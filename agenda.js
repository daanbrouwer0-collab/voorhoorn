/**
 * Agenda UI — data komt uit agenda-data.json (zelfde opbouw als Web Agenda).
 * Nieuws blijft live in news.js. Periode, zoeken en filters zijn client-side.
 */
const AGENDA_DATA_FEED = "agenda-data.json";
const RAAD_CALENDAR_URL = "https://hoorn.bestuurlijkeinformatie.nl/Calendar";

const AGENDA_DATE_LABELS = {
  this_week: "Deze week",
  this_month: "Deze maand",
  next_month: "Volgende maand",
  this_year: "Alles",
};

const PRESETS = {
  alles: "Alles",
  "muziek-geen-club": "Muziek, geen club",
  optreden: "Alleen optreden",
  film: "Film",
  club: "Club",
  overig: "Overig",
};
const AGENDA_FILTER_KEY = "voorhoorn-agenda-custom";
const AGE_LABELS = ["Kind", "Kind en volwassen", "Volwassen", "Volwassen en senior", "Senior"];
const AGE_BANDS = [
  ["Peuter", "Kind", "Jongere"],
  ["Peuter", "Kind", "Jongere", "Volwassene", "Alle leeftijden"],
  ["Volwassene", "Alle leeftijden"],
  ["Volwassene", "Senior", "Alle leeftijden"],
  ["Senior"],
];

const KIDS_RE =
  /\b(kind|kids|kinderen|kleintjes|jongeren|jeugd|jong!?|familie|peuter|kleuter|schoolvakantie|jeugdtheater|voor\s+de\s+jeugd|lego|speel|tiener)\b/i;

const agendaPanel = document.getElementById("agendaPanel");
const agendaList = document.getElementById("agendaList");
const agendaViewTabs = document.getElementById("agendaViewTabs");
const agendaDateTabs = null;
const agendaCount = document.getElementById("agendaCount");
const agendaSourceNote = document.getElementById("agendaSourceNote");

let allAgendaEvents = [];
let agendaEvents = [];
let agendaDataLoaded = false;
let agendaLoading = false;
let agendaFilters = {
  dateRange: "this_month",
  time: "",
  preset: "alles",
};

function agendaEscape(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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
  return eventDate >= startOfDay(new Date());
}

