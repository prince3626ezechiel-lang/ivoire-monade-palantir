"""Offline-first brief generator for Hermes cron jobs."""
import json
from pathlib import Path
from datetime import datetime
TS=datetime.now().strftime('%Y%m%d-%H%M%S')
EVIDENCE=Path('/opt/ivoire-monade/agents/evidence')
EVIDENCE.mkdir(parents=True, exist_ok=True)
payload={
  'offline': True,
  'sources': sorted([p.name for p in Path('/root/.hermes/skills').glob('*/SKILL.md')])[:12],
  'quickwins': [
    'Run github-repo-scan from local mirrors only',
    'Absorb registry pending candidates akquant, investing-algorithm-framework',
    'Merge youtube signal skills into one pipeline skill'
  ],
  'errors': ['RuntimeError: HTTP 401: Missing Authentication header']
}
(EVIDENCE/f'{TS}-brief.json').write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding='utf8')
print(str(EVIDENCE/f'{TS}-brief.json'))
