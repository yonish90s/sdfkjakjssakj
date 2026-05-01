#!/bin/bash
# לחיצה כפולה על הקובץ הזה דוחפת את העדכונים ל-GitHub
# (הקרדנצ'לז של Git כבר שמורים במק שלך מהדחיפה הקודמת)

cd "$(dirname "$0")" || exit 1

echo ""
echo "=========================================="
echo "   דוחף עדכונים ל-GitHub..."
echo "=========================================="
echo ""

git status
echo ""
git add .
git commit -m "Fix modal nesting and welcome deal content"
git push origin main

STATUS=$?
echo ""
if [ $STATUS -eq 0 ]; then
  echo "=========================================="
  echo "   ✅ הצלחה! הקבצים עלו לגיטהאב."
  echo "   Vercel יפרסם אותם תוך ~30 שניות."
  echo "   פתח את https://project98321.online/"
  echo "   ורענן עם Cmd+Shift+R"
  echo "=========================================="
else
  echo "=========================================="
  echo "   ❌ משהו נכשל. שלח לקלוד את ההודעה למעלה."
  echo "=========================================="
fi

echo ""
echo "סגור את החלון הזה כשסיימת."
