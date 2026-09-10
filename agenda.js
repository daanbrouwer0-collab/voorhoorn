const AGENDA_API = "https://komnaarhoorn.nl/wp-json/agenda/v1";
const MANIFESTO_FEED = "https://manifesto-hoorn.nl/upcoming_productions";
const NETWERK_BASE = "https://netwerkhoorn.nl/activiteiten";

const AGENDA_DATE_LABELS = {
  this_week: "Deze week",
  this_month: "Deze maand",
  next_month: "Volgende maand",
  this_year: "Alles",
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

const SPORT_STRONG_RE =
  /\b(sport|voetbal|hockey|tennis|atletiek|wielrennen|fiets|bike|hardloop|marathon|zwem|fitness|toernooi|wedstrijd|ironman|padel|volleybal|basketbal)\b/i;

const SPORT_FALSE_RE =
  /\b(zoomer|bingo|quiz|concert|tribute|dans|muziek|karaoke|festival|theater|expositie|workshop schilderen|keramiek)\b/i;

const agendaPanel = document.getElementById("agendaPanel");
const agendaList = document.getElementById("agendaList");
const agendaCategoryTabs = document.getElementById("agendaCategoryTabs");
const agendaDateTabs = document.getElementById("agendaDateTabs");
const agendaAccessTabs = document.getElementById("agendaAccessTabs");
const agendaSourceTabs = document.getElementById("agendaSourceTabs");
const agendaCount = document.getElementById("agendaCount");
const agendaMoreFilters = document.getElementById("agendaMoreFilters");
const agendaMoreFiltersBtn = document.getElementById("agendaMoreFiltersBtn");

let agendaEvents = [];
let agendaLoaded = false;
let agendaLoading = false;
let agendaFilters = {
  dateRange: "this_month",
  category: "",
  access: "",
  source: "",
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
  // 11 september 2026 | 10 sep '26 | 10 sep 2026
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
  const day = d.getDay(); // 0 sun
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
  // this_year / alles: from today onward this year + future
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
    console.warn("Agenda fetch mislukt, proxy:", url, primaryError);
    const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxy, { cache: "no-store" });
    if (!response.ok) throw new Error(`Proxy HTTP ${response.status}`);
    return await response.text();
  }
}

async function fetchAgendaJson(url) {
  const text = await fetchText(url);
  return JSON.parse(text);
}

function buildAgendaQuery(page = 1) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  // Voor festivals e.d. altijd breed ophalen; periode filteren we client-side
  // behalve access/category die de API goed kan.
  const apiDateRange =
    agendaFilters.category === "festival" || agendaFilters.category === "sport"
      ? "this_year"
      : agendaFilters.dateRange || "this_year";
  params.set("dateRange", apiDateRange);
  if (agendaFilters.category) params.set("categories", agendaFilters.category);
  if (agendaFilters.access) params.set("access", agendaFilters.access);
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
        categories: agendaFilters.category ? [agendaFilters.category] : [],
      };
    })
    .filter((item) => item.link && item.link !== "#");
}

