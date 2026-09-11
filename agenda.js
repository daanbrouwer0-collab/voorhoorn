const AGENDA_API = "https://komnaarhoorn.nl/wp-json/agenda/v1";
const MANIFESTO_FEED = "https://manifesto-hoorn.nl/upcoming_productions";
const NETWERK_BASE = "https://netwerkhoorn.nl/activiteiten";
const RAAD_CALENDAR_API =
  "https://hoorn.bestuurlijkeinformatie.nl/Calendar/GetMonthAgendas";
const RAAD_SITE = "https://hoorn.bestuurlijkeinformatie.nl";

const AGENDA_DATE_LABELS = {
  this_week: "Deze week",
  this_month: "Deze maand",
  next_month: "Volgende maand",
  this_year: "Alles",
};

const AGENDA_VIEW_NOTES = {
  stad:
    'Bronnen: Kom naar Hoorn, Manifesto, Netwerk Hoorn · <a href="https://komnaarhoorn.nl/agenda/" target="_blank" rel="noopener noreferrer">Volledige agenda</a>',
  kinderen:
    'Activiteiten voor kids &amp; jongeren · <a href="https://komnaarhoorn.nl/agenda/" target="_blank" rel="noopener noreferrer">Kom naar Hoorn</a>',
  raad:
    'Vergaderingen via iBabs · <a href="https://hoorn.bestuurlijkeinformatie.nl/Calendar" target="_blank" rel="noopener noreferrer">Raadskalender</a>',
};

