#!/usr/bin/env python3
"""Monitor NLA lotto signal folder and log new predictions."""
import json, hashlib
from pathlib import Path
from datetime import datetime, timezone

SIGNAL_DIR = Path('/root/.hermes/cache/nla-signals')
SIGNAL_DIR.mkdir(parents=True, exist_ok=True)
LEDGER = Path('/root/.hermes/scripts/revenue-ledger/revenue.json')

def log_signal(source, numbers):
    ts = datetime.now(timezone.utc).isoformat()+'Z'
    sid = hashlib.sha256(f"{source}{ts}".encode()).hexdigest()[:12]
    entry = {
        'id': sid,
        'source': source,
        'timestamp': ts,
        'numbers': numbers,
        'status': 'captured'
    }
    out = SIGNAL_DIR / f"{ts[:10]}_{sid}.json"
    out.write_text(json.dumps(entry, ensure_ascii=False, indent=2))
    print(json.dumps(entry, ensure_ascii=False))
    return entry

if __name__ == '__main__':
    # Example: python3 monitor.py --source "GW Online GH" --banker 55 --2sure "55,1" --machine "32,20,68,5,13"
    import sys
    src = 'manual'
    nums = {}
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == '--source' and i+1 < len(args):
            src = args[i+1]; i += 2
        elif args[i] == '--banker' and i+1 < len(args):
            nums['banker'] = args[i+1]; i += 2
        elif args[i] == '--2sure' and i+1 < len(args):
            nums['two_sure'] = args[i+1]; i += 2
        elif args[i] == '--machine' and i+1 < len(args):
            nums['machine'] = args[i+1]; i += 2
        else:
            i += 1
    print(json.dumps(log_signal(src, nums), ensure_ascii=False))
