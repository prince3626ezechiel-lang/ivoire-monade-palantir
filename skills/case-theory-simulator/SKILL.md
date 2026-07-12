---
name: case-theory-simulator
description: Stress-test multiple legal theories against the same fact pattern. For quiet title, fraud, forgery, and breach of fiduciary duty cases. Florida jurisdiction aware.
license: MIT
source: Adapted from sboghossian/mini-claude-for-legal
jurisdictions: [US, FL]
practice_area: Litigation
version: "1.0"
---

# Case Theory Simulator

Test multiple legal theories against the same facts. Identify the strongest primary theory and viable fallbacks. Model opposing counsel responses.

## Step 1 — Theory Generation

For a property fraud / forgery case like Monique v. Spencer, candidate theories:

- **Theory A: Quiet Title** — Establish Monique as rightful owner; void fraudulent deed
- **Theory B: Fraud / Fraudulent Misrepresentation** — Spencer knowingly made false representations to transfer property
- **Theory C: Forgery** (criminal + civil) — Monique's signature was forged
- **Theory D: Breach of Fiduciary Duty** — Spencer as AIF had duty to Monique; self-dealing breached it
- **Theory E: Civil Conspiracy** — Multiple parties (Spencer + notary + witnesses) conspired
- **Theory F: Unjust Enrichment** — Spencer / NWTB LLC unjustly enriched by $350K

## Step 2 — Theory-by-Theory Analysis

For each theory, produce:

**Strengths:**
- Legal elements satisfied by evidence
- Favorable FL precedents
- Burden of proof advantages
- Available remedies

**Weaknesses:**
- Missing elements
- Adverse precedents
- Statute of limitations issues
- Evidentiary gaps

## Step 3 — Opposing Counsel Simulation

For each theory, predict:
- Likely defenses (ratification, laches, bona fide purchaser)
- Motion to dismiss arguments
- Discovery disputes
- Settlement posture

## Step 4 — Recommendation

Rank theories: Primary → Secondary → Fallback → Dropped
