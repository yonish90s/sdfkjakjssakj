# 🤖 Article Scraper Agent

An automated agent that scrapes articles from TechCrunch (and other sites you add) and displays them on your home page.

---

## 💰 Cost: **Completely Free**

- GitHub Actions: Free
- Vercel: Free (already in use)
- No paid APIs used

---

## 🚀 How to Run (3 minutes)

### 1. Push changes to GitHub

New files added:
```
agent/
  ├── scrape_articles.py
  ├── requirements.txt
  └── README.md
.github/workflows/fetch-articles.yml
app.js  (small change - support for loading articles.json)
```

In your terminal from the project folder:
```bash
git add agent .github/workflows app.js
git commit -m "add article scraper agent"
git push
```

### 2. Grant GitHub Actions push permission

1. Open the repo in GitHub
2. **Settings** → **Actions** → **General**
3. Scroll down to **Workflow permissions**
4. Select **"Read and write permissions"** → **Save**

### 3. Run once manually

1. In GitHub → **Actions** tab
2. Click **"Fetch Articles Daily"** on the left
3. Click **Run workflow** → **Run workflow**
4. Wait ~1-2 minutes until you see a green checkmark ✅

If successful → a new commit will be created in the repo with `articles.json`, Vercel will deploy the changes, and when you refresh your site, you will see the new articles on the home page! 🎉

---

## 🧪 Local Testing (Optional)

Before pushing to GitHub, you can test locally:

```bash
pip install -r agent/requirements.txt
python agent/scrape_articles.py
```

If successful - you will see a new `articles.json` file in the root directory.

Open `index.html` in your browser → the home page will display the new articles.

---

## ➕ Add More Source Sites

Open `agent/scrape_articles.py` and find the `SOURCES` array at the top of the file. Add a new block:

```python
{
    "name": "Site Name",
    "url": "https://example.com/category/tech/",
    "list_selectors": ["a.article-link"],
    "title_selectors": ["h1"],
    "body_selectors": ["article", "div.content"],
    "category": "Technology",
    "max_per_run": 3,
    "url_must_include": "/20",
},
```

---

## ⏰ Change Execution Time

Edit `.github/workflows/fetch-articles.yml`:
```yaml
cron: "0 6 * * *"   # Every day at 06:00 UTC
```

Help: https://crontab.guru/

---

## 🛠️ Troubleshooting

| Issue | Solution |
|------|-------|
| "Could not extract title/body" | The site's CSS selectors changed - update in scrape_articles.py |
| Action failed "permission denied" | Settings → Actions → General → "Read and write permissions" |
| Vercel not updating | Check that Vercel is connected to the correct branch (usually `main`) |
| No articles visible on site | Open DevTools (F12) → Console - check loading messages |

---

## ⚖️ Copyright

Copying articles from other sites may violate copyright. The agent automatically adds a link to the source, but it is recommended to:
- Check the source site's terms of use
- Prefer RSS feeds or sites with open licenses
- Add your own value (summary, commentary)
