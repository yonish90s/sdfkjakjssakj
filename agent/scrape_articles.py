#!/usr/bin/env python3
"""
Article Scraper Agent - מותאם לאתר שלך
=========================================
שואב כתבות מאתרי מקור (TechCrunch וכו') וכותב articles.json
בפורמט שה-app.js שלך מצפה לו.

שימוש:
    python agent/scrape_articles.py

מריץ מהתיקייה הראשית של האתר:
    cd /path/to/your-site
    python agent/scrape_articles.py
"""

import json
import hashlib
import logging
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse
from typing import Optional, Union, List, Dict, Set

import requests
from bs4 import BeautifulSoup
from deep_translator import GoogleTranslator


# =============================================================================
# Configuration
# =============================================================================

# אתרי מקור - תוסיף/תערוך לפי הצורך
SOURCES = [
    {
        "name": "TechCrunch AI",
        "url": "https://techcrunch.com/category/artificial-intelligence/",
        "list_selectors": [
            "a.loop-card__title-link",
            "h3.loop-card__title a",
            "h2.post-block__title a",
            "a.post-block__title__link",
        ],
        "title_selectors": ["h1.article-hero__title", "h1.wp-block-post-title", "h1"],
        "body_selectors": [
            "div.article-content",
            "div.wp-block-post-content",
            "div.entry-content",
            "article",
        ],
        "image_meta": "og:image",
        "author_selectors": ["a.wp-block-tc23-author-card-name__link", "span.wp-block-tc23-author-card-name", "a[rel='author']"],
        "date_selectors": ["time", "div.wp-block-post-date time"],
        "category": "AI",
        "category_he": "בינה מלאכותית",
        "max_per_run": 3,
        "url_must_include": "/20",  # ensures we get article URLs (with year in them)
    },
]

# פרטי Output
ROOT = Path(__file__).resolve().parent.parent
ARTICLES_JSON = ROOT / "articles.json"
STATE_PATH = ROOT / "agent" / ".seen.json"
MAX_TOTAL_ARTICLES = 50  # נשמור עד X כתבות, הישנות ביותר נמחקות

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}


# =============================================================================
# Setup
# =============================================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("article-agent")


def try_selectors(soup, selectors: list, attr: Optional[str] = None):
    """Try each selector in order, return first match."""
    for sel in selectors:
        el = soup.select_one(sel)
        if el:
            return el.get(attr) if attr else el
    return None


# =============================================================================
# State
# =============================================================================

def load_seen() -> set:
    if STATE_PATH.exists():
        try:
            return set(json.loads(STATE_PATH.read_text(encoding="utf-8")))
        except Exception:
            pass
    return set()


