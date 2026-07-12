---
name: free-claude-code
description: Proxy local Claude Code / Codex CLI vers OpenAI-compatible providers. Supporte Mistral, OpenRouter, Ollama, Gemini, DeepSeek, Groq, NVIDIA NIM. Inclut CLI wrappers `fcc-claude` / `fcc-codex`, Discord/Telegram bridge, Admin UI et voice optionnel.
version: 3.5.15
source: Alishahryar1/free-claude-code
license: MIT
---

# free-claude-code

Utilise Claude Code ou Codex CLI avec des providers libres/gratuits/locaux via un proxy FastAPI local.

## Installation rapide

```bash
cd /opt/ivoire-monade/free-claude-code
uv run fcc-init
uv run fcc-server
```

## Providers utiles pour notre stack

### Mistral
```bash
export MISTRAL_API_KEY="vault:media-secrets.json.gpg -> mistral_api_key"
uv run fcc-claude --provider mistral
```

### OpenRouter
```bash
export OPENROUTER_API_KEY="..."
uv run fcc-claude --provider open_router
```

### Ollama local
```bash
uv run fcc-claude --provider ollama
```

## CLI commands

| Commande | Usage |
|---|---|
| `uv run fcc-server` | Démarrer le proxy FastAPI |
| `uv run fcc-claude` | Lancer Claude Code via proxy |
| `uv run fcc-codex` | Lancer Codex via proxy |
| `uv run fcc-init` | Initialiser la config |

## Intégration Hermes

- Proxy API : `http://127.0.0.1:8000`
- Modèles listés : `/v1/models`
- Admin UI : route `/admin`
- Telegram bridge : activé via `TELEGRAM_BOT_TOKEN` + `TELEGRAM_ALLOWED_USERS`

## Skills absorbées / comparables

- `claude-code` : si disponible
- `claude-local-memory` : mémoire locale Hermes/Claude

## Tests

```bash
cd /opt/ivoire-monade/free-claude-code
uv run pytest -q
```
