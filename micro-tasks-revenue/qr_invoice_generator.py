#!/usr/bin/env python3
"""Micro-tasks invoice generator for Telegram/OBM micro-payments."""
import json, qrcode, tempfile
from pathlib import Path
OUT = Path.home()/'.hermes/scripts/micro-tasks-revenue/output'
OUT.mkdir(parents=True, exist_ok=True)
TASKS = [
  {"id":"osint_scan","title":"Scan OSINT 1 cible","price_usd":3},
  {"id":"signal_1mo","title":"1 mois signaux trading","price_usd":9},
  {"id":"pack_ai_box","title":"Pack AI Systems in a BOX","price_usd":29},
  {"id":"quote_xcmg","title":"Devis XCMG express","price_usd":15},
]
for t in TASKS:
    payload = json.dumps({"task":t["id"],"price":t["price_usd"],"currency":"USD"})
    img = qrcode.make(payload)
    img.save(OUT/f"{t['id']}.png")
print(json.dumps({"status":"ok","count":len(TASKS),"output":str(OUT)}))
