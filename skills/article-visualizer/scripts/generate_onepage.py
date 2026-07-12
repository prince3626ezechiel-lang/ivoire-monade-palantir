#!/usr/bin/env python3
"""
generate_onepage.py — Generate one-page HTML summary from article data

Input:  JSON dict (either from fetch_url.py or manually constructed)
Output: HTML file (filled template)

Usage:
    # From a fetched URL JSON:
    python3 fetch_url.py "https://example.com/article" --output article.json
    python3 generate_onepage.py article.json --output summary.html

    # With LLM-extracted content (the typical flow):
    # 1. fetch_url.py → article.json (raw text + images + videos)
    # 2. LLM reads article.json → extracts 8 fields → structured JSON
    # 3. generate_onepage.py structured.json → HTML

The 8 fields follow the article-visualizer SKILL.md schema:
  - title, subtitle, source, url
  - insights[]: {title, desc}
  - trends[]: {title, desc}
  - data[]: {value, label, detail}
  - players[]: {name, desc}
  - cases[]: {name, desc, result}
  - risks[]: {risk, suggestion}
  - summary: str (one-liner)
  - images[]: {url, alt, caption}    # LLM-curated 3-5
  - videos[]: {url, type, embed_id}  # from fetch_url.py

For full schema, see SKILL.md "Step 2: 内容提取与结构化".
"""

import argparse
import html
import json
import sys
from pathlib import Path
from urllib.parse import quote

DEFAULT_TEMPLATE = Path(__file__).parent.parent / "references" / "template.html"
DEFAULT_OUTPUT_DIR = Path.home() / "Desktop" / "Hermes 学习" / "one-page-render"


def escape(text: str) -> str:
    """HTML-escape user text."""
    if not text:
        return ""
    return html.escape(str(text), quote=True)


def render_insights(items: list) -> str:
    if not items:
        return '<p style="color:#9CA3AF;font-style:italic;">暂无核心洞察</p>'
    out = []
    for item in items:
        if isinstance(item, str):
            out.append(f'<div class="insight-item">{escape(item)}</div>')
        else:
            out.append(
                f'<div class="insight-item">'
                f'<span class="insight-title">{escape(item.get("title", ""))}</span>'
                f'<span class="insight-desc">{escape(item.get("desc", ""))}</span>'
                f'</div>'
            )
    return "\n".join(out)


def render_trends(items: list) -> str:
    if not items:
        return '<p style="color:#9CA3AF;font-style:italic;">暂无趋势数据</p>'
    out = []
    for i, item in enumerate(items, 1):
        if isinstance(item, str):
            out.append(f'<div class="trend-item">{escape(item)}</div>')
        else:
            out.append(
                f'<div class="trend-item">'
                f'<span class="trend-num">{i}.</span>'
                f'<strong>{escape(item.get("title", ""))}</strong> '
                f'<span class="trend-desc">— {escape(item.get("desc", ""))}</span>'
                f'</div>'
            )
    return "\n".join(out)


def render_data(items: list) -> str:
    if not items:
        return '<p style="color:#9CA3AF;font-style:italic;">暂无数据亮点</p>'
    out = []
    for item in items:
        if isinstance(item, str):
            out.append(f'<div class="data-item"><div class="data-content">{escape(item)}</div></div>')
        else:
            out.append(
                f'<div class="data-item">'
                f'<div class="data-value">{escape(item.get("value", ""))}</div>'
                f'<div class="data-content">'
                f'<div class="data-label">{escape(item.get("label", ""))}</div>'
                f'<div class="data-detail">{escape(item.get("detail", ""))}</div>'
                f'</div></div>'
            )
    return "\n".join(out)


def render_players(items: list) -> str:
    if not items:
        return '<p style="color:#9CA3AF;font-style:italic;">暂无关键玩家</p>'
    out = []
    for item in items:
        if isinstance(item, str):
            out.append(f'<div class="player-item">{escape(item)}</div>')
        else:
            out.append(
                f'<div class="player-item">'
                f'<strong>{escape(item.get("name", ""))}</strong> '
                f'<span style="color:#6B7280;">— {escape(item.get("desc", ""))}</span>'
                f'</div>'
            )
    return "\n".join(out)