const DUTCH_MONTHS = {
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

const KIDS_RE =
  /\b(kind|kids|kinderen|kleintjes|jongeren|jeugd|jong!?|familie|peuter|kleuter|schoolvakantie|jeugdtheater|voor\s+de\s+jeugd|lego|speel|tiener)\b/i;

const agendaPanel = document.getElementById("agendaPanel");
const agendaList = document.getElementById("agendaList");
const agendaViewTabs = document.getElementById("agendaViewTabs");
const agendaDateTabs = document.getElementById("agendaDateTabs");
const agendaCount = document.getElementById("agendaCount");
const agendaSourceNote = document.getElementById("agendaSourceNote");

let agendaEvents = [];
let cityEventsCache = [];
let kidsEventsCache = [];
let raadEventsCache = [];
let cityLoaded = false;
let kidsLoaded = false;
let raadLoaded = false;
let agendaLoading = false;
let agendaFilters = {
  dateRange: "this_month",
  view: "stad",
};

function agendaEscape(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stripTags(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return (tmp.textContent || tmp.innerText || "").replace(/\s+/g, " ").trim();
}

function decodeEntities(text) {
  const tmp = document.createElement("textarea");
  tmp.innerHTML = text || "";
  return tmp.value;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toIsoDate(year, monthIndex, day) {
  return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`;
}

function parseDutchDateFromText(text) {
  if (!text) return "";
  const normalized = decodeEntities(text).toLowerCase().replace(/\./g, "");
  let m = normalized.match(
    /(\d{1,2})\s+(januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december|jan|feb|mrt|apr|jun|jul|aug|sep|sept|okt|nov|dec)\s+'?(\d{2,4})/i
  );
  if (!m) return "";
  let year = Number(m[3]);
  if (year < 100) year += 2000;
  const month = DUTCH_MONTHS[m[2].toLowerCase()];
  if (month == null) return "";
  return toIsoDate(year, month, Number(m[1]));
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function endOfWeek(d) {
  const day = d.getDay();
  const diff = day === 0 ? 0 : 7 - day;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff, 23, 59, 59);
}

function inSelectedDateRange(isoDate) {
  if (!isoDate) return true;
  const eventDate = startOfDay(new Date(`${isoDate}T12:00:00`));
  if (Number.isNaN(eventDate.getTime())) return true;
  const now = startOfDay(new Date());
  const range = agendaFilters.dateRange;

  if (range === "this_week") {
    return eventDate >= now && eventDate <= endOfWeek(now);
  }
  if (range === "this_month") {
    return (
      eventDate.getFullYear() === now.getFullYear() &&
      eventDate.getMonth() === now.getMonth() &&
      eventDate >= now
    );
  }
  if (range === "next_month") {
    const nextMonth = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
    const nextYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
    return eventDate.getFullYear() === nextYear && eventDate.getMonth() === nextMonth;
  }
  return eventDate >= now;
}

function formatAgendaDate(isoDate) {
  if (!isoDate) return "";
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

/** Compacte chip: dagnummer + korte weekdag (bijv. 11 / vr). */
function formatAgendaDateParts(isoDate) {
  if (!isoDate) return null;
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  const weekday = new Intl.DateTimeFormat("nl-NL", { weekday: "short" })
    .format(date)
    .replace(/\./g, "")
    .slice(0, 2);
  return {
    day: String(date.getDate()),
    weekday: weekday.toLowerCase(),
    label: formatAgendaDate(isoDate),
  };
}

function formatAgendaWhen(event) {
  const start = formatAgendaDate(event.startDate);
  if (!start) return "Datum onbekend";
  let label = start;
  if (event.endDate && event.endDate !== event.startDate) {
    label += ` t/m ${formatAgendaDate(event.endDate)}`;
  }
  if (event.startTime) {
    label += ` · ${event.startTime}`;
    if (event.endTime) label += `–${event.endTime}`;
  }
  return label;
}

async function fetchText(url) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch (primaryError) {
    console.warn("Agenda fetch mislukt, probeer proxy:", url, primaryError);
  }

  // AllOrigins (soms down)
  try {
    const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxy, { cache: "no-store" });
    if (!response.ok) throw new Error(`Proxy HTTP ${response.status}`);
    return await response.text();
  } catch (proxyError) {
    console.warn("AllOrigins mislukt:", proxyError);
  }

  // Jina reader: CORS-vriendelijk, geeft markdown terug
  const jina = `https://r.jina.ai/${url}`;
  const response = await fetch(jina, { cache: "no-store" });
  if (!response.ok) throw new Error(`Jina HTTP ${response.status}`);
  return await response.text();
}

async function fetchAgendaJson(url) {
  const text = await fetchText(url);
  // Als we via Jina markdown kregen, is JSON.parse zinloos
  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return JSON.parse(trimmed);
  }
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  throw new Error("Geen JSON in agenda-antwoord");
}

function buildAgendaQuery(page = 1) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("dateRange", "this_year");
  if (agendaFilters.view === "kinderen") {
    params.set("categories", "voor-kinderen");
  }
  return params.toString();
}

function parseAgendaArticles(html) {
  if (!html) return [];
  const doc = new DOMParser().parseFromString(
    `<div id="root">${html}</div>`,
    "text/html"
  );

  return [...doc.querySelectorAll("article.agenda-item")]
    .map((article) => {
      const linkEl = article.querySelector("a[href]");
      const titleAttr = linkEl?.getAttribute("title") || "";
      const titleFromAttr = titleAttr.replace(/^Bekijk evenement:\s*/i, "").trim();
      const title =
        titleFromAttr ||
        article.querySelector("h3")?.textContent?.trim() ||
        "Evenement";

      const location =
        article
          .querySelector(".ti-map-pin")
          ?.closest("div")
          ?.querySelector("span")
          ?.textContent?.trim() || "";

      const descEl =
        article.querySelector(".line-clamp-3") ||
        article.querySelector(".prose-sm");
      const description = descEl ? stripTags(descEl.innerHTML) : "";

      const dateTimes = [...article.querySelectorAll("time[datetime]")]
        .map((t) => t.getAttribute("datetime") || "")
        .filter(Boolean);
      const dayDates = dateTimes.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
      const clockTimes = dateTimes.filter((d) => /^\d{1,2}:\d{2}$/.test(d));

      return {
        id: `knh-${article.id || title}`,
        title: decodeEntities(title),
        link: linkEl?.href || "#",
        location: decodeEntities(location),
        description: decodeEntities(description),
        startDate: dayDates[0] || "",
        endDate: dayDates[1] || "",
        startTime: clockTimes[0] || "",
        endTime: clockTimes[1] || "",
        sourceId: "komnaarhoorn",
        sourceLabel: "Kom naar Hoorn",
        categories:
          agendaFilters.view === "kinderen" ? ["voor-kinderen"] : [],
      };
    })
    .filter((item) => item.link && item.link !== "#");
}

function parseManifestoFeed(xmlText) {
  const doc = new DOMParser().parseFromString(xmlText, "application/xml");
  return [...doc.querySelectorAll("item")]
    .map((item) => {
      const title = item.querySelector("title")?.textContent?.trim() || "Concert";
      const link = item.querySelector("link")?.textContent?.trim() || "#";
      const description =
        item.querySelector("description")?.textContent?.trim() ||
        item.getElementsByTagNameNS(
          "http://purl.org/rss/1.0/modules/content/",
          "encoded"
        )[0]?.textContent ||
        "";
      const plain = stripTags(description);
      const startDate = parseDutchDateFromText(plain) || parseDutchDateFromText(title);

      return {
        id: `manifesto-${link}`,
        title: decodeEntities(title),
        link,
        location: "Manifesto Hoorn",
        description: decodeEntities(plain).slice(0, 420),
        startDate,
        endDate: "",
        startTime: "",
        endTime: "",
        sourceId: "manifesto",
        sourceLabel: "Manifesto",
        categories: ["muziek"],
      };
    })
    .filter((e) => e.link && e.link !== "#");
}

function parseNetwerkPage(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const anchors = [...doc.querySelectorAll('a[href*="/activiteit/"]')];
  const events = [];

  for (const a of anchors) {
    const title = a.querySelector("h3")?.textContent?.trim();
    if (!title) continue;
    const href = a.getAttribute("href") || "";
    const link = href.startsWith("http")
      ? href
      : `https://netwerkhoorn.nl${href}`;
    const locationStrong = [...a.querySelectorAll("strong")].find((s) =>
      /locatie/i.test(s.textContent || "")
    );
    const location =
      locationStrong?.parentElement?.innerHTML
        ?.replace(/<strong>[\s\S]*?<\/strong>/i, "")
        ?.replace(/<br\s*\/?>/gi, " ")
        ?.replace(/<[^>]+>/g, " ")
        ?.replace(/\s+/g, " ")
        .trim() || "Netwerk Hoorn";

    const dateSpan = a.querySelector("span.date span.date, span.date");
    const dateText = dateSpan?.textContent?.trim() || "";
    const startDate = parseDutchDateFromText(dateText);
    const categoryHint = a.textContent || "";
    const kids = /jongeren|kids|kind|jeugd|familie/i.test(categoryHint);

    events.push({
      id: `netwerk-${link}-${startDate || title}`,
      title: decodeEntities(title),
      link,
      location: decodeEntities(location),
      description: "Wijkactiviteit van Stichting Netwerk Hoorn.",
      startDate,
      endDate: "",
      startTime: "",
      endTime: "",
      sourceId: "netwerk",
      sourceLabel: "Netwerk Hoorn",
      categories: kids ? ["voor-kinderen"] : ["creatief"],
    });
  }

  return events;
}

function parseRaadMonthHtml(html) {
  if (!html) return [];

  // Via Jina komt markdown binnen i.p.v. HTML
  if (
    html.includes("Markdown Content:") ||
    (!html.includes("calendar-item") && html.includes("/Agenda/Index/"))
  ) {
    return parseRaadMonthMarkdown(html);
  }

  const doc = new DOMParser().parseFromString(html, "text/html");
  const events = [];

  doc.querySelectorAll(".calendar-items-row").forEach((row) => {
    row.querySelectorAll("a.calendar-item").forEach((a) => {
      const href = a.getAttribute("href") || "";
      const link = href.startsWith("http") ? href : `${RAAD_SITE}${href}`;
      const labelEl = a.querySelector(".calendar-item-label");
      const location =
        labelEl?.querySelector(".calendar-item-location")?.textContent?.trim() ||
        "Raadzaal";
      const subtitle =
        labelEl?.querySelector(".calendar-item-subtitle")?.textContent?.trim() ||
        "";
      const labelClone = labelEl?.cloneNode(true);
      labelClone
        ?.querySelectorAll(".calendar-item-location, .calendar-item-subtitle")
        .forEach((el) => el.remove());
      const mainTitle = labelClone?.textContent?.replace(/\s+/g, " ").trim();
      const title = decodeEntities(mainTitle || subtitle || "Vergadering");

      const srDate = a.querySelector(".sr-only")?.textContent?.trim() || "";
      const startDate = parseDutchDateFromText(srDate);
      if (!startDate) return;

      const timeText = a.querySelector(".calendar-item-time")?.textContent?.trim() || "";
      const timeMatch = timeText.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
      const descEl = a.parentElement?.querySelector(".calendar-item-description");
      const description = descEl
        ? stripTags(descEl.innerHTML)
        : "Raads- of commissievergadering van de gemeente Hoorn.";

      events.push({
        id: `raad-${link}`,
        title,
        link,
        location: decodeEntities(location.replace(/[()]/g, "").trim()),
        description: decodeEntities(description).slice(0, 420),
        startDate,
        endDate: "",
        startTime: timeMatch?.[1] || "",
        endTime: timeMatch?.[2] || "",
        sourceId: "raad",
        sourceLabel: "Gemeenteraad",
        categories: ["raad"],
      });
    });
  });

  return events.filter((e) => e.link && e.startDate);
}

/** Parse Jina-markdown van GetMonthAgendas */
function parseRaadMonthMarkdown(md) {
  const events = [];
  const re =
    /\[([^\]]+)\]\((https:\/\/hoorn\.bestuurlijkeinformatie\.nl\/Agenda\/Index\/[^)]+)\)/g;
  let match;
  while ((match = re.exec(md)) !== null) {
    const label = decodeEntities(match[1]).replace(/\s+/g, " ").trim();
    const link = match[2];
    const startDate = parseDutchDateFromText(label);
    if (!startDate) continue;

    const timeMatch = label.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
    const locMatch = label.match(/\(([^)]+)\)\s*(?:[a-z]+dag|\d)/i);
    let title = label
      .replace(/\([^)]*\)/g, " ")
      .replace(
        /\b(?:maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag)\b[\s\S]*$/i,
        ""
      )
      .replace(/\s+/g, " ")
      .trim();
    if (!title) title = "Vergadering";

    events.push({
      id: `raad-${link}`,
      title,
      link,
      location: (locMatch?.[1] || "Raadzaal").trim(),
      description: "Raads- of commissievergadering van de gemeente Hoorn.",
      startDate,
      endDate: "",
      startTime: timeMatch?.[1] || "",
      endTime: timeMatch?.[2] || "",
      sourceId: "raad",
      sourceLabel: "Gemeenteraad",
      categories: ["raad"],
    });
  }
  return events;
}

