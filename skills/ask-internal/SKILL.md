---
name: ask-internal
description: "Answer questions about a project's internal stuff (setup, features, architecture, design decisions) by reading internal docs and the codebase. Use for 'how do I X', 'where is Y', 'what is the deal with Z', or any question that mixes ops/setup knowledge with code knowledge. Can execute steps with per-command confirmation."
allowed-tools: Bash, Read, Grep, Glob
---

# Ask Internal

Answer team-internal questions by reading internal docs and the codebase, synthesizing a direct answer with file:line citations, and optionally running surfaced commands with confirmation.

**Announce at start:** "I'm using the ask-internal skill to answer this from internal docs and the codebase."

## When to use

- "How do I reset my dogfood profile?"
- "What's the deal with the OpenClaw VM startup?"
- "Where do we configure release signing?"
- Any question whose answer lives in setup runbooks, feature notes, architecture docs, or the code that produced them.

## Hard rules — never do these

- NEVER execute a state-mutating command without per-command `y` confirmation from the user.
- NEVER edit code or docs in response to an ask-internal question. The skill answers; it does not write files.
- NEVER guess. If grep finds nothing useful in docs or code, say so plainly.
- NEVER cite a file or line number you have not actually read.

## Voice rules

- Lead with the point.
- Concrete nouns. Name files, functions, commands.
- Short sentences. Active voice.
- Banned words: delve, crucial, robust, comprehensive, nuanced, multifaceted, furthermore, moreover, additionally, pivotal, landscape, tapestry, underscore, foster, showcase, intricate, vibrant, fundamental, significant, leverage, utilize.
- No filler intros.

## Workflow

### Step 1: Parse the question

Pull the keywords from the user's question. Identify intent:
- **Setup-question** ("how do I", "how to", "where do I configure"): bias the search toward setup/ guides.
- **Feature-question** ("what is X", "why does X work this way"): bias toward features/ and architecture docs.
- **Free-form** ("anything about Y"): search all categories.

### Step 2: Multi-source search

Run grep in parallel across two sources.

**Internal docs:**
Search for each keyword separately. Collect top hits by relevance.

**Codebase:**
Use grep/glob to find relevant source files. Read the top hits fully so citations are accurate.

### Step 3: Synthesize answer

1. **Direct answer.** First sentence answers the question. No preamble.
2. **Steps if applicable.** Numbered list with exact commands.
3. **Citations.** Every factual claim references `path/to/file.md:42` or `path/to/code.ts:117`.

If multiple docs cover the topic at different layers, reconcile them in the answer rather than dumping both.

### Step 4: Offer execution (only if commands surfaced)

If Step 3 produced executable commands the user could run, ask:
> Run these for you? (y / n / dry-run)

- **y:** Execute one at a time. For any command that mutates state, ask "run this? <command>" before each.
- **n:** Skip. Done.
- **dry-run:** Print the full sequence. Do not execute.

### Step 5: Doc-not-found path

If Step 2 returned nothing useful, tell the user plainly, list tangentially relevant files, and offer to draft a doc outline in chat only.

### Step 6: Completion status

Report one of:
- **DONE** — answer delivered, citations verified.
- **DONE_WITH_CONCERNS** — flagged uncertainty (docs and code disagreed).
- **BLOCKED** — docs missing or other pre-flight failure.
- **NEEDS_CONTEXT** — question too vague to search effectively.

## Citation discipline

Every "X is at Y" claim in the answer must point to a file:line that the skill actually read. Do not approximate. If you didn't read it, don't cite it.

If a doc says one thing and the code says another, surface the conflict explicitly.

## Common Mistakes

- **Skimming and then citing:** Read the section fully before citing.
- **Executing without confirmation for mutations:** State-mutating commands need per-command `y`.
- **Searching only docs, not code:** Always check both docs and source.
