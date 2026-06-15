'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ARTICLES_DIR = path.join(__dirname, '..', 'articles');
const SEEN_FILE = path.join(__dirname, '.seen_hebrew.json');
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80';

const RSS_FEEDS = [
  // allFinancial:true  → accept all articles from this feed (dedicated finance source)
  // allFinancial:false → filter by STOCK_KEYWORDS only
  { url: 'https://www.ynet.co.il/Integration/StoryRss6.xml',   source: 'ynet כלכלה',   allFinancial: true  },
  { url: 'https://www.ice.co.il/rss',                          source: 'ice.co.il',    allFinancial: false },
];

// Filter keywords for non-dedicated-financial feeds
const STOCK_KEYWORDS = [
  'בורסה', 'מניה', 'מניות', 'שוק ההון', 'מדד', 'ת"א', 'ני"ע', 'נייר ערך',
  'השקעה', 'השקעות', 'מסחר', 'תיק', 'קרן', 'אגח', 'אג"ח', 'ריבית',
  'הנפקה', 'דיבידנד', 'IPO', 'רווח', 'הפסד', 'מימון', 'פיננסי',
];

// ─── HTTP ──────────────────────────────────────────────────────────────────

function fetchUrl(url, redirectsLeft = 4) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HebrewStockBot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Accept-Charset': 'utf-8',
      },
    }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location && redirectsLeft > 0) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        return fetchUrl(next, redirectsLeft - 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.on('error', reject);
  });
}

// ─── State ─────────────────────────────────────────────────────────────────

function loadSeen() {
  try {
    if (fs.existsSync(SEEN_FILE)) return new Set(JSON.parse(fs.readFileSync(SEEN_FILE, 'utf8')));
  } catch {}
  return new Set();
}

function saveSeen(seen) {
  const arr = [...seen];
  fs.writeFileSync(SEEN_FILE, JSON.stringify(arr.slice(-600), null, 2), 'utf8');
}

// ─── RSS Parse ─────────────────────────────────────────────────────────────

function parseRSSItems(xml, sourceName) {
  try {
    // Inject all common RSS namespaces so JSDOM won't reject undeclared prefixes
    const NS = [
      'xmlns:atom="http://www.w3.org/2005/Atom"',
      'xmlns:media="http://search.yahoo.com/mrss/"',
      'xmlns:dc="http://purl.org/dc/elements/1.1/"',
      'xmlns:content="http://purl.org/rss/1.0/modules/content/"',
    ];
    const cleaned = xml.replace(/<rss\b/, `<rss ${NS.join(' ')}`);
    const dom = new JSDOM(cleaned, { contentType: 'text/xml' });
    const doc = dom.window.document;

    return Array.from(doc.querySelectorAll('item')).map(item => {
      const getText = tag => item.querySelector(tag)?.textContent?.trim() || '';
      const rawDesc = getText('description');
      const description = rawDesc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

      // <link> in RSS is a text node sibling of the tag — querySelector may not work
      let link = '';
      const linkEl = item.querySelector('link');
      if (linkEl) link = linkEl.textContent?.trim() || linkEl.getAttribute('href') || '';

      // Image: try enclosure → media:thumbnail → media:content → og in desc
      let image = '';
      const enc = item.querySelector('enclosure[url]');
      if (enc && enc.getAttribute('type')?.startsWith('image')) image = enc.getAttribute('url');
      if (!image) {
        const ns = ['media:thumbnail', 'media:content'];
        for (const n of ns) {
          const el = item.getElementsByTagName(n)[0];
          if (el) { image = el.getAttribute('url') || ''; break; }
        }
      }
      if (!image) {
        const m = rawDesc.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (m) image = m[1];
      }

      const pubDate = getText('pubDate') || getText('dc:date') || '';

      return {
        title: getText('title'),
        link,
        description: description.substring(0, 300),
        pubDate,
        image,
        source: sourceName,
      };
    }).filter(a => a.title && a.link);
  } catch (err) {
    console.error(`    Parse error: ${err.message}`);
    return [];
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function isStockRelated(article) {
  const text = `${article.title} ${article.description}`.toLowerCase();
  return STOCK_KEYWORDS.some(kw => text.includes(kw.toLowerCase()));
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) throw new Error();
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  } catch {
    const n = new Date();
    const p = x => String(x).padStart(2, '0');
    return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())} 05:00`;
  }
}

function saveArticle(article) {
  if (!fs.existsSync(ARTICLES_DIR)) fs.mkdirSync(ARTICLES_DIR, { recursive: true });

  const id = Date.now() + Math.floor(Math.random() * 999);
  const data = {
    id,
    title: article.title,
    image: article.image || DEFAULT_IMAGE,
    category: 'שוק ההון',
    lang: 'he',
    author: article.source,
    time: formatDate(article.pubDate),
    snippet: article.description || article.title,
    sourceUrl: article.link,
    content: [
      `<p style="padding:12px;background:#f3f4f6;border-radius:8px;font-size:0.9em;color:#6b7280;margin-bottom:16px;">`,
      `📰 מקור: <a href="${article.link}" target="_blank" rel="noopener">${article.source}</a>`,
      `</p>`,
      `<p>${article.description || ''}</p>`
    ].join(''),
  };

  fs.writeFileSync(path.join(ARTICLES_DIR, `${id}.json`), JSON.stringify(data, null, 2), 'utf8');
  return data;
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function collectStockNews() {
  const stamp = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });
  console.log(`\n[${stamp}] מתחיל לאסוף כתבות שוק ההון...`);

  const seen = loadSeen();
  let savedCount = 0;

  for (const feed of RSS_FEEDS) {
    process.stdout.write(`  📡 ${feed.source}... `);
    try {
      const xml = await fetchUrl(feed.url);
      const all = parseRSSItems(xml, feed.source);

      const relevant = feed.allFinancial ? all : all.filter(isStockRelated);
      let added = 0;

      for (const article of relevant.slice(0, 8)) {
        if (!seen.has(article.link)) {
          saveArticle(article);
          seen.add(article.link);
          savedCount++;
          added++;
        }
      }
      console.log(`${all.length} כתבות נמצאו, ${added} חדשות נשמרו`);
    } catch (err) {
      console.log(`שגיאה: ${err.message}`);
    }
  }

  saveSeen(seen);
  console.log(`✅ סה"כ ${savedCount} כתבות חדשות נוספו לאתר\n`);
  return savedCount;
}

module.exports = { collectStockNews };

if (require.main === module) {
  collectStockNews().catch(err => { console.error('Fatal:', err); process.exit(1); });
}
