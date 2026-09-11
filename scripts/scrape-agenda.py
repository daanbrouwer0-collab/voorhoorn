#!/usr/bin/env python3
"""Dagelijks scrapen van alle agenda-bronnen → agenda-data.json

Doel: de portal licht houden. Nieuws blijft live in de browser;
agenda komt uit deze cache. Slimme filters (periode / stad / kids / raad)
blijven client-side.

Bronnen:
  - Kom naar Hoorn (API HTML)
  - Manifesto (RSS)
  - Netwerk Hoorn (HTML, incl. Jeugd/Jongeren-tags)
  - iBabs gemeenteraad (vergaderingen + agendapunten)
"""

from __future__ import annotations

import json
import re
import sys
import urllib.parse
import urllib.request
from datetime import date, datetime, timezone
from html import unescape
from pathlib import Path
from xml.etree import ElementTree as ET

UA = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; VoorhoornAgendaBot/1.0; "
        "+https://github.com/voorhoorn)"
    )
}
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "agenda-data.json"

KNH_API = "https://komnaarhoorn.nl/wp-json/agenda/v1/items"
MANIFESTO_FEED = "https://manifesto-hoorn.nl/upcoming_productions"
NETWERK_BASE = "https://netwerkhoorn.nl/activiteiten"
IBABS_BASE = "https://hoorn.bestuurlijkeinformatie.nl"
IBABS_MONTH = f"{IBABS_BASE}/Calendar/GetMonthAgendas"

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


def fetch(url: str, timeout: int = 35) -> str:
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
        r"(?:(?:ma|di|wo|do|vr|za|zo)\s+)?"
        r"(\d{1,2})\s+"
        r"(januari|februari|maart|april|mei|juni|juli|augustus|september|"
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


def event(
    *,
    id_: str,
    title: str,
    link: str,
    location: str,
    description: str,
    start_date: str,
    source_id: str,
    source_label: str,
    categories: list[str] | None = None,
    start_time: str = "",
    end_time: str = "",
    extra: dict | None = None,
) -> dict:
    row = {
        "id": id_,
        "title": title,
        "link": link,
        "location": location,
        "description": (description or "")[:420],
        "startDate": start_date,
        "endDate": "",
        "startTime": start_time,
        "endTime": end_time,
        "sourceId": source_id,
        "sourceLabel": source_label,
        "categories": categories or [],
    }
    if extra:
        row.update(extra)
    return row


# ── Kom naar Hoorn ──────────────────────────────────────────────


def scrape_knh() -> list[dict]:
    kids_links: set[str] = set()
    # Eerst kids-categorie om te taggen
    for page in range(1, 5):
        url = f"{KNH_API}?page={page}&dateRange=this_year&categories=voor-kinderen"
        try:
            data = json.loads(fetch(url))
        except Exception as exc:  # noqa: BLE001
            print(f"warn knh kids p{page}: {exc}", file=sys.stderr)
            break
        for m in re.finditer(r'<a[^>]+href="([^"]+)"', data.get("html") or ""):
            kids_links.add(m.group(1).split("?")[0])
        if page >= int(data.get("totalPages") or 1):
            break

    events: list[dict] = []
    for page in range(1, 9):
        url = f"{KNH_API}?page={page}&dateRange=this_year"
        try:
            data = json.loads(fetch(url))
        except Exception as exc:  # noqa: BLE001
            print(f"warn knh p{page}: {exc}", file=sys.stderr)
            break
        html = data.get("html") or ""
        for art in re.finditer(
            r'<article[^>]*class="[^"]*agenda-item[^"]*"([^>]*)>([\s\S]*?)</article>',
            html,
            re.I,
        ):
            block = art.group(0)
            link_m = re.search(r'<a[^>]+href="([^"]+)"', block)
            if not link_m:
                continue
            link = link_m.group(1)
            title_attr = re.search(r'title="Bekijk evenement:\s*([^"]+)"', block)
            h3 = re.search(r"<h3[^>]*>([\s\S]*?)</h3>", block)
            title = clean(title_attr.group(1) if title_attr else (h3.group(1) if h3 else "Evenement"))
            loc_m = re.search(r"ti-map-pin[\s\S]*?<span[^>]*>([\s\S]*?)</span>", block)
            location = clean(loc_m.group(1)) if loc_m else ""
            desc_m = re.search(
                r'class="[^"]*(?:line-clamp-3|prose-sm)[^"]*"[^>]*>([\s\S]*?)</(?:div|p)>',
                block,
            )
            description = clean(desc_m.group(1)) if desc_m else ""
            dates = re.findall(r'datetime="(\d{4}-\d{2}-\d{2})"', block)
            times = re.findall(r'datetime="(\d{1,2}:\d{2})"', block)
            cats = ["voor-kinderen"] if link.split("?")[0] in kids_links else []
            events.append(
                event(
                    id_=f"knh-{link}",
                    title=title,
                    link=link,
                    location=location,
                    description=description,
                    start_date=dates[0] if dates else "",
                    start_time=times[0] if times else "",
                    end_time=times[1] if len(times) > 1 else "",
                    source_id="komnaarhoorn",
                    source_label="Kom naar Hoorn",
                    categories=cats,
                )
            )
        if page >= int(data.get("totalPages") or 1):
            break
    print(f"  Kom naar Hoorn: {len(events)} (kids-tag {len(kids_links)})", file=sys.stderr)
    return events