function looksLikeRealSport(event) {
  const text = `${event.title} ${event.description}`;
  if (SPORT_STRONG_RE.test(text)) return true;
  if (SPORT_FALSE_RE.test(text)) return false;
  return true;
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
      categories: /jongeren|kids|kind/i.test(categoryHint)
        ? ["voor-kinderen"]
        : ["creatief"],
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

function matchesCategoryLocally(event) {
  const cat = agendaFilters.category;
  if (!cat) return true;
  if (event.categories?.includes(cat)) return true;

  const text = `${event.title} ${event.description}`.toLowerCase();
  if (cat === "muziek") {
    return /muziek|concert|dj|band|pop|tribute|unplugged|manifesto|dans/.test(text);
  }
  if (cat === "festival") {
    return /festival|kermis|weekend|ronde|week\b/.test(text);
  }
  if (cat === "sport") return looksLikeRealSport(event);
  if (cat === "voor-kinderen") {
    return /kind|kids|jongeren|jeugd|school/.test(text);
  }
  if (cat === "creatief") {
    return /teken|schilder|workshop|creatief|naai|beelden|kunst/.test(text);
  }
  return false;
}

function applyClientFilters(events) {
  return events.filter((event) => {
    if (agendaFilters.source && event.sourceId !== agendaFilters.source) {
      return false;
    }
    if (!inSelectedDateRange(event.startDate)) return false;
    if (agendaFilters.category === "sport" && event.sourceId === "komnaarhoorn") {
      // Kom naar Hoorn over-tagt soms (bijv. Zoomer als sport)
      if (!looksLikeRealSport(event)) return false;
    }
    if (agendaFilters.category && event.sourceId !== "komnaarhoorn") {
      if (!matchesCategoryLocally(event)) return false;
    }
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

function renderAgendaCategoryTabs(categories = []) {
  if (!agendaCategoryTabs) return;
  const preferred = [
    "festival",
    "muziek",
    "creatief",
    "voor-kinderen",
    "sport",
    "eten-drinken",
    "winkelen",
  ];
  const bySlug = Object.fromEntries(
    categories.map((c) => [c.slug, decodeEntities(stripTags(c.name || c.slug))])
  );
  const buttons = [
    { slug: "", name: "Alles" },
    ...preferred
      .filter((slug) => bySlug[slug] || true)
      .map((slug) => ({ slug, name: bySlug[slug] || slug })),
  ];

  // Unique by slug
  const seen = new Set();
  const unique = buttons.filter((b) => {
    if (seen.has(b.slug)) return false;
    seen.add(b.slug);
    return true;
  });

  agendaCategoryTabs.innerHTML = unique
    .map(
      (cat) => `
      <button
        type="button"
        class="news-tab ${cat.slug === agendaFilters.category ? "is-active" : ""}"
        role="tab"
        aria-selected="${cat.slug === agendaFilters.category ? "true" : "false"}"
        data-category="${agendaEscape(cat.slug)}"
      >${agendaEscape(cat.name)}</button>
    `
    )
    .join("");

  agendaCategoryTabs.querySelectorAll(".news-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      agendaFilters.category = btn.dataset.category || "";
      setActiveTabGroup(agendaCategoryTabs, "data-category", agendaFilters.category);
      // Festivals staan vaak later in het jaar
      if (
        agendaFilters.category === "festival" &&
        (agendaFilters.dateRange === "this_week" ||
          agendaFilters.dateRange === "this_month")
      ) {
        agendaFilters.dateRange = "this_year";
        setActiveTabGroup(agendaDateTabs, "data-date-range", "this_year");
      }
      loadAgenda({ force: true });
    });
  });
}

function updateMoreFiltersButton() {
  if (!agendaMoreFiltersBtn) return;
  const extras = [];
  if (agendaFilters.source === "komnaarhoorn") extras.push("Kom naar Hoorn");
  if (agendaFilters.source === "manifesto") extras.push("Manifesto");
  if (agendaFilters.source === "netwerk") extras.push("Netwerk");
  if (agendaFilters.access === "gratis") extras.push("Gratis");
  if (agendaFilters.access === "betaald") extras.push("Betaald");

  const hasActive = extras.length > 0;
  agendaMoreFiltersBtn.classList.toggle("has-active", hasActive);
  agendaMoreFiltersBtn.textContent = hasActive
    ? `Meer filters (${extras.length})`
    : "Meer filters";
}

function bindAgendaFilterTabs() {
  agendaDateTabs?.querySelectorAll(".news-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      agendaFilters.dateRange = btn.dataset.dateRange || "this_month";
      setActiveTabGroup(agendaDateTabs, "data-date-range", agendaFilters.dateRange);
      loadAgenda({ force: true });
    });
  });

  agendaAccessTabs?.querySelectorAll(".news-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      agendaFilters.access = btn.dataset.access || "";
      setActiveTabGroup(agendaAccessTabs, "data-access", agendaFilters.access);
      updateMoreFiltersButton();
      loadAgenda({ force: true });
    });
  });

  agendaSourceTabs?.querySelectorAll(".news-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      agendaFilters.source = btn.dataset.source || "";
      setActiveTabGroup(agendaSourceTabs, "data-source", agendaFilters.source);
      updateMoreFiltersButton();
      loadAgenda({ force: true });
    });
  });

  agendaMoreFiltersBtn?.addEventListener("click", () => {
    if (!agendaMoreFilters) return;
    const open = agendaMoreFilters.hidden;
    agendaMoreFilters.hidden = !open;
    agendaMoreFiltersBtn.setAttribute("aria-expanded", open ? "true" : "false");
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
    agendaCount.textContent =
      n === 0
        ? "Geen evenementen"
        : `${n} ${n === 1 ? "evenement" : "evenementen"}`;
  }
  updateMoreFiltersButton();

  if (!filtered.length) {
    const period = AGENDA_DATE_LABELS[agendaFilters.dateRange] || "deze periode";
    const hint =
      agendaFilters.category === "festival"
        ? " Tip: kies periode “Alles” — veel festivals vallen buiten deze week/maand."
        : "";
    agendaList.innerHTML = `<p class="news-empty">Geen evenementen gevonden voor ${agendaEscape(period)}.${agendaEscape(hint)}</p>`;
    return;
  }

  const rows = filtered
    .map((event, index) => {
      const panelId = `agenda-panel-${index}`;
      const when = formatAgendaWhen(event);
      const metaParts = [when, event.location].filter(Boolean).join(" · ");
      const body =
        event.description || "Geen korte beschrijving. Open de pagina voor meer info.";

      return `
        <article class="news-row">
          <button
            type="button"
            class="news-toggle"
            aria-expanded="false"
            aria-controls="${panelId}"
          >
            <span class="news-item-title">
              <span class="agenda-date-chip">${agendaEscape(formatAgendaDate(event.startDate) || "Agenda")}</span>
              ${agendaEscape(event.title)}
            </span>
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
            >Bekijk evenement →</a>
          </div>
        </article>
      `;
    })
    .join("");

  agendaList.innerHTML = `<div class="news-rows">${rows}</div>`;
  bindAgendaToggles();
}

