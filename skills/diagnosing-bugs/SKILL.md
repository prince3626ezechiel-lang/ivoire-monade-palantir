---
name: diagnosing-bugs
description: "Disciplined bug diagnosis loop for hard defects and regressions: repro first, then minimise, rank hypotheses, instrument, fix, and add a regression test."
source: mattpocock/skills
license: upstream
---

# diagnosing-bugs

Disciplined bug diagnosis for hard defects and regressions.

**Repo:** `mattpocock/skills`
**Skill path:** `docs/engineering/diagnosing-bugs`
**Author:** [Matt Pocock](https://github.com/mattpocock)

## Core rule

No hypothesis before a tight repro loop. Reading code before one runnable red command exists is the failure mode this prevents.

## Loop
1. Repro command — one runnable invocation showing the bug.
2. Minimise — shrink inputs/config/steps until it still fails.
3. Hypotheses — short ranked falsifiable list before changing code.
4. Instrument — tag `[DEBUG-...]` and grep before landing.
5. Fix — smallest change that removes root cause.
6. Regression test — lock the behaviour.

## When to use
- Intermittent or hard-to-reproduce bugs.
- Regressions without a clear failing test.
- Requests like: debug this / diagnose / why is this failing.

## When NOT to use
- Trivial one-line fix with existing failing test.
- Design exploration instead of defect hunting.