# ── Manifesto ───────────────────────────────────────────────────


def scrape_manifesto() -> list[dict]:
    try:
        xml = fetch(MANIFESTO_FEED)
    except Exception as exc:  # noqa: BLE001
        print(f"warn manifesto: {exc}", file=sys.stderr)
        return []
    # strip default ns headaches
    xml = re.sub(r'\sxmlns="[^"]+"', "", xml, count=1)
    root = ET.fromstring(xml)
    events: list[dict] = []
    for item in root.findall(".//item"):
        title = (item.findtext("title") or "Concert").strip()
        link = (item.findtext("link") or "").strip()
        desc = clean(item.findtext("description") or "")
        # content:encoded
        for child in list(item):
            if child.tag.endswith("encoded") and child.text:
                desc = clean(child.text) or desc
        start = parse_dutch_date(desc) or parse_dutch_date(title)
        if not link:
            continue
        events.append(
            event(
                id_=f"manifesto-{link}",
                title=title,
                link=link,
                location="Manifesto Hoorn",
                description=desc,
                start_date=start,
                source_id="manifesto",
                source_label="Manifesto",
                categories=["muziek"],
            )
        )
    print(f"  Manifesto: {len(events)}", file=sys.stderr)
    return events


# ── Netwerk ─────────────────────────────────────────────────────


def scrape_netwerk_page(html: str, audience: str = "") -> list[dict]:
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
            date_m = re.search(
                r'class="date"[^>]*>([\s\S]*?)(?:Inschrijving|<strong>|</span>)',
                block,
                re.I,
            )
        start = parse_dutch_date(date_m.group(1) if date_m else "")
        hint = clean(block)
        kids = bool(audience) or bool(
            re.search(r"jongeren|kids|kind|jeugd|peuter|tiener", hint, re.I)
        )
        cats = ["voor-kinderen"] if kids else ["creatief"]
        events.append(
            event(
                id_=f"netwerk-{link}-{start or title}",
                title=title,
                link=link,
                location=location,
                description=f"Netwerk Hoorn{(' · ' + audience) if audience else ''}",
                start_date=start,
                source_id="netwerk",
                source_label="Netwerk Hoorn",
                categories=cats,
                extra={"audience": audience} if audience else None,
            )
        )
    return events


def scrape_netwerk() -> list[dict]:
    events: list[dict] = []
    # Algemeen (meerdere pagina's)
    for page in range(1, 6):
        url = f"{NETWERK_BASE}?page={page}"
        try:
            html = fetch(url)
        except Exception as exc:  # noqa: BLE001
            print(f"warn netwerk p{page}: {exc}", file=sys.stderr)
            break
        batch = scrape_netwerk_page(html)
        if not batch:
            break
        events.extend(batch)
    # Kids filters
    for group in ("Jeugd", "Jongeren", "Peuters"):
        qs = urllib.parse.urlencode({"forWhoGroup": group, "page": 1})
        try:
            html = fetch(f"{NETWERK_BASE}?{qs}")
        except Exception as exc:  # noqa: BLE001
            print(f"warn netwerk {group}: {exc}", file=sys.stderr)
            continue
        events.extend(scrape_netwerk_page(html, group))
    print(f"  Netwerk (raw): {len(events)}", file=sys.stderr)
    return events


