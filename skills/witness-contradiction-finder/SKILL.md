---
name: witness-contradiction-finder
description: Map contradictions across a person's statements, documents, and sworn testimony. For fraud, forgery, and breach of fiduciary duty cases. Ranks by materiality for cross-examination and impeachment.
license: MIT
source: Adapted from sboghossian/mini-claude-for-legal
jurisdictions: [US, FL]
practice_area: Litigation
version: "1.0"
---

# Witness Contradiction Finder

Systematically identify contradictions across all statements — deeds, POAs, affidavits, depositions, public statements — and produce a ranked impeachment map.

## Source Categories

1. **Legal Documents** — deeds, mortgages, affidavits, POAs, court filings
2. **Sworn Testimony** — depositions, interrogatory answers
3. **Public Statements** — social media, press, interviews
4. **Documents Authored** — emails, memos, letters
5. **Documents Received** — what the person knew and when

## Analysis Methodology

For each contradiction, evaluate:

| Factor | Scale |
|--------|-------|
| **Materiality** | High (bears on liability) / Medium (credibility) / Low (peripheral) |
| **Explicitness** | Direct (statement A ≠ statement B) / Inferential (implies contradiction) |
| **Timeline proximity** | Contradictions closer in time are stronger |
| **Source quality** | Sworn > Signed > Written > Oral > Reported |

## Output Format

For each contradiction:
```
### Contradiction #N — [TITLE] | Materiality: HIGH
**Statement A:** [exact text] — Source: [document], Date: [date]
**Statement B:** [exact text] — Source: [document], Date: [date]
**Cross-Examination:** "You said X on [date]. Then you said Y on [date]. Which is true?"
```

## Spencer Saint-Cyr Case — Known Contradictions to Map

1. Oct 2023 deed claims Spencer was "single" → Jan 2024 corrective deed admits he's "married"
2. Oct 2023 deed transfers property to Spencer alone → Jan 2024 corrective deed adds Monique back as co-grantee
3. Jan 2024 affidavit (Spencer as AIF) confirms Monique owns property → Oct 2023 deed already transferred it away
4. POA executed Jan 20, 2024 → Used to sign documents dated earlier
5. Signing date (Nov 23, 2023) → Recording date (Oct 23, 2023) — recorded before signed
6. Monique allegedly signed Oct 2023 deed → Monique claims forgery
