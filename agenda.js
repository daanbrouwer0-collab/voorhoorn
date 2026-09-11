/**
 * Agenda UI — data komt uit agenda-data.json (dagelijkse scrape).
 * Nieuws blijft live in news.js. Filters (periode / stad / kids / raad) zijn client-side.
 */
const AGENDA_DATA_FEED = "agenda-data.json";
const RAAD_CALENDAR_URL = "https://hoorn.bestuurlijkeinformatie.nl/Calendar";

const AGENDA_DATE_LABELS = {
  this_week: "Deze week",
  this_month: "Deze maand",
  next_month: "Volgende maand",
  this_year: "Alles",
};

const AGENDA_VIEW_NOTES = {
  stad:
    'Dagelijkse cache · Kom naar Hoorn, Manifesto, Netwerk · <a href="https://komnaarhoorn.nl/agenda/" target="_blank" rel="noopener noreferrer">Bron</a>',
  kinderen:
    'Kids/jongeren uit cache · <a href="https://netwerkhoorn.nl/activiteiten?forWhoGroup=Jeugd" target="_blank" rel="noopener noreferrer">Netwerk Jeugd</a>',
  raad:
    'Agendapunten uit cache · <a href="https://hoorn.bestuurlijkeinformatie.nl/Calendar" target="_blank" rel="noopener noreferrer">iBabs</a>',
};

const KIDS_RE =
  /\b(kind|kids|kinderen|kleintjes|jongeren|jeugd|jong!?|familie|peuter|kleuter|schoolvakantie|jeugdtheater|voor\s+de\s+jeugd|lego|speel|tiener)\b/i;

const agendaPanel = document.getElementById("agendaPanel");
const agendaList = document.getElementById("agendaList");
const agendaViewTabs = document.getElementById("agendaViewTabs");
const agendaDateTabs = document.getElementById("agendaDateTabs");
const agendaCount = document.getElementById("agendaCount");
const agendaSourceNote = document.getElementById("agendaSourceNote");

let allAgendaEvents = [];
let agendaEvents = [];
let agendaDataLoaded = false;
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
  if (event.categories?.includes("voor-kinderen")) return true;
  if (event.audience && /jeugd|jongeren|peuters/i.test(event.audience)) return true;
  return KIDS_RE.test(`${event.title} ${event.description} ${event.location}`);
}

function eventsForView(view) {
  if (view === "raad") {
    return allAgendaEvents.filter((e) => e.sourceId === "raad");
  }
  if (view === "kinderen") {
    return allAgendaEvents.filter(
      (e) => e.sourceId !== "raad" && isKidsEvent(e)
    );
  }
  // stad: alles behalve raad
  return allAgendaEvents.filter((e) => e.sourceId !== "raad");
}

function applyClientFilters(events) {
  return events.filter((event) => {
    if (agendaFilters.view === "raad") {
      if (event.sourceId !== "raad") return false;
      if (!event.startDate) return true;
      const eventDate = startOfDay(new Date(`${event.startDate}T12:00:00`));
      return !Number.isNaN(eventDate.getTime()) && eventDate >= startOfDay(new Date());
    }
    if (!inSelectedDateRange(event.startDate)) return false;
    if (agendaFilters.view === "kinderen" && !isKidsEvent(event)) return false;
    if (event.sourceId === "raad") return false;
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

function updateAgendaChrome() {
  const isRaad = agendaFilters.view === "raad";
  if (agendaDateTabs) agendaDateTabs.hidden = isRaad;
  const toolbar = document.querySelector(".agenda-toolbar");
  if (toolbar) toolbar.hidden = isRaad;
}

function updateSourceNote() {
  if (!agendaSourceNote) return;
  agendaSourceNote.innerHTML =
    AGENDA_VIEW_NOTES[agendaFilters.view] || AGENDA_VIEW_NOTES.stad;
  updateAgendaChrome();
}

function bindAgendaViewTabs() {
  agendaViewTabs?.querySelectorAll(".news-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.agendaView || "stad";
      if (next === agendaFilters.view) return;
      agendaFilters.view = next;
      setActiveTabGroup(agendaViewTabs, "data-agenda-view", agendaFilters.view);
      updateSourceNote();
      agendaEvents = eventsForView(next);
      renderAgendaList();
    });
  });
}

function bindAgendaFilterTabs() {
  agendaDateTabs?.querySelectorAll(".news-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      agendaFilters.dateRange = btn.dataset.dateRange || "this_month";
      setActiveTabGroup(agendaDateTabs, "data-date-range", agendaFilters.dateRange);
      renderAgendaList();
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
  updateAgendaChrome();

  if (agendaFilters.view === "raad") {
    renderRaadCalendar(sortRaadEvents(applyClientFilters(agendaEvents)));
    return;
  }

  const filtered = applyClientFilters(agendaEvents).sort((a, b) => {
    const da = a.startDate || "9999-99-99";
    const db = b.startDate || "9999-99-99";
    if (da !== db) return da.localeCompare(db);
    return (a.startTime || "").localeCompare(b.startTime || "");
  });

  if (agendaCount) {
    const n = filtered.length;
    agendaCount.textContent =
      n === 0 ? "Niets gevonden" : `${n} ${n === 1 ? "evenement" : "evenementen"}`;
  }

  if (!filtered.length) {
    const period = AGENDA_DATE_LABELS[agendaFilters.dateRange] || "deze periode";
    const hint =
      agendaFilters.view === "kinderen"
        ? " Tip: kies periode “Alles”."
        : "";
    agendaList.innerHTML = `<p class="news-empty">Geen items gevonden voor ${agendaEscape(period)}.${agendaEscape(hint)}</p>`;
    return;
  }

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
            <div class="agenda-actions">
              <a
                class="news-open"
                href="${agendaEscape(event.link)}"
                target="_blank"
                rel="noopener noreferrer"
              >Bekijk evenement →</a>
              <button
                type="button"
                class="agenda-share-btn"
                data-share-title="${agendaEscape(event.title)}"
                data-share-url="${agendaEscape(event.link)}"
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
    agendaEvents = eventsForView(agendaFilters.view);
    renderAgendaList();
    return;
  }

  agendaLoading = true;
  agendaPanel?.classList.add("is-loading");
  agendaList.innerHTML = '<p class="news-empty">Agenda laden…</p>';
  updateSourceNote();

  try {
    await loadAgendaData();
    agendaEvents = eventsForView(agendaFilters.view);
    renderAgendaList();
  } catch (err) {
    console.error("Agenda-cache laden mislukt:", err);
    agendaList.innerHTML =
      '<p class="news-empty">Kon agenda-data.json niet laden. Draai <code>python3 scripts/scrape-agenda.py</code> of wacht op de dagelijkse Action.</p>';
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
