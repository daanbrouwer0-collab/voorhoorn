#!/usr/bin/env python3
"""Scrape Netwerk Hoorn Jeugd/Jongeren-activiteiten → netwerk-kids-agenda.json.

De site heeft geen RSS en blokkeert browser-CORS; dit script draait in CI/lokaal.
"""

from __future__ import annotations

import json
import re
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from html import unescape
from pathlib import Path

UA = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; VoorhoornNetwerkBot/1.0; "
        "+https://github.com/voorhoorn)"
    )
}
BASE = "https://netwerkhoorn.nl/activiteiten"
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "netwerk-kids-agenda.json"
GROUPS = ("Jeugd", "Jongeren", "Peuters")
MONTHS = {
    "jan": 0,
    "januari": 0,
    "feb": 1,
    "februari": 1,
    "mrt": 2,
    "maart": 2,
    "apr": 3,
    "april": 3,
    "mei": 4,
    "jun": 5,
    "juni": 5,
    "jul": 6,
    "juli": 6,
    "aug": 7,
    "augustus": 7,
    "sep": 8,
    "sept": 8,
    "september": 8,
    "okt": 9,
    "oktober": 9,
    "nov": 10,
    "november": 10,
    "dec": 11,
    "december": 11,
}


def fetch(url: str, timeout: int = 30) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", "ignore")


def clean(html_frag: str) -> str:
    return re.sub(r"\s+", " ", unescape(re.sub(r"<[^>]+>", " ", html_frag or ""))).strip()


def parse_dutch_date(text: str) -> str:
    if not text:
        return ""
    normalized = unescape(text).lower().replace(".", "")
    m = re.search(
        r"(\d{1,2})\s+(januari|februari|maart|april|mei|juni|juli|augustus|september|"
        r"oktober|november|december|jan|feb|mrt|apr|jun|jul|aug|sep|sept|okt|nov|dec)"
        r"\s+'?(\d{2,4})",
        normalized,
        re.I,
    )
    if not m:
        return ""
    year = int(m.group(3))
    if year < 100:
        year += 2000
    month = MONTHS.get(m.group(2).lower())
    if month is None:
        return ""
    return f"{year:04d}-{month + 1:02d}-{int(m.group(1)):02d}"


def parse_page(html: str, group: str) -> list[dict]:
    events: list[dict] = []
    for match in re.finditer(
        r'<a href="(https?://netwerkhoorn\.nl/activiteit/[^"]+|/?activiteit/[^"]+)"[^>]*class="row"[^>]*>([\s\S]*?)</a>',
        html,
        re.I,
    ):
        href = match.group(1)
        block = match.group(2)
        title_m = re.search(r"<h3[^>]*>([\s\S]*?)</h3>", block, re.I)
        if not title_m:
            continue
        title = clean(title_m.group(1))
        if not title:
            continue
        link = href if href.startswith("http") else f"https://netwerkhoorn.nl{href}"

        loc_m = re.search(
            r"<strong>\s*Locatie\s*</strong>\s*([\s\S]*?)(?:<strong>|</span>)",
            block,
            re.I,
        )
        location = clean(loc_m.group(1)) if loc_m else "Netwerk Hoorn"

        date_m = re.search(
            r"<strong>\s*Datum\s*</strong>\s*([\s\S]*?)(?:<strong>|</span>)",
            block,
            re.I,
        )
        if not date_m:
            date_m = re.search(r'class="date"[^>]*>([\s\S]*?)(?:Inschrijving|<strong>|</span>)', block, re.I)
        start_date = parse_dutch_date(date_m.group(1) if date_m else "")

        events.append(
            {
                "id": f"netwerk-{link}-{start_date or title}",
                "title": title,
                "link": link,
                "location": location,
                "description": f"Netwerk Hoorn · {group}",
                "startDate": start_date,
                "endDate": "",
                "startTime": "",
                "endTime": "",
                "sourceId": "netwerk",
                "sourceLabel": "Netwerk Hoorn",
                "categories": ["voor-kinderen"],
                "audience": group,
            }
        )
    return events


def scrape_group(group: str) -> list[dict]:
    all_events: list[dict] = []
    for page in range(1, 6):
        qs = urllib.parse.urlencode({"forWhoGroup": group, "page": page})
        url = f"{BASE}?{qs}"
        try:
            html = fetch(url)
        except Exception as exc:  # noqa: BLE001
            print(f"warn: {url} → {exc}", file=sys.stderr)
            break
        batch = parse_page(html, group)
        if not batch:
            break
        all_events.extend(batch)
        # stop if no next page
        if f"page={page + 1}" not in html and f"page={page+1}" not in html:
            # also check pagination numbers
            if page >= max([int(x) for x in re.findall(r"[?&]page=(\d+)", html)] or [1]):
                break
    return all_events


def scrape() -> dict:
    events: list[dict] = []
    for group in GROUPS:
        batch = scrape_group(group)
        print(f"  {group}: {len(batch)}", file=sys.stderr)
        events.extend(batch)

    seen: set[str] = set()
    unique: list[dict] = []
    for event in events:
        key = f"{event['link']}|{event['startDate']}"
        if key in seen:
            continue
        seen.add(key)
        unique.append(event)
    unique.sort(key=lambda e: (e["startDate"] or "9999", e["title"]))

    return {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": BASE,
        "events": unique,
    }


def main() -> int:
    data = scrape()
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"schreef {OUT} ({len(data['events'])} activiteiten)")
    for event in data["events"][:15]:
        print(f"  {event['startDate'] or '????-??-??'}  {event['title'][:60]}")
    if len(data["events"]) > 15:
        print(f"  … +{len(data['events']) - 15} meer")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
