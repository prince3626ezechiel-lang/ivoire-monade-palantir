# Fetch Fallback Strategy (4-layer, verified 2026-07-12)

The default `fetch_url.py` runs a **4-layer fallback chain**. This reference explains
the design, the trigger conditions, and the WebBridge layer in detail.

## The chain

```
URL
  │
  ├─ 1. requests    (anonymous HTTP, ~1-2s, public content)
  │     └─ fails on: anti-bot, JS render, login walls, captchas
  │
  ├─ 2. webbridge   (Kimi WebBridge daemon, ~5-8s, uses logged-in Chrome cookies)
  │     └─ fails on: daemon stopped, extension disconnected, anti-fingerprint
  │
  ├─ 3. playwright  (headless Chromium, ~3-5s, stealth)
  │     └─ fails on: playwright/chromium not installed, persistent fingerprinting
  │
  └─ 4. error + suggestions  (clear message + retry-with-mode hints)
```

Default mode is `auto` (4-layer fallback). Pass `--mode <name>` or `--no-webbridge`
to skip layers explicitly. Each layer returns a normalized JSON; the chain stops
on the first success.

## Layer 1 — requests (always first)

Standard `requests.get(url, headers={"User-Agent": "..."})`. Fast and cheap.

**Whitelist sites that respond well** (verified working without any fallback):
- NFX posts (`nfx.com/post/*`) — clean static HTML
- Bloomberg, Reuters, TechCrunch — public news
- Medium (no paywall), Substack public posts
- GitHub raw files, blog domains on common hosts
- WeChat 公众号 — **sometimes** works with `requests` (varies by anti-bot state)

**Reject sites (always blocked)**:
- WeChat `mp.weixin.qq.com` (anti-crawler blocks ~50% of attempts; sometimes passes)
- 百家号 (`baijiahao.baidu.com`) — locked to logged-in Baidu
- 小红书 (`xiaohongshu.com`) — fingerprint + login required
- 微博 (`weibo.com`) — requires login for full content

## Layer 2 — webbridge (Kimi WebBridge fallback)

When requests fails, try the local WebBridge daemon. This uses the **user's logged-in
Chrome session** so it bypasses anti-bot and login walls.

**Daemon API (verified 2026-07-12)**:
- Endpoint: `POST http://localhost:10086/command`
- Body: `{"action": "...", ...}`
- **NOT** `/v1/browser/fetch` — that endpoint doesn't exist (common mistake)
- Default port: 10086 (override via `WEBBRIDGE_URL` env var)

**Standard 3-step fetch flow**:
```bash
# 1. Verify daemon + extension are alive
curl -X POST http://localhost:10086/command \
  -H "Content-Type: application/json" \
  -d '{"action":"list_tabs"}'

# 2. Navigate (uses user's cookies)
curl -X POST http://localhost:10086/command \
  -H "Content-Type: application/json" \
  -d '{"action":"navigate","url":"https://example.com"}'

# 3. Snapshot the rendered DOM
curl -X POST http://localhost:10086/command \
  -H "Content-Type: application/json" \
  -d '{"action":"snapshot","tabId":<captured>}'
```

**Python equivalent** (what `fetch_url.py` does):
```python
import os, requests

DAEMON = os.environ.get("WEBBRIDGE_URL", "http://localhost:10086/command")

def cmd(action, **kw):
    r = requests.post(DAEMON, json={"action": action, **kw}, timeout=30).json()
    if not r.get("ok"):
        raise RuntimeError(r.get("error", {}).get("message", "unknown error"))
    return r["data"]

# Open page
d = cmd("navigate", url="https://example.com")
tab_id = d["tabId"]

# Snapshot
tree = cmd("snapshot", tabId=tab_id, maxDepth=4)
```

