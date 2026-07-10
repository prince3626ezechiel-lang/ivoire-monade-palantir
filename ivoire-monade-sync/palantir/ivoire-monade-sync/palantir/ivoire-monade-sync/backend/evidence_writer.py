#!/usr/bin/env python3
"""Evidence packet writer for Hermes/OBM workflows."""
import json
from pathlib import Path
from datetime import datetime

BASE_DIR = Path('/opt/ivoire-monade/agents/evidence')

def write_packet(packet_type: str, payload: dict) -> str:
    BASE_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime('%Y%m%d-%H%M%S')
    path = BASE_DIR / f'{ts}-{packet_type}.json'
    data = {
        'ts': ts,
        'type': packet_type,
        'payload': payload,
    }
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf8')
    return str(path)

__all__ = ['write_packet']
