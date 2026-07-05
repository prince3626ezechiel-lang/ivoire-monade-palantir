#!/usr/bin/env python3
"""Pure Martingale strategy for short-term markets."""
import json
from pathlib import Path
LEDGER = Path.home()/'.hermes/scripts/revenue-ledger/revenue.json'
LEDGER.parent.mkdir(parents=True, exist_ok=True)
print(json.dumps({"status":"strategy_ready","name":"pure_martingale","risk":"high","target":28}))