# ── iBabs raad ──────────────────────────────────────────────────


def ibabs_months(count: int = 6) -> list[tuple[int, int]]:
    today = date.today()
    out: list[tuple[int, int]] = []
    for i in range(count):
        y = today.year + (today.month - 1 + i) // 12
        m = (today.month - 1 + i) % 12
        out.append((y, m))
    return out


def scrape_raad_meetings() -> list[dict]:
    meetings: list[dict] = []
    for year, month in ibabs_months(6):
        url = f"{IBABS_MONTH}?year={year}&month={month}"
        try:
            html = fetch(url)
        except Exception as exc:  # noqa: BLE001
            print(f"warn ibabs month {year}-{month}: {exc}", file=sys.stderr)
            continue
        for match in re.finditer(
            r'<a href="(/Agenda/Index/([^"]+))"[^>]*class="calendar-item[^"]*"[\s\S]*?</a>',
            html,
        ):
            block = match.group(0)
            href, mid = match.group(1), match.group(2)
            sr = re.search(r'class="sr-only">\s*([^<]+)', block)
            label = re.search(r'calendar-item-label">([\s\S]*?)</div>', block)
            time_el = re.search(r'calendar-item-time">\s*([^<]+)', block)
            subtitle = re.search(r'calendar-item-subtitle">\s*([^<]+)', block)
            loc = re.search(r'calendar-item-location">\s*\(([^)]+)\)', block)
            label_txt = clean(label.group(1) if label else "")
            if subtitle:
                st = unescape(subtitle.group(1).strip())
                if not label_txt or label_txt.startswith("(") or len(label_txt) < 3:
                    label_txt = st
            start = parse_dutch_date(sr.group(1) if sr else "")
            if not start:
                continue
            tm = re.search(
                r"(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})",
                time_el.group(1) if time_el else "",
            )
            title = re.sub(r"\s*\([^)]*\)\s*", " ", label_txt).strip() or "Vergadering"
            meetings.append(
                {
                    "meetingId": mid,
                    "meetingTitle": title,
                    "link": f"{IBABS_BASE}{href}",
                    "location": loc.group(1) if loc else "Raadzaal",
                    "startDate": start,
                    "startTime": tm.group(1) if tm else "",
                    "endTime": tm.group(2) if tm else "",
                }
            )
    # dedupe
    seen: set[str] = set()
    unique: list[dict] = []
    for m in meetings:
        if m["meetingId"] in seen:
            continue
        seen.add(m["meetingId"])
        unique.append(m)
    unique.sort(key=lambda m: (m["startDate"], m["startTime"]))
    return unique


def scrape_raad_items(meeting: dict) -> list[dict]:
    try:
        page = fetch(meeting["link"])
    except Exception as exc:  # noqa: BLE001
        print(f"warn raad {meeting['link']}: {exc}", file=sys.stderr)
        return []
    events: list[dict] = []
    for match in re.finditer(
        r'<div class="panel panel-default agenda-item"\s+id="([^"]+)"\s*>([\s\S]*?)(?=<div class="panel panel-default agenda-item"|$)',
        page,
    ):
        item_id, block = match.group(1), match.group(2)
        if 'class="agenda-link' in block and "panel-id" not in block[:800]:
            break
        num_el = re.search(r'<div class="panel-id">\s*([^<]+?)\s*</div>', block)
        label = re.search(
            r'<span class="panel-title-label"[^>]*>\s*([\s\S]*?)\s*</span>',
            block,
        )
        if not label:
            continue
        title = clean(label.group(1))
        if not title:
            continue
        number = clean(num_el.group(1)) if num_el else ""
        body = re.search(
            r'<div class="panel-collapse[\s\S]*?<div class="panel-body[^"]*">([\s\S]*?)</div>',
            block,
        )
        description = clean(body.group(1)) if body else ""
        description = re.sub(r"\b\d+\s*[KM]B\b", "", description, flags=re.I)
        description = re.sub(r"\s+", " ", description).strip()[:420]
        if not description:
            description = f"{meeting['meetingTitle']} · agendapunt {number}".strip()
        display = f"{number}. {title}" if number else title
        events.append(
            event(
                id_=f"raad-{meeting['meetingId']}-{item_id}",
                title=display,
                link=f"{meeting['link']}#{item_id}",
                location=meeting["location"],
                description=description,
                start_date=meeting["startDate"],
                start_time=meeting["startTime"],
                end_time=meeting["endTime"],
                source_id="raad",
                source_label=meeting["meetingTitle"],
                categories=["raad"],
                extra={
                    "meetingTitle": meeting["meetingTitle"],
                    "meetingLink": meeting["link"],
                    "itemNumber": number,
                    "itemTitle": title,
                },
            )
        )
    return events


