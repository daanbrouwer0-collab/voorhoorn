import { SOURCES, dedupeEvents, loadSource } from "./sources.js";

const KIDS_RE =
  /\b(kind|kids|kinderen|kleintjes|jongeren|jeugd|jong!?|familie|peuter|kleuter|schoolvakantie|jeugdtheater|voor\s+de\s+jeugd|lego|speel|tiener)\b/i;

const SOURCE_COLOR = {
  komnaarhoorn: "#fbbf24",
  netwerk: "#2dd4bf",
  raad: "#60a5fa",
  manifesto: "#f472b6",
  hetpark: "#f87171",
  pakhuis: "#38bdf8",
  inhoorn: "#fb923c",
  uitagenda: "#c4b5fd",
  bibliotheek: "#34d399",
  valk: "#fb7185",
  huisverloren: "#f59e0b",
  swaf: "#a3e635",
  popronde: "#e879f9",
  kamermuziek: "#22d3ee",
  oosterkerk: "#facc15",
  cinema: "#f97316",
  vue: "#ef4444",
};

const state = {
  events: [],
  bySource: Object.fromEntries(SOURCES.map((source) => [source.id, []])),
  status: Object.fromEntries(SOURCES.map((source) => [source.id, { state: "idle", error: "" }])),
  source: "all",
  place: "",
  range: "upcoming",
  query: "",
  kids: false,
  filters: [],
  priceMin: null,
  priceMax: null,
  loading: false,
  updatedAt: null,
};

const hasDom = typeof document !== "undefined";
const sourceTabs = hasDom ? document.querySelector("#sourceTabs") : null;
const periodTabs = hasDom ? document.querySelector("#periodTabs") : null;
const searchInput = hasDom ? document.querySelector("#searchInput") : null;
const kidsToggle = hasDom ? document.querySelector("#kidsToggle") : null;
const labelFilters = hasDom ? document.querySelector("#labelFilters") : null;
const priceMinInput = hasDom ? document.querySelector("#priceMin") : null;
const priceMaxInput = hasDom ? document.querySelector("#priceMax") : null;
const exportBtn = hasDom ? document.querySelector("#exportBtn") : null;
const agendaList = hasDom ? document.querySelector("#agendaList") : null;
const statusLine = hasDom ? document.querySelector("#statusLine") : null;
const sourceAlerts = hasDom ? document.querySelector("#sourceAlerts") : null;
const refreshBtn = hasDom ? document.querySelector("#refreshBtn") : null;

const FIELD_FILTERS = [
  { id: "laag", label: "Laag" },
  { id: "categorie", label: "Categorie" },
  { id: "locatie", label: "Locatie" },
  { id: "leeftijd", label: "Leeftijd" },
  { id: "interval", label: "Interval" },
  { id: "tijd", label: "Tijd" },
];

const LAAG_ORDER = ["Festival", "Optreden", "Reeks", "Verzameling", "Vergadering"];
const SOURCE_LAAG = Object.fromEntries(SOURCES.map((source) => [source.id, source.laag]));

const LEEFTIJD_ORDER = ["Peuter", "Kind", "Jongere", "Volwassene", "Senior", "Alle leeftijden", "Onbekend"];
const INTERVAL_ORDER = ["Wekelijks", "Maandelijks", "Eenmalig", "Onbekend"];
const TIJD_ORDER = ["Ochtend", "Middag", "Avond", "Nacht", "Onbekend"];

let weeklyTitleKeys = new Set();
let weeklyDateCounts = new Map();

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function fetchText(url) {
  const response = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
  if (!response.ok) {
    throw new Error(`Bron gaf ${response.status}`);
  }
  return response.text();
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfWeek(date) {
  const day = date.getDay();
  const diff = day === 0 ? 0 : 7 - day;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + diff, 23, 59, 59);
}

function inRange(isoDate) {
  if (!isoDate) return state.range === "upcoming";
  const eventDate = startOfDay(new Date(`${isoDate}T12:00:00`));
  if (Number.isNaN(eventDate.getTime())) return false;
  const now = startOfDay(new Date());
  if (state.range === "this_week") return eventDate >= now && eventDate <= endOfWeek(now);
  if (state.range === "this_month") {
    return (
      eventDate >= now &&
      eventDate.getFullYear() === now.getFullYear() &&
      eventDate.getMonth() === now.getMonth()
    );
  }
  if (state.range === "next_month") {
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return eventDate.getFullYear() === next.getFullYear() && eventDate.getMonth() === next.getMonth();
  }
  return eventDate >= now;
}

function isKids(event) {
  if (event.categories?.includes("voor-kinderen")) return true;
  if (event.audience && /jeugd|jongeren|peuters/i.test(event.audience)) return true;
  return KIDS_RE.test(`${event.title} ${event.description} ${event.location}`);
}

const PLACE_RULES = [
  [/cinema\s+oostereiland/i, "Cinema Oostereiland"],
  [/\bvue\b/i, "Vue Hoorn"],
  [/schouwburg\s+het\s+park|theater\s+het\s+park|^het park\b/i, "Schouwburg Het Park"],
  [/noorderkerk/i, "Noorderkerk"],
  [/manifesto/i, "Manifesto"],
  [/pakhuis/i, "Het Pakhuis"],
  [/van der valk/i, "Van der Valk Hotel"],
  [/huis\s*verloren|huisverloren/i, "Huisverloren"],
  [/swaf/i, "Muziekcafé SWAF"],
  [/kroegie/i, "'t Kroegie"],
  [/charlies/i, "Proeflokaal Charlies"],
  [/drietje/i, "'t Drietje"],
  [/vi[eè]ra/i, "Café Vièra"],
  [/beiaard/i, "De Beiaard"],
  [/barrels/i, "Barrels"],
  [/blue striker/i, "Blue Striker"],
  [/the\s*80/i, "The 80's"],
  [/^jp\b/i, "Café JP"],
  [/koffielokaal/i, "Het Koffielokaal"],
  [/backstage/i, "Backstage"],
  [/oosterkerk/i, "Oosterkerk"],
  [/raadzaal/i, "Raadzaal"],
  [/bibliotheek\s+centrum/i, "Bibliotheek Centrum"],
  [/bibliotheek\s+kersenboogerd/i, "Bibliotheek Kersenboogerd"],
  [/bibliotheek\s+risdam/i, "Bibliotheek Risdam"],
  [/zaagtand/i, "Wijkcentrum De Zaagtand"],
  [/cogge/i, "Wijkcentrum De Cogge"],
  [/huesmolen/i, "Wijkcentrum De Huesmolen"],
  [/grote waal/i, "Wijkcentrum De Grote Waal"],
  [/wijkcentrum\s+kersenboogerd|betje wolff/i, "Wijkcentrum Kersenboogerd"],
];

