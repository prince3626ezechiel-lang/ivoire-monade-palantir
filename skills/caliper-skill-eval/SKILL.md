---
name: caliper-skill-eval
description: >
  Lightweight evaluation wrapper for the Caliper skill harness.
  Use when you need to verify whether a newly discovered or modified Hermes/Codex/Pi skill
  actually works end-to-end, before keeping it in local skills or adding it to a relay run.
  Prefer this when running scheduled scout jobs, PR-first-review checks, or onboarding
  reusable skills from GitHub/Gitea.
version: 0.1.0
license: MIT
source: https://github.com/edonadei/caliper
---

# Caliper Skill Eval

Interface Hermes to [Caliper](https://github.com/edonadei/caliper), a lightweight evaluation
harness that tracks skill success rate across Claude Code, Codex, Pi, and Hermes.

## When to use

- Validate a scrapped GitHub/Gitea skill before installing it into `~/.hermes/skills/`.
- Re-run evaluation after skill edits to prevent regressions.
- Produce a success-rate baseline during scheduled agent-stack polarization/review.
- Complement `github-repo-scan` or scout cron jobs after candidate selection.

## Install

```bash
git clone https://github.com/edonadei/caliper.git /tmp/caliper
cd /tmp/caliper
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
python3 -m caliper --help
```

## Core protocol

1. Install Caliper once in a stable path if not present.
2. For each candidate skill, configure a zero-argument launch run or a focused eval slice.
3. Capture the JSON result and compare `runs_passed / runs_total` before adding the skill.
4. If no dedicated runner exists yet, use `python3 -m caliper eval` against a single skill.

## Recommended starting command

```bash
python3 -m caliper eval --json --reruns 1 --agent hermes
```

## Output rules

- Always surface the pass ratio, not just the final boolean.
- Do not install a skill whose baseline eval is below 50% without explicit manual review.
- Record the raw Caliper result in the run evidence wrapper when requested.

## Pitfalls

- First-run startup overhead is normal; ignore cold-start latency in the success metric.
- Agent support varies by runner config; Hermes/Codex/Pi coverage may require explicit
  agent selection flags.
- Evaluation requires executable agent behavior; read-only scans are not eval inputs.

## Links

- Repo: https://github.com/edonadei/caliper
- Upstream docs: https://github.com/edonadei/caliper#readme
