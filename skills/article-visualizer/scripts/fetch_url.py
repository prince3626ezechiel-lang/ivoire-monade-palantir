#!/usr/bin/env python3
"""
fetch_url.py — Public URL → JSON extractor for article-visualizer

Input:  URL (public web page)
Output: JSON {
  title: str,
  author: str | None,
  publish_date: str | None,
  content_text: str,
  content_html: str (main article body),
  images: [{url, alt, width?, height?}],
  videos: [{url, type: 'local' | 'bilibili', embed_id?}],
  source_url: str,
  fetched_at: ISO timestamp,
  method: 'requests' | 'playwright',
}

Public-only. No login. No anti-bot bypass.
For login-gated sites, see local-browser-automation skill.

Usage:
    python3 fetch_url.py "https://example.com/article" > article.json
    python3 fetch_url.py "https://example.com/article" --output article.json
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from typing import Optional
from urllib.parse import urlparse, urljoin

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Missing deps: pip install requests beautifulsoup4", file=sys.stderr)
    sys.exit(1)

# ---------- URL allowlist (best-effort) ----------
# Sites where requests + BeautifulSoup reliably extracts clean article content.
# Sites NOT here may need playwright or may not work at all.
SUPPORTED_SITES = {
    # News / blogs
    "36kr.com": "新闻/创投",
    "huxiu.com": "财经/科技",
    "jiqizhixin.com": "AI/科技",
    "sspai.com": "效率/工具",
    "zhuanlan.zhihu.com": "知乎专栏",
    # Long-form / tech
    "medium.com": "技术博客",
    "substack.com": "newsletter",
    "dev.to": "开发者社区",
    # Public docs / reports
    "arxiv.org": "学术论文",
    # B站 / Chinese platforms (public only)
    "bilibili.com": "B站",
    "www.bilibili.com": "B站",
    # Wechat (public articles via mp.weixin.qq.com)
    "mp.weixin.qq.com": "微信公众号",
    # Company blogs
    "openai.com": "OpenAI blog",
    "anthropic.com": "Anthropic blog",
    "deepmind.google": "DeepMind blog",
    "stratechery.com": "Stratechery",
    "nfx.com": "NFX (vc)",
}

# Sites that ARE NOT supported via requests (will try playwright fallback)
JS_HEAVY_SITES = {
    "x.com", "twitter.com",
    "xiaohongshu.com", "xhslink.com",
    "weibo.com",
    "douyin.com",
    "mp.douyin.com",
    "kuaishou.com",
}

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

TIMEOUT = 20  # seconds
MAX_TEXT_LENGTH = 50000  # chars; truncate very long articles
MAX_IMAGES = 20  # candidates returned for LLM to pick from


def is_supported(url: str) -> tuple[bool, str]:
    """Check if URL is in allowlist. Returns (supported, reason_if_not)."""
    host = urlparse(url).hostname or ""
    if host in JS_HEAVY_SITES:
        return False, f"{host} 是 JS 渲染站点，requests 拿不到正文"
    if host in SUPPORTED_SITES:
        return True, ""
    # Heuristic: allow generic domains but warn
    return True, f"⚠️ {host} 不在白名单中，可能拿不到正文"


def extract_title(soup: BeautifulSoup, url: str) -> str:
    """Best-effort title extraction."""
    # Priority: og:title > twitter:title > <h1> > <title>
    for selector, attr in [
        ('meta[property="og:title"]', "content"),
        ('meta[name="twitter:title"]', "content"),
        ("h1", None),
        ("title", None),
    ]:
        el = soup.select_one(selector)
        if el:
            text = el.get(attr) if attr else el.get_text()
            text = (text or "").strip()
            if text and len(text) < 200:
                return text
    return url


def extract_meta(soup: BeautifulSoup) -> dict:
    """Extract author + publish date from meta tags."""
    out = {"author": None, "publish_date": None}
    # Author
    for sel in ['meta[name="author"]', 'meta[property="article:author"]']:
        el = soup.select_one(sel)
        if el and el.get("content"):
            out["author"] = el["content"].strip()
            break
    # Date
    for sel in [
        'meta[property="article:published_time"]',
        'meta[name="pubdate"]',
        'meta[name="publishdate"]',
        'meta[property="og:article:published_time"]',
    ]:
        el = soup.select_one(sel)
        if el and el.get("content"):
            out["publish_date"] = el["content"].strip()
            break
    return out


def extract_main_content(soup: BeautifulSoup) -> tuple[str, str]:
    """
    Extract main article body. Returns (text, html).

    Heuristic: pick the densest <article> or main content area.
    Fallback: pick the <body>.
    """
    # Drop noise
    for tag in soup(["script", "style", "nav", "header", "footer", "aside",
                     "form", "iframe", "noscript"]):
        tag.decompose()

    # Try common article containers
    candidates = []
    for sel in ["article", "main", '[role="main"]', ".article-content",
                ".post-content", ".entry-content", ".content", "#content"]:
        el = soup.select_one(sel)
        if el:
            text = el.get_text(separator="\n", strip=True)
            candidates.append((len(text), el, text))

    if candidates:
        # Pick the longest one
        candidates.sort(key=lambda x: -x[0])
        _, el, text = candidates[0]
        html = "".join(str(c) for c in el.children if getattr(c, "name", None))
        return text[:MAX_TEXT_LENGTH], html

    # Fallback: whole body
    body = soup.body or soup
    text = body.get_text(separator="\n", strip=True)
    return text[:MAX_TEXT_LENGTH], ""


def extract_images(soup: BeautifulSoup, base_url: str) -> list[dict]:
    """Extract image URLs from <img> tags. Returns up to MAX_IMAGES candidates.

    Filters out:
      - Tiny tracking pixels / icons (< 100x100)
      - Author avatars / decorative small images (< 200x200) — those are usually
        meaningless in summaries.
    Caller can override filtering by passing include_all=True.
    """
    images = []
    seen = set()
    skipped_avatars = 0
    for img in soup.find_all("img"):
        src = (
            img.get("src")
            or img.get("data-src")
            or img.get("data-original")
            or img.get("data-lazy-src")
        )
        if not src or src.startswith("data:"):
            continue
        abs_url = urljoin(base_url, src)
        if abs_url in seen:
            continue
        seen.add(abs_url)

        w = img.get("width")
        h = img.get("height")
        try:
            w, h = int(w) if w else None, int(h) if h else None
        except (ValueError, TypeError):
            pass

        # Filter tiny tracking pixels / icons
        if w and h and (w < 100 or h < 100):
            continue

        # Filter author avatars / decorative images
        # Heuristics: small (< 200x200), or alt hints at "头像/作者/avatar"
        alt = (img.get("alt") or "").lower()
        is_avatar = (
            (w and h and (w < 200 or h < 200))
            or any(kw in alt for kw in ["avatar", "作者", "头像", "head", "logo"])
        )
        if is_avatar:
            skipped_avatars += 1
            continue

        images.append({
            "url": abs_url,
            "alt": (img.get("alt") or "").strip()[:200],
            "width": w,
            "height": h,
        })
        if len(images) >= MAX_IMAGES:
            break

    if skipped_avatars:
        print(f"  ℹ️  Skipped {skipped_avatars} avatar/decorative image(s)", file=sys.stderr)

    return images


def extract_videos(soup: BeautifulSoup, base_url: str) -> list[dict]:
    """
    Extract video embeds.

    Supported:
    - Local <video src="...">  → type='local'
    - B站 iframe (bilibili.com) → type='bilibili' with embed_id (BV/av)
    - YouTube iframe (youtube.com / youtu.be) → type='youtube' with video_id
    """
    videos = []

    # Local <video>
    for vid in soup.find_all("video"):
        src = vid.get("src")
        if not src:
            source = vid.find("source")
            if source:
                src = source.get("src")
        if src:
            videos.append({
                "url": urljoin(base_url, src),
                "type": "local",
                "embed_id": None,
            })

    # iframes (B站, YouTube)
    for iframe in soup.find_all("iframe"):
        src = iframe.get("src") or iframe.get("data-src") or ""
        if not src:
            continue
        abs_src = urljoin(base_url, src)

        # B站: player.bilibili.com/player.html?aid=XXX&bvid=YYY
        if "bilibili.com" in abs_src or "b23.tv" in abs_src:
            bvid_match = re.search(r"[Bb][Vv]([a-zA-Z0-9]+)", abs_src)
            aid_match = re.search(r"aid=(\d+)", abs_src)
            embed_id = (
                f"BV{bvid_match.group(1)}" if bvid_match
                else f"av{aid_match.group(1)}" if aid_match
                else None
            )
            videos.append({
                "url": abs_src,
                "type": "bilibili",
                "embed_id": embed_id,
            })

        # YouTube
        elif "youtube.com" in abs_src or "youtu.be" in abs_src:
            yt_match = re.search(r"(?:v=|/)([a-zA-Z0-9_-]{11})", abs_src)
            if yt_match:
                videos.append({
                    "url": abs_src,
                    "type": "youtube",
                    "embed_id": yt_match.group(1),
                })

    return videos


def fetch_with_requests(url: str) -> dict:
    """Fetch public URL with requests + BeautifulSoup."""
    supported, warn = is_supported(url)
    if not supported:
        return {"error": warn, "url": url}

    resp = requests.get(
        url,
        headers={"User-Agent": USER_AGENT},
        timeout=TIMEOUT,
        allow_redirects=True,
    )
    resp.raise_for_status()
    # Force UTF-8 if encoding is suspect
    if not resp.encoding or resp.encoding.lower() == "iso-8859-1":
        resp.encoding = resp.apparent_encoding or "utf-8"

    soup = BeautifulSoup(resp.text, "html.parser")

    title = extract_title(soup, url)
    meta = extract_meta(soup)
    content_text, content_html = extract_main_content(soup)
    images = extract_images(soup, url)
    videos = extract_videos(soup, url)

    return {
        "title": title,
        "author": meta["author"],
        "publish_date": meta["publish_date"],
        "content_text": content_text,
        "content_html": content_html,
        "images": images,
        "videos": videos,
        "source_url": url,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "method": "requests",
        "warning": warn if warn and not warn.startswith("⚠️") else None,
        "warning_note": warn if warn.startswith("⚠️") else None,
    }


def fetch_with_playwright(url: str) -> dict:
    """Fallback for JS-heavy sites. Uses headless Chromium."""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        return {
            "error": "playwright not installed. Run: pip install playwright && playwright install chromium",
            "url": url,
        }

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(user_agent=USER_AGENT)
        page = context.new_page()
        page.goto(url, wait_until="networkidle", timeout=TIMEOUT * 1000)

        # Wait for likely article content
        try:
            page.wait_for_selector("article, main, h1", timeout=5000)
        except Exception:
            pass

        html = page.content()
        browser.close()

    soup = BeautifulSoup(html, "html.parser")
    title = extract_title(soup, url)
    meta = extract_meta(soup)
    content_text, content_html = extract_main_content(soup)
    images = extract_images(soup, url)
    videos = extract_videos(soup, url)

    return {
        "title": title,
        "author": meta["author"],
        "publish_date": meta["publish_date"],
        "content_text": content_text,
        "content_html": content_html,
        "images": images,
        "videos": videos,
        "source_url": url,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "method": "playwright",
    }


def fetch_with_webbridge(url: str) -> dict:
    """
    Fetch via Kimi WebBridge daemon (local-browser-automation skill).

    Uses the user's actual Chrome browser with all cookies / login state.
    Works for:
      - Login-gated sites (微信公众号, 知乎登录内容)
      - JS-rendered sites (Twitter/X, 小红书)
      - Anti-bot sites (微博, 抖音) — uses real browser fingerprint

    Requires:
      - kimi-webbridge daemon running on localhost:10086
      - Chrome browser with WebBridge extension connected
      - local-browser-automation skill installed

    Returns dict with same schema as other fetch methods, plus:
      - method: "webbridge"
      - warning_note (if daemon unavailable)
    """
    WEBBRIDGE_DEFAULT_URL = "http://localhost:10086"
    daemon_url = os.environ.get("WEBBRIDGE_URL", WEBBRIDGE_DEFAULT_URL)

    def call_daemon(action: str, args: dict = None, timeout: int = 10) -> dict:
        """Send a single action to the daemon."""
        body = {"action": action}
        if args:
            body.update(args)
        try:
            r = requests.post(
                f"{daemon_url}/command",
                json=body,
                timeout=timeout,
            )
            return r.json()
        except Exception as e:
            return {"ok": False, "error": {"message": str(e)}}

    try:
        # Step 1: verify daemon + extension
        resp = call_daemon("list_tabs")
        if not resp.get("ok"):
            err = resp.get("error", {})
            err_msg = err.get("message", "unknown") if isinstance(err, dict) else str(err)
            return {
                "error": f"WebBridge daemon error: {err_msg}. Is kimi-webbridge running and Chrome extension connected?",
                "url": url,
                "method": "webbridge",
                "fallback_suggestion": "Start daemon: ~/.kimi-webbridge/bin/kimi-webbridge start. Or use --method requests / save page as PDF.",
            }

        tabs = resp.get("tabs", [])
        if not tabs:
            return {
                "error": "No Chrome tabs open. Open a tab first, then retry.",
                "url": url,
                "method": "webbridge",
            }

        # Step 2: navigate to URL in current tab (or first tab)
        # Use navigate without tabId → daemon picks active tab
        nav_resp = call_daemon("navigate", {"url": url}, timeout=TIMEOUT)
        if not nav_resp.get("ok"):
            return {
                "error": f"WebBridge navigate failed: {nav_resp.get('error', 'unknown')}",
                "url": url,
                "method": "webbridge",
            }

        # Step 3: snapshot the page (DOM snapshot after JS render)
        snap_resp = call_daemon("snapshot", {}, timeout=TIMEOUT)
        if not snap_resp.get("ok"):
            return {
                "error": f"WebBridge snapshot failed: {snap_resp.get('error', 'unknown')}",
                "url": url,
                "method": "webbridge",
            }

        snapshot_data = snap_resp.get("snapshot") or snap_resp.get("content") or snap_resp

        # Step 4: parse snapshot — shape depends on daemon version.
        # Best-effort: if it looks like HTML, parse with BS4. Otherwise extract text.
        if isinstance(snapshot_data, str):
            if "<" in snapshot_data and ">" in snapshot_data:
                soup = BeautifulSoup(snapshot_data, "html.parser")
                title = extract_title(soup, url)
                meta = extract_meta(soup)
                content_text, content_html = extract_main_content(soup)
                images = extract_images(soup, url)
                videos = extract_videos(soup, url)
            else:
                # Plain text snapshot (e.g., accessibility tree dump)
                title = url
                content_text = snapshot_data
                content_html = ""
                images = []
                videos = []
                meta = {}
        else:
            # Dict snapshot — best-effort field mapping
            title = snapshot_data.get("title", url)
            content_text = snapshot_data.get("text", snapshot_data.get("content", ""))
            content_html = snapshot_data.get("html", "")
            images = snapshot_data.get("images", [])
            videos = snapshot_data.get("videos", [])
            meta = {
                "author": snapshot_data.get("author"),
                "publish_date": snapshot_data.get("publish_date"),
            }

        return {
            "title": title,
            "author": meta.get("author"),
            "publish_date": meta.get("publish_date"),
            "content_text": content_text,
            "content_html": content_html,
            "images": images,
            "videos": videos,
            "source_url": url,
            "fetched_at": datetime.now(timezone.utc).isoformat(),
            "method": "webbridge",
            "warning_note": f"Fetched via WebBridge (Chrome login state used). Daemon: {daemon_url}",
        }

    except Exception as e:
        return {
            "error": f"WebBridge unexpected error: {e}",
            "url": url,
            "method": "webbridge",
        }


def should_try_webbridge(url: str, requests_result: dict) -> bool:
    """
    Heuristic: should we try webbridge after requests failed?

    Returns True if:
      - URL is in the "JS-heavy / login-gated" allowlist
      - OR requests returned empty content (< 100 chars)
    """
    url_lower = url.lower()

    # Known JS-heavy / login-gated domains
    js_heavy_domains = [
        "mp.weixin.qq.com",       # 微信公众号 (H5 SPA)
        "weibo.com",              # 微博 (login + JS)
        "weibo.cn",
        "xiaohongshu.com",        # 小红书 (anti-bot)
        "douyin.com",             # 抖音 (login + captcha)
        "kuaishou.com",           # 快手 (anti-bot)
        "twitter.com",            # X / Twitter (JS-rendered)
        "x.com",
        "mp.douyin.com",
        "weishi.qq.com",          # 微视
        "baijiahao.baidu.com",    # 百度百家号 (anti-bot)
    ]

    for domain in js_heavy_domains:
        if domain in url_lower:
            return True

    # OR: requests returned suspiciously little content
    content = requests_result.get("content_text", "")
    if len(content) < 100:
        return True

    return False


def main():
    parser = argparse.ArgumentParser(
        description="Fetch public URL → JSON for article-visualizer"
    )
    parser.add_argument("url", help="Public URL to fetch")
    parser.add_argument("--output", "-o", help="Output file (default: stdout)")
    parser.add_argument(
        "--method",
        choices=["auto", "requests", "playwright", "webbridge"],
        default="auto",
        help=(
            "Fetch method. "
            "auto (default): requests → webbridge (if JS-heavy) → playwright. "
            "requests: public URLs only. "
            "playwright: headless browser fallback. "
            "webbridge: use Kimi WebBridge daemon (Chrome login state)."
        ),
    )
    parser.add_argument(
        "--no-webbridge",
        action="store_true",
        help="Disable webbridge fallback even in auto mode",
    )
    args = parser.parse_args()

    result = None
    log = lambda msg: print(msg, file=sys.stderr)

    if args.method == "auto":
        # 4-layer fallback: requests → webbridge → playwright → error
        # Step 1: requests (fast, works for public sites)
        log("→ Trying requests (1-2s)...")
        try:
            result = fetch_with_requests(args.url)
            if not result.get("error") and len(result.get("content_text", "")) >= 100:
                log("✅ Got content via requests")
            else:
                log(f"⚠️ requests returned {len(result.get('content_text', ''))} chars")
                result = None
        except Exception as e:
            log(f"⚠️ requests exception: {e}")
            result = None

        # Step 2: webbridge (if not disabled AND looks like JS-heavy site)
        if result is None and not args.no_webbridge:
            log("→ Trying webbridge (Chrome login state)...")
            try:
                wb_result = fetch_with_webbridge(args.url)
                if not wb_result.get("error"):
                    result = wb_result
                    log("✅ Got content via webbridge")
                else:
                    log(f"⚠️ webbridge: {wb_result.get('error')[:100]}")
            except Exception as e:
                log(f"⚠️ webbridge exception: {e}")

        # Step 3: playwright (headless browser, JS-rendered but no login)
        if result is None:
            log("→ Trying playwright (headless)...")
            try:
                result = fetch_with_playwright(args.url)
                if not result.get("error"):
                    log("✅ Got content via playwright")
                else:
                    log(f"⚠️ playwright: {result.get('error')[:100]}")
            except Exception as e:
                log(f"⚠️ playwright exception: {e}")

        # Step 4: error with suggestions
        if result is None or result.get("error"):
            log("")
            log("❌ All fetch methods failed.")
            log("   Suggestions:")
            log("   1. Save the page as PDF locally, use PDF input")
            log("   2. Copy-paste the article text into chat")
            log("   3. Try a different public URL")
            result = result or {
                "error": "All fetch methods failed",
                "url": args.url,
                "method": "none",
            }

    elif args.method == "requests":
        result = fetch_with_requests(args.url)
    elif args.method == "playwright":
        result = fetch_with_playwright(args.url)
    else:  # webbridge
        result = fetch_with_webbridge(args.url)

    output = json.dumps(result, ensure_ascii=False, indent=2)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output)
        print(f"✅ Saved to {args.output}", file=sys.stderr)
    else:
        print(output)


if __name__ == "__main__":
    main()