---
name: browser-trace
description: "Use when debugging or auditing a live browser automation run. Captures a full DevTools-protocol trace — CDP firehose, screenshots, and DOM snapshots — then bisects the stream into per-page searchable buckets. Does not drive pages; pairs with a primary automation (browse, Stagehand, Playwright, or anything backed by CDP). Triggers: 'attach a trace', 'debug failed run', 'audit network/console/DOM', 'trace the session', 'what happened on page X', 'get the timeline', 'failed automation', 'hung navigation'. Do NOT use browser-trace as the primary automation — use the browser / browseros / playwright skills for that."
allowed-tools: Bash(node *, bash *, jq *)
---

# Browser Trace

Passive, read-only observability layer for an already-running browser automation. It attaches a second CDP client, records the DevTools firehose to NDJSON, polls screenshots and DOM dumps, then bisects everything into a per-page directory tree that bash tools can search.

## When NOT to Use

- Primary page driving. Use `browser`, `browseros`, or `playwright-testing` instead.
- Static fetching where `curl`/`fetch` suffices.
- Instead of `verify-before-completion` for code correctness.

## Setup

```bash
# Optional: install if using the standalone scripts
# scripts are Node ESM modules (node 18+) depending only on `browse` + Node stdlib
export BT_DIR="/path/to/browserbase/skills/skills/browser-trace"
```

## Safety / Non-Negotiables

- **Read-only**: this skill only listens. Never issue click/type/nav via browser-trace.
- **Always run `stop-capture.mjs`**, even after a crash, so background processes don't linger and the manifest gets `stopped_at`.
- **Bisect once per run**: `bisect-cdp.mjs` is idempotent — it overwrites per-bucket files from `raw.ndjson` each time.
- **Order on remote/Browserbase**: when using `bb-capture.mjs`, attach the main automation client **before or together with** the tracer, and create the session with `--keep-alive`.

## Core Workflows

### A) Attach to a local/direct automation session

If you have an active CDP target (for example from `browse open`, `browseros-cli`, Chromium `--remote-debugging-port`, or Playwright):

```bash
# 1. Name the run and the target that you want to watch.
RUN_ID="my-run"
TARGET="browse-session"   # depends on the primary automation

# 2. Start capture (the script runs under the trace helper and attaches to the
#    same target your main automation is already using).
node "$BT_DIR/scripts/start-capture.mjs" "$TARGET" "$RUN_ID" \
  "${BROWSE_ARGS[@]}"

# 3. Drive the browser with your primary automation as usual.

# 4. When done or on failure, always stop cleanly:
node "$BT_DIR/scripts/stop-capture.mjs" "$RUN_ID"

# 5. Bisect the NDJSON firehose into per-page buckets:
node "$BT_DIR/scripts/bisect-cdp.mjs" "$RUN_ID"

# 6. Inspect outputs:
ls -la "$BT_DIR/.o11y/$RUN_ID"/*/cdp/network/ | head
find "$BT_DIR/.o11y/$RUN_ID" -name '*.jsonl' | head
```

### B) Attach mid-flight to an existing Browserbase session

For production or long-running sessions that must stay alive:

```bash
SID="<browserbase-session-id>"
RUN_ID="production-attach"

# --new creates the keep-alive session AND attaches the tracer.
# The original automation still needs to attach to this session's connectUrl.
node "$BT_DIR/scripts/bb-capture.mjs" --new "$SID" "$RUN_ID"

# ... later ...

# Stop capture without releasing the session so the original automation
# stays running:
node "$BT_DIR/scripts/bb-finalize.mjs" "$SID" "$RUN_ID"

# Bisect once per run:
node "$BT_DIR/scripts/bisect-cdp.mjs" "$RUN_ID"
```

## Output Layout

After `bisect-cdp.mjs`, look under:

```
${BT_DIR:-.}/.o11y/<run-id>/
├── cdp/
│   ├── network/
│   │   ├── request-*.jsonl
│   │   └── response-*.jsonl
│   ├── console/*.jsonl
│   ├── dom/*.jsonl
│   └── runtime/*.jsonl
├── page/
│   └── <page-id>/
│       ├── snap-*.png
│       ├── dom-*.html
│       └── manifest.json
├── raw.ndjson
└── manifest.json   # includes started_at / stopped_at / target
```

## Typical Retrieval Patterns

```bash
RUN_ID="my-run"
BASE="$BT_DIR/.o11y/$RUN_ID"

# Requests for a specific URL pattern on a given page:
jq -r 'select(.url | test("/api/search")) | .requestId' \
  "$BASE/cdp/network/request-*.jsonl" | sort -u | head

# Console errors tied to the nearest page snapshot:
for f in "$BASE"/cdp/console/*.jsonl; do
  jq -r 'select(.level=="error") | [.timestamp, .text] | @tsv' "$f"
done | sort

# Screenshots around a suspicious timestamp:
ls "$BASE/page/*/" | grep "snap-" | sort | tail -20

# Full timeline inspection on a page:
jq -r '[.timestamp, .method, .params.url]' \
  "$BASE/cdp/network/request-*.jsonl" | sort | head
```

## Compose With

- `browser` / `browseros` / `playwright-testing` → primary automation; *browser-trace only listens*.
- `browser-to-api` → offline post-processing of `cdp/network/*.jsonl` into an OpenAPI 3.1 spec.
- `browse network on` (via the `browser` skill) if you also need request/response bodies.

## Troubleshooting

| Symptom | Fix |
|--------|-----|
| Zombie trace process | Always run `stop-capture.mjs` even after crashes. |
| Empty buckets | Run `bisect-cdp.mjs` once per run; it is idempotent. |
| Session dies too fast (remote) | Create with `--keep-alive` and attach automation + tracer together. |
| Need request bodies | Add `browse network on` (or equivalent) in the `start-capture` command block. |
