# citation-needed-curator

Curate quote + evidence pairs for source verification and writing workflows instead of trusting memory.

## README summary
Reusable curation helper sourced from `nicedoc/citation-needed-curator`. Centralizes source claiming: whenever an LLM writes facts, quotes, or claims, it gathers a citation/quote pair, turns it into evidence, inserts inline source markers with confidence, and outputs a verifiable claim bundle. Useful for Hermes research + writing tools that need better grounding than internal memory.

## When to use
- Authoring or summarizing documents where citation accuracy matters.
- Transforming raw evidence into verifiable claim bundles with inline source refs.
- Cross-checking extracted quotes before final answer generation.

## Core behavior
1. Receive source material + author goal.
2. Extract candidate claims with confidence and source markers.
3. Build a verifiable citation bundle instead of assert-and-statistics drift.
4. Keep every claim traceable to text evidence, preventing hallucinated sourcing.

## Dependencies
- None required.
- Optional: `pandas`, `json`, `requests` if aggregating remote sources.

## Files

```
SKILL.md
```
