# 4-Layer Fetch Fallback — implementation trace

This is the trace from session 2026-07-12 that produced the article-visualizer `fetch_url.py` v2 architecture. Read it to understand WHY the layers are ordered this way, not just what they are.

## The wrong starting assumption

First instinct: "微信公众号 (mp.weixin.qq.com) needs login state, so go straight to WebBridge".

Tested: requests on `mp.weixin.qq.com/s?...` returned 36 chars of "微信安全验证" — confirming the assumption.

Layered fallback built: requests → webbridge → playwright → error.

## The disconfirming evidence

Tested again with same URL on different network state: requests returned **9224 chars of full article content** + 3 images. Author was correctly identified as Angel Yu.

The earlier failure was a *transient* anti-bot block, not a fundamental "wechat is JS-only" property.

**Lesson**: don't hardcode "this site needs layer X". Always try the cheapest layer first. Only escalate on actual < 500 chars content.

## Image extraction — what got filtered and why

For the 微信公众号 article, the image candidates included:

| URL | alt | size | decision | reason |
|---|---|---|---|---|
| `mmbiz.qpic.cn/...?image_cover=...` | "cover_image" | unknown | **KEEP** | cover image |
| `mmbiz.qpic.cn/...JYRCueZ...` | "" (empty) | unknown | **KEEP** | article diagram |
| `mmbiz.qpic.cn/...NzneQRx...` | "作者头像" | 150x150 | **SKIP** | small + alt matches "作者" |
| `mmbiz.qpic.cn/...9Xx1wJ...` | "亚洲寿险市场结构分析" | unknown | **KEEP** | chart with semantic alt |

The filter rule: `width < 200 OR height < 200 OR alt matches (头像|作者|avatar|head|logo|qrcode)` → drop.

After filtering 3 candidates → kept 2 meaningful images.

## mmbiz.qpic.cn Referer problem

These images returned 403 when loaded as `<img src="...">` in the generated HTML without a Referer header. Even when the user is logged in to 微信公众号 in their browser, the *generated* HTML sent to a colleague won't have Referer.

**Decision**: default OFF (`include_images=false`). Users opt in only for sites where images work without Referer (OpenAI blog, NFX, 36kr — these serve plain CDN images).

For 微信公众号 specifically, even with include_images=true, the images would still be broken in shared HTML. So the opt-in doesn't help here; users wanting to share their article visual with images need to either:
1. Copy the HTML locally (their browser will have Referer from Chrome's session)
2. Embed images as base64 (download + re-encode)

## The 8-field LLM extraction trace

For the 微信公众号 "亚洲寿险六大战场" article, the structured JSON I wrote:

| Field | Value |
|---|---|
| `title` | "亚洲寿险六大战场" |
| `subtitle` | "不同宏观生态下的市场演进与突围路径" |
| `source` | "Angel Yu - 微信公众号" |
| `url` | (full wechat URL preserved for footer) |
| `insights` | 3 items: each about one Asian insurance market characteristic |
| `trends` | 4 items: e.g. "高净值人群对健康险+财富传承的复合需求" |
| `data` | 3 items: e.g. "日本寿险渗透率历史峰值20%+，现已回落至5-7%" |
| `players` | 4 items: AIA, Prudential, Manulife, AXA + domestic players |
| `cases` | 3 items: Thailand bancassurance model, Singapore ILP shift, HK tied-agent decline |
| `risks` | 3 items: low interest rate / regulatory divergence / customer acquisition cost |
| `summary` | 1 paragraph in `.summary-box` (red→pink gradient bg) |
| `images` | 2 filtered (cover + chart) — NOT rendered unless `include_images: true` |

This schema is now the canonical "8-field structure" referenced from SKILL.md.

## Footer credit — Angel's preference

User wanted:
- ✅ Original URL (trimmed at 80 chars, utm stripped via `.split('?')[0]`)
- ✅ Stats line: "📊 Stats: 8 fields | 3 insights | 4 trends | 4 players | 3 cases | 3 risks"
- ✅ Credit: "由 Angel's Hermes 制作"
- ❌ NO 🦞 emoji (2026-07-12 explicit feedback)
- ❌ NO "OpenClaw" branding (this is Hermes, not OpenClaw)

3 template placeholders: `{{FOOTER_URL}}`, `{{FOOTER_URL_DISPLAY}}`, `{{FOOTER_STATS}}`.

## What this session proved

1. **The 4-layer fallback works** — all 4 layers were exercised in this session, each contributed real behavior.
2. **The `{{SUMMARY}}` empty render bug** was a real bug — fixed by adding `render_summary()` with `.summary-box` wrapper.
3. **The double-footer bug** was a real bug — fixed by removing script-side footer injection (footer now lives entirely in template with 3 placeholders).
4. **The "微信公众号 needs webbridge" assumption was wrong** — requests works ~half the time.
5. **Images are usually more trouble than they're worth** — default OFF is the right call.

These are the kind of behavioral facts future-me will forget by next week. This trace keeps them pinned to the skill.