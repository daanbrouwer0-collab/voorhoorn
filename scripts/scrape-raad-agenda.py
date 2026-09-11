#!/usr/bin/env python3
"""Scrape iBabs-vergaderingen én agendapunten naar raad-agenda.json.

Browser-CORS blokkeert live fetch; dit script draait lokaal/CI.
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
MAX_MEETINGS = 10  # aankomende vergaderingen waarvan we punten ophalen


def fetch(url: str, timeout: int = 35) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", "ignore")


def months_ahead(count: int = 6) -> list[tuple[int, int]]:
    today = date.today()
    out: list[tuple[int, int]] = []
    for i in range(count):
        y = today.year + (today.month - 1 + i) // 12
        m = (today.month - 1 + i) % 12
        out.append((y, m))
    return out


def clean_text(html_frag: str) -> str:
    return re.sub(r"\s+", " ", unescape(re.sub(r"<[^>]+>", " ", html_frag or ""))).strip()


def parse_meetings(html: str) -> list[dict]:
    meetings: list[dict] = []
    for match in re.finditer(
        r'<a href="(/Agenda/Index/([^"]+))"[^>]*class="calendar-item[^"]*"[\s\S]*?</a>',
        html,
    ):
        block = match.group(0)
        href = match.group(1)
        meeting_id = match.group(2)
        sr = re.search(r'class="sr-only">\s*([^<]+)', block)
        label = re.search(r'calendar-item-label">([\s\S]*?)</div>', block)
        time_el = re.search(r'calendar-item-time">\s*([^<]+)', block)
        subtitle = re.search(r'calendar-item-subtitle">\s*([^<]+)', block)
        loc = re.search(r'calendar-item-location">\s*\(([^)]+)\)', block)

        label_txt = clean_text(label.group(1) if label else "")
        if subtitle:
            st = unescape(subtitle.group(1).strip())
            if not label_txt or label_txt.startswith("(") or len(label_txt) < 3:
                label_txt = st

        date_txt = (sr.group(1) if sr else "").strip()
        dm = re.search(r"(\d{1,2})\s+(\w+)\s+(\d{4})", date_txt, re.I)
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

        meetings.append(
            {
                "meetingId": meeting_id,
                "meetingTitle": title,
                "link": f"{BASE}{href}",
                "location": (loc.group(1) if loc else "Raadzaal"),
                "startDate": iso,
                "startTime": tm.group(1) if tm else "",
                "endTime": tm.group(2) if tm else "",
            }
        )
    return meetings


def parse_agenda_items(html: str, meeting: dict) -> list[dict]:
    events: list[dict] = []
    for match in re.finditer(
        r'<div class="panel panel-default agenda-item"\s+id="([^"]+)"\s*>([\s\S]*?)(?=<div class="panel panel-default agenda-item"|$)',
        html,
    ):
        item_id = match.group(1)
        block = match.group(2)
        # Sidebar/year lists can leak; stop if we left the main agenda region
        if 'class="agenda-link' in block and "panel-id" not in block[:800]:
            break

        num_el = re.search(r'<div class="panel-id">\s*([^<]+?)\s*</div>', block)
        label = re.search(
            r'<span class="panel-title-label"[^>]*>\s*([\s\S]*?)\s*</span>',
            block,
        )
        if not label:
            continue
        title = clean_text(label.group(1))
        if not title:
            continue

        number = clean_text(num_el.group(1)) if num_el else ""
        # Korte toelichting (eerste tekst in panel-body, zonder bijlage-ruis)
        body = re.search(
            r'<div class="panel-collapse[\s\S]*?<div class="panel-body[^"]*">([\s\S]*?)</div>',
            block,
        )
        description = ""
        if body:
            description = clean_text(body.group(1))
            # strip file-size noise
            description = re.sub(r"\b\d+\s*KB\b", "", description, flags=re.I)
            description = re.sub(r"\b\d+\s*MB\b", "", description, flags=re.I)
            description = re.sub(r"\s+", " ", description).strip()[:420]

        if not description:
            description = (
                f"{meeting['meetingTitle']} · {meeting['startDate']}"
                + (f" · agendapunt {number}" if number else "")
            )

        display_title = f"{number}. {title}" if number else title
        events.append(
            {
                "id": f"raad-{meeting['meetingId']}-{item_id}",
                "title": display_title,
                "link": f"{meeting['link']}#{item_id}",
                "location": meeting["location"],
                "description": description,
                "startDate": meeting["startDate"],
                "endDate": "",
                "startTime": meeting["startTime"],
                "endTime": meeting["endTime"],
                "sourceId": "raad",
                "sourceLabel": meeting["meetingTitle"],
                "categories": ["raad"],
                "meetingTitle": meeting["meetingTitle"],
                "meetingLink": meeting["link"],
                "itemNumber": number,
                "itemTitle": title,
            }
        )
    return events


def scrape() -> dict:
    meetings: list[dict] = []
    for year, month in months_ahead(6):
        url = f"{API}?year={year}&month={month}"
        try:
            html = fetch(url)
        except Exception as exc:  # noqa: BLE001
            print(f"warn: {url} → {exc}", file=sys.stderr)
            continue
        meetings.extend(parse_meetings(html))

    # dedupe meetings
    seen_m: set[str] = set()
    unique_meetings: list[dict] = []
    for meeting in meetings:
        if meeting["meetingId"] in seen_m:
            continue
        seen_m.add(meeting["meetingId"])
        unique_meetings.append(meeting)
    unique_meetings.sort(key=lambda m: (m["startDate"], m["startTime"]))

    today = date.today().isoformat()
    upcoming = [m for m in unique_meetings if m["startDate"] >= today][:MAX_MEETINGS]

    events: list[dict] = []
    for meeting in upcoming:
        try:
            page = fetch(meeting["link"])
        except Exception as exc:  # noqa: BLE001
            print(f"warn: meeting {meeting['link']} → {exc}", file=sys.stderr)
            # fallback: alleen de vergadering zelf
            events.append(
                {
                    "id": f"raad-{meeting['meetingId']}",
                    "title": meeting["meetingTitle"],
                    "link": meeting["link"],
                    "location": meeting["location"],
                    "description": "Raads- of commissievergadering van de gemeente Hoorn.",
                    "startDate": meeting["startDate"],
                    "endDate": "",
                    "startTime": meeting["startTime"],
                    "endTime": meeting["endTime"],
                    "sourceId": "raad",
                    "sourceLabel": meeting["meetingTitle"],
                    "categories": ["raad"],
                    "meetingTitle": meeting["meetingTitle"],
                    "meetingLink": meeting["link"],
                    "itemNumber": "",
                    "itemTitle": meeting["meetingTitle"],
                }
            )
            continue
        items = parse_agenda_items(page, meeting)
        if items:
            events.extend(items)
            print(
                f"  {meeting['startDate']} {meeting['meetingTitle']}: {len(items)} punten",
                file=sys.stderr,
            )
        else:
            # Agenda nog niet gepubliceerd — toon de vergadering zelf
            events.append(
                {
                    "id": f"raad-{meeting['meetingId']}",
                    "title": meeting["meetingTitle"],
                    "link": meeting["link"],
                    "location": meeting["location"],
                    "description": "Agenda nog niet (volledig) gepubliceerd. Open de vergadering op iBabs.",
                    "startDate": meeting["startDate"],
                    "endDate": "",
                    "startTime": meeting["startTime"],
                    "endTime": meeting["endTime"],
                    "sourceId": "raad",
                    "sourceLabel": meeting["meetingTitle"],
                    "categories": ["raad"],
                    "meetingTitle": meeting["meetingTitle"],
                    "meetingLink": meeting["link"],
                    "itemNumber": "",
                    "itemTitle": meeting["meetingTitle"],
                }
            )
            print(
                f"  {meeting['startDate']} {meeting['meetingTitle']}: geen punten (alleen vergadering)",
                file=sys.stderr,
            )

    events.sort(
        key=lambda e: (
            e["startDate"],
            e["startTime"],
            [
                int(p) if p.isdigit() else p
                for p in re.split(r"\.", e.get("itemNumber") or "999")
            ],
        )
    )

    return {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": f"{BASE}/Calendar",
        "events": events,
    }


def main() -> int:
    data = scrape()
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"schreef {OUT} ({len(data['events'])} agendapunten)")
    for event in data["events"][:12]:
        print(f"  {event['startDate']}  {event['title'][:70]}")
    if len(data["events"]) > 12:
        print(f"  … +{len(data['events']) - 12} meer")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