function placeName(event) {
  const raw = String(event.location || "").replace(/\s+/g, " ").trim();
  if (!raw) return "";
  for (const [pattern, label] of PLACE_RULES) {
    if (pattern.test(raw)) return label;
  }
  let name = raw.split(",")[0].trim();
  name = name.replace(/\b(hoorn|nh)\b/gi, "").replace(/\s+/g, " ").trim();
  if (!name || /^(netwerk|stad|locatie|agenda)$/i.test(name)) return "";
  return name;
}

function locationLabel(event) {
  const raw = String(event.location || "").replace(/\s+/g, " ").trim();
  const place = placeName(event);
  const street = raw
    .split(",")
    .map((part) => part.trim())
    .find((part) => /\d/.test(part) && !/^(hoorn|nh)$/i.test(part));
  if (place && street && !place.includes(street)) return `${place}, ${street}`;
  return place;
}

function locationGroups(events) {
  const groups = new Map();
  for (const event of events) {
    const place = placeName(event);
    if (!place) continue;
    if (!groups.has(place)) groups.set(place, []);
    groups.get(place).push(event);
  }
  for (const items of groups.values()) {
    items.sort((a, b) => (a.startDate || "9999").localeCompare(b.startDate || "9999") || a.title.localeCompare(b.title, "nl"));
  }
  return [...groups.entries()].sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], "nl")
  );
}

