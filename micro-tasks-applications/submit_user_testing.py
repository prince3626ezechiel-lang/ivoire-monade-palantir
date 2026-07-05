#!/usr/bin/env python3
"""Prepare UserTesting application package."""
import json
from pathlib import Path
from datetime import datetime
out = Path.home()/'.hermes/scripts/micro-tasks-applications/output'
out.mkdir(parents=True, exist_ok=True)
pkg = {
    'platform': 'UserTesting',
    'role': 'Website/app tester',
    'rate_usd': '10-30 per test',
    'status': 'ready_to_submit',
    'boilerplate': 'scripts/micro-tasks-revenue/boilerplate/user_testing_application.md'
}
(out/'user_testing.json').write_text(json.dumps(pkg, indent=2))
print(json.dumps(pkg, indent=2))
