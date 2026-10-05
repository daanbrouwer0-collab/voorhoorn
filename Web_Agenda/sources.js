/**
 * Live agenda-bronnen, dezelfde set als de dagelijkse Voorhoorn-scrape.
 * Parsers zijn puur: ze krijgen tekst/HTML terug en maken evenementen.
 */

export const SOURCES = [
  { id: "komnaarhoorn", label: "Kom naar Hoorn", short: "Kom naar Hoorn", laag: "Verzameling" },
  { id: "netwerk", label: "Stichting Netwerk", short: "Netwerk", laag: "Reeks" },
  { id: "raad", label: "Gemeente", short: "Gemeente", laag: "Vergadering" },
  { id: "manifesto", label: "Manifesto", short: "Manifesto", laag: "Optreden" },
  { id: "hetpark", label: "Het Park", short: "Het Park", laag: "Optreden" },
  { id: "pakhuis", label: "Het Pakhuis", short: "Het Pakhuis", laag: "Optreden" },
  { id: "inhoorn", label: "inHoorn", short: "inHoorn", laag: "Verzameling" },
  { id: "uitagenda", label: "Uitagenda", short: "Uitagenda", laag: "Verzameling" },
  { id: "bibliotheek", label: "Bibliotheek", short: "Bibliotheek", laag: "Reeks" },
  { id: "valk", label: "Van der Valk", short: "Van der Valk", laag: "Optreden" },
  { id: "huisverloren", label: "Huisverloren", short: "Huisverloren", laag: "Optreden" },
  { id: "swaf", label: "SWAF", short: "SWAF", laag: "Optreden" },
  { id: "popronde", label: "Popronde", short: "Popronde", laag: "Festival" },
  { id: "kamermuziek", label: "Kamermuziek", short: "Kamermuziek", laag: "Festival" },
  { id: "oosterkerk", label: "Oosterkerk", short: "Oosterkerk", laag: "Optreden" },
  { id: "cinema", label: "Cinema", short: "Cinema", laag: "Festival" },
  { id: "vue", label: "Vue Hoorn", short: "Vue", laag: "Optreden" },
];

const KNH_API = "https://komnaarhoorn.nl/wp-json/agenda/v1/items";
const MANIFESTO_FEED = "https://manifesto-hoorn.nl/upcoming_productions";
const NETWERK_BASE = "https://netwerkhoorn.nl/activiteiten";
const IBABS_BASE = "https://hoorn.bestuurlijkeinformatie.nl";
const INHOORN_AGENDA = "https://www.inhoorn.nl/agenda/";
const UITAGENDA = "https://westfrieseuitagenda.nl/agenda/";
const BIBLIOTHEEK_FEED = "https://www.bibliotheekhoorn.nl/doen/Agenda.atom";
const VALK_AGENDA = "https://www.hotelhoorn.com/evenementen";
const HETPARK_FEED = "https://hetpark.nl/event_feed_json";
const HUISVERLOREN_AGENDA = "https://www.huisverloren.nl/agenda/";
const SWAF_EVENTS = "https://swaf.nl/wp-json/wp/v2/event?per_page=50";
const POPRONDE_HOORN = "https://popronde.nl/steden/hoorn";
const KAMERMUZIEK = "https://www.kamermuziekfestivalhoorn.nl/";
const OOSTERKERK_ICS = "https://www.oosterkerkhoorn.nl/activiteiten/?ical=1";
const PAKHUIS_API = "https://www.pakhuishoorn.nl/wp-json/tribe/events/v1/events";
const CINEMA_FESTIVALS = "https://cinemaoostereiland.nl/wp-json/wp/v2/festivals?per_page=20";
const VUE_DATES =
  "https://www.vuecinemas.nl/api/microservice/showings/showingDates?cinemaId=1023&minEmbargoLevel=2&forNextWeek=true";
const VUE_HOME = "https://www.vuecinemas.nl/cinema/hoorn/nu-in-de-bioscoop";

const VALK_MONTHS = {
  jan: 0,
  feb: 1,
  mrt: 2,
  mar: 2,
  apr: 3,
  mei: 4,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  sept: 8,
  okt: 9,
  oct: 9,
  nov: 10,
  dec: 11,
  dic: 11,
};

const HOORN_PLACE =
  /hoorn|oostereiland|schouwburg|\bhet park\b|manifesto|van der valk|bibliotheek|netwerk|kersenboogerd|risdam|zwaag|blokker/i;