function titleKey(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 6)
    .join(" ");
}

function dedupeEvents(items) {
  const sorted = [...items].sort((a, b) =>
    (a.startDate || "9999").localeCompare(b.startDate || "9999")
  );
  const out = [];
  for (const item of sorted) {
    const key = titleKey(item.title);
    const dup = out.some((kept) => {
      if (key && key === titleKey(kept.title)) {
        if (!item.startDate || !kept.startDate) return true;
        return item.startDate === kept.startDate;
      }
      return false;
    });
    if (!dup) out.push(item);
  }
  return out;
}

function isKidsEvent(event) {
  if (event.categories?.includes("voor-kinderen")) return true;
  return KIDS_RE.test(`${event.title} ${event.description} ${event.location}`);
}

function applyClientFilters(events) {
  return events.filter((event) => {
    if (!inSelectedDateRange(event.startDate)) return false;
    if (agendaFilters.view === "kinderen" && !isKidsEvent(event)) return false;
    if (agendaFilters.view === "raad" && event.sourceId !== "raad") return false;
    if (agendaFilters.view !== "raad" && event.sourceId === "raad") return false;
    return true;
  });
}

function setActiveTabGroup(container, attr, value) {
  if (!container) return;
  container.querySelectorAll(".news-tab").forEach((btn) => {
    const on = (btn.getAttribute(attr) || "") === value;
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-selected", on ? "true" : "false");
  });
}

