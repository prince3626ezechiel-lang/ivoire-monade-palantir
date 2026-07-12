# Hermes Self-Evolution

## Summary

Reusable workflow for evolving Hermes Agent skills, prompts, and tool descriptions using DSPy + GEPA-style reflective mutation on execution traces.

## Source

https://github.com/NousResearch/hermes-agent-self-evolution

## Install / Setup

```bash
git clone https://github.com/NousResearch/hermes-agent-self-evolution.git ~/.hermes/external/hermes-agent-self-evolution
cd ~/.hermes/external/hermes-agent-self-evolution
pip install -e '.[dev]'
export HERMES_AGENT_REPO=~/.hermes
```

## Usage

```bash
# Evolve a specific skill
python -m evolution.skills.evolve_skill --skill github-code-review --iterations 10 --eval-source sessiondb

# Evolve tool descriptions
python -m evolution.tools.evolve_tools --iterations 5 --eval-source sessiondb

# Evolve prompt sections
python -m evolution.prompts.evolve_prompt --section system_prompt --iterations 8 --eval-source sessiondb
```

## What It Optimizes

- Phase 1: Skill files
- Phase 2: Tool descriptions
- Phase 3: System prompt sections
- Phase 4: Tool implementation code
- Phase 5: Continuous improvement loop

## Constraints / Guardrails

- `pytest tests/ -q` must pass 100%
- Skills <= 15KB, tool descriptions <= 500 chars
- Preserves original purpose and semantic behavior
- Requires human review before merging evolved candidates

## Notes

- No GPU required; uses API-backed reflected mutation.
- Read `PLAN.md` in the cloned repo for full architecture and eval strategy.
