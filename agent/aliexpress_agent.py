#!/usr/bin/env python3
"""
AliExpress Product Agent
Builds aliexpress_products.json (active shop) and product_pool.json (daily rotation pool).

Usage:
  python aliexpress_agent.py             # Init shop + pool
  python aliexpress_agent.py --daily     # Add 2 new products from pool (run via cron)
  python aliexpress_agent.py --api-key K # Use AliExpress Affiliate API
"""

import json, sys, os, argparse, random
from datetime import datetime
from pathlib import Path

# ─── Full tech product pool (40 products) ───────────────────────────────────

ALL_PRODUCTS = [
    # ── אלקטרוניקה ──────────────────────────────────────────────────────────
    {"id":"ali_001","title":"אוזניות בלוטות׳ TWS עם ביטול רעשים","cat":"אלקטרוניקה",
     "desc":"אוזניות אלחוטיות עם ביטול רעשים אקטיבי, Bluetooth 5.3, עד 8 שעות שמע + 24 שעות בקייס.",
     "aliPrice":48,"img":"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=tws+earbuds+anc"},

    {"id":"ali_002","title":"שעון חכם עם מד לחץ דם","cat":"אלקטרוניקה",
     "desc":"סמארטווטש עם מעקב בריאות, ניטור שינה, עמיד למים IP67. תואם iOS ואנדרואיד.",
     "aliPrice":65,"img":"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=smart+watch+health"},

    {"id":"ali_004","title":"מטען אלחוטי מהיר 15W","cat":"אלקטרוניקה",
     "desc":"מטען Qi תואם לכל מכשיר, טעינה מהירה 15W, עיצוב שטוח ומינימליסטי.",
     "aliPrice":28,"img":"https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=wireless+charger+15w"},

    {"id":"ali_009","title":"רב-שקע חכם USB-C 65W","cat":"אלקטרוניקה",
     "desc":"3 שקעים + 4 יציאות USB כולל USB-C PD 65W לטעינה מהירה של לפטופ.",
     "aliPrice":42,"img":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=power+strip+usb-c+pd"},

    {"id":"ali_011","title":"משקפי מציאות מדומה VR","cat":"אלקטרוניקה",
     "desc":"משקפי VR לסמארטפון 4-7 אינץ׳, עדשות מתכווננות, כפתור סיבוב 360°.",
     "aliPrice":35,"img":"https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=vr+headset+smartphone"},

    {"id":"ali_013","title":"רמקול Bluetooth עמיד למים","cat":"אלקטרוניקה",
     "desc":"רמקול נייד IPX7, 360° סאונד, 24 שעות סוללה, מיקרופון מובנה.",
     "aliPrice":55,"img":"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=bluetooth+speaker+waterproof"},

    {"id":"ali_014","title":"מקלדת מכנית RGB אלחוטית","cat":"אלקטרוניקה",
     "desc":"מקלדת גיימינג 75% עם מתגים אדומים, תאורת RGB, חיבור Bluetooth + USB-C.",
     "aliPrice":72,"img":"https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=mechanical+keyboard+rgb+wireless"},

    {"id":"ali_015","title":"עכבר גיימינג אלחוטי 26000 DPI","cat":"אלקטרוניקה",
     "desc":"עכבר גיימינג עם חיישן אופטי 26000 DPI, 70 שעות סוללה, 8 כפתורים תכנותיים.",
     "aliPrice":45,"img":"https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=gaming+mouse+wireless+26000dpi"},

    {"id":"ali_016","title":"מסך נייד 15.6 אינץ׳ IPS","cat":"אלקטרוניקה",
     "desc":"מסך חיצוני 1080p IPS, USB-C/HDMI, דק ב-8mm, מושלם ללפטופ ולנינטנדו Switch.",
     "aliPrice":110,"img":"https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=portable+monitor+usb-c"},

    {"id":"ali_017","title":"מצלמת אקשן 4K 60fps","cat":"אלקטרוניקה",
     "desc":"מצלמת ספורט 4K עם ייצוב תמונה EIS, עמידה למים עד 40 מטר, WiFi, מסך מגע.",
     "aliPrice":68,"img":"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=action+camera+4k+60fps"},

    {"id":"ali_018","title":"מקרן מיני Bluetooth 1080p","cat":"אלקטרוניקה",
     "desc":"מקרן כיס עם רזולוציית 1080p, רמקול Bluetooth מובנה, HDMI+USB, 120 אינץ׳.",
     "aliPrice":88,"img":"https://images.unsplash.com/photo-1626379953822-baec19c3accd?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=mini+projector+1080p+bluetooth"},

    {"id":"ali_019","title":"סטנד לפטופ מתכוונן אלומיניום","cat":"אלקטרוניקה",
     "desc":"מעמד לפטופ מאלומיניום עם 6 גבהים, מתקפל לנסיעות, לפטופ עד 17 אינץ׳.",
     "aliPrice":22,"img":"https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=laptop+stand+aluminum+foldable"},

    {"id":"ali_020","title":"ענן אחסון NAS נייד 1TB","cat":"אלקטרוניקה",
     "desc":"כונן אחסון אישי נייד עם WiFi, אפליקציה, גיבוי אוטומטי לסמארטפון, 1TB.",
     "aliPrice":95,"img":"https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=portable+nas+wifi+1tb"},

    {"id":"ali_021","title":"נורת LED חכמה RGBW WiFi","cat":"אלקטרוניקה",
     "desc":"נורה חכמה 16M צבעים, שליטה קולית (Alexa/Google), תזמון, E27.",
     "aliPrice":18,"img":"https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=smart+bulb+rgbw+wifi+alexa"},

    {"id":"ali_022","title":"מנעול דלת חכם טביעת אצבע","cat":"אלקטרוניקה",
     "desc":"מנעול חכם עם קורא טביעות אצבע, קוד, כרטיס RFID ומפתח. Bluetooth + אפליקציה.",
     "aliPrice":75,"img":"https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=smart+lock+fingerprint+bluetooth"},

    {"id":"ali_023","title":"רובוט שואב אבק WiFi","cat":"אלקטרוניקה",
     "desc":"שואב רובוטי עם מיפוי LiDAR, שאיבה 2700Pa, מגב, שליטה מהאפליקציה.",
     "aliPrice":120,"img":"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=robot+vacuum+lidar+wifi"},

    {"id":"ali_024","title":"מכשיר בדיקת איכות אוויר CO2","cat":"אלקטרוניקה",
     "desc":"חיישן CO2, לחות, טמפרטורה ו-PM2.5. מסך OLED, התראות, ניתן לחיבור ל-Home Assistant.",
     "aliPrice":38,"img":"https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=co2+air+quality+monitor+home"},

    {"id":"ali_025","title":"משדר FM לרכב Bluetooth 5.0","cat":"אלקטרוניקה",
     "desc":"מתאם FM לרכב, Bluetooth 5.0, מטען כפול USB-A+C, ידיים חופשיות, EQ.",
     "aliPrice":16,"img":"https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=car+fm+transmitter+bluetooth+5"},

    {"id":"ali_026","title":"כבל USB-C ל-USB-C 240W 2m","cat":"אלקטרוניקה",
     "desc":"כבל USB-C 240W לטעינה מלפטופ לסמארטפון, 40Gbps, 8K@60Hz, ניילון קלוע.",
     "aliPrice":12,"img":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=usb-c+cable+240w+2m"},

    {"id":"ali_027","title":"אוזניות גיימינג עם מיקרופון רעשי","cat":"אלקטרוניקה",
     "desc":"אוזניות גיימינג 7.1 סראונד, מיקרופון עם ביטול רעש, LED RGB, חוטיות USB.",
     "aliPrice":32,"img":"https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=gaming+headset+71+surround+rgb"},

    {"id":"ali_028","title":"מדפסת מיני A4 Bluetooth","cat":"אלקטרוניקה",
     "desc":"מדפסת תרמית ניידת A4, Bluetooth + WiFi, ללא דיו, מהירות 80mm/s.",
     "aliPrice":62,"img":"https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=portable+printer+bluetooth+a4"},

    {"id":"ali_029","title":"מדחום אינפרא אדום לא-מגע","cat":"אלקטרוניקה",
     "desc":"מדחום מצח/אוזן ≤0.3°C דיוק, תוצאה ב-1 שניה, זיכרון 32 מדידות, LCD.",
     "aliPrice":20,"img":"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=infrared+thermometer+forehead"},

    {"id":"ali_030","title":"טאבלט ציור גרפי 10 אינץ׳","cat":"אלקטרוניקה",
     "desc":"לוח גרפי 10×6.25 אינץ׳ עם 8192 רמות לחץ, עט פסיבי, USB-C, תואם Windows/Mac.",
     "aliPrice":44,"img":"https://images.unsplash.com/photo-1540103711724-ebf833bde8d1?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=drawing+tablet+10+inch+8192"},

    {"id":"ali_031","title":"מחשב מיני Intel N100 16GB","cat":"אלקטרוניקה",
     "desc":"מיני-PC עם מעבד Intel N100, 16GB RAM, 512GB SSD, 4K Dual Display, WiFi 6.",
     "aliPrice":155,"img":"https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=mini+pc+n100+16gb+512ssd"},

    {"id":"ali_032","title":"מתאם Multiport USB-C 9-in-1","cat":"אלקטרוניקה",
     "desc":"Hub 9 ב-1: HDMI 4K, USB 3.0×3, SD/TF, LAN 1Gbps, USB-C PD 100W.",
     "aliPrice":28,"img":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=usb-c+hub+9in1+hdmi+4k"},

    {"id":"ali_033","title":"מסגרת תמונה דיגיטלית WiFi 10.1\"","cat":"אלקטרוניקה",
     "desc":"מסגרת חכמה IPS 10.1 אינץ׳ 1280×800, WiFi, אפליקציה, שיתוף ברשת.",
     "aliPrice":58,"img":"https://images.unsplash.com/photo-1551516595-a8c5a0df1e4a?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=digital+photo+frame+wifi+10inch"},

    {"id":"ali_034","title":"מאוורר שולחני USB ללא להבים","cat":"אלקטרוניקה",
     "desc":"מאוורר חשמלי ללא להבים, 12 מהירויות, שלט רחוק, שקט 25dB, USB-C.",
     "aliPrice":36,"img":"https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=bladeless+fan+usb+desk"},

    {"id":"ali_035","title":"מנקה אולטרסוני עבור משקפיים","cat":"אלקטרוניקה",
     "desc":"מכשיר ניקוי אולטרסוני 45kHz, 600ml, לתכשיטים / משקפיים / שעונים, USB-C.",
     "aliPrice":26,"img":"https://images.unsplash.com/photo-1559521783-1d1599583485?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=ultrasonic+cleaner+glasses+jewelry"},

    {"id":"ali_036","title":"מייבש כפות ידיים מהיר 1800W","cat":"אלקטרוניקה",
     "desc":"מייבש ידיים חשמלי 1800W, 10 שניות, שקט, ABS אנטי-בקטריאלי.",
     "aliPrice":40,"img":"https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=hand+dryer+1800w+fast"},

    {"id":"ali_037","title":"למפת UV לעקירת קרנית ג׳ל 48W","cat":"אלקטרוניקה",
     "desc":"מנורת UV/LED 48W לייבוש ציפורניים ג׳ל, תימר אוטומטי, LCD, עיצוב מקצועי.",
     "aliPrice":18,"img":"https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=uv+led+nail+lamp+48w"},

    {"id":"ali_038","title":"מד מרחק לייזר 60m Bluetooth","cat":"אלקטרוניקה",
     "desc":"מד מרחק לייזר דיגיטלי עד 60 מטר, ±2mm דיוק, Bluetooth לאפליקציה, IP54.",
     "aliPrice":30,"img":"https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=laser+distance+meter+60m+bluetooth"},

    {"id":"ali_039","title":"מחמם ספל USB שולחני","cat":"אלקטרוניקה",
     "desc":"מחמם ספל חשמלי לשולחן, 55°C, USB-C, מחוון LED, לקפה/תה/שוקו.",
     "aliPrice":14,"img":"https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=usb+mug+warmer+55c"},

    {"id":"ali_040","title":"משחזת סכינים חשמלית 3 שלבים","cat":"אלקטרוניקה",
     "desc":"משחזת חשמלית עם 3 שלבי שחיזה: גסה / דקה / פולישינג. USB-C, בטוחה לשימוש.",
     "aliPrice":24,"img":"https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=electric+knife+sharpener+3stage"},

    # ── אביזרים ──────────────────────────────────────────────────────────────
    {"id":"ali_005","title":"תרמיל גב עמיד למים 30L","cat":"אביזרים",
     "desc":"תרמיל יומיומי עמיד למים עם תא ייעודי ללפטופ 16 אינץ׳, יציאת USB, רצועות אורתופדיות.",
     "aliPrice":55,"img":"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=waterproof+backpack+usb"},

    # ── בית ──────────────────────────────────────────────────────────────────
    {"id":"ali_003","title":"מנורת LED שולחנית חכמה","cat":"בית",
     "desc":"מנורת לד עם בקרת בהירות וטמפרטורת צבע, שליטה מגע, מצב לילה, USB לטעינה.",
     "aliPrice":38,"img":"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=led+desk+lamp+touch"},

    {"id":"ali_007","title":"מצלמת אבטחה IP WiFi 4K","cat":"בית",
     "desc":"מצלמה חכמה 4K עם ראיית לילה, גילוי תנועה, שמע דו-כיווני, אחסון בענן או microSD.",
     "aliPrice":72,"img":"https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=ip+camera+4k+wifi"},

    {"id":"ali_010","title":"ארגונייר שולחן עץ במבוק","cat":"בית",
     "desc":"ארגונייר מבמבוק טבעי לשולחן עבודה — תא לעטים, מחברות, סמארטפון ועוד.",
     "aliPrice":30,"img":"https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=bamboo+desk+organizer"},

    # ── יומיום ────────────────────────────────────────────────────────────────
    {"id":"ali_006","title":"כוס תרמית נירוסטה 500ml","cat":"יומיום",
     "desc":"כוס וואקום כפולה שומרת חום 12 שעות וקור 24 שעות, מכסה הרמטי.",
     "aliPrice":22,"img":"https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=stainless+thermos+vacuum"},

    {"id":"ali_008","title":"עט חרט לייזר נטען","cat":"יומיום",
     "desc":"עט לייזר רב-שימושי: מצביע, חרט UV, פנס LED, USB-C. אידיאלי למשרד.",
     "aliPrice":18,"img":"https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=laser+pointer+uv+pen"},

    {"id":"ali_012","title":"מיני מאוורר נייד USB","cat":"יומיום",
     "desc":"מאוורר כיס נטען USB-C, 3 מהירויות, שקט במיוחד, 8 שעות סוללה.",
     "aliPrice":16,"img":"https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=mini+portable+fan+usb"},
]

# First 12 show up immediately; the rest go into the daily rotation pool
INITIAL_COUNT = 12
# Prefer tech products for daily rotation
POOL_IDS = [p["id"] for p in ALL_PRODUCTS if p["id"] not in
            [p["id"] for p in ALL_PRODUCTS[:INITIAL_COUNT]]]


def build_output(products):
    out = []
    for p in products:
        out.append({
            "id": p["id"], "title": p["title"], "cat": p["cat"],
            "desc": p["desc"], "price": f"₪{round(p['aliPrice'] * 2)}",
            "aliPrice": p["aliPrice"], "img": p["img"], "aliUrl": p["aliUrl"],
        })
    return out


def run_init(project_root):
    """First run — write active shop + full pool."""
    active = build_output(ALL_PRODUCTS[:INITIAL_COUNT])
    pool   = [p for p in ALL_PRODUCTS if p["id"] not in {x["id"] for x in ALL_PRODUCTS[:INITIAL_COUNT]}]

    (project_root / "aliexpress_products.json").write_text(
        json.dumps(active, ensure_ascii=False, indent=2), encoding="utf-8")

    pool_state = {"pool": [p["id"] for p in pool], "index": 0}
    (project_root / "product_pool_state.json").write_text(
        json.dumps(pool_state, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"✅ Shop: {len(active)} products | Pool: {len(pool)} products queued")


def run_daily(project_root, n=2):
    """Daily mode — add n new products from the pool to the active shop."""
    shop_path  = project_root / "aliexpress_products.json"
    state_path = project_root / "product_pool_state.json"

    if not shop_path.exists() or not state_path.exists():
        print("⚠️  Run without --daily first to initialise.")
        run_init(project_root)
        return

    active = json.loads(shop_path.read_text(encoding="utf-8"))
    state  = json.loads(state_path.read_text(encoding="utf-8"))

    pool_ids  = state["pool"]
    idx       = state["index"]
    added     = 0
    all_by_id = {p["id"]: p for p in ALL_PRODUCTS}

    for i in range(n):
        if idx >= len(pool_ids):
            print("🔄 Pool exhausted — reshuffling")
            random.shuffle(pool_ids)
            idx = 0
        pid = pool_ids[idx]; idx += 1
        if pid in all_by_id and not any(x["id"] == pid for x in active):
            active.append(build_output([all_by_id[pid]])[0])
            added += 1

    state["index"] = idx
    shop_path.write_text(json.dumps(active, ensure_ascii=False, indent=2), encoding="utf-8")
    state_path.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"✅ {datetime.now().strftime('%Y-%m-%d %H:%M')} — Added {added} new products. Total: {len(active)}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--daily", action="store_true", help="Add 2 new products from pool")
    parser.add_argument("--count", type=int, default=2, help="How many to add (used with --daily)")
    parser.add_argument("--api-key", help="AliExpress Affiliate API key (optional)")
    args = parser.parse_args()

    project_root = Path(__file__).parent.parent

    if args.daily:
        run_daily(project_root, args.count)
    else:
        run_init(project_root)
        print(f"   Pool state saved to product_pool_state.json")


if __name__ == "__main__":
    main()