function sourceTint(event) {
  const bron = `${event.bron || ""} ${event.sourceLabel || ""}`;
  if (/vue/i.test(bron)) return "vue";
  if (/het park/i.test(bron)) return "park";
  if (/netwerk/i.test(bron)) return "netwerk";
  return "";
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

function eventDate(event) {
  const match = String(event.datum || event.startDate || "").match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : "";
}

function formatAgendaWhen(event) {
  const start = formatAgendaDate(eventDate(event));
  if (!start) return event.datum && event.datum !== "Onbekend" ? event.datum : "Datum onbekend";
  let label = start;
  if (event.tijd && event.tijd !== "Onbekend") label += ` · ${event.tijd}`;
  else if (event.startTime) label += ` · ${event.startTime}${event.endTime ? `–${event.endTime}` : ""}`;
  return label;
}

const VOORHOORN_SHARE_URL = "https://voorhoorn.nl";

const SHARE_HOOKS = [
  "Zin om mee te gaan?",
  "Even iemand meesleuren?",
  "Dit lijkt me niks voor alleen.",
  "Buddy gezocht voor dit avontuur.",
  "Zullen we dit samen doen?",
  "Eentje is geen, twee is een feest.",
  "Mijn plus-één-plek is nog vrij.",
  "Kom je ook, of moet ik alleen stom staan?",
  "Dit schreeuwt om gezelschap.",
  "Ready voor een missie in Hoorn?",
  "Ik ga — jij ook?",
  "Te leuk om solo te doen.",
  "Even een vriend kidnapen voor:",
  "Sociale agenda-upgrade?",
  "Zin in een kleine escapade?",
  "Dit past in onze ‘dingen die we ooit doen’-lijst.",
  "Geen FOMO, wel een uitnodiging.",
  "Plan B was Netflix. Plan A is dit.",
  "Kom je mee, of blijf je zielig thuis?",
  "Hoorn-momentje? Graag met jou.",
];

function pickShareHook() {
  return SHARE_HOOKS[Math.floor(Math.random() * SHARE_HOOKS.length)];
}

function buildShareText(title, eventUrl) {
  const hook = pickShareHook();
  return [hook, title, "", VOORHOORN_SHARE_URL, eventUrl].filter(Boolean).join("\n");
}

async function shareEventInvite(title, eventUrl) {
  const text = buildShareText(title, eventUrl);
  if (navigator.share) {
    try {
      await navigator.share({
        title: title || "Voorhoorn agenda",
        text,
      });
      return;
    } catch (err) {
      if (err?.name === "AbortError") return;
    }
  }
  // Fallback: WhatsApp (werkt op mobiel + desktop)
  const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(wa, "_blank", "noopener,noreferrer");
}

function weekdayLong(isoDate) {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("nl-NL", { weekday: "long" }).format(date);
}

function isKidsEvent(event) {
  if (/^(peuter|kind)$/i.test(event.leeftijd || "")) return true;
  if (event.categories?.includes("voor-kinderen")) return true;
  if (event.audience && /jeugd|jongeren|peuters/i.test(event.audience)) return true;
  return KIDS_RE.test(`${event.titel || event.title || ""} ${event.beschrijving || event.description || ""} ${event.locatie || event.location || ""}`);
}

function isRaadEvent(event) {
  return /vergadering/i.test(event.laag || "") || event.sourceId === "raad" || /raad/i.test(event.categorie || "");
}

function isFilmEvent(event) {
  return /film/i.test(event.categorie || "") || /\b(film|bioscoop)\b/i.test(`${event.titel || event.title || ""} ${event.beschrijving || ""}`);
}

const MUSIC_RE = /\b(muziek|concert|optreden|band|dj|jazz|pop|rock|klassiek|blues|house)\b/i;

function isClubEvent(event) {
  return /reeks/i.test(event.laag || "") || /^(wekelijks|maandelijks)$/i.test(event.interval || "");
}

function isMusicEvent(event) {
  return /^(jazz|pop|rock|klassiek|blues|house|tribute|jam|muziek)$/i.test(event.categorie || "") || MUSIC_RE.test(`${event.titel || event.title || ""} ${event.beschrijving || ""} ${event.categorie || ""}`);
}

function matchesTime(event) {
  if (!agendaFilters.time) return true;
  const iso = eventDate(event);
  if (!iso) return false;
  const date = new Date(`${iso}T12:00:00`);
  if (agendaFilters.time === "vandaag") return startOfDay(date).getTime() === startOfDay(new Date()).getTime();
  const day = date.getDay();
  return day === 0 || day === 6;
}

function matchesAge(event) {
  if (!agendaFilters.ageOn) return true;
  const band = AGE_BANDS[agendaFilters.age - 1] || AGE_BANDS[0];
  const age = event.leeftijd || "";
  if (band.includes(age)) return true;
  if (agendaFilters.age <= 2 && isKidsEvent(event)) return true;
  return false;
}

function isOptredenEvent(event) {
  return /optreden/i.test(event.laag || "") && !isFilmEvent(event);
}

function isOverigEvent(event) {
  return !isFilmEvent(event) && !isClubEvent(event) && !isMusicEvent(event) && !isOptredenEvent(event);
}

function kindHit(event, chip) {
  if (chip === "film") return isFilmEvent(event);
  if (chip === "club") return isClubEvent(event);
  if (chip === "muziek") return isMusicEvent(event);
  if (chip === "optreden") return isOptredenEvent(event);
  if (chip === "overig") return isOverigEvent(event);
  return false;
}

function matchesChips(event) {
  const preset = agendaFilters.preset;
  if (preset === "muziek-geen-club") return isMusicEvent(event) && !isClubEvent(event);
  if (preset === "optreden") return isOptredenEvent(event);
  if (preset === "film") return isFilmEvent(event);
  if (preset === "club") return isClubEvent(event);
  if (preset === "overig") return isOverigEvent(event);
  return true;
}

function matchesQuery(event) {
  const query = agendaFilters.query.trim().toLowerCase();
  if (!query) return true;
  return `${event.titel || event.title || ""} ${event.beschrijving || event.description || ""} ${event.locatie || event.location || ""} ${event.bron || ""} ${event.categorie || ""}`
    .toLowerCase()
    .includes(query);
}

function applyClientFilters(events) {
  return events.filter((event) => inSelectedDateRange(eventDate(event)) && matchesTime(event) && matchesChips(event));
}

function syncFilterControls() {
  document.querySelectorAll("#agendaTimeTabs [data-time]").forEach((btn) => {
    const on = btn.dataset.time === agendaFilters.time;
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-pressed", String(on));
  });
  const presetBtn = document.getElementById("agendaPresetBtn");
  const active = agendaFilters.preset !== "alles";
  presetBtn?.classList.toggle("is-active", active);
  presetBtn?.setAttribute("aria-pressed", String(active));
  document.querySelectorAll("#agendaPresetMenu [data-preset]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.preset === agendaFilters.preset);
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

function updateSourceNote() {}

function setPresetMenu(open) {
  const menu = document.getElementById("agendaPresetMenu");
  const button = document.getElementById("agendaPresetBtn");
  if (!menu || !button) return;
  menu.hidden = !open;
  button.setAttribute("aria-expanded", String(open));
}

function bindAgendaViewTabs() {
  document.querySelectorAll("#agendaTimeTabs [data-time]").forEach((btn) => {
    btn.addEventListener("click", () => {
      agendaFilters.time = agendaFilters.time === btn.dataset.time ? "" : btn.dataset.time;
      setPresetMenu(false);
      syncFilterControls();
      renderAgendaList();
    });
  });
  document.getElementById("agendaPresetBtn")?.addEventListener("click", (event) => {
    event.stopPropagation();
    const menu = document.getElementById("agendaPresetMenu");
    setPresetMenu(menu?.hidden !== false);
  });
  document.querySelectorAll("#agendaPresetMenu [data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      agendaFilters.preset = PRESETS[btn.dataset.preset] ? btn.dataset.preset : "alles";
      setPresetMenu(false);
      syncFilterControls();
      renderAgendaList();
    });
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest(".agenda-preset")) return;
    setPresetMenu(false);
  });
  syncFilterControls();
}

