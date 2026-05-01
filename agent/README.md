# 🤖 אג'נט שאיבת כתבות

אג'נט אוטומטי ששואב כתבות מ-TechCrunch (ואתרים נוספים שתוסיף) ומציג אותן בדף הבית שלך.

---

## 💰 עלות: **חינם לגמרי**

- GitHub Actions: חינם
- Vercel: חינם (כבר משתמש)
- אין שימוש ב-API בתשלום

---

## 🚀 איך להפעיל (3 דקות)

### 1. דחוף את השינויים לגיטהאב

הקבצים החדשים שנוספו:
```
agent/
  ├── scrape_articles.py
  ├── requirements.txt
  └── README.md
.github/workflows/fetch-articles.yml
app.js  (שינוי קטן - תמיכה בטעינת articles.json)
```

בטרמינל מתוך תיקיית הפרויקט:
```bash
git add agent .github/workflows app.js
git commit -m "add article scraper agent"
git push
```

### 2. תן ל-GitHub Actions הרשאה לדחוף

1. פתח את הריפו ב-GitHub
2. **Settings** → **Actions** → **General**
3. גלול למטה ל-**Workflow permissions**
4. בחר **"Read and write permissions"** → **Save**

### 3. הרץ פעם אחת באופן ידני

1. ב-GitHub → טאב **Actions**
2. לחץ **"Fetch Articles Daily"** בצד שמאל
3. לחץ **Run workflow** → **Run workflow**
4. חכה ~1-2 דקות ותראה ריצה ירוקה ✅

אם הצליח → ייווצר commit חדש בריפו עם `articles.json`, Vercel יעלה את השינויים, וכשתרענן את האתר שלך תראה את הכתבות החדשות בדף הבית! 🎉

---

## 🧪 בדיקה מקומית (אופציונלי)

לפני שדוחפים לגיטהאב, אפשר לבדוק מקומית:

```bash
pip install -r agent/requirements.txt
python agent/scrape_articles.py
```

אם הצליח - תראה קובץ `articles.json` חדש בתיקייה הראשית.

פתח את `index.html` בדפדפן → דף הבית יציג את הכתבות החדשות.

---

## ➕ להוסיף אתרי מקור נוספים

פתח את `agent/scrape_articles.py` ומצא את מערך `SOURCES` בראש הקובץ. הוסף בלוק חדש:

```python
{
    "name": "שם האתר",
    "url": "https://example.com/category/tech/",
    "list_selectors": ["a.article-link"],
    "title_selectors": ["h1"],
    "body_selectors": ["article", "div.content"],
    "category_he": "טכנולוגיה",
    "max_per_run": 3,
    "url_must_include": "/20",
},
```

---

## ⏰ שינוי זמן ההרצה

ערוך את `.github/workflows/fetch-articles.yml`:
```yaml
cron: "0 6 * * *"   # כל יום ב-06:00 UTC (09:00 שעון ישראל)
```

עזרה: https://crontab.guru/

---

## 🛠️ פתרון בעיות

| בעיה | פתרון |
|------|-------|
| "Could not extract title/body" | ה-CSS selectors של האתר השתנו - תעדכן ב-scrape_articles.py |
| Action נכשל "permission denied" | Settings → Actions → General → "Read and write permissions" |
| Vercel לא מעדכן | בדוק ש-Vercel מחובר ל-branch הנכון (בד"כ `main`) |
| לא רואה כתבות באתר | פתח DevTools (F12) → Console - תראה הודעות טעינה |

---

## ⚖️ זכויות יוצרים

העתקה של כתבות מאתרים אחרים עלולה להפר זכויות יוצרים. האג'נט מוסיף אוטומטית קישור למקור, אבל מומלץ:
- לבדוק תנאי שימוש של אתר המקור
- להעדיף RSS feeds או אתרים עם רישיון פתוח
- להוסיף ערך משלך (סיכום, תגובה)
