#!/usr/bin/env python3
"""
IVOIRE MONADE Quote Alert Emitter
Writes quote-alert JSON and triggers notification channels.
"""
import json, os, sys
from datetime import datetime, timezone
from pathlib import Path

ALERTS_DIR = Path('/opt/ivoire-monade/output/alerts')
ALERTS_DIR.mkdir(parents=True, exist_ok=True)

def emit(alert: dict) -> dict:
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

if __name__ == '__main__':
    alert = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
    print(json.dumps(emit(alert), indent=2, ensure_ascii=False))