function visibleEvents() {
  const query = state.query.trim().toLowerCase();
  const pool =
    state.source === "all" || state.source === "locations"
      ? state.events
      : state.bySource[state.source] || [];
  return pool
    .filter((event) => state.source !== "locations" || !state.place || placeName(event) === state.place)
    .filter((event) => inRange(event.startDate))
    .filter((event) => !state.kids || isKids(event))
    .filter((event) => matchesFilters(event))
    .filter((event) => {
      if (!query) return true;
      return `${event.title} ${event.location} ${event.description} ${allLabels(event).join(" ")}`
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => (a.startDate || "9999").localeCompare(b.startDate || "9999") || a.title.localeCompare(b.title, "nl"));
}

function formatDay(isoDate) {
  if (!isoDate) return "Datum onbekend";
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${isoDate}T12:00:00`));
}

function dayParts(isoDate) {
  if (!isoDate) return { day: "–", weekday: "" };
  const date = new Date(`${isoDate}T12:00:00`);
  const weekday = new Intl.DateTimeFormat("nl-NL", { weekday: "short" })
    .format(date)
    .replace(".", "");
  return { day: String(date.getDate()), weekday };
}

function timeLabel(event) {
  if (!event.startTime) return "";
  return event.endTime ? `${event.startTime}–${event.endTime}` : event.startTime;
}

const SOURCE_KIND = {
  komnaarhoorn: "Stad",
  netwerk: "Wijk",
  raad: "Vergadering",
  manifesto: "Podium",
  hetpark: "Theater",
  pakhuis: "Kroeg",
  inhoorn: "Stad",
  uitagenda: "Uitgaan",
  bibliotheek: "Lezen",
  valk: "Restaurant",
  huisverloren: "Podium",
  swaf: "Kroeg",
  popronde: "Kroeg",
  kamermuziek: "Muziek",
  oosterkerk: "Kerk",
  cinema: "Film",
  vue: "Film",
};

const SPORT_RE = /\b(sport|fitness|fit|conditietraining|voetbal|zwem|hardloop|yoga|wandel)\b/i;

const LABEL_RULES = [
  { label: "Familie", test: (text) => /\b(familie|ouders|grootouder)\b/i.test(text) },
  { label: "Muziek", test: (text, event) => event.categories?.includes("muziek") || /\b(concert|optreden|tribute|band|muziek|live|dj|song)\b/i.test(text) },
  { label: "Dans", test: (text) => /\b(dans|dance|disco|flamenco|tango|salsa)\b/i.test(text) },
  { label: "Comedy", test: (text) => /\b(comedy|cabaret|stand-?up|lach)\b/i.test(text) },
  { label: "Film", test: (text, event) => event.categories?.includes("film") || /\b(film|cinema|bioscoop)\b/i.test(text) },
  { label: "Theater", test: (text, event) => /\b(voorstelling|toneel|musical|theater|opera)\b/i.test(`${event.title} ${event.description} ${(event.categories || []).join(" ")}`) },
  { label: "Eten", test: (text, event) => event.categories?.includes("eten") || /\b(diner|proeverij|brunch|restaurant|buffet|kerstdiner|borrelhap|eten)\b/i.test(text) },
  { label: "Drinken", test: (text) => /\b(bier|wijn|borrel|proeverij|cocktail)\b/i.test(text) },
  { label: "Uitgaan", test: (text, event) => event.categories?.includes("uitgaan") || /\b(feest|festival|party|uitgaan|borrel)\b/i.test(text) },
  { label: "Sport", test: (text) => SPORT_RE.test(text) },
  { label: "Creatief", test: (text, event) => !SPORT_RE.test(text) && (event.categories?.includes("creatief") || /\b(creatief|schilder|knutsel|teken)\b/i.test(text)) },
  { label: "Workshop", test: (text) => /\bworkshop\b/i.test(text) },
  { label: "Lezing", test: (text) => /\b(lezing|spreekuur|cursus|lezing|informatie)\b/i.test(text) },
  { label: "Expo", test: (text) => /\b(expo|expositie|tentoonstelling|museum|kunst)\b/i.test(text) },
  { label: "Markt", test: (text) => /\b(markt|beurs)\b/i.test(text) },
  { label: "Quiz", test: (text) => /\bquiz\b/i.test(text) },
  { label: "Gratis", test: (text, event) => event.price === "Gratis" || /\b(gratis|vrije inloop|kosteloos)\b/i.test(text) },
  { label: "Kerst", test: (text) => /\b(kerst|christmas|xmas)\b/i.test(text) },
  { label: "Sinterklaas", test: (text) => /\bsinterklaas/i.test(text) },
  { label: "Raad", test: (text, event) => event.categories?.includes("raad") || /\b(raad|commissie|vergadering|agendapunt)\b/i.test(text) },
  { label: "Jazz", test: (text) => /\bjazz\b/i.test(text) },
  { label: "Klassiek", test: (text) => /\b(klassiek|kamermuziek|symfon|orgel|koor|barok)\b/i.test(text) },
  { label: "Pop", test: (text) => /\bpop\b/i.test(text) },
  { label: "Rock", test: (text) => /\b(rock|metal|punk)\b/i.test(text) },
  { label: "Blues", test: (text) => /\bblues\b/i.test(text) },
  { label: "Tribute", test: (text) => /\btribute\b/i.test(text) },
  { label: "Jam", test: (text) => /\bjam\b/i.test(text) },
  { label: "House", test: (text) => /\b(house|techno)\b/i.test(text) },
  { label: "Koor", test: (text) => /\bkoor\b/i.test(text) },
  { label: "Voetbal", test: (text) => /\bvoetbal\b/i.test(text) },
  { label: "Zwemmen", test: (text) => /\bzwem/i.test(text) },
  { label: "Yoga", test: (text) => /\byoga\b/i.test(text) },
  { label: "Wandelen", test: (text) => /\bwandel/i.test(text) },
  { label: "Fitness", test: (text) => /\b(fitness|fit|conditietraining)\b/i.test(text) },
  { label: "Schaatsen", test: (text) => /\b(schaats|ijsbaan)\b/i.test(text) },
  { label: "Boek", test: (text, event) => event.sourceId === "bibliotheek" || /\b(boek|lezen|voorlezen|bibliotheek)\b/i.test(text) },
  { label: "Natuur", test: (text) => /\b(natuur|wandel|tuin|klimaat|bos)\b/i.test(text) },
  { label: "Spel", test: (text) => /\b(spel|bordspel|game)\b/i.test(text) },
];

function dayPartLabel(startTime) {
  const match = String(startTime || "").match(/(\d{1,2}):(\d{2})/);
  if (!match) return "Hele dag";
  const hour = Number(match[1]);
  if (hour < 6 || hour >= 23) return "Nacht";
  if (hour < 12) return "Ochtend";
  if (hour < 17) return "Middag";
  return "Avond";
}

function weekLabel(isoDate) {
  if (!isoDate) return "";
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  const day = date.getDay();
  return day === 0 || day === 6 ? "Weekend" : "Doordeweeks";
}

const BINNENSTAD_RE =
  /binnenstad|kerkplein|roode steen|grote oost|grote noord|kerkstraat|nieuwstraat|onder de boompjes|oosterkerk|kroegie|swaf|charlies|drietje|vi[eè]ra|beiaard|noorderkerk|westfries museum/i;
const WIJK_RE = /wijkcentrum|zaagtand|cogge|huesmolen|kersenboogerd|risdam|grote waal|zwaag|blokker/i;

function placeKindLabel(event) {
  const text = `${event.location} ${event.title}`;
  if (WIJK_RE.test(text)) return "Wijk";
  if (BINNENSTAD_RE.test(text)) return "Binnenstad";
  return "";
}

function titleKey(title) {
  return String(title || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function isWeeklyDates(dates) {
  const days = [...dates].filter(Boolean).sort();
  if (days.length < 3) return false;
  let weekly = 0;
  for (let index = 1; index < days.length; index += 1) {
    const gap = (new Date(`${days[index]}T12:00:00`) - new Date(`${days[index - 1]}T12:00:00`)) / 86400000;
    if (gap >= 6 && gap <= 8) weekly += 1;
  }
  return weekly / (days.length - 1) >= 0.6;
}

function refreshWeeklyKeys() {
  const dates = new Map();
  for (const event of state.events) {
    const key = `${titleKey(event.title)}|${placeName(event)}`;
    if (!titleKey(event.title) || !event.startDate) continue;
    if (!dates.has(key)) dates.set(key, new Set());
    dates.get(key).add(event.startDate);
  }
  weeklyDateCounts = new Map([...dates.entries()].map(([key, days]) => [key, days.size]));
  weeklyTitleKeys = new Set([...dates.entries()].filter(([, days]) => isWeeklyDates(days)).map(([key]) => key));
}

function seriesKind(event) {
  if (event.programma?.length) return "";
  if (event.repeat === "Wekelijks" || event.repeat === "Maandelijks") return event.repeat;
  const text = `${event.title} ${event.description}`;
  if (/\b(elke maand|maandelijks|iedere maand)\b/i.test(text)) return "Maandelijks";
  if (
    /\b(elke week|wekelijks|iedere week|wekelijkse)\b/i.test(text) ||
    /\belke\s+(maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag)\b/i.test(text)
  ) {
    return "Wekelijks";
  }
  if (weeklyTitleKeys.has(`${titleKey(event.title)}|${placeName(event)}`)) return "Wekelijks";
  return "";
}

function profileLine(event) {
  const labels = allLabels(event);
  const what = CATEGORIEEN.find((label) => labels.includes(label));
  const whoNames = { Peuter: "peuters", Kind: "kinderen", Jongere: "jongeren", Volwassene: "volwassenen", Senior: "senioren", "Alle leeftijden": "alle leeftijden" };
  const who = ["Peuter", "Kind", "Jongere", "Volwassene", "Senior", "Alle leeftijden"]
    .filter((label) => labels.includes(label))
    .map((label) => whoNames[label])
    .join(" en ");
  const kind = seriesKind(event);
  const clock = timeLabel(event);
  let rhythm = "";
  if (kind === "Wekelijks" && event.startDate) {
    rhythm = `elke ${weekdayName(event.startDate)}${clock ? ` ${clock}` : ""}`;
  } else if (kind === "Maandelijks") {
    rhythm = `elke maand${clock ? ` ${clock}` : ""}`;
  }
  const place = placeName(event);
  return [what, who, rhythm, event.price, place].filter(Boolean).join(" · ");
}

function weekdayName(isoDate) {
  return new Intl.DateTimeFormat("nl-NL", { weekday: "long" }).format(new Date(`${isoDate}T12:00:00`));
}

function ageLabel(text, event) {
  const audience = String(event.audience || "").trim();
  if (/^alle leeftijden$/i.test(audience)) return "Alle leeftijden";
  if (/^peuter$/i.test(audience)) return "Peuter";
  if (/^kind$/i.test(audience)) return "Kind";
  if (/^jongere$/i.test(audience)) return "Jongere";
  if (/^volwassene$/i.test(audience)) return "Volwassene";
  if (/^senior$/i.test(audience)) return "Senior";
  const blob = `${text} ${audience}`;
  if (/peuter|dreumes/i.test(blob)) return "Peuter";
  if (/\b(senior|senioren|ouderen|50\+|55\+|60\+|65\+)\b/i.test(blob)) return "Senior";
  if (/\b(jongere|jongeren|tiener)\b/i.test(blob)) return "Jongere";
  if (event.categories?.includes("voor-kinderen") || /\b(kind|kinderen|kleuter|basisschool|jeugd)\b/i.test(blob)) return "Kind";
  if (/\b(volwassene|volwassenen|18\+)\b/i.test(blob)) return "Volwassene";
  if (/\b(alle leeftijden|jong en oud)\b/i.test(blob)) return "Alle leeftijden";
  return "";
}

function repeatLabel(event) {
  if (event.repeat === "Wekelijks" || event.repeat === "Maandelijks") return event.repeat;
  const text = `${event.title} ${event.description}`;
  if (/\b(elke maand|maandelijks|iedere maand)\b/i.test(text)) return "Maandelijks";
  if (
    /\b(elke week|wekelijks|iedere week|wekelijkse)\b/i.test(text) ||
    /\belke\s+(maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag)\b/i.test(text) ||
    weeklyTitleKeys.has(`${titleKey(event.title)}|${placeName(event)}`)
  ) {
    return "Wekelijks";
  }
  if (/\b(eenmalig|eenmalige)\b/i.test(text)) return "Eenmalig";
  const seen = weeklyDateCounts.get(`${titleKey(event.title)}|${placeName(event)}`) || 0;
  const laag = SOURCE_LAAG[event.sourceId];
  if (seen <= 1 && (laag === "Optreden" || laag === "Festival" || laag === "Vergadering")) return "Eenmalig";
  return "";
}

const CATEGORIEEN = [
  "Jazz", "Pop", "Rock", "Klassiek", "Blues", "House", "Tribute", "Jam",
  "Voetbal", "Zwemmen", "Yoga", "Wandelen", "Fitness", "Schaatsen",
  "Film", "Theater", "Eten", "Comedy", "Dans", "Lezing", "Expo", "Quiz", "Boek",
  "Creatief", "Workshop", "Raad", "Markt", "Spel",
];

function knownTitle(value) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text || "Onbekend";
}

function knownText(value) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (
    !text ||
    /^(netwerk hoorn|westfriese uitagenda|het park|manifesto|bibliotheek hoorn|stichting netwerk|popronde hoorn|inhoorn|uitagenda)$/i.test(text) ||
    /^diner, show of feest bij van der valk\.?$/i.test(text)
  ) {
    return "Onbekend";
  }
  return text;
}

function eventRecord(event) {
  const labels = allLabels(event);
  const text = `${event.title} ${event.description} ${event.location} ${(event.categories || []).join(" ")} ${event.audience || ""} ${event.price || ""}`;
  const bronnenVan = event.sources?.length ? event.sources : [{ id: event.sourceId, label: event.sourceLabel }];
  const bronnen = bronnenVan.map((source) => source.label).filter(Boolean);
  const lagen = [...new Set(bronnenVan.map((source) => SOURCE_LAAG[source.id]).filter(Boolean))].sort(
    (left, right) => LAAG_ORDER.indexOf(left) - LAAG_ORDER.indexOf(right)
  );
  const tijd = event.startTime
    ? event.endTime
      ? `${event.startTime}–${event.endTime}`
      : event.startTime
    : "Onbekend";
  const locatie = locationLabel(event) || (/^hoorn$/i.test(String(event.location || "").trim()) ? "" : knownText(event.location));
  const genre = (event.categories || []).find(
    (category) => !/^(uitgaan|muziek|eten|film|creatief|raad|voor-kinderen)$/i.test(category)
  );
  const record = {
    datum: event.endDate && event.startDate && event.endDate !== event.startDate
      ? `${event.startDate} – ${event.endDate}`
      : event.startDate || "Onbekend",
    tijd,
    titel: knownTitle(event.title),
    beschrijving: knownText(event.description),
    categorie: CATEGORIEEN.find((label) => labels.includes(label)) || genre || "Onbekend",
    locatie: locatie || "Onbekend",
    leeftijd: ageLabel(text, event) || "Onbekend",
    prijs: displayPrice(event.price),
    interval: repeatLabel(event) || "Onbekend",
    laag: lagen.join(", ") || "Onbekend",
    bron: bronnen.join(", ") || "Onbekend",
    link: event.link || "Onbekend",
  };
  if (event.programma?.length) {
    record.programma = event.programma.map((act) => {
      const item = eventRecord(act);
      return {
        tijd: item.tijd,
        titel: item.titel,
        beschrijving: item.beschrijving,
        categorie: item.categorie,
        locatie: item.locatie,
        prijs: item.prijs,
        link: item.link,
      };
    });
  }
  if (event.komende?.length > 1) record.komende = event.komende;
  return record;
}

function displayPrice(price) {
  if (!price || /^€0(?:,00)?$/.test(String(price))) return "Onbekend";
  return price;
}

function allLabels(event) {
  const text = `${event.title} ${event.description} ${event.location} ${(event.categories || []).join(" ")} ${event.audience || ""} ${event.price || ""}`;
  const labels = [];
  const add = (label) => {
    if (label && !labels.includes(label)) labels.push(label);
  };
  const sources = event.sources?.length
    ? event.sources
    : [{ id: event.sourceId, label: event.sourceLabel }];
  for (const source of sources) add(source.label);
  for (const rule of LABEL_RULES) {
    if (rule.test(text, event)) add(rule.label);
  }
  if (["Jazz", "Pop", "Rock", "Klassiek", "Blues", "House", "Tribute", "Jam"].some((label) => labels.includes(label))) add("Muziek");
  if (["Voetbal", "Zwemmen", "Yoga", "Wandelen", "Fitness", "Schaatsen"].some((label) => labels.includes(label))) add("Sport");
  add(ageLabel(text, event));
  add(repeatLabel(event));
  add(dayPartLabel(event.startTime));
  if (event.startTime) add("Met tijd");
  add(weekLabel(event.startDate));
  add(placeKindLabel(event));
  if (event.price && event.price !== "Gratis") add("Betaald");
  add("Hoorn");
  return labels;
}

function labelsFor(event) {
  return allLabels(event);
}

function filterId(field, value) {
  return `${field}:${value}`;
}

function tijdBucket(tijd) {
  if (!tijd || tijd === "Onbekend") return "Onbekend";
  const match = String(tijd).match(/(\d{1,2}):(\d{2})/);
  if (!match) return "Onbekend";
  const hour = Number(match[1]);
  if (hour < 6 || hour >= 23) return "Nacht";
  if (hour < 12) return "Ochtend";
  if (hour < 17) return "Middag";
  return "Avond";
}

function priceAmount(price) {
  const text = String(price || "");
  if (!text || text === "Onbekend") return null;
  if (/gratis/i.test(text)) return 0;
  const amounts = [...text.matchAll(/(\d{1,4})(?:[,.](\d{1,2}))?/g)].map((match) => {
    const cents = (match[2] || "0").padEnd(2, "0").slice(0, 2);
    return Number(match[1]) + Number(cents) / 100;
  });
  return amounts.length ? Math.min(...amounts) : null;
}

function matchesPrice(record) {
  if (state.priceMin == null && state.priceMax == null) return true;
  const amount = priceAmount(record.prijs);
  if (amount == null) return false;
  if (state.priceMin != null && amount < state.priceMin) return false;
  if (state.priceMax != null && amount > state.priceMax) return false;
  return true;
}

function fieldValue(record, field) {
  if (field === "tijd") return tijdBucket(record.tijd);
  return record[field] || "Onbekend";
}

function poolForFilters() {
  const pool =
    state.source === "all" || state.source === "locations"
      ? state.events
      : state.bySource[state.source] || [];
  return pool.filter((event) => {
    if (state.source === "locations" && state.place && placeName(event) !== state.place) return false;
    if (!inRange(event.startDate)) return false;
    if (state.kids && !isKids(event)) return false;
    return true;
  });
}

let optionCache = null;

function fieldOptions() {
  if (optionCache) return optionCache;
  const values = Object.fromEntries(FIELD_FILTERS.map((field) => [field.id, new Set()]));
  for (const event of poolForFilters()) {
    const record = eventRecord(event);
    for (const field of FIELD_FILTERS) values[field.id].add(fieldValue(record, field.id));
  }
  optionCache = Object.fromEntries(
    FIELD_FILTERS.map((field) => [field.id, sortFieldValues(field.id, [...values[field.id]])])
  );
  return optionCache;
}

function sortFieldValues(field, values) {
  const order = {
    categorie: [...CATEGORIEEN, "Onbekend"],
    leeftijd: LEEFTIJD_ORDER,
    interval: INTERVAL_ORDER,
    tijd: TIJD_ORDER,
    laag: LAAG_ORDER,
  }[field];
  return values.sort((left, right) => {
    if (left === "Onbekend") return 1;
    if (right === "Onbekend") return -1;
    if (order) {
      const rank = order.indexOf(left) - order.indexOf(right);
      if (rank) return rank;
    }
    return left.localeCompare(right, "nl");
  });
}

function matchesFilters(event) {
  const record = eventRecord(event);
  if (!matchesPrice(record)) return false;
  if (!state.filters.length) return true;
  const options = fieldOptions();
  return FIELD_FILTERS.every((field) => {
    const picked = (options[field.id] || []).map((value) => filterId(field.id, value)).filter((id) => state.filters.includes(id));
    if (!picked.length || picked.length === (options[field.id] || []).length) return true;
    return picked.includes(filterId(field.id, fieldValue(record, field.id)));
  });
}

function renderTabs() {
  const overviewEvents = state.events.filter(passesSharedFilters);
  const counts = {
    all: agendaPicture(overviewEvents).length,
    locations: locationGroups(overviewEvents).length,
  };
  for (const source of SOURCES) {
    counts[source.id] = agendaPicture((state.bySource[source.id] || []).filter(passesSharedFilters)).length;
  }
  const tabs = [
    { id: "all", label: "Alles", color: "#e2e8f0" },
    { id: "locations", label: "Locaties", color: "#5eead4" },
    ...SOURCES.map((source) => ({
    id: source.id,
    label: source.label,
    laag: source.laag,
    color: SOURCE_COLOR[source.id],
  }))];
  sourceTabs.innerHTML = tabs
    .map((tab) => {
      const selected = state.source === tab.id;
      const failed = tab.id !== "all" && tab.id !== "locations" && state.status[tab.id]?.state === "error";
      const badge = failed
        ? `<span class="fail-mark">mislukt</span>`
        : `<span class="count">${counts[tab.id] ?? 0}</span>`;
      const reason = failed ? ` title="${escapeHtml(state.status[tab.id].error)}"` : "";
      const laag = tab.laag ? `<span class="laag">${escapeHtml(tab.laag)}</span>` : "";
      return `<button type="button" role="tab" class="${failed ? "is-failed" : ""}" data-source="${tab.id}" aria-selected="${selected}" style="--tab:${tab.color}"${reason}>
        ${escapeHtml(tab.label)}
        ${laag}
        ${badge}
      </button>`;
    })
    .join("");
}

function passesSharedFilters(event) {
  if (!inRange(event.startDate)) return false;
  if (state.kids && !isKids(event)) return false;
  if (!matchesFilters(event)) return false;
  const query = state.query.trim().toLowerCase();
  if (!query) return true;
  return `${event.title} ${event.location} ${event.description} ${allLabels(event).join(" ")}`
    .toLowerCase()
    .includes(query);
}

function filterSummary() {
  const options = fieldOptions();
  const parts = FIELD_FILTERS.map((field) => {
    const picked = (options[field.id] || []).filter((value) => state.filters.includes(filterId(field.id, value)));
    if (!picked.length) return "";
    return `${field.label}: ${picked.join(" of ")}`;
  }).filter(Boolean);
  if (state.priceMin != null || state.priceMax != null) {
    const van = state.priceMin != null ? `van ${state.priceMin}` : "";
    const tot = state.priceMax != null ? `tot ${state.priceMax}` : "";
    parts.unshift(`Prijs: ${[van, tot].filter(Boolean).join(" ")} euro`);
  }
  if (!parts.length) return "Filter op dezelfde velden als de kaart. Binnen een veld telt of, tussen velden telt en. Prijs is een bedrag van–tot.";
  return parts.join(" · en · ");
}

function renderFilters() {
  const options = fieldOptions();
  const groups = FIELD_FILTERS.map((field) => {
    const buttons = (options[field.id] || [])
      .map((value) => {
        const id = filterId(field.id, value);
        const active = state.filters.includes(id);
        const unknown = value === "Onbekend" ? " is-unknown" : "";
        return `<button type="button" data-filter="${escapeHtml(id)}" class="${active ? "is-active" : ""}${unknown}" aria-pressed="${active}">${escapeHtml(value)}</button>`;
      })
      .join("");
    if (!buttons) return "";
    return `<div class="filter-group"><h3>${escapeHtml(field.label)}</h3>${buttons}</div>`;
  }).join("");
  const clear = state.filters.length || state.priceMin != null || state.priceMax != null
    ? `<button type="button" class="filter-clear" data-clear-filters>Wis filter</button>`
    : "";
  labelFilters.innerHTML = `<p class="filter-note">${escapeHtml(filterSummary())}</p>${clear}${groups}`;
}

function sourceFailureMessage(sourceId) {
  const status = state.status[sourceId];
  if (status?.state !== "error") return "";
  const source = SOURCES.find((item) => item.id === sourceId);
  return `${source?.label || sourceId} is niet geladen: ${status.error}. De andere bronnen blijven in de lijst.`;
}

function renderPlaces(events) {
  const places = locationGroups(events);
  if (!places.length) {
    agendaList.innerHTML = `<p class="empty">Geen locaties voor deze filters.</p>`;
    return;
  }
  agendaList.innerHTML = `<div class="places">${places
    .map(([place, items]) => {
      const next = items[0];
      const sources = [...new Set(items.map((event) => event.sourceLabel))].slice(0, 3).join(", ");
      return `<button type="button" class="place" data-place="${escapeHtml(place)}">
        <strong>${escapeHtml(place)}</strong>
        <span>${items.length} ${items.length === 1 ? "afspraak" : "afspraken"}</span>
        <span class="meta">${escapeHtml(formatDay(next.startDate))}${next.title ? ` · ${escapeHtml(next.title)}` : ""}</span>
        <span class="meta">${escapeHtml(sources)}</span>
      </button>`;
    })
    .join("")}</div>`;
}

function renderList() {
  optionCache = null;
  refreshWeeklyKeys();
  const events = state.place ? visibleEvents() : agendaPicture(visibleEvents());
  renderTabs();
  renderFilters();
  if (state.loading && !state.events.length) {
    agendaList.innerHTML = `<p class="loading">Bronnen ophalen…</p>`;
    return;
  }
  if (state.source === "locations" && !state.place) {
    renderPlaces(state.events.filter(passesSharedFilters));
    return;
  }
  const placeBar =
    state.source === "locations" && state.place
      ? `<button type="button" class="place-back" data-places-back>Alle locaties</button>`
      : "";
  if (!events.length) {
    const failure = sourceFailureMessage(state.source);
    const empty = failure
      ? `<p class="empty source-fail">${escapeHtml(failure)}</p>`
      : `<p class="empty">Geen afspraken voor deze filters.</p>`;
    agendaList.innerHTML = `${placeBar}${empty}`;
    return;
  }
  agendaList.innerHTML = placeBar + renderEventSections(events);
}

function renderEventSections(events) {
  const weekly = new Map();
  const monthly = new Map();
  const once = [];
  for (const event of events) {
    const kind = seriesKind(event);
    if (!kind) {
      once.push(event);
      continue;
    }
    const key = `${kind}|${titleKey(event.title)}|${placeName(event) || event.location}`;
    const bucket = kind === "Maandelijks" ? monthly : weekly;
    const existing = bucket.get(key);
    if (!existing || (event.startDate || "9999") < (existing.startDate || "9999")) bucket.set(key, event);
  }
  const byDate = (a, b) => (a.startDate || "9999").localeCompare(b.startDate || "9999") || a.title.localeCompare(b.title, "nl");
  const blocks = [];
  const weeklyItems = [...weekly.values()].sort(byDate);
  const monthlyItems = [...monthly.values()].sort(byDate);
  if (weeklyItems.length) {
    blocks.push(renderNamedSection("Elke week", "De volgende keer van een vaste weekreeks.", weeklyItems));
  }
  if (monthlyItems.length) {
    blocks.push(renderNamedSection("Elke maand", "De volgende keer van een maandelijkse reeks.", monthlyItems));
  }
  const groups = new Map();
  for (const event of once) {
    const key = event.startDate || "unknown";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(event);
  }
  for (const [day, items] of groups) {
    blocks.push(`<section class="day"><h2>${escapeHtml(formatDay(day === "unknown" ? "" : day))}</h2><div class="cards">${items.map(renderCard).join("")}</div></section>`);
  }
  return blocks.join("");
}

function renderNamedSection(title, note, items) {
  return `<section class="day"><h2>${escapeHtml(title)}</h2><p class="section-note">${escapeHtml(note)}</p><div class="cards">${items.map(renderCard).join("")}</div></section>`;
}

function renderCard(event) {
  const record = eventRecord(event);
  const parts = dayParts(event.startDate);
  const rows = [
    ["Datum", record.datum],
    ["Tijd", record.tijd],
    ["Categorie", record.categorie],
    ["Locatie", record.locatie],
    ["Leeftijd", record.leeftijd],
    ["Prijs", record.prijs],
    ["Interval", record.interval],
    ["Laag", record.laag],
    ["Bron", record.bron],
  ];
  const facts = rows
    .map(([name, value]) => {
      const unknown = value === "Onbekend" ? " is-unknown" : "";
      const price = name === "Prijs" ? " fact-price" : "";
      return `<div class="fact${unknown}${price}"><dt>${escapeHtml(name)}</dt><dd>${escapeHtml(value)}</dd></div>`;
    })
    .join("");
  const program = record.programma?.length
    ? `<ol class="program">${record.programma
        .map(
          (act) =>
            `<li><span>${escapeHtml(act.tijd)}</span><strong>${escapeHtml(act.titel)}</strong><em>${escapeHtml(act.locatie)}</em></li>`
        )
        .join("")}</ol>`
    : "";
  const upcoming = record.komende?.length > 1 ? `<p class="upcoming">Komende datums: ${record.komende.length}</p>` : "";
  const href = record.link === "Onbekend" ? "" : ` href="${escapeHtml(record.link)}" target="_blank" rel="noopener noreferrer"`;
  const descUnknown = record.beschrijving === "Onbekend" ? " is-unknown" : "";
  return `<a class="card"${href} style="--tab:${SOURCE_COLOR[event.sourceId] || "#818cf8"}">
    <div class="when"><span>${escapeHtml(parts.weekday)}</span><strong>${escapeHtml(parts.day)}</strong></div>
    <div>
      <h3>${escapeHtml(record.titel)}</h3>
      <p class="desc${descUnknown}">${escapeHtml(record.beschrijving)}</p>
      <dl class="facts">${facts}</dl>
      ${upcoming}
      ${program}
    </div>
  </a>`;
}

function renderStatus() {
  const failed = SOURCES.filter((source) => state.status[source.id].state === "error");
  const pending = SOURCES.filter((source) => state.status[source.id].state === "loading").map((source) => source.label);
  if (location.protocol === "file:") {
    statusLine.classList.add("is-error");
    statusLine.textContent = "Open de snelkoppeling Web Agenda op je bureaublad. Dit bestand zelf toont nog geen lijst.";
    sourceAlerts.hidden = true;
    sourceAlerts.innerHTML = "";
    return;
  }
  if (failed.length) {
    sourceAlerts.hidden = false;
    sourceAlerts.innerHTML = failed
      .map(
        (source) =>
          `<li><strong>${escapeHtml(source.label)}</strong> is niet geladen: ${escapeHtml(state.status[source.id].error)}. De andere afspraken blijven zichtbaar.</li>`
      )
      .join("");
  } else {
    sourceAlerts.hidden = true;
    sourceAlerts.innerHTML = "";
  }
  if (pending.length) {
    statusLine.classList.remove("is-error");
    statusLine.textContent = `Bezig met ${pending.join(", ")}…`;
    return;
  }
  statusLine.classList.remove("is-error");
  const stamp = state.updatedAt
    ? new Intl.DateTimeFormat("nl-NL", { hour: "2-digit", minute: "2-digit" }).format(state.updatedAt)
    : "";
  const loaded = state.events.length;
  if (!stamp) {
    statusLine.textContent = "Klaar om te laden.";
    return;
  }
  const missed = failed.length ? ` · ${failed.length} ${failed.length === 1 ? "bron mislukt" : "bronnen mislukt"}` : "";
  statusLine.textContent = `${loaded} afspraken opgehaald · ${stamp}${missed}`;
}

function festivalKey(event) {
  if (event.sourceId === "kamermuziek") return "kamermuziek";
  if (event.sourceId === "cinema") return `cinema:${event.id || event.title}`;
  return `${event.sourceId}:${event.startDate}`;
}

function asFestival(items) {
  const sorted = [...items].sort(
    (left, right) =>
      (left.startDate || "").localeCompare(right.startDate || "") ||
      (left.startTime || "").localeCompare(right.startTime || "") ||
      left.title.localeCompare(right.title, "nl")
  );
  const first = sorted[0];
  const places = [...new Set(sorted.map((item) => placeName(item)).filter(Boolean))];
  const dates = [...new Set(sorted.map((item) => item.startDate).filter(Boolean))].sort();
  const times = sorted.map((item) => item.startTime).filter(Boolean).sort();
  const endTimes = sorted.map((item) => item.endTime || item.startTime).filter(Boolean).sort();
  const counts = new Map();
  for (const item of sorted) {
    for (const category of item.categories || []) {
      if (/^(uitgaan|muziek)$/i.test(category)) continue;
      counts.set(category, (counts.get(category) || 0) + 1);
    }
  }
  const dominant = [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0];
  const title =
    first.sourceId === "popronde"
      ? "Popronde Hoorn"
      : first.sourceId === "kamermuziek"
        ? "Kamermuziekfestival Hoorn"
        : first.title;
  const onePlace = places.length === 1 ? sorted.find((item) => placeName(item) === places[0]) : null;
  return {
    ...first,
    title,
    description: `${sorted.length} ${sorted.length === 1 ? "optreden" : "optredens"}${places.length ? ` op ${places.length} ${places.length === 1 ? "locatie" : "locaties"}` : ""}.`,
    startDate: dates[0] || first.startDate,
    endDate: dates.length > 1 ? dates.at(-1) : "",
    startTime: times[0] || "",
    endTime: endTimes.at(-1) && endTimes.at(-1) !== times[0] ? endTimes.at(-1) : "",
    location: onePlace ? onePlace.location : "Diverse locaties",
    link: first.sourceId === "popronde" ? "https://popronde.nl/steden/hoorn" : first.link,
    price: "",
    categories: dominant ? ["uitgaan", dominant] : ["uitgaan"],
    programma: sorted.map((item) => ({ ...item, programma: undefined, komende: undefined })),
    sources: [{ id: first.sourceId, label: first.sourceLabel }],
  };
}

function shadowsFestival(event, festivals) {
  const blob = `${event.title} ${event.description} ${event.link}`.toLowerCase();
  return festivals.some((festival) => {
    if (event.sourceId === festival.sourceId) return false;
    const start = festival.startDate;
    const end = festival.endDate || festival.startDate;
    if (!event.startDate || event.startDate < start || event.startDate > end) return false;
    const name = titleKey(festival.title).split(" ")[0];
    return name.length > 3 && blob.includes(name);
  });
}

function collapseSeries(events) {
  const buckets = new Map();
  const once = [];
  for (const event of events) {
    const kind = seriesKind(event);
    if (!kind) {
      once.push(event);
      continue;
    }
    const key = `${kind}|${titleKey(event.title)}|${placeName(event) || event.location}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(event);
  }
  const folded = [...buckets.values()].map((items) => {
    items.sort((left, right) => (left.startDate || "9999").localeCompare(right.startDate || "9999"));
    return { ...items[0], komende: [...new Set(items.map((item) => item.startDate).filter(Boolean))] };
  });
  return [...folded, ...once].sort(
    (left, right) => (left.startDate || "9999").localeCompare(right.startDate || "9999") || left.title.localeCompare(right.title, "nl")
  );
}

