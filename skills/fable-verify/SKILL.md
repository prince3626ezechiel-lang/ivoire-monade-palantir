---
name: fable-verify
description: Verification contract — done means executed and observed, not written and plausible. Use before declaring any code change, fix, or build complete; before committing; and when writing summaries that claim something works.
---

# Fable Verify

**Done = executed and observed. Not written and plausible.**

The most common agent failure isn't bad code — it's confidently describing untested
code as working. This skill defines what "verified" means and forbids the word
"done" without it.

## The verification ladder

Climb as high as the change warrants; know which rung you stopped on and say so.

1. **It parses** — typecheck/lint passes. Catches typos, nothing else.
2. **Tests pass** — the suite runs green. Catches regressions in covered paths.
3. **The flow works** — you exercised the actual change end-to-end: hit the
   endpoint, ran the CLI with real input, loaded the page and clicked the thing,
   observed the output match the intent. **This is the target rung for any
   behavior-changing change.**
4. **The edges hold** — empty input, wrong type, double-submit, the error path.
   Target for anything touching money, auth, deletion, or user data.

Typecheck-only verification of a behavior change is rung 1 masquerading as rung 3.
Tests-only verification of a UI change proves the code you didn't change still works.

## The procedure

1. **Before coding, state the observable.** "When this is done, running X will show
   Y." If you can't phrase it, you don't understand the task yet — that's the real
   finding.
2. **Make the change.**
3. **Drive the observable.** Run the command, hit the endpoint, load the page. Use
   the real entry point a user would, not a synthetic shortcut that bypasses the
   integration surface.
4. **Compare, don't vibe.** The output either matches the stated observable or it
   doesn't. "Looks right" is not a comparison.
5. **On failure: report first, then fix.** The failure is a finding. Fix it, then
   re-drive — a fix is unverified until the observable passes again.

## Reporting rules

- **Failures are stated with evidence.** "2 of 14 tests fail, both in date parsing:"
  followed by the actual output. Never "mostly working," "should be fine," or
  silently narrowing the summary to the parts that passed.
- **Skipped verification is named.** "I could not run the integration tests (no DB
  in this environment); verified via unit tests and a manual curl only." An honest
  gap beats a false green.
- **Claims match rungs.** "Typechecks" ≠ "tests pass" ≠ "works." Use the words that
  match what you observed.
- **Verified work is stated plainly.** No hedging on things you actually observed —
  "the endpoint returns the new field" — not "the endpoint should now return…"

## Harness reinforcement (for the harness builder)

Prompt adherence to verification sags over long sessions. Back this skill with
deterministic hooks:
- **PostToolUse** on Edit/Write → run typecheck/lint, inject failures back as
  feedback the agent must address.
- **Stop gate** → if source files changed since the last test run, refuse the stop
  with "run the tests or state why you can't."

The skill teaches the behavior; the hooks guarantee it on hour three.