async function loadKomNaarHoorn() {
  if (agendaFilters.source && agendaFilters.source !== "komnaarhoorn") return [];
  // Access filter only exists on KNH
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
  if (agendaFilters.source && agendaFilters.source !== "manifesto") return [];
  if (agendaFilters.access === "gratis") return []; // vaak tickets
  if (
    agendaFilters.category &&
    !["", "muziek", "festival"].includes(agendaFilters.category)
  ) {
    return [];
  }
  const xml = await fetchText(MANIFESTO_FEED);
  return parseManifestoFeed(xml);
}

async function loadNetwerk() {
  if (agendaFilters.source && agendaFilters.source !== "netwerk") return [];
  if (
    agendaFilters.category &&
    !["", "creatief", "voor-kinderen", "sport"].includes(agendaFilters.category)
  ) {
    return [];
  }
  const pages = [1, 2, 3];
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

async function loadAgendaFilters() {
  try {
    const data = await fetchAgendaJson(`${AGENDA_API}/filters`);
    renderAgendaCategoryTabs(Array.isArray(data.categories) ? data.categories : []);
  } catch (err) {
    console.warn("Agenda filters laden mislukt:", err);
    renderAgendaCategoryTabs([
      { slug: "festival", name: "Festival" },
      { slug: "muziek", name: "Muziek" },
      { slug: "creatief", name: "Creatief" },
      { slug: "voor-kinderen", name: "Voor kinderen" },
      { slug: "sport", name: "Sport" },
      { slug: "eten-drinken", name: "Eten & drinken" },
      { slug: "winkelen", name: "Winkelen" },
    ]);
  }
}

async function loadAgenda({ force = false } = {}) {
  if (!agendaList) return;
  if (agendaLoading && !force) return;
  if (agendaLoaded && !force) {
    renderAgendaList();
    return;
  }

  agendaLoading = true;
  agendaLoaded = false;
  agendaEvents = [];
  agendaPanel?.classList.add("is-loading");
  agendaList.innerHTML = '<p class="news-empty">Agenda laden…</p>';

  try {
    // Parallel bronnen; KNH streamt pagina’s progressief
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
    renderAgendaList();
    agendaLoaded = true;
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
  if (!agendaLoaded) loadAgenda({ force: true });
  else renderAgendaList();
}

window.VoorhoornAgenda = {
  show: showAgendaView,
  reload: () => loadAgenda({ force: true }),
};

if (agendaPanel && agendaList) {
  bindAgendaFilterTabs();
  updateMoreFiltersButton();
  loadAgendaFilters();
}
