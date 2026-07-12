# Image extraction: avatar / decorative filter

Default behavior for `extract_images()` in `scripts/fetch_url.py`:

## Why filter at fetch time (not at render time)

- Most Chinese content sites (微信公众号, 微博, 知乎, 小红书) place author avatars, headshots, watermarks, and tracking pixels alongside real content images.
- These decorations are visually noisy in summaries but the LLM doesn't reliably skip them when curating.
- Filter at fetch = the LLM never sees them in the candidates list, so it can't accidentally pick them.

## Filter rules (apply in order)

```python
SKIP if any of these match:
1. Dimensions < 100x100 (tracking pixels, icons)
2. Dimensions < 200x200 (likely avatar, headshot, badge)
3. Alt text contains (case-insensitive): "avatar", "作者", "头像", "head", "logo"
```

Log to stderr: `ℹ️  Skipped N avatar/decorative image(s)` so the user can see what was filtered.

## Why this matters

Without the filter, the LLM extracted these for a 微信公众号 article:
- `cover_image` (real — keep)
- `文章内图` (real — keep)
- `作者头像` (Angel's avatar — should be filtered)

After the filter, only the 2 real images reach the candidates list.

## When NOT to filter

For analysis-focused articles (e.g., 36kr / NFX), the images are usually charts, product shots, or diagrams — all useful. The filter doesn't catch these because they're large + non-avatar alt text.

For reference profiles / "About the team" sections, the filter would wrongly strip legitimate headshots. Disable with `include_all=True` if needed.

## Default render: OFF even with valid images

`include_images=false` is the HTML render default regardless of fetch quality. Reason: many source images need Referer / auth headers (微信公众号 CDN blocks anonymous image fetches with 403). Embedding them produces broken `<img>` tags in the HTML, which is worse than no image.

User must opt in explicitly: `"include_images": true` in the structured JSON.