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
    # ── Electronics ──────────────────────────────────────────────────────────
    {"id":"ali_001","title":"TWS Bluetooth ANC Earbuds","cat":"Electronics",
     "desc":"Wireless earbuds with active noise cancellation, Bluetooth 5.3, up to 8h playtime + 24h in case.",
     "aliPrice":48,"img":"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=tws+earbuds+anc"},

    {"id":"ali_002","title":"Smart Watch with Blood Pressure Monitor","cat":"Electronics",
     "desc":"Smartwatch with health tracking, sleep monitoring, IP67 waterproof. iOS/Android compatible.",
     "aliPrice":65,"img":"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=smart+watch+health"},

    {"id":"ali_004","title":"15W Fast Wireless Charger","cat":"Electronics",
     "desc":"Qi charger compatible with all devices, 15W fast charging, slim minimalist design.",
     "aliPrice":28,"img":"https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=wireless+charger+15w"},

    {"id":"ali_009","title":"65W Smart USB-C Power Strip","cat":"Electronics",
     "desc":"3 sockets + 4 USB ports including 65W USB-C PD for fast laptop charging.",
     "aliPrice":42,"img":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=power+strip+usb-c+pd"},

    {"id":"ali_011","title":"VR Headset for Smartphone","cat":"Electronics",
     "desc":"VR headset for 4-7 inch smartphones, adjustable lenses, 360° view button.",
     "aliPrice":35,"img":"https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=vr+headset+smartphone"},

    {"id":"ali_013","title":"Waterproof Bluetooth Speaker","cat":"Electronics",
     "desc":"Portable IPX7 speaker, 360° sound, 24h battery life, built-in mic.",
     "aliPrice":55,"img":"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=bluetooth+speaker+waterproof"},

    {"id":"ali_014","title":"Wireless RGB Mechanical Keyboard","cat":"Electronics",
     "desc":"75% gaming keyboard with red switches, RGB lighting, Bluetooth + USB-C connection.",
     "aliPrice":72,"img":"https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=mechanical+keyboard+rgb+wireless"},

    {"id":"ali_015","title":"26000 DPI Wireless Gaming Mouse","cat":"Electronics",
     "desc":"Gaming mouse with 26000 DPI optical sensor, 70h battery life, 8 programmable buttons.",
     "aliPrice":45,"img":"https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=gaming+mouse+wireless+26000dpi"},

    {"id":"ali_016","title":"15.6\" Portable IPS Monitor","cat":"Electronics",
     "desc":"1080p IPS external monitor, USB-C/HDMI, 8mm thin, perfect for laptop & Switch.",
     "aliPrice":110,"img":"https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=portable+monitor+usb-c"},

    {"id":"ali_017","title":"4K 60fps Action Camera","cat":"Electronics",
     "desc":"4K sports camera with EIS stabilization, waterproof up to 40m, WiFi, touch screen.",
     "aliPrice":68,"img":"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=action+camera+4k+60fps"},

    {"id":"ali_018","title":"1080p Bluetooth Mini Projector","cat":"Electronics",
     "desc":"Pocket projector with 1080p resolution, built-in Bluetooth speaker, HDMI+USB, 120-inch display.",
     "aliPrice":88,"img":"https://images.unsplash.com/photo-1626379953822-baec19c3accd?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=mini+projector+1080p+bluetooth"},

    {"id":"ali_019","title":"Adjustable Aluminum Laptop Stand","cat":"Electronics",
     "desc":"Aluminum laptop stand with 6 heights, foldable for travel, fits up to 17-inch laptops.",
     "aliPrice":22,"img":"https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=laptop+stand+aluminum+foldable"},

    {"id":"ali_020","title":"1TB Portable NAS Storage Cloud","cat":"Electronics",
     "desc":"Portable personal storage drive with WiFi, app, automatic smartphone backup, 1TB.",
     "aliPrice":95,"img":"https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=portable+nas+wifi+1tb"},

    {"id":"ali_021","title":"RGBW WiFi Smart LED Bulb","cat":"Electronics",
     "desc":"Smart bulb with 16M colors, voice control (Alexa/Google), scheduling, E27 base.",
     "aliPrice":18,"img":"https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=smart+bulb+rgbw+wifi+alexa"},

    {"id":"ali_022","title":"Smart Fingerprint Door Lock","cat":"Electronics",
     "desc":"Smart lock with fingerprint reader, code, RFID card, and key. Bluetooth + App.",
     "aliPrice":75,"img":"https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=smart+lock+fingerprint+bluetooth"},

    {"id":"ali_023","title":"LiDAR WiFi Robot Vacuum","cat":"Electronics",
     "desc":"Robot vacuum with LiDAR mapping, 2700Pa suction, mop, app control.",
     "aliPrice":120,"img":"https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=robot+vacuum+lidar+wifi"},

    {"id":"ali_024","title":"CO2 Air Quality Monitor","cat":"Electronics",
     "desc":"CO2 sensor, humidity, temperature, and PM2.5. OLED screen, alerts, Home Assistant compatible.",
     "aliPrice":38,"img":"https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=co2+air+quality+monitor+home"},

    {"id":"ali_025","title":"Bluetooth 5.0 Car FM Transmitter","cat":"Electronics",
     "desc":"Car FM adapter, Bluetooth 5.0, dual USB-A+C charger, hands-free, EQ.",
     "aliPrice":16,"img":"https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=car+fm+transmitter+bluetooth+5"},

    {"id":"ali_026","title":"USB-C to USB-C 240W 2m Cable","cat":"Electronics",
     "desc":"USB-C 240W cable for laptop to smartphone charging, 40Gbps, 8K@60Hz, braided nylon.",
     "aliPrice":12,"img":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=usb-c+cable+240w+2m"},

    {"id":"ali_027","title":"Gaming Headset with Noise-Cancelling Mic","cat":"Electronics",
     "desc":"7.1 surround gaming headset, noise-cancelling mic, RGB LED, wired USB.",
     "aliPrice":32,"img":"https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=gaming+headset+71+surround+rgb"},

    {"id":"ali_028","title":"Mini A4 Bluetooth Printer","cat":"Electronics",
     "desc":"Portable A4 thermal printer, Bluetooth + WiFi, inkless, 80mm/s speed.",
     "aliPrice":62,"img":"https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=portable+printer+bluetooth+a4"},

    {"id":"ali_029","title":"Non-Contact Infrared Thermometer","cat":"Electronics",
     "desc":"Forehead/ear thermometer, ≤0.3°C accuracy, 1s result, 32 readings memory, LCD.",
     "aliPrice":20,"img":"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=infrared+thermometer+forehead"},

    {"id":"ali_030","title":"10-inch Graphic Drawing Tablet","cat":"Electronics",
     "desc":"10x6.25 inch graphic tablet with 8192 pressure levels, passive pen, USB-C, Win/Mac compatible.",
     "aliPrice":44,"img":"https://images.unsplash.com/photo-1540103711724-ebf833bde8d1?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=drawing+tablet+10+inch+8192"},

    {"id":"ali_031","title":"Intel N100 16GB Mini PC","cat":"Electronics",
     "desc":"Mini-PC with Intel N100 processor, 16GB RAM, 512GB SSD, 4K Dual Display, WiFi 6.",
     "aliPrice":155,"img":"https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=mini+pc+n100+16gb+512ssd"},

    {"id":"ali_032","title":"9-in-1 USB-C Multiport Adapter","cat":"Electronics",
     "desc":"9-in-1 Hub: HDMI 4K, USB 3.0x3, SD/TF, LAN 1Gbps, USB-C PD 100W.",
     "aliPrice":28,"img":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=usb-c+hub+9in1+hdmi+4k"},

    {"id":"ali_033","title":"10.1\" WiFi Digital Photo Frame","cat":"Electronics",
     "desc":"Smart IPS 10.1 inch frame, 1280x800, WiFi, app, social network sharing.",
     "aliPrice":58,"img":"https://images.unsplash.com/photo-1551516595-a8c5a0df1e4a?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=digital+photo+frame+wifi+10inch"},

    {"id":"ali_034","title":"Bladeless USB Desk Fan","cat":"Electronics",
     "desc":"Bladeless electric fan, 12 speeds, remote control, quiet 25dB, USB-C.",
     "aliPrice":36,"img":"https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=bladeless+fan+usb+desk"},

    {"id":"ali_035","title":"Ultrasonic Glasses Cleaner","cat":"Electronics",
     "desc":"45kHz ultrasonic cleaning device, 600ml, for jewelry / glasses / watches, USB-C.",
     "aliPrice":26,"img":"https://images.unsplash.com/photo-1559521783-1d1599583485?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=ultrasonic+cleaner+glasses+jewelry"},

    {"id":"ali_036","title":"1800W Fast Hand Dryer","cat":"Electronics",
     "desc":"Electric hand dryer 1800W, 10 seconds, quiet, anti-bacterial ABS.",
     "aliPrice":40,"img":"https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=hand+dryer+1800w+fast"},

    {"id":"ali_037","title":"48W UV LED Nail Lamp","cat":"Electronics",
     "desc":"48W UV/LED lamp for gel nail drying, auto timer, LCD, professional design.",
     "aliPrice":18,"img":"https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=uv+led+nail+lamp+48w"},

    {"id":"ali_038","title":"60m Bluetooth Laser Distance Meter","cat":"Electronics",
     "desc":"Digital laser distance meter up to 60m, ±2mm accuracy, Bluetooth for app, IP54.",
     "aliPrice":30,"img":"https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=laser+distance+meter+60m+bluetooth"},

    {"id":"ali_039","title":"USB Desktop Mug Warmer","cat":"Electronics",
     "desc":"Electric mug warmer for desk, 55°C, USB-C, LED indicator, for coffee/tea/cocoa.",
     "aliPrice":14,"img":"https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=usb+mug+warmer+55c"},

    {"id":"ali_040","title":"3-Stage Electric Knife Sharpener","cat":"Electronics",
     "desc":"Electric sharpener with 3 sharpening stages: coarse / fine / polishing. USB-C, safe to use.",
     "aliPrice":24,"img":"https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=electric+knife+sharpener+3stage"},

    # ── Accessories ──────────────────────────────────────────────────────────────
    {"id":"ali_005","title":"30L Waterproof Backpack","cat":"Accessories",
     "desc":"Waterproof everyday backpack with dedicated 16-inch laptop compartment, USB port, orthopedic straps.",
     "aliPrice":55,"img":"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=waterproof+backpack+usb"},

    # ── Home ──────────────────────────────────────────────────────────────────
    {"id":"ali_003","title":"Smart LED Desk Lamp","cat":"Home",
     "desc":"LED lamp with brightness and color temperature control, touch control, night mode, USB for charging.",
     "aliPrice":38,"img":"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=led+desk+lamp+touch"},

    {"id":"ali_007","title":"4K WiFi IP Security Camera","cat":"Home",
     "desc":"4K smart camera with night vision, motion detection, two-way audio, cloud or microSD storage.",
     "aliPrice":72,"img":"https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=ip+camera+4k+wifi"},

    {"id":"ali_010","title":"Bamboo Wood Desk Organizer","cat":"Home",
     "desc":"Natural bamboo organizer for your workspace — compartment for pens, notebooks, smartphone, etc.",
     "aliPrice":30,"img":"https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=bamboo+desk+organizer"},

    # ── Daily ────────────────────────────────────────────────────────────────
    {"id":"ali_006","title":"500ml Stainless Steel Thermal Cup","cat":"Daily",
     "desc":"Double vacuum cup keeps hot for 12 hours and cold for 24 hours, hermetic lid.",
     "aliPrice":22,"img":"https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=stainless+thermos+vacuum"},

    {"id":"ali_008","title":"Rechargeable Laser Pointer Pen","cat":"Daily",
     "desc":"Multi-purpose laser pen: pointer, UV engraver, LED flashlight, USB-C. Ideal for office.",
     "aliPrice":18,"img":"https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=600",
     "aliUrl":"https://www.aliexpress.com/wholesale?SearchText=laser+pointer+uv+pen"},

    {"id":"ali_012","title":"Mini Portable USB Fan","cat":"Daily",
     "desc":"Rechargeable pocket USB-C fan, 3 speeds, ultra-quiet, 8 hours battery.",
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
            "desc": p["desc"], "price": f"${round(p['aliPrice'] * 0.54, 2)}", # Standardizing to USD (approx conversion)
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