function bindAgendaFilterTabs() {}

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

function renderRaadCalendar(events) {
  if (agendaCount) {
    const meetings = new Set(
      events.map((e) => e.meetingLink || e.link).filter(Boolean)
    );
    const n = events.length;
    const m = meetings.size;
    agendaCount.textContent =
      n === 0
        ? "Geen aankomende vergaderingen"
        : `${n} agendapunten · ${m} ${m === 1 ? "vergadering" : "vergaderingen"}`;
  }

  const byMeeting = new Map();
  for (const event of events) {
    const key =
      event.meetingLink || `${event.startDate}|${event.meetingTitle || event.title}`;
    if (!byMeeting.has(key)) byMeeting.set(key, []);
    byMeeting.get(key).push(event);
  }

  const meetingsHtml = [...byMeeting.values()]
    .map((items) => {
      const first = items[0];
      const meetingTitle = first.meetingTitle || first.sourceLabel || "Vergadering";
      const when = [
        weekdayLong(first.startDate),
        first.startDate ? formatAgendaDate(first.startDate) : "",
        first.startTime
          ? `${first.startTime}${first.endTime ? `–${first.endTime}` : ""}`
          : "",
      ]
        .filter(Boolean)
        .join(" · ");
      const meetingUrl = first.meetingLink || first.link;
      const hasPoints = items.some((e) => e.itemNumber);

      const rows = items
        .map((event) => {
          const num = event.itemNumber || "";
          const title = event.itemTitle || event.title;
          const isSection =
            /^(A|B|C)-agenda/i.test(title) || /^Sluiting$/i.test(title);
          return `
            <a class="raad-item ${isSection ? "raad-item--section" : ""}" href="${agendaEscape(event.link)}" target="_blank" rel="noopener noreferrer">
              <span class="raad-item-num">${agendaEscape(num || "·")}</span>
              <span class="raad-item-body">
                <span class="raad-item-title">${agendaEscape(title)}</span>
                ${
                  event.description && event.itemNumber
                    ? `<span class="raad-item-meta">${agendaEscape(event.description.slice(0, 140))}</span>`
                    : ""
                }
              </span>
            </a>`;
        })
        .join("");

      return `
        <section class="raad-meeting">
          <a class="raad-meeting-head" href="${agendaEscape(meetingUrl)}" target="_blank" rel="noopener noreferrer">
            <span class="raad-meeting-title">${agendaEscape(meetingTitle)}</span>
            <span class="raad-meeting-meta">${agendaEscape([when, first.location].filter(Boolean).join(" · "))}</span>
            ${hasPoints ? "" : '<span class="raad-meeting-meta">Agenda nog niet gepubliceerd</span>'}
          </a>
          <div class="raad-month-list">${rows}</div>
        </section>`;
    })
    .join("");

  agendaList.innerHTML = `
    <div class="raad-calendar">
      <p class="raad-scrape-note">
        Agendapunten uit dagelijkse cache.
        <a href="${RAAD_CALENDAR_URL}" target="_blank" rel="noopener noreferrer">Bronkalender</a>
      </p>
      ${
        meetingsHtml ||
        '<p class="news-empty">Geen aankomende vergaderingen.</p>'
      }
    </div>`;
}

