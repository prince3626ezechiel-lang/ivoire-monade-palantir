#!/usr/bin/env python3
"""Minimal local Telegram gateway. Decrypts vault once at startup, then serves alerts over localhost."""
import json, os, subprocess, sys
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

VAULT = Path('/root/.gpg/telegram-secrets.json.gpg')
CHAT_ID = '6499054466'

def decrypt_vault():
    try:
        result = subprocess.run(
            ['gpg', '--quiet', '--decrypt', str(VAULT)],
            capture_output=True, text=True, check=True
        )
        data = json.loads(result.stdout)
        return data['telegram']['bot_token']
    except Exception as e:
        print(f'[telegram_gateway] vault error: {e}', file=sys.stderr)
        sys.exit(1)

BOT_TOKEN = decrypt_vault() if VAULT.exists() else os.environ.get('TELEGRAM_BOT_TOKEN')
if not BOT_TOKEN:
    print('[telegram_gateway] no bot token', file=sys.stderr)
    sys.exit(1)

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(length) or '{}')
            text = body.get('text', '')
            if not text:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'{"ok":false,"reason":"missing text"}')
                return
            chat = body.get('chat_id', CHAT_ID)
            url = f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage'
            payload = json.dumps({'chat_id': chat, 'text': text}).encode()
            out = subprocess.run(['curl', '-sS', '-X', 'POST', url, '-H', 'Content-Type: application/json', '-d', payload], capture_output=True, text=True)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(f'{{"ok":true,"telegram":{out.stdout}}}'.encode())
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(f'{{"ok":false,"error":"{e}"}}'.encode())

    def log_message(self, format, *args):
        return

if __name__ == '__main__':
    server = HTTPServer(('127.0.0.1', 17832), Handler)
    print('[telegram_gateway] running on 127.0.0.1:17832', file=sys.stderr)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
