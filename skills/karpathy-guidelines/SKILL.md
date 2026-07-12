---
name: karpathy-guidelines
description: >-
  Behavioral guidelines to reduce common LLM coding mistakes. Derived from
  Andrej Karpathy's observations. Use ALWAYS when writing, reviewing, or
  refactoring code. Covers assumption surfacing, simplicity, surgical edits,
  and goal-driven execution with verification.
version: 2.0.0
author: forrestchang (adapted for Hermes by dubgasm)
license: MIT

metadata:
  hermes:
    tags:
      - coding
      - guidelines
      - best-practices
      - karpathy
      - quality
      - simplicity
      - surgical
      - goal-driven
    related_skills:
      - test-driven-development
      - systematic-debugging
      - writing-plans
      - requesting-code-review
---

# Karpathy Guidelines for Hermes

Behavioral guidelines to reduce common LLM coding mistakes, derived from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding pitfalls.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks (typo fixes, obvious one-liners), use judgment — not every change needs full rigor.

---

## When to Load This Skill

**Always active when:**
- Writing new code
- Editing existing code
- Reviewing code
- Refactoring code
- Planning code changes

**Skip only when:**
- User explicitly says "just do it fast"
- Pure configuration files (YAML, JSON, env)
- Throwaway prototypes user confirmed are throwaway

---

## The Four Principles

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing ANYTHING:

1. **State assumptions explicitly.** If uncertain, ask.
2. **Multiple interpretations?** Present them — don't pick silently.
3. **Simpler approach exists?** Say so. Push back when warranted.
4. **Something unclear?** Stop. Name what's confusing. Ask.

**Bad:**
> "I'll implement the export feature now." *[proceeds with assumptions]*

**Good:**
> "Before implementing, I need to clarify:
> 1. Export all users or filtered? (privacy implications)
> 2. File download, API endpoint, or background job?
> 3. Which fields? Some might be sensitive.
> What's your preference?"

**The test:** If you're about to write code and haven't stated your assumptions, you're doing it wrong.

---

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

Rules:
- No features beyond what was asked
- No abstractions for single-use code
- No "flexibility" or "configurability" that wasn't requested
- No error handling for impossible scenarios
- If you write 200 lines and it could be 50, rewrite it

**Ask yourself:** "Would a senior engineer say this is overcomplicated?" If yes, simplify.

**Bad:**
```python
# Strategy pattern, abstract base class, config system...
# for a single discount calculation
class DiscountStrategy(ABC):
    @abstractmethod
    def calculate(self, amount: float) -> float: pass
class PercentageDiscount(DiscountStrategy):
    # 50+ lines
```

**Good:**
```python
def calculate_discount(amount: float, percent: float) -> float:
    return amount * (percent / 100)
```

**When to add complexity:** Only when you actually need it. Refactor later when requirements emerge.

---

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting
- Don't refactor things that aren't broken
- Match existing style, even if you'd do it differently
- If you notice unrelated dead code, mention it — don't delete it

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused
- Don't remove pre-existing dead code unless asked

**The test:** Every changed line should trace directly to the user's request.

**Bad:**
```diff
- def upload_file(file_path, destination):
+ def upload_file(file_path: str, destination: str) -> bool:
+     """Upload file to destination with logging."""
+     logger.info(f"Uploading {file_path} to {destination}")
      try:
-         with open(file_path, 'rb') as f:
+         with open(file_path, "rb") as f:
```
*[Added type hints, docstring, changed quote style — none requested]*

**Good:**
```diff
+ import logging
+ logger = logging.getLogger(__name__)
+
  def upload_file(file_path, destination):
+     logger.info(f'Starting upload: {file_path}')
      try:
          with open(file_path, 'rb') as f:
```
*[Only added what was requested: logging. Matched existing style.]*

---

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform imperative tasks into verifiable goals:

| Instead of... | Transform to... |
|--------------|-----------------|
| "Add validation" | "Write tests for invalid inputs, then make them pass" |
| "Fix the bug" | "Write a test that reproduces it, then make it pass" |
| "Refactor X" | "Ensure tests pass before and after" |
| "Make it work" | "Define what 'works' means, write test, verify" |

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

**Strong success criteria** let you loop independently.
**Weak criteria** ("make it work") require constant clarification.

**Bad:**
> "I'll review the authentication code and make improvements."
> *[Proceeds to change things without clear criteria]*

**Good:**
> "To fix authentication, I need success criteria.
> Issue: users stay logged in after password change.
> Plan:
> 1. Write test: change password → old session invalidated
> 2. Implement fix
> 3. Verify test passes + no regressions
> Starting with step 1."

---

## Integration with Hermes

This skill works alongside other Hermes skills:

- **[[test-driven-development]]** — Pair with Principle 4 (Goal-Driven). TDD is the verification loop.
- **[[systematic-debugging]]** — Pair with Principle 1 (Think Before Coding). Debug first, fix second.
- **[[writing-plans]]** — Pair with Principle 4. Multi-step tasks need plans with verification.
- **[[requesting-code-review]]** — All four principles apply during review.

## Anti-Patterns Quick Reference

| Principle | Anti-Pattern | Fix |
|-----------|-------------|-----|
| Think Before Coding | Silently assumes format, fields, scope | List assumptions, ask for clarification |
| Simplicity First | Strategy pattern for single function | One function until complexity needed |
| Surgical Changes | Reformats quotes while fixing bug | Only change lines that fix the issue |
| Goal-Driven | "I'll review and improve" | "Write test → fix → verify" |

## Key Insight

From Karpathy:

> "LLMs are exceptionally good at looping until they meet specific goals... Don't tell it what to do, give it success criteria and watch it go."

**Good code solves today's problem simply, not tomorrow's problem prematurely.**

---

## How to Know It's Working

These guidelines are working if you see:

- **Fewer unnecessary changes in diffs** — Only requested changes appear
- **Fewer rewrites due to overcomplication** — Code is simple the first time
- **Clarifying questions come before implementation** — Not after mistakes
- **Clean, minimal PRs** — No drive-by refactoring or "improvements"

---

## Full Examples

See `references/EXAMPLES.md` for detailed before/after examples of each principle.