function updateSourceNote() {
  if (!agendaSourceNote) return;
  agendaSourceNote.innerHTML =
    AGENDA_VIEW_NOTES[agendaFilters.view] || AGENDA_VIEW_NOTES.stad;
}

function bindAgendaViewTabs() {
  agendaViewTabs?.querySelectorAll(".news-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.agendaView || "stad";
      if (next === agendaFilters.view) return;
      agendaFilters.view = next;
      setActiveTabGroup(agendaViewTabs, "data-agenda-view", agendaFilters.view);
      updateSourceNote();

      if (next === "raad") {
        if (raadLoaded) {
          agendaEvents = raadEventsCache;
          renderAgendaList();
        } else {
          loadAgenda({ force: true });
        }
        return;
      }

      if (next === "kinderen") {
        if (kidsLoaded) {
          agendaEvents = kidsEventsCache;
          renderAgendaList();
        } else {
          loadAgenda({ force: true });
        }
        return;
      }

      if (cityLoaded) {
        agendaEvents = cityEventsCache;
        renderAgendaList();
        return;
      }
      loadAgenda({ force: true });
    });
  });
}

function bindAgendaFilterTabs() {
  agendaDateTabs?.querySelectorAll(".news-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      agendaFilters.dateRange = btn.dataset.dateRange || "this_month";
      setActiveTabGroup(agendaDateTabs, "data-date-range", agendaFilters.dateRange);
      if (agendaFilters.view === "raad" && raadLoaded) {
        agendaEvents = raadEventsCache;
        renderAgendaList();
        return;
      }
      if (agendaFilters.view === "kinderen" && kidsLoaded) {
        agendaEvents = kidsEventsCache;
        renderAgendaList();
        return;
      }
      if (agendaFilters.view === "stad" && cityLoaded) {
        agendaEvents = cityEventsCache;
        renderAgendaList();
        return;
      }
      loadAgenda({ force: true });
    });
  });
}

