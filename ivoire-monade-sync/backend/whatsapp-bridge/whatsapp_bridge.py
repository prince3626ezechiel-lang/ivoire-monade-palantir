#!/usr/bin/env python3
"""
IVOIRE MONADE WhatsApp Bridge (backend)
- Stub connector for WhatsApp Business API / Baileys / Twilio
- Emits quote alerts to Telegram + Calendar + Odoo

Env:
    WHATSAPP_PROVIDER=baileys|twilio|meta
    WHATSAPP_SESSION_PATH=/opt/ivoire-monade/backend/whatsapp-bridge/session
"""

import json
import os
from datetime import datetime, timezone
from pathlib import Path

ALERTS_DIR = Path('/opt/ivoire-monade/output/alerts')
ALERTS_DIR.mkdir(parents=True, exist_ok=True)

PROVIDER = os.getenv('WHATSAPP_PROVIDER', 'baileys')


def emit_alert(alert: dict) -> dict:
    ts = datetime.now(timezone.utc).isoformat()
    alert['created_at'] = ts
    alert['notifications'] = [
        {'channel': 'telegram', 'status': 'sent', 'at': ts},
        {'channel': 'calendar', 'status': 'scheduled', 'at': ts},
        {'channel': 'odoo', 'status': 'pending', 'at': None},
    ]
    out = ALERTS_DIR / f"quote-{alert.get('quote_id','unknown')}.json"
    out.write_text(json.dumps(alert, indent=2, ensure_ascii=False))
    return alert


def connect(phone: str) -> dict:
    # TODO: initialize provider session with QR/pairing
    return {
        'ok': True,
        'provider': PROVIDER,
        'phone': phone,
        'status': 'pending_pairing',
    }


def send_message(to: str, text: str) -> dict:
    # TODO: send via provider
    return {'ok': True, 'to': to, 'text': text, 'provider': PROVIDER}


if __name__ == '__main__':
    import sys
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'status'
    if cmd == 'connect':
        print(json.dumps(connect(sys.argv[2]), indent=2))
    elif cmd == 'send':
        print(json.dumps(send_message(sys.argv[2], sys.argv[3]), indent=2))
    else:
        print(json.dumps({'ok': True, 'provider': PROVIDER, 'status': 'ready'}, indent=2))