const MONTHS = {
  jan: 0,
  januari: 0,
  feb: 1,
  februari: 1,
  mrt: 2,
  maart: 2,
  apr: 3,
  april: 3,
  mei: 4,
  jun: 5,
  juni: 5,
  jul: 6,
  juli: 6,
  aug: 7,
  augustus: 7,
  sep: 8,
  sept: 8,
  september: 8,
  okt: 9,
  oktober: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

export function unescapeHtml(value) {
  return String(value || "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .replace(/&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&nbsp;/gi, " ")
    .replace(/&hellip;/gi, "…")
    .replace(/&amp;/gi, "&");
}

export function clean(html) {
  const withoutCdata = String(html || "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  return unescapeHtml(withoutCdata.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

export function parseDutchDate(text) {
  if (!text) return "";
  const normalized = unescapeHtml(text).toLowerCase().replace(/\./g, "");
  const match = normalized.match(
    /(?:(?:ma|di|wo|do|vr|za|zo)\s+)?(\d{1,2})\s+(januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december|jan|feb|mrt|apr|jun|jul|aug|sep|sept|okt|nov|dec)\s+'?(\d{2,4})/i
  );
  if (!match) return "";
  let year = Number(match[3]);
  if (year < 100) year += 2000;
  const month = MONTHS[match[2].toLowerCase()];
  if (month == null) return "";
  const day = Number(match[1]);
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function priceFromCents(cents) {
  const value = Number(cents);
  if (!Number.isFinite(value) || value < 0) return "";
  if (value === 0) return "Gratis";
  const euros = Math.floor(value / 100);
  const rest = String(value % 100).padStart(2, "0");
  return rest === "00" ? `€${euros}` : `€${euros},${rest}`;
}

export function priceFromText(text) {
  const source = unescapeHtml(text || "");
  if (/\bgratis\b/i.test(source)) return "Gratis";
  const match = source.match(/€\s*(\d{1,4})(?:[,.](\d{1,2}))?/);
  if (!match) return "";
  const cents = (match[2] || "00").padEnd(2, "0").slice(0, 2);
  return cents === "00" ? `€${Number(match[1])}` : `€${Number(match[1])},${cents}`;
}

export function parseAgendaWhen(text) {
  const source = unescapeHtml(text || "");
  let startDate = parseDutchDate(source);
  if (!startDate) {
    const match = source
      .toLowerCase()
      .replace(/\./g, "")
      .match(
        /(\d{1,2})\s+(januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december|jan|feb|mrt|apr|jun|jul|aug|sep|sept|okt|nov|dec)/i
      );
    if (match) {
      const month = MONTHS[match[2].toLowerCase()];
      const day = Number(match[1]);
      if (month != null) {
        const now = new Date();
        let year = now.getFullYear();
        const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        startDate = iso < todayIso() ? `${year + 1}-${iso.slice(5)}` : iso;
      }
    }
  }
  const range = source.match(/van\s+(\d{1,2}:\d{2})\s+tot\s+(\d{1,2}:\d{2})/i);
  const vanaf = source.match(/(?:vanaf|om)\s+(\d{1,2}:\d{2})/i);
  return {
    startDate,
    startTime: range?.[1] || vanaf?.[1] || "",
    endTime: range?.[2] || "",
  };
}

function eventRow(fields) {
  return {
    id: fields.id,
    title: fields.title,
    link: fields.link,
    location: fields.location || "",
    description: (fields.description || "").slice(0, 420),
    startDate: fields.startDate || "",
    endDate: "",
    startTime: fields.startTime || "",
    endTime: fields.endTime || "",
    sourceId: fields.sourceId,
    sourceLabel: fields.sourceLabel,
    categories: fields.categories || [],
    price: fields.price || "",
    audience: fields.audience || "",
    meetingTitle: fields.meetingTitle || "",
    repeat: fields.repeat || "",
  };
}

function matchAll(text, regex) {
  const flags = regex.flags.includes("g") ? regex.flags : `${regex.flags}g`;
  const global = new RegExp(regex.source, flags);
  return [...text.matchAll(global)];
}

export function parseKnhHtml(html, kidsLinks) {
  const events = [];
  for (const art of matchAll(
    html,
    /<article[^>]*class="[^"]*agenda-item[^"]*"([^>]*)>([\s\S]*?)<\/article>/gi
  )) {
    const block = art[0];
    const linkMatch = block.match(/<a[^>]+href="([^"]+)"/);
    if (!linkMatch) continue;
    const link = linkMatch[1].replace(/\\\//g, "/");
    const titleAttr = block.match(/title="Bekijk evenement:\s*([^"]+)"/);
    const heading = block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
    const title = clean(titleAttr ? titleAttr[1] : heading ? heading[1] : "Evenement");
    const loc = block.match(/ti-map-pin[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/);
    const desc = block.match(
      /class="[^"]*(?:line-clamp-3|prose-sm)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|p)>/
    );
    const dates = [...block.matchAll(/datetime="(\d{4}-\d{2}-\d{2})"/g)].map((m) => m[1]);
    const times = [...block.matchAll(/datetime="(\d{1,2}:\d{2})"/g)].map((m) => m[1]);
    const bare = link.split("?")[0];
    events.push(
      eventRow({
        id: `knh-${bare}`,
        title,
        link: bare,
        location: loc ? clean(loc[1]) : "",
        description: desc ? clean(desc[1]) : "",
        startDate: dates[0] || "",
        startTime: times[0] || "",
        endTime: times[1] || "",
        sourceId: "komnaarhoorn",
        sourceLabel: "Kom naar Hoorn",
        categories: kidsLinks.has(bare) ? ["voor-kinderen"] : [],
        price: priceFromText(`${title} ${desc ? desc[1] : ""}`),
      })
    );
  }
  return events;
}

export function parseManifestoRss(xml) {
  const stripped = xml.replace(/\sxmlns="[^"]+"/, "");
  const events = [];
  for (const item of matchAll(stripped, /<item>([\s\S]*?)<\/item>/gi)) {
    const block = item[1];
    const title = clean(block.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "Concert");
    const link = clean(block.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "");
    if (!link) continue;
    const shortText = clean(block.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "");
    const longText = clean(block.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/i)?.[1] || "");
    const description = longText || shortText;
    events.push(
      eventRow({
        id: `manifesto-${link}`,
        title,
        link,
        location: "Manifesto Hoorn",
        description,
        startDate: parseDutchDate(shortText) || parseDutchDate(longText) || parseDutchDate(title),
        sourceId: "manifesto",
        sourceLabel: "Manifesto",
        categories: ["muziek"],
        price: priceFromText(`${title} ${description}`),
      })
    );
  }
  return events;
}

export function parseNetwerkHtml(html, audience = "") {
  const events = [];
  for (const match of matchAll(
    html,
    /<a href="(https?:\/\/netwerkhoorn\.nl\/activiteit\/[^"]+|\/?activiteit\/[^"]+)"[^>]*class="row"[^>]*>([\s\S]*?)<\/a>/gi
  )) {
    const href = match[1];
    const block = match[2];
    const titleMatch = block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    if (!titleMatch) continue;
    const title = clean(titleMatch[1]);
    if (!title) continue;
    const link = href.startsWith("http") ? href : `https://netwerkhoorn.nl${href}`;
    const loc = block.match(
      /<strong>\s*Locatie\s*<\/strong>\s*([\s\S]*?)(?:<strong>|<\/span>)/i
    );
    const dateMatch =
      block.match(/<strong>\s*Datum\s*<\/strong>\s*([\s\S]*?)(?:<strong>|<\/span>)/i) ||
      block.match(/class="date"[^>]*>([\s\S]*?)(?:Inschrijving|<strong>|<\/span>)/i);
    const start = parseDutchDate(dateMatch ? dateMatch[1] : "");
    const hint = clean(block);
    const listedAudience = clean((block.match(/<\/h3>([\s\S]*?)<\/span>/i) || [])[1] || "");
    const who = [audience, listedAudience].filter(Boolean).join(", ");
    const kids =
      Boolean(audience) || /jongeren|kids|kind|jeugd|peuter|tiener/i.test(`${hint} ${who}`);
    events.push(
      eventRow({
        id: `netwerk-${link}-${start || title}`,
        title,
        link,
        location: loc ? clean(loc[1]) : "Netwerk Hoorn",
        description: who ? `Netwerk Hoorn · ${who}` : "Netwerk Hoorn",
        startDate: start,
        sourceId: "netwerk",
        sourceLabel: "Stichting Netwerk",
        categories: kids ? ["voor-kinderen"] : ["creatief"],
        price: priceFromText(hint),
        audience: who,
      })
    );
  }
  return events;
}

export function parseRaadMonth(html) {
  const meetings = [];
  for (const match of matchAll(
    html,
    /<a href="(\/Agenda\/Index\/([^"]+))"[^>]*class="calendar-item[^"]*"[\s\S]*?<\/a>/gi
  )) {
    const block = match[0];
    const href = match[1];
    const meetingId = match[2];
    const sr = block.match(/class="sr-only">\s*([^<]+)/);
    const label = block.match(/calendar-item-label">([\s\S]*?)<\/div>/);
    const timeEl = block.match(/calendar-item-time">\s*([^<]+)/);
    const subtitle = block.match(/calendar-item-subtitle">\s*([^<]+)/);
    const loc = block.match(/calendar-item-location">\s*\(([^)]+)\)/);
    let labelText = label ? clean(label[1]) : "";
    if (subtitle) {
      const sub = unescapeHtml(subtitle[1].trim());
      if (!labelText || labelText.startsWith("(") || labelText.length < 3) labelText = sub;
    }
    const start = parseDutchDate(sr ? sr[1] : "");
    if (!start) continue;
    const time = (timeEl?.[1] || "").match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
    const title = labelText.replace(/\s*\([^)]*\)\s*/g, " ").trim() || "Vergadering";
    meetings.push({
      meetingId,
      meetingTitle: title,
      link: `${IBABS_BASE}${href}`,
      location: loc ? loc[1] : "Raadzaal",
      startDate: start,
      startTime: time ? time[1] : "",
      endTime: time ? time[2] : "",
    });
  }
  return meetings;
}

export function parseRaadItems(page, meeting) {
  const events = [];
  const pattern =
    /<div class="panel panel-default agenda-item"\s+id="([^"]+)"\s*>([\s\S]*?)(?=<div class="panel panel-default agenda-item"|$)/g;
  for (const match of page.matchAll(pattern)) {
    const itemId = match[1];
    const block = match[2];
    if (block.includes('class="agenda-link') && !block.slice(0, 800).includes("panel-id")) break;
    const numberEl = block.match(/<div class="panel-id">\s*([^<]+?)\s*<\/div>/);
    const label = block.match(
      /<span class="panel-title-label"[^>]*>\s*([\s\S]*?)\s*<\/span>/
    );
    if (!label) continue;
    const title = clean(label[1]);
    if (!title) continue;
    const number = numberEl ? clean(numberEl[1]) : "";
    const body = block.match(
      /<div class="panel-collapse[\s\S]*?<div class="panel-body[^"]*">([\s\S]*?)<\/div>/
    );
    let description = body ? clean(body[1]) : "";
    description = description.replace(/\b\d+\s*[KM]B\b/gi, "").replace(/\s+/g, " ").trim();
    if (!description) {
      description = `${meeting.meetingTitle} · agendapunt ${number}`.trim();
    }
    events.push(
      eventRow({
        id: `raad-${meeting.meetingId}-${itemId}`,
        title: number ? `${number}. ${title}` : title,
        link: `${meeting.link}#${itemId}`,
        location: meeting.location,
        description: description.slice(0, 420),
        startDate: meeting.startDate,
        startTime: meeting.startTime,
        endTime: meeting.endTime,
        sourceId: "raad",
        sourceLabel: "Gemeente",
        categories: ["raad"],
        meetingTitle: meeting.meetingTitle,
      })
    );
  }
  return events;
}

function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function upcomingMonths(count = 4) {
  const now = new Date();
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    out.push({ year: date.getFullYear(), month: date.getMonth() });
  }
  return out;
}

const TITLE_FILLER =
  /\b(de|het|een|van|met|voor|en|the|in|op|te|aan|bij|door|naar|uit|tot|hoorn|com|amp)\b/g;

function titleTokens(title) {
  return unescapeHtml(title || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(TITLE_FILLER, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function placesConflict(a, b) {
  const words = (event) =>
    new Set(titleTokens(event.location).filter((word) => !["noord", "holland", "centrum"].includes(word)));
  const left = words(a);
  const right = words(b);
  if (!left.size || !right.size) return false;
  for (const word of left) {
    if (right.has(word)) return false;
  }
  return true;
}

function sameEvent(a, b) {
  if (a.startDate && b.startDate && a.startDate !== b.startDate) return false;
  if (!a.startDate || !b.startDate) {
    return Boolean(a.startDate) === Boolean(b.startDate) && titleTokens(a.title).join(" ") === titleTokens(b.title).join(" ");
  }
  if (placesConflict(a, b)) return false;
  const left = new Set(titleTokens(a.title));
  const right = new Set(titleTokens(b.title));
  if (!left.size || !right.size) return false;
  let shared = 0;
  for (const word of left) {
    if (right.has(word)) shared += 1;
  }
  const smaller = Math.min(left.size, right.size);
  const larger = Math.max(left.size, right.size);
  if (shared === smaller && shared === larger && shared >= 1) return true;
  if (smaller >= 2 && shared === smaller && shared / larger >= 0.5) return true;
  return smaller >= 3 && shared / smaller >= 0.75;
}

function locationRank(location) {
  const text = String(location || "").replace(/\s+/g, " ").trim();
  if (!text || /^(hoorn|netwerk hoorn|stad|locatie|agenda)$/i.test(text)) return 0;
  if (/^(het park|manifesto|manifesto hoorn|bibliotheek hoorn|schouwburg het park)$/i.test(text)) return 1;
  return 2;
}

function descriptionRank(description) {
  const text = String(description || "").replace(/\s+/g, " ").trim();
  if (!text) return 0;
  if (/^(netwerk hoorn|westfriese uitagenda|het park|manifesto|bibliotheek hoorn|stichting netwerk)(?:\s·.*)?$/i.test(text)) return 1;
  return 10 + text.length;
}

function mergeEvent(kept, item) {
  if (!kept.sources) kept.sources = [{ id: kept.sourceId, label: kept.sourceLabel }];
  if (!kept.sources.some((source) => source.id === item.sourceId)) {
    kept.sources.push({ id: item.sourceId, label: item.sourceLabel });
  }
  if (!kept.categories) kept.categories = [];
  for (const category of item.categories || []) {
    if (!kept.categories.includes(category)) kept.categories.push(category);
  }
  if (!kept.price && item.price) kept.price = item.price;
  if (descriptionRank(item.description) > descriptionRank(kept.description)) kept.description = item.description;
  if (locationRank(item.location) > locationRank(kept.location)) kept.location = item.location;
  if (locationRank(item.location) === locationRank(kept.location) && (item.location || "").length > (kept.location || "").length) {
    kept.location = item.location;
  }
  if ((item.startTime || "") && !kept.startTime) {
    kept.startTime = item.startTime;
    kept.endTime = item.endTime || "";
  }
  if (!kept.audience && item.audience) kept.audience = item.audience;
  if (item.repeat === "Wekelijks" || (!kept.repeat && item.repeat)) kept.repeat = item.repeat;
  if (titleTokens(item.title).length > titleTokens(kept.title).length) {
    kept.title = item.title;
    if (item.link) kept.link = item.link;
  }
}

export function dedupeEvents(items) {
  const sorted = [...items].sort((a, b) => (a.startDate || "9999").localeCompare(b.startDate || "9999"));
  const out = [];
  for (const item of sorted) {
    const duplicate = out.find((kept) => sameEvent(kept, item));
    if (!duplicate) {
      out.push(item);
      continue;
    }
    mergeEvent(duplicate, item);
  }
  return out;
}

async function loadKnh(fetchText) {
  const kidsLinks = new Set();
  for (let page = 1; page <= 4; page += 1) {
    const data = JSON.parse(
      await fetchText(`${KNH_API}?page=${page}&dateRange=this_year&categories=voor-kinderen`)
    );
    for (const match of String(data.html || "").matchAll(/<a[^>]+href="([^"]+)"/g)) {
      kidsLinks.add(match[1].replace(/\\\//g, "/").split("?")[0]);
    }
    if (page >= Number(data.totalPages || 1)) break;
  }

  const events = [];
  for (let page = 1; page <= 6; page += 1) {
    const data = JSON.parse(
      await fetchText(`${KNH_API}?page=${page}&dateRange=this_year`)
    );
    events.push(...parseKnhHtml(data.html || "", kidsLinks));
    if (page >= Number(data.totalPages || 1)) break;
  }
  return events;
}

async function loadManifesto(fetchText) {
  const events = parseManifestoRss(await fetchText(MANIFESTO_FEED));
  await mapPool(
    events.filter((event) => !event.startTime && /manifesto-hoorn\.nl\/productie\//.test(event.link || "")),
    4,
    async (event) => {
      try {
        const detail = parseManifestoDetail(await fetchText(event.link));
        if (detail.startTime) event.startTime = detail.startTime;
        if (!event.price && detail.price) event.price = detail.price;
      } catch {
        // De RSS-tekst blijft staan als de productiepagina faalt.
      }
    }
  );
  return events;
}

export function parseManifestoDetail(html) {
  const text = clean(html);
  const schedule = text.match(/Tijdschema([\s\S]{0,220})/i);
  const chunk = schedule ? schedule[1] : text.slice(0, 700);
  const times = [...chunk.matchAll(/\b(\d{1,2}:\d{2})\b/g)].map((match) => match[1]);
  const doors = chunk.match(/(\d{1,2}:\d{2})\s+Deuren/i);
  const startTime = doors ? times.find((time) => time !== doors[1]) || doors[1] : times[0] || "";
  return { startTime, price: priceFromText(text) };
}

export function repeatFromDates(dates) {
  const unique = [...new Set(dates.filter(Boolean))].sort();
  if (unique.length < 3) return "";
  const gaps = [];
  for (let index = 1; index < unique.length; index += 1) {
    const previous = new Date(`${unique[index - 1]}T12:00:00`);
    const current = new Date(`${unique[index]}T12:00:00`);
    gaps.push(Math.round((current - previous) / 86400000));
  }
  const share = (min, max) => gaps.filter((gap) => gap >= min && gap <= max).length / gaps.length;
  if (share(6, 8) >= 0.6) return "Wekelijks";
  if (share(26, 35) >= 0.6) return "Maandelijks";
  return "";
}

export function parseNetwerkDetail(html) {
  const audience = clean((html.match(/Doelgroep:<\/strong><br>([\s\S]*?)<\/div>/i) || [])[1] || "");
  const description = clean(
    (html.match(/<meta name=['"]description['"] content=['"]([\s\S]*?)['"]/i) || [])[1] || ""
  );
  const slots = [];
  for (const row of matchAll(
    html,
    /<tr[^>]*>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>/gi
  )) {
    const date = parseDutchDate(row[1]);
    if (!date) continue;
    slots.push({ date, start: clean(row[2]), end: clean(row[3]) });
  }
  return {
    audience,
    description,
    slots,
    repeat: repeatFromDates(slots.map((slot) => slot.date)),
  };
}

function applyNetwerkDetail(event, detail) {
  if (detail.audience) event.audience = detail.audience;
  if (detail.description && detail.description.length > (event.description || "").length) {
    event.description = detail.description.slice(0, 420);
  }
  if (detail.repeat) event.repeat = detail.repeat;
  const upcoming = detail.slots.filter((slot) => slot.date >= (event.startDate || todayIso()));
  const slot = upcoming[0];
  if (slot?.start && !event.startTime) {
    event.startTime = slot.start;
    event.endTime = slot.end || "";
  }
}

async function mapPool(items, limit, worker) {
  let next = 0;
  async function run() {
    while (next < items.length) {
      const index = next;
      next += 1;
      await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => run()));
}

async function loadNetwerk(fetchText) {
  const events = [];
  for (let page = 1; page <= 4; page += 1) {
    const html = await fetchText(`${NETWERK_BASE}?page=${page}`);
    const batch = parseNetwerkHtml(html);
    if (!batch.length) break;
    events.push(...batch);
  }
  for (const group of ["Jeugd", "Jongeren", "Peuters"]) {
    const html = await fetchText(
      `${NETWERK_BASE}?${new URLSearchParams({ forWhoGroup: group, page: "1" })}`
    );
    events.push(...parseNetwerkHtml(html, group));
  }
  const byLink = new Map();
  for (const event of events) {
    if (!byLink.has(event.link)) byLink.set(event.link, []);
    byLink.get(event.link).push(event);
  }
  await mapPool([...byLink.keys()], 6, async (link) => {
    try {
      const detail = parseNetwerkDetail(await fetchText(link));
      for (const event of byLink.get(link)) applyNetwerkDetail(event, detail);
    } catch {
      // De lijstpagina blijft geldig als een detailpagina faalt.
    }
  });
  return events;
}

async function loadRaad(fetchText) {
  const today = todayIso();
  const meetings = [];
  const seen = new Set();
  for (const { year, month } of upcomingMonths(4)) {
    const html = await fetchText(`${IBABS_BASE}/Calendar/GetMonthAgendas?year=${year}&month=${month}`);
    for (const meeting of parseRaadMonth(html)) {
      if (seen.has(meeting.meetingId) || meeting.startDate < today) continue;
      seen.add(meeting.meetingId);
      meetings.push(meeting);
    }
  }
  meetings.sort((a, b) => a.startDate.localeCompare(b.startDate) || a.startTime.localeCompare(b.startTime));

  const events = [];
  for (const meeting of meetings.slice(0, 8)) {
    const page = await fetchText(meeting.link);
    const items = parseRaadItems(page, meeting);
    if (items.length) {
      events.push(...items);
      continue;
    }
    events.push(
      eventRow({
        id: `raad-${meeting.meetingId}`,
        title: meeting.meetingTitle,
        link: meeting.link,
        location: meeting.location,
        description: "Agenda nog niet (volledig) gepubliceerd.",
        startDate: meeting.startDate,
        startTime: meeting.startTime,
        endTime: meeting.endTime,
        sourceId: "raad",
        sourceLabel: "Gemeente",
        categories: ["raad"],
        meetingTitle: meeting.meetingTitle,
      })
    );
  }
  return events;
}

export function parseInhoornHtml(html) {
  const events = [];
  for (const part of html.split("<!-- Item-->").slice(1)) {
    const link = part.match(/href="(https:\/\/www\.inhoorn\.nl\/agenda-item\/[^"]+)"/)?.[1];
    const heading = part.match(/<h3>([\s\S]*?)<\/h3>/)?.[1] || "";
    const title = clean(heading.replace(/<span>[\s\S]*?<\/span>/gi, ""));
    if (!link || !title) continue;
    const location = clean(part.match(/<p>([\s\S]*?)<\/p>/)?.[1] || "Hoorn");
    const when = parseAgendaWhen(clean(part.match(/class="price">([\s\S]*?)<\/div>/)?.[1] || ""));
    events.push(
      eventRow({
        id: `inhoorn-${link}`,
        title,
        link,
        location,
        description: "inHoorn",
        startDate: when.startDate,
        startTime: when.startTime,
        endTime: when.endTime,
        sourceId: "inhoorn",
        sourceLabel: "inHoorn",
        categories: ["uitgaan"],
        price: priceFromText(part),
      })
    );
  }
  return events;
}

export function parseUitagendaHtml(html) {
  const events = [];
  for (const part of html.split('<div class="card event-card h-100">').slice(1)) {
    const block = part.split('class="col-lg-4')[0];
    const link = block.match(/href="(https:\/\/westfrieseuitagenda\.nl\/agenda\/[^"]+)"/)?.[1];
    const title = clean(block.match(/class="card-title[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/)?.[1] || "");
    if (!link || !title) continue;
    const whenText = clean(block.match(/fa-calendar-check[\s\S]*?<em>([\s\S]*?)<\/em>/)?.[1] || "");
    const location = clean(block.match(/fa-map-marker-alt[\s\S]*?<em>([\s\S]*?)<\/em>/)?.[1] || "");
    if (!HOORN_PLACE.test(`${location} ${title}`)) continue;
    const when = parseAgendaWhen(whenText);
    events.push(
      eventRow({
        id: `uitagenda-${link}`,
        title,
        link,
        location: location || "Hoorn",
        description: "Westfriese Uitagenda",
        startDate: when.startDate,
        startTime: when.startTime,
        endTime: when.endTime,
        sourceId: "uitagenda",
        sourceLabel: "Uitagenda",
        categories: ["uitgaan"],
        price: priceFromText(block),
      })
    );
  }
  return events;
}

export function parseBibliotheekAtom(xml) {
  const events = [];
  for (const match of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/gi)) {
    const block = match[1];
    const title = clean(block.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "");
    const link = block.match(/<link[^>]+href="([^"]+)"/)?.[1] || "";
    if (!title || !link) continue;
    const parts = clean(block.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] || "")
      .split("|")
      .map((part) => part.trim())
      .filter(Boolean);
    const when = parseAgendaWhen(parts[0] || "");
    const location = parts.find((part) => /bibliotheek|straat|plein|weg|centrum/i.test(part)) || "Bibliotheek Hoorn";
    const description = parts.filter((part) => part !== parts[0] && part !== location).join(" · ");
    events.push(
      eventRow({
        id: `bibliotheek-${link}`,
        title,
        link,
        location,
        description,
        startDate: when.startDate,
        startTime: when.startTime,
        endTime: when.endTime,
        sourceId: "bibliotheek",
        sourceLabel: "Bibliotheek",
        categories: [],
        price: priceFromText(parts.join(" ")),
      })
    );
  }
  return events;
}

export function parseInhoornDetail(html) {
  const start = html.match(/Starttijd:\s*\d{1,2}-\d{1,2}-\d{4}\s+(\d{1,2}:\d{2})/i);
  const end = html.match(/Eindtijd:\s*\d{1,2}-\d{1,2}-\d{4}\s+(\d{1,2}:\d{2})/i);
  const priceLine = clean(html.match(/Prijs:\s*([^<]*)/i)?.[1] || "");
  const description = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
    .map((match) => clean(match[1]))
    .find((paragraph) => paragraph.length > 80);
  return {
    description: description || "",
    startTime: start?.[1] || "",
    endTime: end?.[1] || "",
    price: priceFromText(priceLine),
  };
}

async function loadInhoorn(fetchText) {
  const events = [];
  for (let page = 1; page <= 4; page += 1) {
    const url = page === 1 ? INHOORN_AGENDA : `${INHOORN_AGENDA}page/${page}/`;
    const batch = parseInhoornHtml(await fetchText(url));
    if (!batch.length) break;
    events.push(...batch);
  }
  await mapPool(events, 4, async (event) => {
    try {
      const detail = parseInhoornDetail(await fetchText(event.link));
      if (detail.description) event.description = detail.description.slice(0, 420);
      if (detail.startTime && !event.startTime) event.startTime = detail.startTime;
      if (detail.endTime && !event.endTime) event.endTime = detail.endTime;
      if (detail.price) event.price = detail.price;
    } catch {
      // De agenda-regel blijft bruikbaar zonder de detailpagina.
    }
  });
  return events;
}

async function loadUitagenda(fetchText) {
  const events = [];
  for (let page = 0; page < 6; page += 1) {
    let html = "";
    try {
      html = await fetchText(`${UITAGENDA}?curP=${page}`);
    } catch {
      break;
    }
    if (!html.includes("event-card")) break;
    events.push(...parseUitagendaHtml(html));
  }
  await mapPool(events, 4, async (event) => {
    try {
      const detail = parseUitagendaDetail(await fetchText(event.link));
      if (detail.description) event.description = detail.description.slice(0, 420);
      if (detail.price) event.price = detail.price;
    } catch {
      // De kaart blijft bruikbaar zonder de detailpagina.
    }
  });
  return events;
}

export function parseUitagendaDetail(html) {
  const block = html.match(/class="wp-content-page event-description">([\s\S]*?)<\/div>/);
  const description = clean(block?.[1] || "");
  return { description, price: priceFromText(description) };
}

export function parseBibliotheekDetail(html) {
  const cost = clean(html).match(/Kosten:\s*([^.]{0,48})/i);
  return { price: cost ? priceFromText(cost[1]) : "" };
}

async function loadBibliotheek(fetchText) {
  const events = parseBibliotheekAtom(await fetchText(BIBLIOTHEEK_FEED));
  const today = todayIso();
  await mapPool(
    events.filter((event) => !event.price && event.link && (!event.startDate || event.startDate >= today)),
    6,
    async (event) => {
      try {
        const detail = parseBibliotheekDetail(await fetchText(event.link));
        if (detail.price) event.price = detail.price;
      } catch {
        // De agendaregel blijft bruikbaar zonder de kostenregel.
      }
    }
  );
  return events;
}

function parseValkDate(label) {
  const match = String(label || "").match(/(\d{1,2})\s+([a-z]{3,})\.?\s+(\d{4})/i);
  if (!match) return "";
  const month = VALK_MONTHS[match[2].toLowerCase()];
  if (month == null) return "";
  return `${match[3]}-${String(month + 1).padStart(2, "0")}-${String(Number(match[1])).padStart(2, "0")}`;
}

function valkPrices(html) {
  const prices = new Map();
  for (const match of html.matchAll(/"([^"\\]{3,90})","images":\[[\s\S]{0,2500}?"displayAmount":(\d+)/g)) {
    prices.set(unescapeHtml(match[1]).trim().toLowerCase(), priceFromCents(match[2]));
  }
  return prices;
}

function huisverlorenPrice(item) {
  const cents = (item.ticketGroups || [])
    .map((group) => Number(group.priceInCents))
    .filter((value) => Number.isFinite(value) && value >= 0);
  if (!cents.length) return priceFromText(`${item.name} ${item.textHtml || ""}`);
  return priceFromCents(Math.min(...cents));
}

export function parseValkHtml(html) {
  const prices = valkPrices(html);
  const labels = [...html.matchAll(/aria-label="([^"]+)"/g)]
    .map((match) => unescapeHtml(match[1]).trim())
    .filter((label) => label && !/^(tab navigation|\d+ van \d+)$/i.test(label));
  const hrefs = [...html.matchAll(/href="(\/evenementen\/[^"]+)"/g)].map((match) => match[1]);
  const events = [];
  let hrefIndex = 0;
  for (let index = 0; index < labels.length; index += 1) {
    const label = labels[index];
    if (/^\d{1,2}\s+[a-z]{3,}\.?\s+\d{4}/i.test(label) || /^\d{1,2}:\d{2}/.test(label)) continue;
    if (/^verschillende dagen$/i.test(label)) continue;
    const dateLabel = labels[index + 1] || "";
    const startDate = parseValkDate(dateLabel);
    if (!startDate) continue;
    const timeLabel = [labels[index + 2], labels[index + 3]].find((item) =>
      /^\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}$/.test(item || "")
    );
    const times = timeLabel?.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
    const href = hrefs[hrefIndex];
    hrefIndex += 1;
    if (!href) continue;
    events.push(
      eventRow({
        id: `valk-${href}`,
        title: label,
        link: `https://www.hotelhoorn.com${href}`,
        location: "Van der Valk Hotel Hoorn",
        description: "Diner, show of feest bij Van der Valk.",
        startDate,
        startTime: times?.[1] || "",
        endTime: times?.[2] || "",
        sourceId: "valk",
        sourceLabel: "Van der Valk",
        categories: ["eten"],
        price: prices.get(label.toLowerCase()) || "",
      })
    );
  }
  return events;
}

async function loadValk(fetchText) {
  return parseValkHtml(await fetchText(VALK_AGENDA));
}

function parkGenreLabels(tags) {
  const genre = tags?.genre;
  if (!genre || typeof genre !== "object") return [];
  return Object.values(genre).map((label) => clean(String(label))).filter(Boolean);
}

function parkCategories(labels) {
  const text = labels.join(" ");
  const cats = [];
  const add = (label) => {
    if (label && !cats.includes(label)) cats.push(label);
  };
  if (/cabaret/i.test(text)) add("cabaret");
  if (/musical/i.test(text)) add("musical");
  if (/opera/i.test(text)) add("opera");
  if (/toneel|theater/i.test(text)) add("toneel");
  if (/klassiek/i.test(text)) add("klassiek");
  if (/dans/i.test(text)) add("dans");
  if (/workshop|cursus/i.test(text)) add("workshop");
  if (/inleiding/i.test(text)) add("lezing");
  if (/beurs/i.test(text)) add("beurs");
  if (/jeugd|familie/i.test(text)) add("voor-kinderen");
  if (!cats.length) add(labels[0] || "uitgaan");
  return cats;
}

export function parseHetParkFeed(data) {
  const events = [];
  const items = Array.isArray(data?.events) ? data.events : Object.values(data?.events || {});
  for (const item of items) {
    const title = clean(item.title || "");
    const link = item.permalink || "";
    if (!title || !link.includes("hetpark.nl")) continue;
    const slots = Array.isArray(item.times) && item.times.length ? item.times : [{}];
    slots.forEach((slot, index) => {
      const startIso = slot.program_start_iso || item.dates?.release_iso || item.date_range_iso?.[0] || "";
      const endIso = slot.program_end_iso || "";
      const startTime = startIso.slice(11, 16);
      const endTime = endIso.slice(11, 16);
      const cancelled = /geannuleerd/i.test(slot.status_label || "");
      const hall = slot.location ? Object.values(slot.location)[0] : "";
      const story = item.storyline && item.storyline !== false ? clean(String(item.storyline)) : "";
      const amount = String(slot.price || "").replace(",", ".");
      const genres = parkGenreLabels(item.tags);
      const genreText = genres.join(" ");
      events.push(
        eventRow({
          id: `hetpark-${item.post_id || link}-${index}`,
          title,
          link,
          location: hall ? `Schouwburg Het Park · ${clean(hall)}` : "Schouwburg Het Park",
          description: [cancelled ? "Geannuleerd" : "", story].filter(Boolean).join(" · "),
          startDate: startIso.slice(0, 10),
          startTime,
          endTime: endTime && endTime !== startTime ? endTime : "",
          sourceId: "hetpark",
          sourceLabel: "Het Park",
          categories: parkCategories(genres),
          audience: /familie/i.test(genreText) ? "Alle leeftijden" : /\bjeugd\b/i.test(genreText) ? "Kind" : "",
          price: cancelled || slot.price == null || slot.price === "" || slot.price === false ? "" : euroAmount(amount),
        })
      );
    });
  }
  return events;
}

async function loadHetPark(fetchText) {
  return parseHetParkFeed(JSON.parse(await fetchText(HETPARK_FEED)));
}

function euroAmount(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "";
  const cents = Math.round(number * 100);
  const euros = Math.floor(cents / 100);
  const rest = String(cents % 100).padStart(2, "0");
  return rest === "00" ? `€${euros}` : `€${euros},${rest}`;
}

export function parsePakhuisEvents(data) {
  const events = [];
  for (const item of data?.events || []) {
    if (item.status && item.status !== "publish") continue;
    if (item.hide_from_listings) continue;
    const title = clean(item.title || "");
    const link = item.url || "https://www.pakhuishoorn.nl/voorstellingen/";
    if (!title) continue;
    const start = String(item.start_date || "");
    const end = String(item.end_date || "");
    const startTime = start.slice(11, 16);
    const endTime = end.slice(11, 16);
    const amounts = (item.cost_details?.values || []).map(Number).filter((value) => value > 0);
    let price = "";
    if (amounts.length) {
      const low = Math.min(...amounts);
      const high = Math.max(...amounts);
      price = low === high ? euroAmount(low) : `${euroAmount(low)}–${euroAmount(high)}`;
    } else {
      price = priceFromText(item.cost || "");
    }
    events.push(
      eventRow({
        id: `pakhuis-${item.id || link}`,
        title,
        link,
        location: clean(item.venue?.venue || "") || "Theater Het Pakhuis",
        description: clean(item.description || item.excerpt || ""),
        startDate: start.slice(0, 10),
        startTime: item.all_day ? "" : startTime,
        endTime: !item.all_day && endTime && endTime !== startTime ? endTime : "",
        sourceId: "pakhuis",
        sourceLabel: "Het Pakhuis",
        categories: ["uitgaan"],
        price,
      })
    );
  }
  return events;
}

async function loadPakhuis(fetchText) {
  const url = `${PAKHUIS_API}?${new URLSearchParams({ per_page: "50", start_date: todayIso() })}`;
  return parsePakhuisEvents(JSON.parse(await fetchText(url)));
}

export function parseHuisverlorenHtml(html) {
  const events = [];
  for (const match of html.matchAll(/<script class="args" type="application\/json">([\s\S]*?)<\/script>/g)) {
    let data;
    try {
      data = JSON.parse(match[1]);
    } catch {
      continue;
    }
    if (!Array.isArray(data.events)) continue;
    for (const item of data.events) {
      if (item.status && item.status !== "CONFIRMED") continue;
      const start = String(item.programStartAt || "");
      const end = String(item.programEndAt || "");
      const place = item.location || {};
      const location = [place.name, place.city].filter(Boolean).join(", ").replace(/\s+,/g, ",").trim();
      events.push(
        eventRow({
          id: `huisverloren-${item.id}`,
          title: clean(item.name || "Evenement"),
          link: item.shopUrl || HUISVERLOREN_AGENDA,
          location: location || "Huisverloren, Hoorn",
          description: clean(item.textHtml || item.subtitle || item.type || "Huisverloren"),
          startDate: start.slice(0, 10),
          startTime: start.slice(11, 16),
          endTime: end.slice(11, 16),
          sourceId: "huisverloren",
          sourceLabel: "Huisverloren",
          categories: /workshop|proeverij|diner/i.test(`${item.type} ${item.name}`) ? ["eten"] : ["uitgaan"],
          price: huisverlorenPrice(item),
        })
      );
    }
  }
  return events;
}

async function loadHuisverloren(fetchText) {
  return parseHuisverlorenHtml(await fetchText(HUISVERLOREN_AGENDA));
}

const PUB_PLACE =
  /beiaard|verloren|swaf|kroeg|caf[eé]|charlies|drietje|vi[eè]ra|barrels|backstage|\bjp\b|blue striker|the\s*80|koffielokaal/i;

export function parseSwafEventHtml(html, item) {
  const dateText = html.match(/vsel-meta-date[\s\S]*?<span>([\s\S]*?)<\/span>/)?.[1] || "";
  const timeText = clean(html.match(/vsel-meta-time[\s\S]*?<span>([\s\S]*?)<\/span>/)?.[1] || "");
  const times = timeText.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
  const single = timeText.match(/(\d{1,2}:\d{2})/);
  const description = clean(html.match(/class="vsel-text">([\s\S]*?)<\/div>/)?.[1] || "");
  const title = clean(item?.title?.rendered || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || "SWAF");
  return eventRow({
    id: `swaf-${item?.id || title}`,
    title,
    link: item?.link || "https://swaf.nl/agenda/",
    location: "Muziekcafé SWAF, Kerkstraat 3, Hoorn",
    description: description || "Optreden in muziekcafé SWAF.",
    startDate: parseDutchDate(dateText),
    startTime: times?.[1] || single?.[1] || "",
    endTime: times?.[2] || "",
    sourceId: "swaf",
    sourceLabel: "SWAF",
    categories: ["uitgaan"],
    price: priceFromText(`${title} ${description}`),
  });
}

async function loadSwaf(fetchText) {
  const payload = JSON.parse(await fetchText(SWAF_EVENTS));
  if (!Array.isArray(payload)) return [];
  const events = [];
  for (const item of payload) {
    if (!item?.link) continue;
    events.push(parseSwafEventHtml(await fetchText(item.link), item));
  }
  return events.filter((event) => event.startDate);
}

function jsString(value) {
  try {
    return JSON.parse(`"${value}"`);
  } catch {
    return value;
  }
}

function poprondeAddresses(html) {
  const addresses = new Map();
  for (const match of html.matchAll(/map_title:"([^"]+)",infowindow_html:"([^"]+)"/g)) {
    const name = clean(jsString(match[1]));
    const info = clean(jsString(match[2]));
    const address = info
      .replace(new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*`, "i"), "")
      .replace(/,?\s*Hoorn\s*$/i, "")
      .trim();
    if (name && address) addresses.set(name.toLowerCase(), address);
  }
  return addresses;
}

export function parsePoprondeProfile(html) {
  const description = clean(html.match(/name="description" content="([^"]*)"/)?.[1] || "");
  const genres = [
    ...html.matchAll(/badge rounded-pill bg-white text-black[^>]*>([\s\S]*?)<\/span>/g),
  ]
    .map((match) => clean(match[1]))
    .filter(Boolean);
  return { description, genres };
}

export function parsePoprondeHtml(html) {
  const dotted = html.match(/<h2[^>]*>\s*(\d{1,2})\.(\d{1,2})\.(\d{2,4})\s*<\/h2>/);
  if (!dotted) return [];
  let year = Number(dotted[3]);
  if (year < 100) year += 2000;
  const startDate = `${year}-${String(Number(dotted[2])).padStart(2, "0")}-${String(Number(dotted[1])).padStart(2, "0")}`;
  const addresses = poprondeAddresses(html);
  const events = [];
  let startTime = "";
  for (const match of html.matchAll(
    /<div class="row g-0 fw-bold">([\s\S]*?)<span class="pe-1 d-inline-block align-middle">([\s\S]*?)<\/span>/g
  )) {
    const block = match[1];
    const venue = clean(match[2]);
    const artist = clean(block.match(/<a[^>]*>([\s\S]*?)<\/a>/)?.[1] || "");
    const slot = clean(block.match(/class="col-1"[^>]*>([\s\S]*?)<\/div>/)?.[1] || "");
    if (/^\d{1,2}:\d{2}$/.test(slot)) startTime = slot;
    if (!artist || !venue) continue;
    const profile = block.match(/href="(\/profiel\/\d+)"/)?.[1];
    const address = addresses.get(venue.toLowerCase());
    events.push(
      eventRow({
        id: `popronde-${startDate}-${artist}-${venue}`,
        title: artist,
        link: profile ? `https://popronde.nl${profile}` : POPRONDE_HOORN,
        location: address ? `${venue}, ${address}, Hoorn` : `${venue}, Hoorn`,
        description: "",
        startDate,
        startTime,
        sourceId: "popronde",
        sourceLabel: "Popronde",
        categories: ["uitgaan"],
      })
    );
  }
  return events;
}

async function loadPopronde(fetchText) {
  const events = parsePoprondeHtml(await fetchText(POPRONDE_HOORN));
  const links = [...new Set(events.map((event) => event.link).filter((link) => link.includes("/profiel/")))];
  const profiles = new Map();
  const cacheKey = (link) => `web-agenda-popronde:${link}`;
  for (const link of links) {
    try {
      const saved = JSON.parse(globalThis.localStorage?.getItem(cacheKey(link)) || "null");
      if (saved?.profile && Date.now() - saved.at < 7 * 24 * 60 * 60 * 1000) profiles.set(link, saved.profile);
    } catch {
      // Geen bruikbare lokale kopie.
    }
  }
  async function readProfile(link) {
    if (profiles.has(link)) return;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const profile = parsePoprondeProfile(await fetchText(link));
        if (profile.description || profile.genres.length) {
          profiles.set(link, profile);
          try {
            globalThis.localStorage?.setItem(cacheKey(link), JSON.stringify({ at: Date.now(), profile }));
          } catch {
            // De volgende keer wordt het profiel opnieuw opgehaald.
          }
          break;
        }
      } catch {
        // Popronde antwoordt soms te druk; dan opnieuw proberen.
      }
      if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    await new Promise((resolve) => setTimeout(resolve, 600));
  }
  await mapPool(links, 1, readProfile);
  for (const event of events) {
    const profile = profiles.get(event.link);
    if (!profile) continue;
    const genres = profile.genres.filter((genre, index) => profile.genres.indexOf(genre) === index);
    if (genres.length) event.categories = ["uitgaan", ...genres];
    const description = [genres.join(", "), profile.description].filter(Boolean).join(". ");
    if (description) event.description = description.slice(0, 420);
  }
  return events;
}

export function parseKamermuziekEventHtml(html, url) {
  const title = clean(html.match(/tribe-events-single-event-title">([\s\S]*?)<\/h1>/)?.[1] || "");
  const startDate = html.match(/tribe-events-start-date[^>]*title="(\d{4}-\d{2}-\d{2})"/)?.[1] || "";
  const startTime = html.match(/tribe-event-date-start">[^<]*@\s*(\d{1,2}:\d{2})/)?.[1] || "";
  const endTime = html.match(/tribe-event-time">(\d{1,2}:\d{2})</)?.[1] || "";
  const location = clean(html.match(/tribe-venue">\s*([\s\S]*?)<\/li>/)?.[1] || "");
  if (!title || !startDate || !PUB_PLACE.test(`${title} ${location}`)) return null;
  const description = clean(html.match(/tribe-events-single-event-description[\s\S]*?<p>([\s\S]*?)<\/p>/)?.[1] || "");
  return eventRow({
    id: `kamermuziek-${url}`,
    title,
    link: url,
    location: location ? `${location}, Hoorn` : "Hoorn",
    description: description || "Kamermuziekfestival Hoorn",
    startDate,
    startTime,
    endTime,
    sourceId: "kamermuziek",
    sourceLabel: "Kamermuziek",
    categories: ["uitgaan"],
    price: priceFromText(`${description} ${html.match(/Kaarten[^<]{0,80}/)?.[0] || ""}`),
  });
}

function icsValue(block, name) {
  const unfolded = block.replace(/\r?\n[ \t]/g, "");
  const match = unfolded.match(new RegExp(`^${name}(?:;[^:\\r\\n]*)?:([^\\r\\n]*)$`, "mi"));
  if (!match) return "";
  return match[1]
    .replace(/\\n/gi, " ")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}

function icsStamp(value) {
  const digits = String(value || "").replace(/[^0-9T]/g, "");
  const date = digits.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!date) return { startDate: "", startTime: "" };
  const time = digits.match(/T(\d{2})(\d{2})/);
  return {
    startDate: `${date[1]}-${date[2]}-${date[3]}`,
    startTime: time ? `${time[1]}:${time[2]}` : "",
  };
}

export function parseIcs(text) {
  const events = [];
  for (const chunk of String(text || "").split("BEGIN:VEVENT").slice(1)) {
    const block = chunk.split("END:VEVENT")[0];
    const title = clean(icsValue(block, "SUMMARY"));
    const start = icsStamp(icsValue(block, "DTSTART"));
    if (!title || !start.startDate) continue;
    const end = icsStamp(icsValue(block, "DTEND"));
    const description = clean(icsValue(block, "DESCRIPTION"));
    const location = clean(icsValue(block, "LOCATION")) || "Oosterkerk, Grote Oost 58, Hoorn";
    events.push(
      eventRow({
        id: `oosterkerk-${icsValue(block, "UID") || title}`,
        title,
        link: icsValue(block, "URL") || "https://www.oosterkerkhoorn.nl/activiteiten/",
        location,
        description: description || "Oosterkerk Hoorn",
        startDate: start.startDate,
        startTime: start.startTime,
        endTime: end.startTime,
        sourceId: "oosterkerk",
        sourceLabel: "Oosterkerk",
        categories: ["uitgaan"],
        price: priceFromText(`${title} ${description}`),
      })
    );
  }
  return events;
}

async function loadOosterkerk(fetchText) {
  return parseIcs(await fetchText(OOSTERKERK_ICS));
}

function festivalStart(text) {
  const months =
    "januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december";
  const named = text.match(
    new RegExp(`van\\s+(?:[a-z]+\\s+)?(\\d{1,2})\\s+(${months})(?:\\s+(20\\d{2}))?`, "i")
  );
  if (named) return parseAgendaWhen(`${named[1]} ${named[2]} ${named[3] || ""}`).startDate;
  const loose = text.match(new RegExp(`van\\s+(\\d{1,2})\\s+(?:tot(?:\\s+en\\s+met)?|t/m)[\\s\\S]{0,40}?(${months})(?:\\s+(20\\d{2}))?`, "i"));
  if (loose) return parseAgendaWhen(`${loose[1]} ${loose[2]} ${loose[3] || ""}`).startDate;
  return parseAgendaWhen(text).startDate;
}

export function parseCinemaFestivals(payload) {
  if (!Array.isArray(payload)) return [];
  return payload
    .map((item) => {
      const title = clean(item?.title?.rendered || "");
      const description = clean(item?.content?.rendered || "");
      const startDate = festivalStart(`${title} ${description}`);
      if (!title || !startDate) return null;
      return eventRow({
        id: `cinema-${item.id}`,
        title,
        link: item.link || "https://cinemaoostereiland.nl/agenda/",
        location: "Cinema Oostereiland, Hoorn",
        description: description || "Film in Cinema Oostereiland",
        startDate,
        sourceId: "cinema",
        sourceLabel: "Cinema",
        categories: ["film"],
        price: priceFromText(description),
      });
    })
    .filter(Boolean);
}

async function loadCinema(fetchText) {
  return parseCinemaFestivals(JSON.parse(await fetchText(CINEMA_FESTIVALS)));
}

function vueClock(value) {
  const match = String(value || "").match(/T(\d{2}:\d{2})/);
  return match ? match[1] : "";
}

function vueAudience(certificate) {
  const name = String(certificate?.name || "").trim().toUpperCase();
  if (!name) return "";
  if (name === "AL" || name === "ALL") return "Alle leeftijden";
  if (name === "6" || name === "9") return "Kind";
  if (name === "12" || name === "14") return "Jongere";
  if (name === "16" || name === "18") return "Volwassene";
  return "";
}

export function parseVueFilms(payload) {
  const films = Array.isArray(payload?.result) ? payload.result : [];
  const events = [];
  for (const film of films) {
    const title = clean(film.filmTitle || "");
    if (!title) continue;
    const audience = vueAudience(film.certificate);
    const synopsis = clean(film.synopsisShort || "");
    const genres = (film.genres || []).map((genre) => clean(genre?.name || genre)).filter(Boolean);
    for (const group of film.showingGroups || []) {
      for (const session of group.sessions || []) {
        const startDate = String(session.startTime || group.date || "").slice(0, 10);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) continue;
        const extras = (session.attributes || [])
          .filter((item) => item.attributeType === "Session_Special" || item.shortName)
          .map((item) => clean(item.shortName || item.name))
          .filter((name) => name && !/^(netherlands|nederlands)$/i.test(name));
        const screen = clean(session.screenName || "");
        const description = [synopsis, screen ? `Zaal ${screen}`.replace(/^Zaal Zaal/i, "Zaal") : "", extras.join(", ")]
          .filter(Boolean)
          .join(" ");
        const booking = String(session.bookingUrl || "");
        events.push(
          eventRow({
            id: `vue-${film.filmId}-${session.sessionId}`,
            title,
            link: booking.startsWith("http")
              ? booking
              : booking
                ? `https://www.vuecinemas.nl${booking.startsWith("/") ? "" : "/"}${booking}`
                : film.filmUrl || VUE_HOME,
            location: "Vue Hoorn, Westfriese Parkweg 3",
            description,
            startDate,
            startTime: vueClock(session.startTime),
            endTime: vueClock(session.endTime),
            sourceId: "vue",
            sourceLabel: "Vue Hoorn",
            categories: ["film", ...genres],
            price: session.isPriceVisible === false ? "" : priceFromText(session.formattedPrice || ""),
            audience,
          })
        );
      }
    }
  }
  return events;
}

async function loadVue(fetchText) {
  const dates = JSON.parse(await fetchText(VUE_DATES));
  const days = (dates.result || []).filter((day) => day.hasShowings && day.showingDate);
  const events = [];
  for (const day of days) {
    const url = `https://www.vuecinemas.nl/api/microservice/showings/cinemas/1023/films?showingDate=${day.showingDate}&minEmbargoLevel=3&includesSession=true&includeSessionAttributes=true`;
    events.push(...parseVueFilms(JSON.parse(await fetchText(url))));
  }
  return events;
}

async function loadKamermuziek(fetchText) {
  const home = await fetchText(KAMERMUZIEK);
  const links = [
    ...new Set(
      [...home.matchAll(/href="(https:\/\/www\.kamermuziekfestivalhoorn\.nl\/event\/[^"]+)"/g)].map((match) => match[1])
    ),
  ];
  const events = [];
  for (const link of links) {
    const event = parseKamermuziekEventHtml(await fetchText(link), link);
    if (event) events.push(event);
  }
  return events;
}

const LOADERS = {
  komnaarhoorn: loadKnh,
  manifesto: loadManifesto,
  netwerk: loadNetwerk,
  raad: loadRaad,
  inhoorn: loadInhoorn,
  uitagenda: loadUitagenda,
  bibliotheek: loadBibliotheek,
  valk: loadValk,
  hetpark: loadHetPark,
  pakhuis: loadPakhuis,
  huisverloren: loadHuisverloren,
  swaf: loadSwaf,
  popronde: loadPopronde,
  kamermuziek: loadKamermuziek,
  oosterkerk: loadOosterkerk,
  cinema: loadCinema,
  vue: loadVue,
};

export async function loadSource(sourceId, fetchText) {
  const loader = LOADERS[sourceId];
  if (!loader) throw new Error(`Onbekende bron: ${sourceId}`);
  return loader(fetchText);
}