function sortRaadEvents(events) {
  return [...events].sort((a, b) => {
    const da = a.startDate || "9999-99-99";
    const db = b.startDate || "9999-99-99";
    if (da !== db) return da.localeCompare(db);
    const ta = a.startTime || "";
    const tb = b.startTime || "";
    if (ta !== tb) return ta.localeCompare(tb);
    const parts = (num) =>
      String(num || "999")
        .split(".")
        .map((p) => (Number.isFinite(Number(p)) ? Number(p) : 999));
    const pa = parts(a.itemNumber);
    const pb = parts(b.itemNumber);
    for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
      const x = pa[i] ?? 0;
      const y = pb[i] ?? 0;
      if (x !== y) return x - y;
    }
    return (a.title || "").localeCompare(b.title || "");
  });
}

function renderAgendaList() {
  if (!agendaList) return;

  if (agendaFilters.preset === "vergadering" && agendaEvents.some((event) => event.itemNumber)) {
    renderRaadCalendar(sortRaadEvents(applyClientFilters(agendaEvents)));
    return;
  }

  const filtered = applyClientFilters(agendaEvents).sort((a, b) => {
    const da = eventDate(a) || "9999-99-99";
    const db = eventDate(b) || "9999-99-99";
    if (da !== db) return da.localeCompare(db);
    return String(a.tijd || a.startTime || "").localeCompare(String(b.tijd || b.startTime || ""));
  });

  if (agendaCount) {
    const n = filtered.length;
    agendaCount.textContent =
      n === 0 ? "Niets gevonden" : `${n} ${n === 1 ? "evenement" : "evenementen"}`;
  }

  if (!filtered.length) {
    agendaList.innerHTML = `<p class="news-empty">Niets gevonden met deze filters.</p>`;
    return;
  }

  const rows = filtered
    .map((event, index) => {
      const panelId = `agenda-panel-${index}`;
      const title = event.titel || event.title || "Onbekend";
      const when = formatAgendaWhen(event);
      const place = event.locatie && event.locatie !== "Onbekend" ? event.locatie : event.location || "";
      const metaParts = [when, place].filter(Boolean).join(" · ");
      const body = event.beschrijving && event.beschrijving !== "Onbekend"
        ? event.beschrijving
        : event.description || "Geen korte beschrijving. Open de pagina voor meer info.";
      const known = (value) => value && value !== "Onbekend";
      const facts = [event.categorie, event.interval, event.laag].filter(known);
      const extra = [
        known(event.leeftijd) ? event.leeftijd : "",
        known(event.prijs) ? event.prijs : "",
      ].filter(Boolean);
      const program = Array.isArray(event.programma)
        ? event.programma
            .map((act) => `${act.tijd && act.tijd !== "Onbekend" ? `${act.tijd} ` : ""}${act.titel}${act.locatie && act.locatie !== "Onbekend" ? ` · ${act.locatie}` : ""}`)
            .join("\n")
        : "";
      const upcoming = Array.isArray(event.komende) && event.komende.length > 1 ? event.komende.join(", ") : "";
      const dateParts = formatAgendaDateParts(eventDate(event));
      const tint = sourceTint(event);
      const dateChip = dateParts
        ? `<span class="agenda-date-chip${tint ? ` is-${tint}` : ""}" aria-hidden="true">
              <span class="agenda-date-day">${agendaEscape(dateParts.day)}</span>
              <span class="agenda-date-wday">${agendaEscape(dateParts.weekday)}</span>
            </span>`
        : `<span class="agenda-date-chip agenda-date-chip--empty" aria-hidden="true">
              <span class="agenda-date-day">–</span>
              <span class="agenda-date-wday">?</span>
            </span>`;
      const toggleLabel = dateParts ? `${dateParts.label}: ${title}` : title;
      const sourceLabel = event.bron || event.sourceLabel || "";
      const link = event.link && event.link !== "Onbekend" ? event.link : "";

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
            <span class="news-item-title">${agendaEscape(title)}</span>
            <span class="news-chevron" aria-hidden="true"></span>
          </button>
          <div class="news-panel" id="${panelId}" hidden>
            <div class="news-meta">
              <span class="news-source">${agendaEscape(sourceLabel)}</span>
              ${agendaEscape(metaParts)}
            </div>
            ${facts.length || extra.length ? `<p class="news-blurb">${agendaEscape([...facts, ...extra].join(" - "))}</p>` : ""}
            <p class="news-blurb">${agendaEscape(body)}</p>
            ${program ? `<p class="news-blurb">${agendaEscape(program)}</p>` : ""}
            ${upcoming ? `<p class="news-blurb">Komende datums: ${agendaEscape(upcoming)}</p>` : ""}
            <div class="agenda-actions">
              ${
                link
                  ? `<a class="news-open" href="${agendaEscape(link)}" target="_blank" rel="noopener noreferrer">Bekijk evenement →</a>`
                  : ""
              }
              <button
                type="button"
                class="agenda-share-btn"
                data-share-title="${agendaEscape(title)}"
                data-share-url="${agendaEscape(link)}"
              >Vraag vriend</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  agendaList.innerHTML = `<div class="news-rows">${rows}</div>`;
  bindAgendaToggles();
  bindAgendaShareButtons();
}

function bindAgendaShareButtons() {
  agendaList?.querySelectorAll(".agenda-share-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      shareEventInvite(btn.dataset.shareTitle || "", btn.dataset.shareUrl || "");
    });
  });
}