function agendaPicture(events) {
  const groups = new Map();
  const rest = [];
  for (const event of events) {
    if (SOURCE_LAAG[event.sourceId] !== "Festival") {
      rest.push(event);
      continue;
    }
    const key = festivalKey(event);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(event);
  }
  const festivals = [...groups.values()].map((items) => (items.length > 1 ? asFestival(items) : items[0]));
  return collapseSeries([...festivals, ...rest.filter((event) => !shadowsFestival(event, festivals))]);
}

export function agendaPayload(bySource, failedSources = []) {
  state.bySource = bySource;
  state.events = dedupeEvents(
    Object.values(bySource)
      .flat()
      .map((event) => ({
        ...event,
        categories: [...(event.categories || [])],
        sources: event.sources?.length ? event.sources : [{ id: event.sourceId, label: event.sourceLabel }],
      }))
  );
  state.source = "all";
  state.place = "";
  state.range = "upcoming";
  state.query = "";
  state.kids = false;
  state.filters = [];
  state.priceMin = null;
  state.priceMax = null;
  refreshWeeklyKeys();
  const events = agendaPicture(visibleEvents()).map(eventRecord);
  const lagen = {};
  for (const event of events) lagen[event.laag] = (lagen[event.laag] || 0) + 1;
  return {
    updated: new Date().toISOString(),
    failedSources,
    count: events.length,
    lagen,
    events,
  };
}

