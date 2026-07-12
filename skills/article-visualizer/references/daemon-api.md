# WebBridge Daemon API Quick Reference

For the **layer-2 fallback** in `fetch_url.py`. Article-visualizer calls these 4 actions only — for the full action list, see `local-browser-automation` SKILL.md § Direct daemon API.

## Endpoint

```
POST http://localhost:10086/command
Content-Type: application/json
```

⚠️ **NOT** `/v1/browser/fetch` — that's the wrong endpoint shape. Daemon uses a single `/command` route with an `action` discriminator in the JSON body.

## Actions used by article-visualizer

### 1. `list_tabs` — verify extension is connected

```bash
curl -s -X POST http://localhost:10086/command \
  -H "Content-Type: application/json" \
  -d '{"action":"list_tabs"}'
```

Returns `{ok: true, tabs: [...]}` if extension connected; `{ok: false, error: {message: "no extension connected"}}` otherwise.

### 2. `navigate` — open URL in current tab

```bash
curl -s -X POST http://localhost:10086/command \
  -H "Content-Type: application/json" \
  -d '{"action":"navigate", "url": "https://mp.weixin.qq.com/s?..."}'
```

Returns `{ok: true, url, tabId, frameId}`.

### 3. `snapshot` — get DOM snapshot after JS render

```bash
curl -s -X POST http://localhost:10086/command \
  -H "Content-Type: application/json" \
  -d '{"action":"snapshot"}'
```

Returns DOM snapshot. Shape depends on daemon version — could be HTML string, accessibility tree, or dict. Article-visualizer handles all three shapes.

## Setup

```bash
# 1. Start daemon
~/.kimi-webbridge/bin/kimi-webbridge start
#   → "kimi-webbridge daemon started (pid 3579)"

# 2. Verify daemon
curl -s -m 3 -o /dev/null -w "HTTP %{http_code}\n" http://localhost:10086/health
#   → HTTP 404 (daemon up, no /health route — normal)

# 3. Verify extension
curl -s -X POST http://localhost:10086/command \
  -d '{"action":"list_tabs"}' -H "Content-Type: application/json"
#   → {"ok":false,"error":{"message":"no extension connected"}}
#     means daemon up but Chrome extension not enabled

# 4. User opens Chrome with WebBridge extension → list_tabs returns tabs

# 5. article-visualizer now uses webbridge layer
```

## Failure modes

| Symptom | Cause | Fix |
|---|---|---|
| `connection refused` | daemon not running | `~/.kimi-webbridge/bin/kimi-webbridge start` |
| `no extension connected` | Chrome not open with extension | User opens Chrome with extension enabled |
| `navigate failed` | URL blocked by extension | Different URL or use requests fallback |
| `snapshot empty` | JS render took >TIMEOUT | Increase TIMEOUT or use playwright fallback |