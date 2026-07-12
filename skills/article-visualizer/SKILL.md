---
name: article-visualizer
description: "Convert articles (URL or local PDF) into a one-page HTML visualization. Uses 4-layer fetch fallback (requests → webbridge → playwright → error+suggestions) so login-gated, JS-heavy, and anti-bot URLs all work. Extracts 8 key fields (insights, trends, data, players, cases, risks, summary) and embeds curated images (opt-in) + video (local MP4, B站 iframe, YouTube iframe). Default output is image-free for shareability. Triggers: 总结成一页纸 / 生成行业分析可视化 / 帮我整理这篇文章 / summarize this URL / one-pager for {url} / 微信文章可视化 / make this into a one-pager."
---

# Article Visualizer

URL or PDF → one-page HTML summary with 8 structured fields + optional media.

**Defaults**: `include_images=false` (no embedded images, shareable clean HTML). Set `"include_images": true` in the structured JSON to opt in. Avatars / decorative images are auto-filtered at fetch time. Full filter rules + rationale: `references/image-filtering.md`.

## UI iteration principle (learned 2026-07-12)

When Angel asks to "remove" a UI element, **don't permanently delete the CSS/HTML** — comment it out or leave it dead. UI decisions reverse frequently in the same session (e.g. "去掉 footer" → "保留 footer" → "去掉 🦞" → all within 4 turns).

Best practice: keep the deleted code reachable in the file (commented) so a one-line revert restores it. Saves 30s+ per round-trip.

For the article-visualizer, this applies to footer (link + credit + stats) and image-gallery sections specifically.

**Defaults**: `include_images=false` (no embedded images, shareable clean HTML). Set `"include_images": true` in the structured JSON to opt in. Avatars / decorative images are auto-filtered at fetch time.

## 30-second decision tree

| Input | Path |
|---|---|
| Local PDF on disk | `extract_pdf.py` → JSON → `generate_onepage.py` |
| Public URL (36kr, NFX, sspai, OpenAI blog, 微信公众号*) | `fetch_url.py` auto-mode → usually stops at `requests` (1-2s) |
| Login-gated / JS-heavy URL (Twitter, 小红书, 知乎登录态) | `fetch_url.py` auto-mode → tries `webbridge` (Chrome login state) |
| Anti-bot sites (微信公众号 sometimes, 微博, 抖音) | Auto-falls through to `playwright` headless |
| Everything fails | Last resort: tell user "save as PDF, use PDF input mode" |

\* 微信公众号有时可走 requests 拿到完整正文（实测 9224 字符），但失败率高。WebBridge 是稳定兜底。

## Pipeline (canonical)

```
URL or PDF
   ↓
[fetch_url.py | extract_pdf.py]   ← JSON: title/text/images/videos/meta
   ↓
LLM (you) extracts 8 fields       ← JSON: insights/trends/data/players/cases/risks/summary/images
   ↓
[generate_onepage.py]             ← HTML from template + 12 placeholders
   ↓
open in browser
```

## 4-Layer Fetch Fallback (the core technique)

When user gives a URL, `fetch_url.py` tries these in order until one succeeds:

| Layer | Tool | Speed | When it works |
|---|---|---|---|
| 1. `requests` | `requests` + BeautifulSoup | 1-2s | Server-rendered public pages (90% of cases) |
| 2. `webbridge` | Kimi WebBridge daemon → Chrome | 3-5s | Login-gated + JS-heavy sites (Twitter, 知乎会员, 小红书) |
| 3. `playwright` | headless chromium | 5-8s | Anti-bot sites needing real browser fingerprint |
| 4. error+suggestions | — | — | Save as PDF / copy-paste / change URL |

**Key insight**: 微信公众号 is NOT necessarily webbridge-only — `requests` works ~half the time. Always try `requests` first; only escalate when it returns < 500 chars or fails.

**Daemon config**: WebBridge daemon uses `POST http://localhost:10086/command` with `{"action": "navigate|snapshot|list_tabs|..."}` — NOT `/v1/browser/fetch`. Full failure modes + recovery in `references/webbridge-pitfalls.md`.

**Override**:
- `--method webbridge` force webbridge (skip requests)
- `--no-webbridge` skip webbridge (use requests + playwright only)
- `--output FILE.json` write JSON for inspection

## 8-field schema (extracted by LLM)

| Field | Type | Notes |
|---|---|---|
| `title` | string | One-line. The hook. |
| `subtitle` | string | Optional. For long articles. |
| `source` | string | Site/publication name + author |
| `url` | string | Original URL (preserved for footer) |
| `insights` | list[{title, desc}] | 3-5 core takeaways, each with substantive description |
| `trends` | list[{title, desc}] | 3-5 forward-looking trends |
| `data` | list[{value, label, detail}] | 3-5 key numbers with context |
| `players` | list[{name, desc}] | 3-5 companies/orgs/people mentioned |
| `cases` | list[{name, desc, result}] | 3-5 real examples with outcomes |
| `risks` | list[{risk, suggestion}] | 2-4 risk+suggestion pairs |
| `summary` | string | One-paragraph punchline (rendered in red→pink `.summary-box`) |
| `images` | list[{url, alt, caption}] | **OPT-IN embed only** (see "Images" below) |

## Images: default OFF

**Do NOT embed images by default.** Reasons:

1. Most article CDN images (微信公众号 mmbiz.qpic.cn, 微博, 小红书) require Referer → won't render in shared HTML
2. Avatars / decorative images add noise
3. Image embedding requires LLM curation (LLM must pick 3-5 from ~10 candidates)

