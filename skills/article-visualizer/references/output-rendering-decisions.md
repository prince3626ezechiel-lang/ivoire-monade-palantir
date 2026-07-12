# Output Rendering Decisions (HTML one-pager, verified 2026-07-12)

User-confirmed output conventions for `generate_onepage.py`. These are Angel's
preferences — when in doubt, check here before changing template.html.

## Footer (must include all 3, in this order)

```html
<div id="footer">
  <div class="footer-link">📄 原文链接：<a href="{{FOOTER_URL}}">{{FOOTER_URL_DISPLAY}}</a></div>
  <div class="footer-stats">📊 Stats: 8 fields | 3 insights | 4 trends | 5 players</div>
  <div class="footer-credit">由 Angel's Hermes 制作</div>
</div>
```

- ✅ **原文链接**: full clickable URL (the `{{FOOTER_URL_DISPLAY}}` placeholder
  is a truncated display version for narrow layouts)
- ✅ **stats**: count of fields extracted (8 fields | N insights | N trends | ...)
- ✅ **credit**: "由 Angel's Hermes 制作" — NO emoji
- ❌ DO NOT add 🦞 (user explicitly removed it 2026-07-12)
- ❌ DO NOT remove the credit or stats line — both required

**History note**: User first removed footer entirely, then restored it with the
credit line. Treat the footer as a fixed brand asset — only edit when the user
explicitly says so.

## Summary box (NEW 2026-07-12)

The `{{SUMMARY}}` placeholder wraps the one-line article summary in a styled box
(`.summary-box` CSS class). Without it, the summary just renders as bare text
under the title — easy to miss.

CSS:
```css
.summary-box {
  background: linear-gradient(135deg, #DC2626 0%, #DB2777 100%);
  color: white;
  padding: 18px 24px;
  border-radius: 8px;
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  margin: 16px 0 32px;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15);
}
```

**Implementation**: `render_summary(data.get("summary", ""))` in
`generate_onepage.py` wraps the value in `<div class="summary-box">...</div>`.
If the summary is empty, the function returns `""` (no empty box).

## Image embedding (default OFF, 2026-07-12)

`data["include_images"]` controls whether the HTML actually renders `<img>` tags:

- `include_images: false` (default) → `render_images()` returns empty string.
  Images are still **fetched and cached** in `data["images"]` so they're available
  if the caller flips the flag and re-runs.
- `include_images: true` → renders the filtered image list as a gallery.

**Why default off**:
1. WeChat CDN URLs (mmbiz.qpic.cn etc.) require `Referer: mp.weixin.qq.com` to
   serve — anti-hotlink. Embedding them in a standalone HTML file breaks the
   image display.
2. NFX and most blogs use lazy-loaded `_next/image` URLs that may 403 outside
   the original page context.
3. The user said "看不到图" when testing WeChat URLs with images embedded —
   confirmed this is a real failure mode, not a bug in template.html.

**Auto-filtering** (always applied regardless of flag):
- `< 200×200` pixel size → drop (avatar / logo / icon territory)
- alt text matches `作者头像|avatar|head|logo|作者|头像` → drop
- 1×1 tracking pixels → drop

## Video embedding (always opt-in)

`data["videos"]` array. Each entry is one of:
```json
{"type": "bilibili", "bvid": "BV1...", "title": "..."}
{"type": "youtube", "video_id": "abc123", "title": "..."}
{"type": "local", "path": "/abs/path/to/file.mp4", "title": "..."}
```

Rendered via `{{VIDEOS}}` placeholder → `.video-section` block with iframe
(for B站/YouTube) or `<video controls>` (for local).

## The 8 fields (extract this from article)

```
1.  title         (string)
2.  subtitle      (string, optional)
3.  source        (string, optional — site name)
4.  url           (string)
5.  include_images (bool, default false)
6.  insights      (array of {title, desc})        — 2-3 items
7.  trends        (array of {title, desc})        — 3-5 items
8.  data          (array of {value, label, detail}) — 3-5 items
9.  players       (array of {name, desc})          — 2-5 items
10. cases         (array of {name, desc, result}) — 1-3 items
11. risks         (array of {risk, suggestion})   — 1-3 items
12. summary       (string, 1-2 sentences)
13. images        (array of {url, alt, caption})  — auto-filtered
14. videos        (array of {type, ...})          — opt-in
```

If you have an `{{SUMMARY}}` placeholder in the template, **make sure the
rendering function exists in the script**. A bare `data["summary"]` substitution
gives unstyled text; the user will notice immediately.