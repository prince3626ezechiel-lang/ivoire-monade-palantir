#!/usr/bin/env python3
"""Offline-safe evidence wrapper for Hermes cron jobs."""
import json, sys, argparse
from pathlib import Path
from datetime import datetime

DEFAULT_DIR = Path('/opt/ivoire-monade/agents/evidence')

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--type', required=True)
    parser.add_argument('--payload', required=True)
    parser.add_argument('--dir', default=str(DEFAULT_DIR))
    parser.add_argument('--job-id', default='cron')
    args = parser.parse_args()

    out_dir = Path(args.dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime('%Y%m%d-%H%M%S')

    try:
        payload = json.loads(args.payload)
    except json.JSONDecodeError:
        payload = {'raw': args.payload}

    data = {
        'ts': ts,
        'job_id': args.job_id,
        'type': args.type,
        'payload': payload,
        'status': 'ok',
        'offline': True,
    }
    path = out_dir / f'{ts}-{args.type}.json'
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf8')
    print(path)

if __name__ == '__main__':
    main()