**Default behavior**:
- `fetch_url.py` extracts images but filters out avatars (< 200x200 OR alt matches `头像/作者/avatar/head/logo`)
- `generate_onepage.py` does NOT render images unless `data["include_images"] = True`
- Result: clean, shareable HTML

**When to opt in**: User says "把图也带上" / "include images" / working with a URL where images are publicly accessible (OpenAI blog, NFX, 36kr — these serve CDN images that work without Referer). Add `"include_images": true` to the JSON before running `generate_onepage.py`.

**Fetch fallback layer design**: see `references/fetch-fallback-strategy.md` for the full 4-layer architecture (requests → webbridge → playwright → error+suggestions), daemon API integration with Kimi WebBridge, and auto-applied image filtering rules.

**Output rendering rules**: see `references/output-rendering-decisions.md` for the footer template, summary-box CSS, image embedding defaults, and the 14-field structured JSON schema.

## Footer design

```html
<div id="footer">
  <div class="footer-link">📄 原文链接：<a href="...">...</a></div>
  <div class="footer-stats">📊 Stats: 8 fields | 3 insights | 4 trends | ...</div>
  <div class="footer-credit">由 Angel's Hermes 制作</div>  <!-- NO emoji -->
</div>
```

- **3 elements**: URL + stats + credit
- URL trimmed at 80 chars, strips `?...` (utm junk)
- Stats line shows field counts
- Credit: "由 Angel's Hermes 制作" — NO 🦞 emoji
- Uses 3 template placeholders: `{{FOOTER_URL}}`, `{{FOOTER_URL_DISPLAY}}`, `{{FOOTER_STATS}}`

## Pitfalls

**1. `{{SUMMARY}}` empty render bug**: If you `escape(data["summary"])` without wrapping in `.summary-box` div, the user sees only the section comment. **Fix**: `render_summary()` returns `<div class="summary-box"><p>...</p></div>`.

**2. Double-footer bug**: If template.html has hardcoded `<div id="footer">...</div>` AND the script injects footer at `</body>`, you get 2 footers. **Fix**: put footer placeholders (`{{FOOTER_URL}}`, `{{FOOTER_STATS}}`) inside template; let script fill them. No script-side injection.

**3. Image URLs that need Referer**: mmbiz.qpic.cn (微信公众号), weibo.com images return 403 without Referer. **Don't pretend to embed them.** Either base64-embed (download first) or default to image-free HTML.

**4. 微信公众号 sometimes works via requests**: Don't assume webbridge-only. Auto-mode tries requests first; if it returns 1000+ chars of real content, use it.

**5. WebBridge daemon API is `/command`, not `/v1/browser/fetch`**: Easy mistake from "REST API" intuition. Correct shape: `POST http://localhost:10086/command` with JSON body `{"action": "..."}`. See `references/daemon-api.md`.

**6. Playwright chromium binary path mismatch**: Even after `pip install playwright`, you need `python3 -m playwright install chromium` to download the binary. Install can time out (~2 min) — fall back gracefully.

**7. Daemon "no extension connected"**: WebBridge daemon runs but extension isn't talking to it. User must open Chrome with the WebBridge extension enabled. Not a code bug — surface clearly in error message.

## Quickstart

```bash
# 1. Fetch URL → JSON
python3 scripts/fetch_url.py "https://example.com/article" --output /tmp/feed.json

# 2. Inspect (titles, images count)
python3 -c "import json; d=json.load(open('/tmp/feed.json')); print(d['title'], len(d.get('content_text','')), 'chars;', len(d.get('images',[])), 'imgs')"

# 3. LLM (you) extracts 8 fields → write to /tmp/structured.json

# 4. Generate HTML
python3 scripts/generate_onepage.py /tmp/structured.json --output ~/Desktop/article.html

# 5. Open
open ~/Desktop/article.html
```

## Files

- `scripts/fetch_url.py` — URL → JSON (4-layer fallback)
- `scripts/extract_pdf.py` — local PDF → JSON
- `scripts/generate_onepage.py` — JSON → HTML (12 placeholders)
- `references/template.html` — HTML template (footer embedded, 12 placeholders)
- `references/url-fetch-strategy.md` — whitelist + per-site notes + failure handling
- `references/daemon-api.md` — WebBridge `/command` API quick reference
- `references/4-layer-fetch-trace.md` — 2026-07-12 implementation trace + reasoning
- `README.md` — GitHub landing page

## Related skills

- `local-browser-automation` — WebBridge daemon (the layer-2 fallback). Read § "Pitfall: don't assume `/v1/...` endpoint shape" for action list.
- `darwin-skill` — auto-optimize this SKILL.md based on rubric
- `publish-skill-to-github` — when ready to push this skill to a public repo

## Reference index

- `references/url-fetch-strategy.md` — original whitelist/reject lists + retry strategy (layer 1 design)
- `references/fetch-fallback-strategy.md` — 4-layer fallback (requests → webbridge → playwright → error) + WebBridge daemon API + image filtering + CLI flags + normalized output JSON shape
- `references/output-rendering-decisions.md` — Angel's confirmed output conventions: footer (no 🦞), summary box, image embedding default (off), auto-filtered avatar/logo rules, 8-field schema

## Versioning

v2.0 (2026-07-12): Hybrid 4-layer fetch fallback + image embed opt-in + Hermes-branded footer. Phase 2 GitHub push pending.
v1.x: Public-URL-only + image-on-by-default + OpenClaw footers.