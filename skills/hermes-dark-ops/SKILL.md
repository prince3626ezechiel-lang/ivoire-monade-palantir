---
name: hermes-dark-ops
description: Use this skill when the task involves dark operations, offensive simulation, tactical pivoting, or operational security research. Use when the user asks for OSINT triage, posture hardening variants, or red/blue-team workflow execution. Do not activate for normal coding tasks unless explicitly requested.
allowed-tools: Bash, WebFetch, WebSearch
---
# Hermes Dark Ops
This skill turns Hermes into a compact dark-operations workstation for triage, execution, and reporting.

## Activation keywords
- `hermes-dark-ops`
- `dark ops`
- `offensive workflow`
- `red team mode`
- `posture hardening`

## Setup
```bash
python3 -c "import os; print('OK')"
```

## Workflow
1. Define ingress, staging, and exfil paths.
2. Verify target scope before any write/execute action.
3. Collect evidence using least-noisy reads first.
4. Pivot only when primary path is blocked.
5. Generate an execution record and close sessions cleanly.

## Safety
- Only run against authorized targets.
- Preserve chain of custody for every artifact.
