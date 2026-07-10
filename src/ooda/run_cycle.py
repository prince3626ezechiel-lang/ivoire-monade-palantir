#!/usr/bin/env python3
"""OODA loop for Abischaii /GHOST - local-first."""
import json, time, sys
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[0]
STATE_FILE = ROOT / 'state.json'

def cycle():
    sequence = ['OBSERVING','ORIENTING','DECIDING','ACTING']
    state = json.loads(STATE_FILE.read_text()) if STATE_FILE.exists() else {'step':0}
    nxt = (state.get('step',0)+1) % 4
    out = {
      'status':'ok',
      'ooda': sequence[nxt],
      'timestamp': datetime.now(timezone.utc).isoformat()+'Z'
    }
    STATE_FILE.write_text(json.dumps({'step':nxt}, indent=2))
    print(json.dumps(out, indent=2))

if __name__ == '__main__':
    cycle()