def render_images(items: list, include: bool = False) -> str:
    """LLM-curated 3-5 images, in priority order.

    By default does NOT embed images (include=False) because:
      - Many source images require authentication / Referer (微信公众号, 微博)
      - Adds visual noise without value in most summaries
    Set include=True to embed (only when caller has verified URLs work in browser).
    """
    if not include or not items:
        return ""
    sections = []
    for img in items[:5]:  # cap at 5
        url = img.get("url", "")
        alt = escape(img.get("alt", ""))
        caption = escape(img.get("caption", ""))
        if not url:
            continue
        sections.append(
            f'<div class="image-section">'
            f'<img src="{escape(url)}" alt="{alt}" loading="lazy" />'
            f'<p class="image-caption">{caption or alt}</p>'
            f'</div>'
        )
    if not sections:
        return ""
    return '<div class="image-gallery">\n' + "\n".join(sections) + "\n</div>"


def render_videos(items: list) -> str:
    """
    Render video embeds: local <video>, B站 iframe, YouTube iframe.
    Skips items with no usable URL/embed_id.
    """
    if not items:
        return ""

    cards = []
    for v in items:
        vtype = v.get("type", "local")
        url = v.get("url", "")
        embed_id = v.get("embed_id")
        caption = escape(v.get("caption", ""))

        if vtype == "bilibili" and embed_id:
            # B站 iframe — use player URL with bvid
            src = (
                f"//player.bilibili.com/player.html?bvid={quote(embed_id)}"
                f"&autoplay=0&danmaku=0"
            )
            cards.append(
                f'<div class="video-section">'
                f'<iframe src="{src}" scrolling="no" frameborder="no" '
                f'framespacing="0" allowfullscreen="true" '
                f'sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"></iframe>'
                f'<p class="video-caption">{caption or "B站视频"}</p>'
                f'</div>'
            )
        elif vtype == "youtube" and embed_id:
            src = f"https://www.youtube.com/embed/{quote(embed_id)}"
            cards.append(
                f'<div class="video-section">'
                f'<iframe src="{src}" allowfullscreen="true" '
                f'sandbox="allow-same-origin allow-scripts allow-presentation"></iframe>'
                f'<p class="video-caption">{caption or "YouTube 视频"}</p>'
                f'</div>'
            )
        elif vtype == "local" and url:
            cards.append(
                f'<div class="video-section">'
                f'<video src="{escape(url)}" controls preload="metadata"></video>'
                f'<p class="video-caption">{caption or "本地视频"}</p>'
                f'</div>'
            )
        # silently skip if neither embed_id nor url

    if not cards:
        return ""

    section_title = ""
    if cards:
        section_title = (
            '<div class="section-title" style="margin-top:30px;">'
            '<span class="section-number">▶</span>'
            'VIDEO 视频'
            '</div>'
        )

    grid_class = "video-grid" if len(cards) > 1 else ""
    return section_title + f'<div class="{grid_class}">\n' + "\n".join(cards) + "\n</div>"


def render_cases(items: list) -> str:
    if not items:
        return '<p style="color:#9CA3AF;font-style:italic;">暂无案例</p>'
    out = []
    for item in items:
        if isinstance(item, str):
            out.append(f'<div class="case-box">{escape(item)}</div>')
        else:
            result_html = ""
            if item.get("result"):
                result_html = (
                    f'<div class="case-result">'
                    f'📈 {escape(item.get("result", ""))}'
                    f'</div>'
                )
            out.append(
                f'<div class="case-box">'
                f'<div class="case-name">{escape(item.get("name", ""))}</div>'
                f'<div class="case-desc">{escape(item.get("desc", ""))}</div>'
                f'{result_html}'
                f'</div>'
            )
    return "\n".join(out)


def render_summary(text: str) -> str:
    """One-liner punchline, wrapped in styled summary-box."""
    if not text:
        return ""
    return f'<div class="summary-box"><p>{escape(text)}</p></div>'


