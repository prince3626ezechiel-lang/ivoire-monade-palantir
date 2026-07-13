---
name: memory-topic-store
description: "Scale Hermes persistent memory beyond the flat-file character cap by splitting MEMORY.md into a lean topic-index (TOC) plus offloaded topics/*.md reference files. Use when MEMORY.md/USER.md approaches its char_limit, when you are about to prune high-signal facts to make room, or whenever a user's memory is growing and you want it to scale cleanly. Trigger phrases: 'memory is full', 'cleanup memory', 'memory getting cramped', 'scale my memory', 'topic-indexed memory'."
version: 1.0.0
author: Hermes Agent
metadata:
  hermes:
    tags: [memory, productivity, hermes]
  provenance: "Authored by the Hermes Agent assistant; published by Bart Rutherford."
---

# Memory Topic Store

Hermes injects a single flat markdown string per store (`MEMORY.md`, `USER.md`) into
every session, capped by `memory.memory_char_limit` / `memory.user_char_limit`
(default 2200 / 1375). A single growing blob is fine for "who is the user" but
chokes the moment you accumulate projects, hardware notes, lessons, and history.

This skill fixes that by making `MEMORY.md` a **table of contents** and moving deep
reference into `topics/<topic>.md` files that are loaded only on demand.

## When to use
- MEMORY.md is near its char limit (check `usage` in the memory tool response).
- You find yourself pruning real facts just to stay under budget.
- The user has ongoing projects / multiple contexts worth remembering long-term.
- User explicitly asks to "scale" or "clean up" memory.

## Steps

### 1. Inspect current state
```
read_file: ~/.hermes/memories/MEMORY.md
read_file: ~/.hermes/memories/USER.md
```
Note the char usage from the memory tool's `usage` field. This is a CHAR budget,
NOT disk space — verify disk is fine separately:
```
terminal: df -h / | tail -1
```

### 2. Raise the char limits (cheap headroom)
```
hermes config set memory.memory_char_limit 3500
hermes config set memory.user_char_limit 2000
```
Note: `hermes config set` is required to edit config.yaml — the `patch` tool is
blocked from writing Hermes config files (security guard). The memory tool's
`replace`/`remove` ops are fine for the markdown stores themselves.

### 3. Rewrite MEMORY.md as a topic index (TOC)
Keep only high-signal, cross-session facts. One or two lines per topic. Structure:

```markdown
# MEMORY — Topic Index (TOC)
Compact high-signal facts only. Deep reference in `topics/*.md`, loaded on demand.
Rebuild this file lean — it is injected every session.

## Identity & Verification
- (challenge phrase, origin, assistant name)

## Patterns
- (standing user instructions / corrections)

## Hardware & Local Setup
- (host summary) => `topics/hardware.md`

## Projects / Builds
- (what was built, where it lives)

## Channels / Integrations
- (Telegram, endpoints, caveats)

## Lessons
- (dated: root cause + fix + how to avoid)
```

Guideline: if a fact is referenced less than weekly, it belongs in a topic file,
not the index.

### 4. Create topic files for heavy content
```
write_file: ~/.hermes/memories/topics/hardware.md
```
Each topic file is a normal markdown doc — full detail, tables, command history.
Examples of good topics: `hardware.md` (host spec, local model shelf, Ollama
wiring, operational lessons), `projects.md`, `channels.md`.

The directory is created automatically by write_file (parent dirs auto-created).

### 5. Verify
- Re-read MEMORY.md: confirm it's lean and every topic bullet points at a
  `topics/*.md` file that exists.
- Confirm limits applied: grep `memory_char_limit` in `~/.hermes/config.yaml`.
- Optionally prune USER.md the same way (role, channels, assistant name — keep
  only durable identity facts).

## How sessions find the deep stuff
The TOC is injected every session, so the agent always knows what topics exist and
where. To pull detail, use `read_file` on the relevant `topics/*.md`, or
`session_search` for deep recall of past conversations. Nothing is truly lost —
just offloaded from the hot path.

## Pitfalls
- **Don't stuff topic files back into the index.** The whole point is keeping the
  injected string small. Index = pointers; topics = content.
- **Char limit != disk.** A "memory full" panic is almost always the char budget,
  not storage. Check `df -h /` before assuming hardware constraints.
- **`patch` can't touch config.yaml.** Use `hermes config set` for limits.
- **The desktop app may cache config at launch.** After changing limits, do New
  Chat / `/reset`; if settings seem stale, Cmd+Q and relaunch the app.
- **Topic files aren't auto-loaded.** Establish the convention explicitly (or via
  this skill) so future sessions know to read them on demand.

## Verification checklist
- [ ] MEMORY.md is a TOC with one-line-per-topic pointers
- [ ] Each referenced `topics/*.md` file exists and is readable
- [ ] `memory_char_limit` / `user_char_limit` raised and confirmed in config
- [ ] Disk confirmed fine (separate from char budget)
- [ ] High-signal facts preserved; only verbose/noise pruned