function bindAgendaToggles() {
  if (!agendaList) return;
  agendaList.querySelectorAll(".news-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest(".news-row");
      const panel = row?.querySelector(".news-panel");
      if (!panel) return;

      const willOpen = panel.hidden;
      agendaList.querySelectorAll(".news-row.is-open").forEach((openRow) => {
        if (openRow === row) return;
        openRow.classList.remove("is-open");
        const openBtn = openRow.querySelector(".news-toggle");
        const openPanel = openRow.querySelector(".news-panel");
        if (openBtn) openBtn.setAttribute("aria-expanded", "false");
        if (openPanel) openPanel.hidden = true;
      });

      row.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
      panel.hidden = !willOpen;
    });
  });
}

function renderAgendaList() {
  if (!agendaList) return;
  const filtered = applyClientFilters(agendaEvents).sort((a, b) => {
    const da = a.startDate || "9999-99-99";
    const db = b.startDate || "9999-99-99";
    if (da !== db) return da.localeCompare(db);
    return (a.startTime || "").localeCompare(b.startTime || "");
  });

  if (agendaCount) {
    const n = filtered.length;
    const noun =
      agendaFilters.view === "raad"
        ? n === 1
          ? "vergadering"
          : "vergaderingen"
        : n === 1
          ? "evenement"
          : "evenementen";
    agendaCount.textContent = n === 0 ? "Niets gevonden" : `${n} ${noun}`;
  }

  if (!filtered.length) {
    const period = AGENDA_DATE_LABELS[agendaFilters.dateRange] || "deze periode";
    const hint =
      agendaFilters.view === "kinderen"
        ? " Tip: kies periode “Alles” voor meer kids-activiteiten."
        : "";
    agendaList.innerHTML = `<p class="news-empty">Geen items gevonden voor ${agendaEscape(period)}.${agendaEscape(hint)}</p>`;
    return;
  }

  const openLabel =
    agendaFilters.view === "raad" ? "Bekijk agenda →" : "Bekijk evenement →";

  const rows = filtered
    .map((event, index) => {
      const panelId = `agenda-panel-${index}`;
      const when = formatAgendaWhen(event);
      const metaParts = [when, event.location].filter(Boolean).join(" · ");
      const body =
        event.description || "Geen korte beschrijving. Open de pagina voor meer info.";
      const dateParts = formatAgendaDateParts(event.startDate);
      const dateChip = dateParts
        ? `<span class="agenda-date-chip" aria-hidden="true">
              <span class="agenda-date-day">${agendaEscape(dateParts.day)}</span>
              <span class="agenda-date-wday">${agendaEscape(dateParts.weekday)}</span>
            </span>`
        : `<span class="agenda-date-chip agenda-date-chip--empty" aria-hidden="true">
              <span class="agenda-date-day">–</span>
              <span class="agenda-date-wday">?</span>
            </span>`;
      const toggleLabel = dateParts
        ? `${dateParts.label}: ${event.title}`
        : event.title;

      return `
        <article class="news-row">
          <button
            type="button"
            class="news-toggle agenda-toggle"
            aria-expanded="false"
            aria-controls="${panelId}"
            aria-label="${agendaEscape(toggleLabel)}"
          >
            ${dateChip}
            <span class="news-item-title">${agendaEscape(event.title)}</span>
            <span class="news-chevron" aria-hidden="true"></span>
          </button>
          <div class="news-panel" id="${panelId}" hidden>
            <div class="news-meta">
              <span class="news-source source-${agendaEscape(event.sourceId)}">${agendaEscape(event.sourceLabel)}</span>
              ${agendaEscape(metaParts)}
            </div>
            <p class="news-blurb">${agendaEscape(body)}</p>
            <a
              class="news-open"
              href="${agendaEscape(event.link)}"
              target="_blank"
              rel="noopener noreferrer"
            >${openLabel}</a>
          </div>
        </article>
      `;
    })
    .join("");

  agendaList.innerHTML = `<div class="news-rows">${rows}</div>`;
  bindAgendaToggles();
}