**Daemon lifecycle** (handled by `local-browser-automation` skill):
- Install: `curl -fsSL https://cdn.kimi.com/webbridge/install.sh | bash` (user must run; Hermes blocks curl|bash)
- Start: `~/.kimi-webbridge/bin/kimi-webbridge start`
- Status: `kimi-webbridge status` → expect `extension_connected: true`
- Stop: `kimi-webbridge stop`

**When to skip webbridge** (`--no-webbridge` flag):
- Public content that requests can handle (saves 5-8 sec per URL)
- Daemon not running (saves the failure noise)
- Headless/automated batch without user present (no Chrome = no extension)

## Layer 3 — playwright (last-ditch browser)

Uses local headless Chromium via playwright. Slow (~3-5s) but more robust than
requests for JS-rendered sites without requiring a real browser session.

**Limitation**: requires `playwright install chromium` to have succeeded. On
macOS this often times out at 60s on first install (use longer timeout or
`playwright install --with-deps chromium`).

**Skip playwright when**:
- WebBridge is available (faster, has user's cookies)
- Target is a simple API endpoint
- You're in a CI/headless environment (WebBridge won't work either)

## Layer 4 — error + actionable suggestions

When all layers fail, return a JSON error with:
- Which layers were tried
- Specific failure reason per layer (timeout? blocked? JS-required?)
- Suggested next steps (try `--no-webbridge`? install playwright?)

**Example error shape**:
```json
{
  "ok": false,
  "url": "https://mp.weixin.qq.com/s/abc",
  "title": null,
  "error": {
    "code": "all_layers_failed",
    "tried": ["requests", "webbridge", "playwright"],
    "reasons": {
      "requests": "HTTP 200 but body is 百度安全验证 (anti-bot challenge)",
      "webbridge": "daemon responded: no extension connected",
      "playwright": "chromium not installed (run: playwright install chromium)"
    },
    "suggestions": [
      "open the URL in Chrome manually with the WebBridge extension active, then retry",
      "if you have a paid SaaS API for this site, paste the content into a JSON file and run generate_onepage.py directly"
    ]
  }
}
```

## CLI flags

```bash
python3 scripts/fetch_url.py <url>                    # auto mode (default)
python3 scripts/fetch_url.py <url> --mode requests    # force layer 1 only
python3 scripts/fetch_url.py <url> --mode webbridge   # force layer 2
python3 scripts/fetch_url.py <url> --mode playwright  # force layer 3
python3 scripts/fetch_url.py <url> --no-webbridge     # skip layer 2 (faster)
python3 scripts/fetch_url.py <url> --output out.json  # write to specific path
```

## Output shape (normalized across all layers)

All 4 layers return the same JSON structure:

```json
{
  "ok": true,
  "url": "...",
  "title": "...",
  "author": "...",
  "date": "...",
  "content_text": "...",        // main article body, plain text
  "content_html": "...",        // raw HTML if you need to re-parse
  "images": [
    {"url": "...", "alt": "...", "width": N, "height": N}
  ],
  "videos": [
    {"type": "bilibili", "bvid": "...", "title": "..."},
    {"type": "youtube", "video_id": "...", "title": "..."},
    {"type": "local", "path": "/path/to/file.mp4"}
  ],
  "method": "requests" | "webbridge" | "playwright",
  "bytes_fetched": 12345,
  "duration_ms": 1234
}
```

## Image filtering (auto-applied to all layers)

By default, images smaller than 200×200 OR with alt text matching these patterns
are filtered out:
- `作者头像`, `avatar`, `head`, `logo`, `作者`, `头像`

Rationale: article images that survive the filter are real content images.
Authors/logos/decorative pixels are noise that breaks the one-page visual.

**Override**: pass `include_avatars=true` to disable filtering. **Don't** — the
default behavior exists because WeChat CDN URLs are anti-hotlinked, so avatar
images don't even render anyway.

## Related references

- `url-fetch-strategy.md` — original whitelist/reject lists + retry strategy
- `local-browser-automation` skill — full WebBridge setup + daemon API reference