function exportJson() {
  refreshWeeklyKeys();
  const events = (state.place ? visibleEvents() : agendaPicture(visibleEvents())).map(eventRecord);
  const lagen = {};
  for (const event of events) lagen[event.laag] = (lagen[event.laag] || 0) + 1;
  const failed = SOURCES.filter((source) => state.status[source.id].state === "error").map((source) => ({
    id: source.id,
    label: source.label,
    error: state.status[source.id].error,
  }));
  const payload = {
    exportedAt: new Date().toISOString(),
    filters: {
      source: state.source,
      place: state.place,
      range: state.range,
      query: state.query,
      kids: state.kids,
      labels: state.filters,
      priceMin: state.priceMin,
      priceMax: state.priceMax,
    },
    failedSources: failed,
    count: events.length,
    lagen,
    events,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  const day = new Date().toISOString().slice(0, 10);
  link.href = URL.createObjectURL(blob);
  link.download = `web-agenda-${day}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

async function refresh() {
  if (location.protocol === "file:") {
    renderStatus();
    return;
  }
  state.loading = true;
  state.events = [];
  refreshBtn.disabled = true;
  for (const source of SOURCES) state.status[source.id] = { state: "loading", error: "" };
  renderStatus();
  renderList();

  state.bySource = Object.fromEntries(SOURCES.map((source) => [source.id, []]));
  await Promise.all(
    SOURCES.map(async (source) => {
      try {
        const events = await loadSource(source.id, fetchText);
        state.status[source.id] = { state: "ok", error: "" };
        state.bySource[source.id] = dedupeEvents(events);
      } catch (error) {
        state.status[source.id] = {
          state: "error",
          error: error instanceof Error ? error.message : "onbekende fout",
        };
        state.bySource[source.id] = [];
      } finally {
        state.events = dedupeEvents(
          Object.values(state.bySource)
            .flat()
            .map((event) => ({
              ...event,
              categories: [...(event.categories || [])],
              sources: [{ id: event.sourceId, label: event.sourceLabel }],
            }))
        );
        renderStatus();
        renderList();
      }
    })
  );
  state.updatedAt = new Date();
  state.loading = false;
  refreshBtn.disabled = false;
  renderStatus();
  renderList();
}

if (hasDom && sourceTabs && agendaList) {
bindPage();
}

function bindPage() {
sourceTabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-source]");
  if (!button) return;
  state.source = button.dataset.source;
  state.place = "";
  renderList();
});

agendaList.addEventListener("click", (event) => {
  const placeButton = event.target.closest("[data-place]");
  if (placeButton) {
    state.source = "locations";
    state.place = placeButton.dataset.place;
    renderList();
    return;
  }
  if (event.target.closest("[data-places-back]")) {
    state.place = "";
    renderList();
  }
});

periodTabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-range]");
  if (!button) return;
  state.range = button.dataset.range;
  for (const item of periodTabs.querySelectorAll("button")) {
    const active = item === button;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-selected", String(active));
  }
  renderList();
});

searchInput.addEventListener("input", () => {
  state.query = searchInput.value;
  renderList();
});

kidsToggle.addEventListener("change", () => {
  state.kids = kidsToggle.checked;
  renderList();
});

function setPrice(input, key) {
  if (input.value === "") {
    state[key] = null;
  } else {
    const number = Number(input.value);
    state[key] = Number.isFinite(number) && number >= 0 ? number : null;
  }
  renderList();
}

priceMinInput.addEventListener("input", () => setPrice(priceMinInput, "priceMin"));
priceMaxInput.addEventListener("input", () => setPrice(priceMaxInput, "priceMax"));

labelFilters.addEventListener("click", (event) => {
  if (event.target.closest("[data-clear-filters]")) {
    state.filters = [];
    state.priceMin = null;
    state.priceMax = null;
    priceMinInput.value = "";
    priceMaxInput.value = "";
    renderList();
    return;
  }
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  const id = button.dataset.filter;
  state.filters = state.filters.includes(id)
    ? state.filters.filter((filter) => filter !== id)
    : [...state.filters, id];
  renderList();
});

exportBtn.addEventListener("click", () => {
  exportJson();
});

refreshBtn?.addEventListener("click", () => {
  refresh();
});

renderStatus();
renderList();
refresh();
}