async function loadKomNaarHoorn() {
  const first = await fetchAgendaJson(`${AGENDA_API}/items?${buildAgendaQuery(1)}`);
  let events = parseAgendaArticles(first.html || "");
  const totalPages = Math.min(8, Math.max(1, Number(first.totalPages) || 1));

  agendaEvents = dedupeEvents([...agendaEvents, ...events]);
  renderAgendaList();

  for (let page = 2; page <= totalPages; page += 1) {
    const pageData = await fetchAgendaJson(
      `${AGENDA_API}/items?${buildAgendaQuery(page)}`
    );
    events = events.concat(parseAgendaArticles(pageData.html || ""));
    agendaEvents = dedupeEvents([
      ...agendaEvents.filter((e) => e.sourceId !== "komnaarhoorn"),
      ...events,
    ]);
    renderAgendaList();
  }
  return events;
}

async function loadManifesto() {
  const xml = await fetchText(MANIFESTO_FEED);
  return parseManifestoFeed(xml);
}

async function loadNetwerk() {
  const pages = [1, 2, 3, 4, 5];
  let all = [];
  for (const page of pages) {
    try {
      const html = await fetchText(`${NETWERK_BASE}?page=${page}`);
      all = all.concat(parseNetwerkPage(html));
    } catch (err) {
      console.warn("Netwerk pagina mislukt", page, err);
    }
  }
  return all;
}

