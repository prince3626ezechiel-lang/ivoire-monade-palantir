#!/usr/bin/env python3
"""Prepare DataAnnotation application package."""
import json
from pathlib import Path
from datetime import datetime
out = Path.home()/'.hermes/scripts/micro-tasks-applications/output'
out.mkdir(parents=True, exist_ok=True)
pkg = {
    'platform': 'DataAnnotation.Tech',
    'role': 'AI trainer / annotator / code evaluator',
    'rate_usd': '20-40 per hour',
    'status': 'ready_to_submit',
    'boilerplate': 'scripts/micro-tasks-revenue/boilerplate/dataannotation_application.md'
}
(out/'dataannotation.json').write_text(json.dumps(pkg, indent=2))
print(json.dumps(pkg, indent=2))
