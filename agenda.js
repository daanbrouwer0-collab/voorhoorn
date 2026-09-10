const AGENDA_API = "https://komnaarhoorn.nl/wp-json/agenda/v1";

const AGENDA_DATE_LABELS = {
  this_week: "Deze week",
  this_month: "Deze maand",
  next_month: "Volgende maand",
  this_year: "Alles",
};

const agendaPanel = document.getElementById("agendaPanel");
const agendaList = document.getElementById("agendaList");
const agendaCategoryTabs = document.getElementById("agendaCategoryTabs");
const agendaDateTabs = document.getElementById("agendaDateTabs");
const agendaAccessTabs = document.getElementById("agendaAccessTabs");

let agendaEvents = [];
let agendaLoaded = false;
let agendaLoading = false;
let agendaFilters = {
  dateRange: "this_week",
  category: "",
  access: "",
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

async function fetchAgendaJson(url) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (primaryError) {
    console.warn("Agenda directe fetch mislukt, probeer proxy:", primaryError);
    const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxy, { cache: "no-store" });
    if (!response.ok) throw new Error(`Proxy HTTP ${response.status}`);
    return await response.json();
  }
}

function buildAgendaQuery(page = 1) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (agendaFilters.dateRange) params.set("dateRange", agendaFilters.dateRange);
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
  const articles = [...doc.querySelectorAll("article.agenda-item")];

  return articles
    .map((article) => {
      const linkEl = article.querySelector("a[href]");
      const titleAttr = linkEl?.getAttribute("title") || "";
      const titleFromAttr = titleAttr.replace(/^Bekijk evenement:\s*/i, "").trim();
      const title =
        titleFromAttr ||
        article.querySelector("h3")?.textContent?.trim() ||
        "Evenement";

      const location =
        article.querySelector(".ti-map-pin")?.closest("div")?.querySelector("span")
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
        id: article.id || title,
        title: decodeEntities(title),
        link: linkEl?.href || "#",
        location: decodeEntities(location),
        description: decodeEntities(description),
        startDate: dayDates[0] || "",
        endDate: dayDates[1] || "",
        startTime: clockTimes[0] || "",
        endTime: clockTimes[1] || "",
      };
    })
    .filter((item) => item.link && item.link !== "#");
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
  const buttons = [
    { slug: "", name: "Alles" },
    ...categories.map((c) => ({
      slug: c.slug,
      name: decodeEntities(stripTags(c.name || c.slug)),
    })),
  ];

  agendaCategoryTabs.innerHTML = buttons
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
      loadAgenda({ force: true });
    });
  });
}

function bindAgendaFilterTabs() {
  agendaDateTabs?.querySelectorAll(".news-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      agendaFilters.dateRange = btn.dataset.dateRange || "this_week";
      setActiveTabGroup(agendaDateTabs, "data-date-range", agendaFilters.dateRange);
      loadAgenda({ force: true });
    });
  });

  agendaAccessTabs?.querySelectorAll(".news-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      agendaFilters.access = btn.dataset.access || "";
      setActiveTabGroup(agendaAccessTabs, "data-access", agendaFilters.access);
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

  if (!agendaEvents.length) {
    const period = AGENDA_DATE_LABELS[agendaFilters.dateRange] || "deze periode";
    agendaList.innerHTML = `<p class="news-empty">Geen evenementen gevonden voor ${agendaEscape(period)}.</p>`;
    return;
  }

  const rows = agendaEvents
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
              <span class="news-source">Kom naar Hoorn</span>
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

async function loadAgendaFilters() {
  try {
    const data = await fetchAgendaJson(`${AGENDA_API}/filters`);
    renderAgendaCategoryTabs(Array.isArray(data.categories) ? data.categories : []);
  } catch (err) {
    console.warn("Agenda filters laden mislukt:", err);
    renderAgendaCategoryTabs([
      { slug: "muziek", name: "Muziek" },
      { slug: "festival", name: "Festival" },
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
  agendaPanel?.classList.add("is-loading");
  agendaList.innerHTML = '<p class="news-empty">Agenda laden…</p>';

  try {
    const firstUrl = `${AGENDA_API}/items?${buildAgendaQuery(1)}`;
    const first = await fetchAgendaJson(firstUrl);
    let events = parseAgendaArticles(first.html || "");
    const totalPages = Math.max(1, Number(first.totalPages) || 1);

    // Toon eerste pagina meteen, vul daarna aan
    agendaEvents = events;
    renderAgendaList();

    if (totalPages > 1) {
      for (let page = 2; page <= totalPages; page += 1) {
        const pageData = await fetchAgendaJson(
          `${AGENDA_API}/items?${buildAgendaQuery(page)}`
        );
        events = events.concat(parseAgendaArticles(pageData.html || ""));
        agendaEvents = events;
        renderAgendaList();
      }
    }

    // Chronologisch op startdatum
    agendaEvents.sort((a, b) => {
      const da = a.startDate || "9999-99-99";
      const db = b.startDate || "9999-99-99";
      if (da !== db) return da.localeCompare(db);
      return (a.startTime || "").localeCompare(b.startTime || "");
    });
    renderAgendaList();
    agendaLoaded = true;
  } catch (err) {
    console.error("Agenda laden mislukt:", err);
    agendaEvents = [];
    agendaList.innerHTML =
      '<p class="news-empty">Kon de agenda niet laden. Vernieuw de pagina of probeer later opnieuw.</p>';
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
  loadAgendaFilters();
}