function raadMonthsToFetch() {
  const now = new Date();
  const months = [];
  // Altijd ruim vooruit laden; periode filteren we client-side
  for (let i = 0; i <= 5; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() }); // iBabs: 0-indexed
  }
  return months;
}

async function loadRaad() {
  const months = raadMonthsToFetch();
  let all = [];
  for (const { year, month } of months) {
    try {
      const html = await fetchText(
        `${RAAD_CALENDAR_API}?year=${year}&month=${month}`
      );
      all = all.concat(parseRaadMonthHtml(html));
    } catch (err) {
      console.warn("Raadskalender maand mislukt", year, month, err);
    }
  }
  return dedupeEvents(all);
}

async function loadCityAgenda() {
  agendaEvents = [];
  const knhPromise = loadKomNaarHoorn().catch((err) => {
    console.error("Kom naar Hoorn mislukt:", err);
    return [];
  });
  const otherPromise = Promise.all([
    loadManifesto().catch((err) => {
      console.warn("Manifesto mislukt:", err);
      return [];
    }),
    loadNetwerk().catch((err) => {
      console.warn("Netwerk mislukt:", err);
      return [];
    }),
  ]);

  const [, [manifesto, netwerk]] = await Promise.all([knhPromise, otherPromise]);
  agendaEvents = dedupeEvents([...agendaEvents, ...manifesto, ...netwerk]);
  cityEventsCache = agendaEvents;
  cityLoaded = true;
  renderAgendaList();
}

async function loadKidsAgenda() {
  agendaEvents = [];
  const knhPromise = loadKomNaarHoorn().catch((err) => {
    console.error("Kom naar Hoorn (kids) mislukt:", err);
    return [];
  });
  const netwerkPromise = loadNetwerk()
    .then((items) => items.filter(isKidsEvent))
    .catch((err) => {
      console.warn("Netwerk (kids) mislukt:", err);
      return [];
    });

  const [, netwerk] = await Promise.all([knhPromise, netwerkPromise]);
  agendaEvents = dedupeEvents([...agendaEvents, ...netwerk]);
  kidsEventsCache = agendaEvents;
  kidsLoaded = true;
  renderAgendaList();
}

async function loadAgenda({ force = false } = {}) {
  if (!agendaList) return;
  if (agendaLoading && !force) return;

  const view = agendaFilters.view;

  if (!force) {
    if (view === "raad" && raadLoaded) {
      agendaEvents = raadEventsCache;
      renderAgendaList();
      return;
    }
    if (view === "kinderen" && kidsLoaded) {
      agendaEvents = kidsEventsCache;
      renderAgendaList();
      return;
    }
    if (view === "stad" && cityLoaded) {
      agendaEvents = cityEventsCache;
      renderAgendaList();
      return;
    }
  }

  agendaLoading = true;
  agendaPanel?.classList.add("is-loading");
  agendaList.innerHTML = '<p class="news-empty">Agenda laden…</p>';
  updateSourceNote();

  try {
    if (view === "raad") {
      const raad = await loadRaad();
      raadEventsCache = raad;
      raadLoaded = true;
      agendaEvents = raad;
      renderAgendaList();
    } else if (view === "kinderen") {
      await loadKidsAgenda();
    } else {
      await loadCityAgenda();
    }
  } catch (err) {
    console.error("Agenda laden mislukt:", err);
    if (!agendaEvents.length) {
      agendaList.innerHTML =
        '<p class="news-empty">Kon de agenda niet laden. Vernieuw de pagina of probeer later opnieuw.</p>';
    }
  } finally {
    agendaLoading = false;
    agendaPanel?.classList.remove("is-loading");
  }
}

function showAgendaView() {
  updateSourceNote();
  loadAgenda({ force: false });
}

window.VoorhoornAgenda = {
  show: showAgendaView,
  reload: () => {
    cityLoaded = false;
    kidsLoaded = false;
    raadLoaded = false;
    loadAgenda({ force: true });
  },
};

if (agendaPanel && agendaList) {
  bindAgendaViewTabs();
  bindAgendaFilterTabs();
  updateSourceNote();
}