def render_risks(items: list) -> str:
    """Risks can be a list of strings OR a list of {risk, suggestion}."""
    if not items:
        return '<p style="color:#9CA3AF;font-style:italic;">暂无风险/建议</p>'
    if all(isinstance(it, str) for it in items):
        return (
            '<div class="risk-box">\n'
            + "\n".join(f"<p>• {escape(s)}</p>" for s in items)
            + "\n</div>"
        )
    out = []
    for item in items:
        risk = escape(item.get("risk", ""))
        suggestion = escape(item.get("suggestion", ""))
        out.append(
            f'<div class="risk-box">'
            f'<p><strong>⚠️ {risk}</strong></p>'
            f'<div class="suggestion-box">💡 <strong>建议:</strong> {suggestion}</div>'
            f'</div>'
        )
    return "\n".join(out)


def fill_template(template_html: str, data: dict) -> str:
    """Replace {{KEY}} placeholders. Image/video sections render above their slots."""
    url = data.get("url", "") or ""
    stats = data.get("_stats") or _build_stats(data)

    # Display URL: keep it readable (strip utm params if present)
    display_url = url
    if len(display_url) > 80 and "?" in display_url:
        display_url = display_url.split("?", 1)[0] + "..."

    include_images = bool(data.get("include_images", False))

    replacements = {
        "{{TITLE}}": escape(data.get("title", "Untitled")),
        "{{SUBTITLE}}": escape(data.get("subtitle", "")),
        "{{SOURCE}}": escape(data.get("source", "")),
        "{{INSIGHTS}}": render_insights(data.get("insights", [])),
        "{{TRENDS}}": render_trends(data.get("trends", [])),
        "{{DATA}}": render_data(data.get("data", [])),
        "{{PLAYERS}}": render_players(data.get("players", [])),
        "{{CASES}}": render_cases(data.get("cases", [])),
        "{{RISKS}}": render_risks(data.get("risks", [])),
        "{{IMAGES}}": render_images(data.get("images", []), include=include_images),
        "{{VIDEOS}}": render_videos(data.get("videos", [])),
        "{{SUMMARY}}": render_summary(data.get("summary", "")),
        "{{FOOTER_URL}}": escape(url),
        "{{FOOTER_URL_DISPLAY}}": escape(display_url),
        "{{FOOTER_STATS}}": escape(stats),
    }

    out = template_html
    for key, val in replacements.items():
        out = out.replace(key, val)

    return out


def _build_stats(data: dict) -> str:
    parts = ["8 fields"]
    parts.append(f"{len(data.get('insights', []))} insights")
    parts.append(f"{len(data.get('trends', []))} trends")
    parts.append(f"{len(data.get('data', []))} data")
    parts.append(f"{len(data.get('players', []))} players")
    if data.get("images"):
        parts.append(f"{len(data['images'])} images")
    if data.get("videos"):
        parts.append(f"{len(data['videos'])} videos")
    return "Stats: " + " | ".join(parts)


def generate(input_data: dict, output_path: Path, template_path: Path = None) -> Path:
    """Main entry: data → HTML file."""
    template_path = template_path or DEFAULT_TEMPLATE
    if not template_path.exists():
        raise FileNotFoundError(f"Template not found: {template_path}")

    template_html = template_path.read_text(encoding="utf-8")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    html_out = fill_template(template_html, input_data)
    output_path.write_text(html_out, encoding="utf-8")
    return output_path


def main():
    parser = argparse.ArgumentParser(
        description="Generate one-page HTML summary from article data"
    )
    parser.add_argument(
        "input",
        help="Input JSON file (from fetch_url.py OR pre-structured)",
    )
    parser.add_argument(
        "--output", "-o",
        help="Output HTML file path",
    )
    parser.add_argument(
        "--template", "-t",
        help=f"Custom template HTML (default: {DEFAULT_TEMPLATE})",
    )
    parser.add_argument(
        "--open",
        action="store_true",
        help="Open the generated HTML in default browser after creation",
    )
    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        print(f"❌ Input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Default output path
    if args.output:
        output_path = Path(args.output)
    else:
        DEFAULT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        slug = data.get("title", "summary").replace("/", "-")[:50].strip()
        if not slug:
            slug = "summary"
        output_path = DEFAULT_OUTPUT_DIR / f"{slug}.html"

    template_path = Path(args.template) if args.template else None
    out_path = generate(data, output_path, template_path)

    print(f"✅ Generated: {out_path}", file=sys.stderr)

    if args.open:
        import subprocess
        subprocess.run(["open", str(out_path)], check=False)


if __name__ == "__main__":
    main()