async function loadAgendaData() {
  const response = await fetch(AGENDA_DATA_FEED, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  allAgendaEvents = Array.isArray(data) ? data : data.events || [];
  agendaDataLoaded = true;
  if (agendaSourceNote && data.updated) {
    const stamp = String(data.updated).slice(0, 10);
    agendaSourceNote.dataset.updated = stamp;
  }
}

async function loadAgenda({ force = false } = {}) {
  if (!agendaList) return;
  if (agendaLoading) return;

  if (agendaDataLoaded && !force) {
    agendaEvents = allAgendaEvents;
    renderAgendaList();
    return;
  }

  agendaLoading = true;
  agendaPanel?.classList.add("is-loading");
  agendaList.innerHTML = '<p class="news-empty">Agenda laden…</p>';
  updateSourceNote();

  try {
    await loadAgendaData();
    agendaEvents = allAgendaEvents;
    renderAgendaList();
  } catch (err) {
    console.error("Agenda-cache laden mislukt:", err);
    agendaList.innerHTML =
      '<p class="news-empty">Kon agenda-data.json niet laden. Draai <code>node scripts/build-agenda.mjs</code> of wacht op de dagelijkse Action.</p>';
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
    agendaDataLoaded = false;
    loadAgenda({ force: true });
  },
};

if (agendaPanel && agendaList) {
  bindAgendaViewTabs();
  bindAgendaFilterTabs();
  updateSourceNote();
}
