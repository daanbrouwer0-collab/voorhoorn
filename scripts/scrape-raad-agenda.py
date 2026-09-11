#!/usr/bin/env python3
"""Scrape gemeenteraad-/commissievergaderingen van iBabs naar raad-agenda.json.

iBabs blokkeert browser-CORS; dit script draait server-side (lokaal of CI)
en schrijft een JSON die de portal wél mag laden.
"""

from __future__ import annotations

import json
import re
import sys
import urllib.request
from datetime import date, datetime, timezone
from html import unescape
from pathlib import Path

UA = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; VoorhoornRaadBot/1.0; "
        "+https://github.com/voorhoorn)"
    )
}
BASE = "https://hoorn.bestuurlijkeinformatie.nl"
API = f"{BASE}/Calendar/GetMonthAgendas"
MONTHS_NL = [
    "januari",
    "februari",
    "maart",
    "april",
    "mei",
    "juni",
    "juli",
    "augustus",
    "september",
    "oktober",
    "november",
    "december",
]
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "raad-agenda.json"


def fetch(url: str, timeout: int = 30) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", "ignore")


def months_ahead(count: int = 6) -> list[tuple[int, int]]:
    """iBabs month-parameter is 0-indexed (0=januari)."""
    today = date.today()
    out: list[tuple[int, int]] = []
    for i in range(count):
        y = today.year + (today.month - 1 + i) // 12
        m = (today.month - 1 + i) % 12  # 0-indexed
        out.append((y, m))
    return out


def parse_month_html(html: str) -> list[dict]:
    events: list[dict] = []
    for match in re.finditer(
        r'<a href="(/Agenda/Index/[^"]+)"[^>]*class="calendar-item[^"]*"[\s\S]*?</a>',
        html,
    ):
        block = match.group(0)
        href = match.group(1)
        sr = re.search(r'class="sr-only">\s*([^<]+)', block)
        label = re.search(r'calendar-item-label">([\s\S]*?)</div>', block)
        time_el = re.search(r'calendar-item-time">\s*([^<]+)', block)
        subtitle = re.search(r'calendar-item-subtitle">\s*([^<]+)', block)
        loc = re.search(r'calendar-item-location">\s*\(([^)]+)\)', block)
        desc_m = re.search(r'calendar-item-description">([\s\S]*?)</div>', block)

        label_txt = re.sub(r"<[^>]+>", " ", label.group(1) if label else "")
        label_txt = re.sub(r"\s+", " ", unescape(label_txt)).strip()
        if subtitle:
            st = unescape(subtitle.group(1).strip())
            if not label_txt or label_txt.startswith("("):
                label_txt = st
            elif st and st.lower() not in label_txt.lower():
                # lege label-case (raadscafé e.d.)
                if len(label_txt) < 3:
                    label_txt = st

        date_txt = (sr.group(1) if sr else "").strip()
        dm = re.search(
            r"(\d{1,2})\s+(\w+)\s+(\d{4})",
            date_txt,
            re.I,
        )
        if not dm:
            continue
        try:
            mon = MONTHS_NL.index(dm.group(2).lower())
        except ValueError:
            continue
        iso = f"{dm.group(3)}-{mon + 1:02d}-{int(dm.group(1)):02d}"

        tm = re.search(
            r"(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})",
            time_el.group(1) if time_el else "",
        )
        title = re.sub(r"\s*\([^)]*\)\s*", " ", label_txt).strip() or "Vergadering"
        desc = "Raads- of commissievergadering van de gemeente Hoorn."
        if desc_m:
            cleaned = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", desc_m.group(1))).strip()
            if cleaned:
                desc = cleaned[:420]

        events.append(
            {
                "id": f"raad-{href}",
                "title": title,
                "link": f"{BASE}{href}",
                "location": (loc.group(1) if loc else "Raadzaal"),
                "description": desc,
                "startDate": iso,
                "endDate": "",
                "startTime": tm.group(1) if tm else "",
                "endTime": tm.group(2) if tm else "",
                "sourceId": "raad",
                "sourceLabel": "Gemeenteraad",
                "categories": ["raad"],
            }
        )
    return events


def scrape() -> dict:
    all_events: list[dict] = []
    for year, month in months_ahead(6):
        url = f"{API}?year={year}&month={month}"
        try:
            html = fetch(url)
        except Exception as exc:  # noqa: BLE001
            print(f"warn: {url} → {exc}", file=sys.stderr)
            continue
        all_events.extend(parse_month_html(html))

    seen: set[str] = set()
    unique: list[dict] = []
    for event in all_events:
        if event["link"] in seen:
            continue
        seen.add(event["link"])
        unique.append(event)
    unique.sort(key=lambda e: (e["startDate"], e["startTime"]))

    return {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": f"{BASE}/Calendar",
        "events": unique,
    }


def main() -> int:
    data = scrape()
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"schreef {OUT} ({len(data['events'])} vergaderingen)")
    for event in data["events"]:
        print(f"  {event['startDate']} {event['startTime']}  {event['title']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
