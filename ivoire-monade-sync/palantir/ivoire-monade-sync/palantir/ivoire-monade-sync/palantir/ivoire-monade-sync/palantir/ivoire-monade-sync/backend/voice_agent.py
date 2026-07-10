"""
IVOIRE MONADE - Voice Agent skeleton
Provides Whisper transcription + Mistral/Edge/OpenAI TTS pipeline with Telegram Bot API.
Security: API keys are NOT stored here. Use voice-config.json with GPG-backed secrets.
"""
from __future__ import annotations

import hashlib
import json
import os
import pathlib
import time
from typing import Optional

import requests

DEFAULT_CONFIG_PATH = "/opt/ivoire-monade/schemas/voice/voice-config.json"
DEFAULT_AUDIO_CACHE = "/opt/ivoire-monade/audio"


class VoicePipeline:
    """High-level voice pipeline for IVOIRE MONADE."""

    def __init__(self, config_path: str = DEFAULT_CONFIG_PATH):
        self.config = self._load_config(config_path)
        self.cache_dir = pathlib.Path(
            self.config.get("cache", {}).get("directory", DEFAULT_AUDIO_CACHE)
        )
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.telegram_bot_token = os.environ.get(
            "IVOIRE_TELEGRAM_TOKEN",
            self.config.get("telegram", {}).get("bot_token", ""),
        )

    # ------------------------------------------------------------------ #
    #  Config helpers                                                     #
    # ------------------------------------------------------------------ #
    @staticmethod
    def _load_config(config_path: str) -> dict:
        if not os.path.exists(config_path):
            return {
                "mistral": {"tts_enabled": False, "model": "mistral-tts", "voice": "default"},
                "edge": {"tts_enabled": True, "voice": "fr-FR-DeniseNeural", "rate": "+0%"},
                "openai": {"tts_enabled": True, "model": "tts-1", "voice": "nova"},
                "whisper": {
                    "model": "base",
                    "device": "cpu",
                    "compute_type": "int8",
                    "local_path": "/opt/ivoire-monade/models/whisper",
                },
                "telegram": {"allowed_user_ids": [], "max_voice_duration_seconds": 120},
                "cache": {"enabled": True, "directory": DEFAULT_AUDIO_CACHE, "ttl_days": 30},
                "fallback_order": ["mistral", "edge", "openai"],
                "secrets_file": "/run/secrets/ivoire-voice-tokens.json",  # GPG-backed runtime mount
            }
        with open(config_path, "r", encoding="utf-8") as fh:
            return json.load(fh)

    def _get_secret(self, key: str, default: Optional[str] = None) -> Optional[str]:
        """
        Fetches an API key from the runtime secrets file or environment.
        Never logs the raw secret.
        """
        secrets_file = self.config.get("secrets_file")
        if secrets_file and os.path.exists(secrets_file):
            try:
                with open(secrets_file, "r", encoding="utf-8") as fh:
                    secrets = json.load(fh)
                value = secrets.get(key)
                if value:
                    return value
            except Exception:
                pass
        return os.environ.get(key, default)

    # ------------------------------------------------------------------ #
    #  Cache helpers                                                      #
    # ------------------------------------------------------------------ #
    def _cache_path(self, chat_id: str, text_hash: str, extension: str = "mp3") -> pathlib.Path:
        safe_chat = str(chat_id).replace("-", "minus")
        filename = f"{safe_chat}_{text_hash[:16]}.{extension}"
        return self.cache_dir / filename

    @staticmethod
    def _hash_text(text: str) -> str:
        return hashlib.sha1(text.encode("utf-8")).hexdigest()

    # ------------------------------------------------------------------ #
    #  Telegram Bot API wrappers                                          #
    # ------------------------------------------------------------------ #
    def telegram_receive_voice(self, update: dict) -> Optional[dict]:
        """
        Extracts voice data from a Telegram Update object.

        Returns:
            dict with file_id, duration, mime_type, chat_id, message_id, or None.
        """
        message = update.get("message", {})
        voice = message.get("voice")
        if not voice:
            return None

        max_duration = self.config.get("telegram", {}).get("max_voice_duration_seconds", 120)
        duration = voice.get("duration", 0)
        if duration > max_duration:
            # Caller should notify the user; we just reject here.
            return None

        return {
            "file_id": voice.get("file_id"),
            "duration": voice.get("duration"),
            "mime_type": voice.get("mime_type", "audio/ogg"),
            "chat_id": message.get("chat", {}).get("id"),
            "message_id": message.get("message_id"),
        }

    def telegram_send_voice(self, chat_id: str, audio_path: str, caption: str = "") -> bool:
        """
        Sends a voice message via Telegram Bot API (sendVoice).

        Returns:
            True if the API reports success, False otherwise.
        """
        token = self.telegram_bot_token
        if not token:
            return False

        url = f"https://api.telegram.org/bot{token}/sendVoice"
        try:
            with open(audio_path, "rb") as audio_file:
                files = {"voice": audio_file}
                data = {
                    "chat_id": str(chat_id),
                }
                if caption:
                    data["caption"] = caption

                response = requests.post(url, data=data, files=files, timeout=60)
                response.raise_for_status()
                payload = response.json()
                return payload.get("ok", False)
        except Exception:
            return False

    # ------------------------------------------------------------------ #
    #  Transcription (local Whisper)                                      #
    # ------------------------------------------------------------------ #
    def transcribe(self, voice_update: dict, bot_token: Optional[str] = None) -> str:
        """
        Transcribes a Telegram voice message into text using a local Whisper model.

        NOTE: Stub implementation. Replace with your Whisper backend (faster-whisper,
        openai-whisper, or WhisperX) once installed and populated in the models path.

        Flow:
            1. Validate voice_update via telegram_receive_voice().
            2. Download file from Telegram Bot API getFile -> get file_path.
            3. Load Whisper model and run transcription.
            4. Return transcript string.
        """
        if bot_token:
            self.telegram_bot_token = bot_token

        voice = self.telegram_receive_voice(voice_update)
        if not voice:
            return "[ERROR] No valid voice payload or duration exceeded."

        whisper_cfg = self.config.get("whisper", {})

        # Demo stub logic: in production, download and run whisper.
        cached_transcript = pathlib.Path(DEFAULT_AUDIO_CACHE) / f"transcript_{voice['message_id']}.txt"
        if cached_transcript.exists():
            return cached_transcript.read_text(encoding="utf-8")

        transcript = (
            f"[TRANSCRIPTION_STUB] file_id={voice['file_id']} "
            f"duration={voice['duration']}s model={whisper_cfg.get('model', 'base')}"
        )
        cached_transcript.write_text(transcript, encoding="utf-8")
        return transcript

    # ------------------------------------------------------------------ #
    #  Synthesis (Mistral TTS + Edge/OpenAI fallback)                     #
    # ------------------------------------------------------------------ #
    def synthesize(self, text: str, chat_id: str, bot_token: Optional[str] = None) -> bool:
        """
        Synthesizes text into speech and sends it as a Telegram voice message.

        Providers following fallback order (mistral -> edge -> openai).
        Results are cached in /opt/ivoire-monade/audio/.

        NOTE: Stub implementation. Replace with actual provider SDKs.
        """
        if bot_token:
            self.telegram_bot_token = bot_token

        if not text or not self.telegram_bot_token:
            return False

        text_hash = self._hash_text(text)
        extension = "mp3"
        cache = self.cache_dir

        # 1) Check cache
        for provider in ["mistral", "edge", "openai"]:
            provider_ext = "mp3"
            hit = cache / f"{chat_id}_{text_hash[:16]}_{provider}.{provider_ext}"
            if hit.exists():
                return self.telegram_send_voice(chat_id, str(hit), caption=" ")

        # 2) Try providers in order
        order = self.config.get("fallback_order", ["mistral", "edge", "openai"])
        for provider in order:
            try:
                audio_path = self._synthesize_provider(provider, text, chat_id, text_hash)
                if audio_path and os.path.exists(audio_path):
                    sent = self.telegram_send_voice(chat_id, audio_path, caption=" ")
                    return sent
            except Exception:
                continue
        return False

    def _synthesize_provider(
        self, provider: str, text: str, chat_id: str, text_hash: str
    ) -> Optional[str]:
        """Stub synthesis per provider."""
        safe_chat = str(chat_id).replace("-", "minus")
        path = self.cache_dir / f"{safe_chat}_{text_hash[:16]}_{provider}.mp3"

        if not path.exists():
            if provider == "mistral":
                # Demo placeholder: Mistral Studio TTS endpoint
                api_key = self._get_secret("MISTRAL_API_KEY")
                if not api_key:
                    return None
                # Real implementation: POST https://api.mistral.ai/v1/tts
                path.write_text("[MISTRAL_STUB]", encoding="utf-8")

            elif provider == "edge":
                # Real implementation: use Edge TTS CLI or edge-tts Python package
                # edge-tts --voice fr-FR-DeniseNeural --text "..." --write-media <path>
                path.write_text("[EDGE_STUB]", encoding="utf-8")

            elif provider == "openai":
                api_key = self._get_secret("OPENAI_API_KEY")
                if not api_key:
                    return None
                # Real implementation: POST https://api.openai.com/v1/audio/speech
                path.write_text("[OPENAI_STUB]", encoding="utf-8")
            else:
                return None

        return str(path)
