#!/usr/bin/env python3
"""Verify web3 keychain items."""
from pathlib import Path
from datetime import datetime
import json
HOME = Path.home()
ITEMS = {
    'github_secrets': HOME/'.gpg'/'github-secrets.json.gpg',
    'wallet_secrets': HOME/'.gpg'/'wallet-secrets.json.gpg',
}
STATUS = {}
for name, path in ITEMS.items():
    STATUS[name] = {
        'exists': path.exists(),
        'size': path.stat().st_size if path.exists() else 0,
    }
STATUS['meta'] = {'checked_at': datetime.utcnow().isoformat()+'Z'}
print(json.dumps(STATUS, indent=2))