def scrape_raad() -> list[dict]:
    today = date.today().isoformat()
    meetings = [m for m in scrape_raad_meetings() if m["startDate"] >= today][:10]
    events: list[dict] = []
    for meeting in meetings:
        items = scrape_raad_items(meeting)
        if items:
            events.extend(items)
            print(
                f"  raad {meeting['startDate']} {meeting['meetingTitle']}: {len(items)}",
                file=sys.stderr,
            )
        else:
            events.append(
                event(
                    id_=f"raad-{meeting['meetingId']}",
                    title=meeting["meetingTitle"],
                    link=meeting["link"],
                    location=meeting["location"],
                    description="Agenda nog niet (volledig) gepubliceerd.",
                    start_date=meeting["startDate"],
                    start_time=meeting["startTime"],
                    end_time=meeting["endTime"],
                    source_id="raad",
                    source_label=meeting["meetingTitle"],
                    categories=["raad"],
                    extra={
                        "meetingTitle": meeting["meetingTitle"],
                        "meetingLink": meeting["link"],
                        "itemNumber": "",
                        "itemTitle": meeting["meetingTitle"],
                    },
                )
            )
    print(f"  Raad totaal: {len(events)}", file=sys.stderr)
    return events


# ── merge ───────────────────────────────────────────────────────


def title_key(title: str) -> str:
    t = unescape(title).lower()
    t = re.sub(r"[^a-z0-9\s]", " ", t)
    words = [w for w in t.split() if len(w) > 2][:6]
    return " ".join(words)


def dedupe(items: list[dict]) -> list[dict]:
    items = sorted(items, key=lambda e: e.get("startDate") or "9999")
    out: list[dict] = []
    for item in items:
        key = title_key(item.get("title") or "")
        dup = False
        for kept in out:
            if key and key == title_key(kept.get("title") or ""):
                if not item.get("startDate") or not kept.get("startDate"):
                    dup = True
                    break
                if item["startDate"] == kept["startDate"]:
                    # merge kids tag
                    if "voor-kinderen" in item.get("categories", []):
                        if "voor-kinderen" not in kept.get("categories", []):
                            kept["categories"] = list(
                                {*kept.get("categories", []), "voor-kinderen"}
                            )
                    dup = True
                    break
        if not dup:
            out.append(item)
    return out


def main() -> int:
    print("Scrapen agenda-bronnen…", file=sys.stderr)
    all_events = []
    all_events.extend(scrape_knh())
    all_events.extend(scrape_manifesto())
    all_events.extend(scrape_netwerk())
    all_events.extend(scrape_raad())
    merged = dedupe(all_events)
    merged.sort(
        key=lambda e: (
            e.get("startDate") or "9999",
            e.get("startTime") or "",
            e.get("title") or "",
        )
    )
    data = {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "sources": [
            "komnaarhoorn",
            "manifesto",
            "netwerk",
            "raad",
        ],
        "events": merged,
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    # Compat: ook oude bestanden bijwerken zodat niets breekt tijdens transitie
    kids = [e for e in merged if "voor-kinderen" in e.get("categories", [])]
    raad = [e for e in merged if e.get("sourceId") == "raad"]
    (ROOT / "netwerk-kids-agenda.json").write_text(
        json.dumps(
            {"updated": data["updated"], "source": NETWERK_BASE, "events": kids},
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    (ROOT / "raad-agenda.json").write_text(
        json.dumps(
            {
                "updated": data["updated"],
                "source": f"{IBABS_BASE}/Calendar",
                "events": raad,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(
        f"schreef {OUT.name} ({len(merged)} events; kids={len(kids)} raad={len(raad)})"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
