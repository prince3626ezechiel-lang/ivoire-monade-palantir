# Article Visualizer

Turn any **public article** (URL) or **local PDF** into a beautiful **one-page HTML summary** with 8 structured fields (insights, trends, data, players, cases, risks, summary).

**4-layer fetch fallback** (requests → webbridge → playwright → error+suggestions) handles 90%+ of real-world URLs, including login-gated and JS-heavy sites.

**Clean defaults**: HTML is image-free and shareable. Set `"include_images": true` in the structured JSON to opt in.

## When to use

✅ User wants a one-page summary of a public article (paste URL)
✅ User wants a PDF / Markdown file converted to a one-pager
✅ User wants to share an article summary via 飞书 / email / Notion (HTML works everywhere)
✅ User wants the 8-field breakdown (insights + trends + data + players + cases + risks)
✅ User has a login-gated URL (微信公众号, 知乎会员) — auto-falls back to WebBridge

## When NOT to use

❌ Source is paywalled (Stratechery subscriber, Medium member-only)
❌ Source requires custom interactive flows (banking, OA dashboards)
❌ User wants real-time data / dashboards
❌ User wants raw text only (no HTML)

## Quick start

### 1. Install dependencies

```bash
pip install requests beautifulsoup4 playwright
python3 -m playwright install chromium    # optional, only for JS-heavy fallback
```

### 2. Fetch a URL

```bash
python3 scripts/fetch_url.py "https://www.nfx.com/post/ai-games" \
    --output /tmp/article.json
```

**4-layer fallback** runs automatically:
1. `requests` (1-2s) — public pages
2. `webbridge` (3-5s) — login-gated / JS-heavy sites (uses your Chrome)
3. `playwright` (5-8s) — anti-bot sites needing real browser
4. Error + suggestions (save as PDF, copy-paste, change URL)

Override: `--method webbridge` / `--no-webbridge` / `--method playwright`

### 3. Extract 8 fields (LLM step)

Read `/tmp/article.json` as the LLM, extract these 8 fields:

| # | Field | Description |
|---|-------|-------------|
| 01 | **insights** | 3 key insights |
| 02 | **trends** | 3-5 trends |
| 03 | **data** | Big numbers + meaning |
| 04 | **players** | Companies / brands + 1-line intro |
| 05 | **cases** | Cases + outcome + lesson |
| 06 | **risks** | Risks + suggestions |
| 07 | **summary** | One-liner punchline |
| 08 | **images** *(optional)* | 3-5 picks from candidates |

See `SKILL.md` for the full schema and prompting tips.

### 4. Render HTML

```bash
python3 scripts/generate_onepage.py structured.json \
    --output "~/Desktop/Hermes 学习/one-page-render/summary.html"
open "~/Desktop/Hermes 学习/one-page-render/summary.html"
```

**Default**: HTML is image-free, shareable, single-file.
**Opt in to images**: add `"include_images": true` to your structured JSON.

## Supported sites

See [`references/url-fetch-strategy.md`](./references/url-fetch-strategy.md) for full details.

**Works cleanly with requests** (1-2s, no setup):
- News: 36kr, huxiu, jiqizhixin, sspai, zhihu 专栏
- Tech blogs: Medium (public), Substack (public), Dev.to
- Public docs: arxiv, OpenAI/Anthropic/DeepMind blogs
- VC / analysis: Stratechery (public posts), NFX
- Chinese: 微信公众号 (works ~50% of the time)

**Works with WebBridge** (3-5s, requires Chrome + extension):
- Login-gated: 知乎会员, 小红书 (logged-in), 飞书 web
- JS-heavy: Twitter/X, 小红书 notes, 抖音, 微博

**Won't work even with WebBridge** (use PDF fallback):
- Paywalled content (Stratechery subscriber, Medium member-only)
- Custom interactive flows (online banking, complex dashboards)

## WebBridge setup (optional)

If you want layer-2 fallback to work:

```bash
# 1. Install Kimi WebBridge daemon
brew install kimi-webbridge    # or download from github

# 2. Start daemon (default port 10086)
~/.kimi-webbridge/bin/kimi-webbridge start

# 3. Install Chrome extension
# See local-browser-automation skill § Setup

# 4. Verify
curl -X POST http://localhost:10086/command \
    -H "Content-Type: application/json" \
    -d '{"action":"list_tabs"}'
```

Without WebBridge, layer 1 (requests) still handles ~90% of URLs.

## Architecture

```
URL or PDF
   ↓
[fetch_url.py | extract_pdf.py]   ← JSON: title/text/images/videos/meta
   ↓
LLM (you) extracts 8 fields       ← JSON: insights/trends/data/...
   ↓
[generate_onepage.py]             ← HTML from template + 12 placeholders
   ↓
open in browser
```

Two scripts (URL + PDF) → unified JSON schema → unified HTML renderer.

## License

MIT

## Author

Angel Yu (@sahatuhurc) — built for the Hermes agent ecosystem.