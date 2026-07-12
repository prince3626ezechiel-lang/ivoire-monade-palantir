# URL Fetch Strategy

How `fetch_url.py` decides which fetch layer to use for which site, and how to handle failures.

## Decision tree (matches the 4-layer fallback in SKILL.md)

```
URL arrives
  ↓
[Try requests with proper UA]──────┐
  ↓                                │
content_text < 500 chars?          │ Yes (or 4xx/5xx)
  ↓ No                             │
STOP — return JSON                 ▼
  ↓                       [Try webbridge daemon]
                                ↓
                          daemon up + extension connected?
                                ↓ Yes
                          navigate → snapshot
                                ↓
                          content_text < 500 chars?
                                ↓ No
                          STOP — return JSON (method: webbridge)
                                ↓ Yes
                          [Try playwright headless]
                                ↓
                          chromium installed?
                                ↓ Yes
                          render → snapshot
                                ↓
                          STOP or fall through
                                ↓
                          [Error + 3 suggestions]
                          - Save as PDF locally → use PDF input mode
                          - Copy-paste into chat
                          - Try a different URL
```

## Whitelist (auto-mode preferences)

These sites work with `requests` (layer 1) in ≥90% of attempts:

| Site | Why it works | Notes |
|---|---|---|
| 36kr.com | server-rendered HTML | rich content |
| huxiu.com | server-rendered HTML | clean extraction |
| sspai.com | server-rendered HTML | paywall for older articles |
| jiqizhixin.com (机器之心) | server-rendered HTML | |
| 36kr / ifanr | server-rendered HTML | |
| nfx.com | server-rendered HTML | clean, English |
| openai.com/blog | server-rendered HTML | |
| anthropic.com/news | server-rendered HTML | |
| stratechery.com | server-rendered HTML | may 503 on bursts |
| bzhibo.com / chinabgao.com | server-rendered HTML | |
| mp.weixin.qq.com | **sometimes** server-rendered | ~50% success via requests; needs retry |
| zhihu.com/p/... (专栏) | server-rendered HTML | but ad-heavy |

## Deny-list (likely to fail with `requests`)

These sites need layer 2+ in ≥90% of attempts:

| Site | Why | Best layer |
|---|---|---|
| weibo.com | JS-rendered timeline | webbridge |
| x.com / twitter.com | JS + login | webbridge (logged-in Chrome) |
| xiaohongshu.com | JS + anti-bot | webbridge |
| douyin.com | JS + signed URLs | playwright (webbridge only gets the page) |
| baidu.com/...baijiahao | aggressive anti-bot (百度安全验证) | playwright + cookies, or skip |
| zhihu.com (问答，需登录) | login wall | webbridge (logged-in Chrome) |
| linkedin.com | login wall | webbridge (logged-in Chrome) |
| instagram.com | login wall | webbridge |

## Retry policy

`requests` failure modes and how to handle them:

| Error | Cause | Auto-retry? |
|---|---|---|
| `connection refused` | DNS or network | No — surface to user |
| 4xx (forbidden/blocked) | anti-bot | No — escalate to next layer |
| 5xx (server error) | site down | Yes, 1 retry after 2s |
| Timeout (>10s) | slow / blocked | No — escalate |
| SSL error | cert issue | No — escalate |
| Empty `<body>` | JS-rendered | Yes — escalate |
| Content < 500 chars | likely anti-bot stub | Yes — escalate |

## Image extraction (applied during all layers)

When a layer succeeds, extract `<img>` URLs from the rendered HTML. Filter:

| Filter | Why |
|---|---|
| `width < 200` OR `height < 200` | avatars, icons, QR codes, tracking pixels |
| alt matches `(头像|作者|avatar|head|logo|qrcode)` | author decoration, share buttons |
| URL contains `(pixel.gif|tracking|ads)` | noise |
| Already-seen URLs (dedup) | avoid duplicates |

Output: up to 10 candidate images with `{url, alt, width, height, caption}` for LLM curation.

**Note**: candidates are returned in JSON but `generate_onepage.py` does NOT embed them unless `data["include_images"] = True` (see SKILL.md § "Images: default OFF").

**Avatar / decorative filter** (added 2026-07-12): images are pre-filtered at fetch time. Skipped if:
- Dimensions < 200x200 (likely avatar / icon)
- Alt text contains `avatar` / `作者` / `头像` / `head` / `logo`
- Dimensions < 100x100 (tracking pixels)

Stderr log: `ℹ️  Skipped N avatar/decorative image(s)`.

## Metadata extraction

Always returned regardless of layer:

- `title` — `<meta og:title>` or `<title>` (whichever is longer)
- `author` — `<meta name:author>` or byline text
- `publish_date` — `<meta article:published_time>` or visible date
- `description` — `<meta og:description>` or first 200 chars

## WebBridge specifics

For layer 2, see `references/daemon-api.md` for the `/command` endpoint shape.

**Critical**: daemon must be running AND Chrome extension connected, otherwise layer 2 fails immediately. Don't pretend the layer is "trying" — surface the failure clearly:

```
→ Trying webbridge (3-5s)...
⚠️  Daemon up but no Chrome extension connected.
    Open Chrome with the WebBridge extension enabled, then retry.
    Or set --no-webbridge to skip this layer.
```

## Playwright specifics

For layer 3:

```bash
# Install (one-time)
python3 -m pip install playwright
python3 -m playwright install chromium  # 2-3 min download
```

Browser binary path: `~/.cache/ms-playwright/chromium-*/chrome-linux/chrome` (Linux) or `~/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app` (macOS).

**Pitfall**: install can time out at 2 min on slow networks. If it fails:
1. Surface the timeout clearly
2. Don't pretend playwright is "trying"
3. Fall through to layer 4 with all-3-failed message

## Final layer: error + suggestions

After all 3 layers fail, return:

```json
{
  "url": "...",
  "method": "failed",
  "error": "All 3 fetch layers failed",
  "fallback_suggestion": "..."
}
```

Suggestions (in priority order):
1. **Save as PDF locally** → use the PDF input mode (which works without any fetch)
2. **Copy-paste the article text** → ask LLM to extract 8 fields from raw text
3. **Try a different URL** (if it's a content farm or login-walled)
4. **Open in browser yourself** → summarize aloud

Always show the user what failed, not just "fetch failed":
- "requests returned 36 chars (likely anti-bot block)"
- "webbridge: daemon up but no extension connected"
- "playwright: chromium not installed"