def save_seen(seen: set) -> None:
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(
        json.dumps(sorted(seen), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def load_existing_articles() -> list:
    if ARTICLES_JSON.exists():
        try:
            data = json.loads(ARTICLES_JSON.read_text(encoding="utf-8"))
            return data if isinstance(data, list) else data.get("articles", [])
        except Exception:
            pass
    return []


# =============================================================================
# HTTP
# =============================================================================

def fetch(url: str, timeout: int = 20) -> str:
    log.info(f"Fetching: {url}")
    resp = requests.get(url, headers=HEADERS, timeout=timeout)
    resp.raise_for_status()
    if not resp.encoding or resp.encoding.lower() == "iso-8859-1":
        resp.encoding = resp.apparent_encoding or "utf-8"
    return resp.text


def translate_text(text: str, target: str = "iw") -> str:
    """Translate text to Hebrew using Google Translator."""
    if not text or not text.strip():
        return text
    try:
        translated = GoogleTranslator(source="auto", target=target).translate(text)
        return translated if translated else text
    except Exception as e:
        log.error(f"  Translation failed: {e}")
        return text


# =============================================================================
# Discovery
# =============================================================================

def discover_links(source: dict) -> list:
    html = fetch(source["url"])
    soup = BeautifulSoup(html, "html.parser")
    base = source["url"]

    links = []
    for sel in source["list_selectors"]:
        for a in soup.select(sel):
            href = a.get("href")
            if not href:
                continue
            absolute = urljoin(base, href)
            if urlparse(absolute).netloc and urlparse(absolute).netloc != urlparse(base).netloc:
                continue
            if absolute in links:
                continue
            links.append(absolute)
        if links:
            log.info(f"  Found {len(links)} links using selector: {sel}")
            break

    # Filter to article URLs only
    must_include = source.get("url_must_include")
    if must_include:
        links = [u for u in links if must_include in u]

    limit = source.get("max_per_run", 5)
    return links[:limit]


# =============================================================================
# Extract
# =============================================================================

def clean_html_for_display(soup_el) -> str:
    """Remove junk elements and return cleaned HTML string."""
    for junk in soup_el.select(
        "script, style, iframe, form, nav, aside, "
        ".ad, .ads, .advertisement, .related, .newsletter, "
        "[class*='newsletter'], [class*='advertisement'], "
        "figure.wp-block-pullquote, .wp-block-embed"
    ):
        junk.decompose()
    return str(soup_el)


def extract_image(soup, source: dict) -> str:
    """Try og:image meta first, then any image in article body."""
    og = soup.select_one(f"meta[property='{source.get('image_meta', 'og:image')}']")
    if og and og.get("content"):
        return og["content"]
    # Fallback - first image in body
    img = soup.select_one("article img, div.article-content img")
    if img and img.get("src"):
        return img["src"]
    # Default placeholder
    return "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"


def extract_date(soup, source: dict) -> str:
    for sel in source.get("date_selectors", []):
        el = soup.select_one(sel)
        if el:
            dt = el.get("datetime")
            if dt:
                try:
                    parsed = datetime.fromisoformat(dt.replace("Z", "+00:00"))
                    return parsed.strftime("%Y-%m-%d %H:%M")
                except Exception:
                    return dt
            return el.get_text(strip=True)
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")


def extract_article(url: str, source: dict) -> Optional[dict]:
    html = fetch(url)
    soup = BeautifulSoup(html, "html.parser")

    title_el = try_selectors(soup, source["title_selectors"])
    body_el = try_selectors(soup, source["body_selectors"])

    if not title_el or not body_el:
        log.warning(f"  Skipped (no title/body): {url}")
        return None

    title = title_el.get_text(strip=True)
    image = extract_image(soup, source)
    date_str = extract_date(soup, source)

    author_el = try_selectors(soup, source.get("author_selectors", []))
    author = author_el.get_text(strip=True) if author_el else source["name"]

    # Clean + extract snippet (first paragraph)
    first_p = body_el.select_one("p")
    snippet = ""
    if first_p:
        snippet = first_p.get_text(strip=True)[:250]
        if len(snippet) == 250:
            snippet = snippet.rsplit(" ", 1)[0] + "..."

    # Full content as HTML
    content_html = clean_html_for_display(body_el)

    return {
        "title": title,
        "image": image,
        "category": source.get("category_he", source.get("category", "חדשות")),
        "author": author,
        "time": date_str,
        "snippet": snippet,
        "content": content_html,
        "source_name": source["name"],
        "source_url": url,
    }


# =============================================================================
# Build articles.json
# =============================================================================

def to_site_format(article: dict, article_id: int) -> dict:
    """Convert to the exact format app.js expects."""
    # Add source attribution to the content
    attribution = (
        f'<p style="padding:12px;background:#f3f4f6;border-radius:8px;'
        f'font-size:0.9em;color:#6b7280;margin-bottom:16px;">'
        f'📰 Source: <a href="{article["source_url"]}" target="_blank" '
        f'rel="noopener">{article["source_name"]}</a></p>\n'
    )
    # Translate title and snippet to Hebrew
    translated_title = translate_text(article["title"])
    translated_snippet = translate_text(article["snippet"])

    return {
        "id": article_id,
        "title": translated_title,
        "image": article["image"],
        "category": article["category"],
        "author": article["author"],
        "time": article["time"],
        "snippet": translated_snippet,
        "content": attribution + article["content"],
    }


def next_available_id(articles: list) -> int:
    if not articles:
        return 1000  # Start high so user-added articles don't clash
    max_id = max(a.get("id", 0) for a in articles)
    return max(max_id + 1, 1000)


# =============================================================================
# Main
# =============================================================================

def run() -> int:
    seen = load_seen()
    existing = load_existing_articles()
    existing_urls = {a.get("source_url") for a in existing if a.get("source_url")}

    new_articles = []
    next_id = next_available_id(existing)

    for source in SOURCES:
        name = source["name"]
        log.info(f"=== Source: {name} ===")
        try:
            urls = discover_links(source)
        except Exception as e:
            log.error(f"  Discovery failed: {e}")
            continue

        for url in urls:
            if url in seen or url in existing_urls:
                log.info(f"  Skip (already processed): {url}")
                continue
            try:
                article = extract_article(url, source)
            except Exception as e:
                log.error(f"  Extract failed {url}: {e}")
                continue
            if article is None:
                continue
            formatted = to_site_format(article, next_id)
            new_articles.append(formatted)
            seen.add(url)
            next_id += 1
            log.info(f"  Added: {article['title'][:60]}")

    # Combine: new articles on top, keep existing, cap at MAX_TOTAL_ARTICLES
    combined = new_articles + existing
    combined = combined[:MAX_TOTAL_ARTICLES]

    # Write
    ARTICLES_JSON.write_text(
        json.dumps(combined, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    save_seen(seen)

    log.info(f"Done. New articles added: {len(new_articles)}")
    log.info(f"Total in articles.json: {len(combined)}")
    return 0


if __name__ == "__main__":
    sys.exit(run())
