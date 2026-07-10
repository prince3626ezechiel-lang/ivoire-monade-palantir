# IVOIRE MONADE OBM Stack
Open-source Online Business Management stack for XCMG heavy equipment, spare parts, and ivoire-monade.shop.

## 5 Skills Core
- `obm-core` — security, ops, infrastructure, 99.9% uptime
- `obm-docs` — transcripts, PDFs, schemas, Obsidian vault, Git
- `obm-collab` — GitHub PRs/issues/actions + Google Workspace
- `obm-agents` — Hermes multi-agent orchestration + Maxwell control laws
- `obm-sales` — lead → quote → invoice → support pipeline

## Structure
```
/opt/ivoire-monade/
├── skills/          # Project skills
├── schemas/         # JSON schemas for all OBM entities
├── docs/            # Notes, youtube-notes, architecture, workflow
├── assets/          # SVG brand, images, templates
├── scripts/         # Validators, analyzers, autodreams
├── cron/            # Cron jobs config
├── backups/         # Backup targets
└── .secrets/        # GPG-only secrets
```

## Quick Start
1. `python scripts/validate_schemas.py`
2. `python scripts/maxwell_autodream.py`
3. `python scripts/training_analyzer.py --channel network-chuck --url <video>`

## Brand
EON IVOIRE V5 — primary palette #1E293B #166534 #A17846 #F1C40F
