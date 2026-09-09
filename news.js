const FEEDS = [
  {
    id: "hoornnieuws",
    label: "Hoornnieuws",
    url: "https://hoornnieuws.nl/feed/",
  },
  {
    id: "hoornsdagblad",
    label: "Hoornsdagblad",
    url: "https://www.hoornsdagblad.nl/newsfeed/general",
  },
  {
    id: "hoornsdagblad-sport",
    label: "Hoornsdagblad",
    url: "https://www.hoornsdagblad.nl/newsfeed/sport",
  },
  {
    id: "rodi",
    label: "Rodi Hoorn",
    url: "https://www.rodi.nl/hoorn/rss",
  },
  {
    id: "streekomroep",
    label: "Streekomroep",
    url: "https://www.streekomroepwestfriesland.nl/feed/",
  },
  {
    id: "hoornactueel",
    label: "HoornActueel",
    url: "https://www.hoornactueel.nl/feed",
  },
  {
    id: "onswestfriesland",
    label: "OnsWestfriesland",
    url: "https://onswestfriesland.nl/feed",
  },
];

const MAX_ITEMS = 20;

const LOCAL_CLUBS_RE =
  /\b(hollandia|hvv hollandia|always forward|de blokkers|blokkers|westfriezen|sport 1889|hsv sport|zwaluwen(?:\s*'?30)?|hcsv|hv hoorn|wfhc|wfhc hoorn|stg hoorn|slash hoorn|hv blokker|sew|spartanen|vv berkhout|berkhout|woudia|hauwert\s*65|dess|zwaagdijk|rkvv zwaagdijk|vv moc|kwiek\s*'?78|de valken|sint george|spirit\s*'?30|vvs\s*'?46|vv alc|rkedo|zvv zwaag)\b/i;

const SPORT_RE =
  /\b(sport|voetbal|hockey|tennis|handbal|basketbal|volleybal|atletiek|wielrennen|schaats|zwem|futsal|zaalvoetbal|badminton|padel|wedstrijd|beker|eredivisie|hoofdklasse|knvb|keeper|doelpunt|competitie|training|uitslag|strafschop|hardloop|marathon|triathlon|fietsclassic|wieler|toernooi)\b|(?:\brun\b)|(?:\braces?\b)/i;

const URGENT_RE =
  /\b(112|politie|brandweer|ambulance|traumaheli|grip|ongevallen?|ongeluk|aanrijding|botsing|botsen|gebotst|overleden|dode|dodelijk|zwaargewond|onwel|brand|inbraak|diefstal|mishandel|schiet|steek|evacu|afzetting|gevaarlijke stof|chemisch|vermist|getuigen gezocht|crash|ontploffing|explosie|zeer grote brand)\b/i;

const TRAFFIC_URGENT_RE =
  /\b(verkeershinder|afsluitingen?|afgesloten|ov-staking|trein.?staking|busstaking|geen ns-treinen|buurtbussen staken|file op)\b/i;

const CULTURE_RE =
  /\b(cultuur|kunst|muziek|festival|concert|tentoonstelling|theater|museum|kermis|feest|uitgaan|eten|restaurant|borrel|podcast|column|histor|erfgoed|dialect|westfries|open monument|tentoon|galerie|voorstelling|toneel|jazz|koor|harmonie|orkest)\b/i;

/**
 * Exclusieve classificatie (één tab per bericht):
 * 1. Urgent  — 112/veiligheid/misdaad + zware verkeershinder (niet "politiek")
 * 2. Sport   — clubs, wedstrijden, sportcategorie
 * 3. Cultuur — rest (kunst/uitgaan + overig lokaal nieuws)
 */
function classifyBucket(item) {
  if (matchesUrgent(item)) return "urgent";
  if (matchesSport(item)) return "sport";
  return "cultuur";
}

const TABS = {
  urgent: {
    id: "urgent",
    title: "Urgent",
    subtitle: "112, veiligheid & spoed",
    filter: (items) => items.filter((i) => i.bucket === "urgent"),
    score: scoreUrgent,
  },
  cultuur: {
    id: "cultuur",
    title: "Cultuur",
    subtitle: "Kunst, uitgaan & overig lokaal",
    filter: (items) => items.filter((i) => i.bucket === "cultuur"),
    score: scoreCulture,
  },
  sport: {
    id: "sport",
    title: "Sport",
    subtitle: "Clubs & uitslagen Hoorn e.o.",
    filter: (items) => items.filter((i) => i.bucket === "sport"),
    score: scoreSport,
  },
};

const digestEl = document.getElementById("digest-card");
const newsDigestEl = document.getElementById("newsDigest");
const tabButtons = [...document.querySelectorAll(".news-tab")];

let allItems = [];
let activeTab = "urgent";

function setStatus(_message, _isError = false) {
  // Statusregel is bewust verborgen in de UI
}

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return (tmp.textContent || tmp.innerText || "").trim();
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function categoryList(item) {
  if (Array.isArray(item.categories)) return item.categories.filter(Boolean);
  if (typeof item.categories === "string" && item.categories) {
    return [item.categories];
  }
  return [];
}

function itemText(item) {
  return `${item.title} ${stripHtml(item.description)}`;
}

function catsText(item) {
  return item.categories.map((c) => c.toLowerCase()).join(" ");
}

function normalizeItems(items, source) {
  return items
    .map((item) => {
      const normalized = {
        title: item.title?.trim() || "Zonder titel",
        link: item.link || item.guid || "#",
        pubDate: item.pubDate || item.published || "",
        description: item.description || item.content || "",
        categories: categoryList(item),
        sourceId: source.id.startsWith("hoornsdagblad")
          ? "hoornsdagblad"
          : source.id,
        sourceLabel: source.label,
      };
      normalized.bucket = classifyBucket(normalized);
      return normalized;
    })
    .filter((item) => item.link && item.link !== "#");
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
    .filter((w) => w.length > 3)
    .slice(0, 6)
    .join(" ");
}

// Plaatsnamen eruit zodat "botsen in Grootebroek" ≈ "botsen op Venneweg" herkend wordt
const PLACE_NOISE_RE =
  /\b(hoorn|zwaag|blokker|grootebroek|enkhuizen|medemblik|opmeer|venneweg|kersenboogerd|stedebroec|westfriesland|noord[- ]holland|andijk|spanbroek|wognum|obdam|heerhugowaard)\b/gi;

function softTitleKey(title) {
  return titleKey(title.replace(PLACE_NOISE_RE, " "));
}

function titleWords(title) {
  const places = new Set(
    "hoorn zwaag blokker grootebroek enkhuizen medemblik opmeer venneweg kersenboogerd stedebroec westfriesland andijk spanbroek wognum obdam heerhugowaard".split(
      " "
    )
  );
  return new Set(
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !places.has(w) && w !== "noord" && w !== "holland")
  );
}

function titleSimilarity(a, b) {
  const A = titleWords(a);
  const B = titleWords(b);
  if (!A.size || !B.size) return 0;
  let overlap = 0;
  for (const w of A) {
    if (B.has(w)) overlap += 1;
  }
  return overlap / Math.max(A.size, B.size);
}

function dedupeSimilar(items) {
  // Nieuwste eerst bewaren bij bijna-dubbels
  const sorted = [...items].sort(
    (a, b) => new Date(b.pubDate) - new Date(a.pubDate)
  );
  const result = [];

  for (const item of sorted) {
    const key = titleKey(item.title);
    const soft = softTitleKey(item.title);
    const isDup = result.some((kept) => {
      if (key && key === titleKey(kept.title)) return true;
      if (soft && soft === softTitleKey(kept.title)) return true;
      // Zelfde krant + sterk overlappende kop
      if (
        item.sourceId === kept.sourceId &&
        titleSimilarity(item.title, kept.title) >= 0.65
      ) {
        return true;
      }
      // Over bronnen heen: bijna identiek
      if (titleSimilarity(item.title, kept.title) >= 0.85) return true;
      return false;
    });

    if (!isDup) result.push(item);
  }

  return result;
}

function ageBonus(item) {
  const ageHours =
    (Date.now() - new Date(item.pubDate).getTime()) / (1000 * 60 * 60);
  if (Number.isNaN(ageHours)) return 0;
  if (ageHours < 3) return 50;
  if (ageHours < 12) return 35;
  if (ageHours < 24) return 25;
  if (ageHours < 48) return 12;
  if (ageHours < 72) return 5;
  return 0;
}

function matchesUrgent(item) {
  const cats = catsText(item);
  const text = itemText(item);
  // Let op: "politiek" mag NIET matchen op "politie"
  if (/(^|[\s,/&])112([\s,/&-]|$)|112-nieuws|112 nieuws/.test(cats)) return true;
  if (/\bpolitie\b|\bmisdaad\b/.test(cats)) return true;
  if (URGENT_RE.test(text)) return true;
  if (TRAFFIC_URGENT_RE.test(text)) return true;
  // Samenstellingen zoals fietsongevallen
  if (/ongevallen?/.test(text.toLowerCase())) return true;
  return false;
}

function matchesSport(item) {
  const cats = catsText(item);
  const text = itemText(item);
  if (/\bsport\b/.test(cats)) return true;
  if (LOCAL_CLUBS_RE.test(text)) return true;
  if (SPORT_RE.test(text)) return true;
  // Evenementnamen zonder spatie: FietsClassic, Damloop, etc.
  if (/fietsclassic|(?:^|[\s-])run(?:\s|$)|hardlo|dam.?tot.?dam/i.test(text)) {
    return true;
  }
  return false;
}

function scoreUrgent(item) {
  const cats = catsText(item);
  const text = itemText(item).toLowerCase();
  let score = ageBonus(item);

  if (/\b112\b/.test(cats)) score += 35;
  if (/politie|misdaad/.test(cats)) score += 18;
  if (/overleden|dodelijk|dode|zwaargewond|grip/.test(text)) score += 30;
  if (/ongeval|aanrijding|botsing|brand|evacu|gevaarlijke stof/.test(text)) {
    score += 22;
  }
  if (/inbraak|mishandel|getuigen|diefstal/.test(text)) score += 16;
  return score;
}

function scoreSport(item) {
  const cats = catsText(item);
  const text = itemText(item).toLowerCase();
  let score = ageBonus(item);

  if (cats.includes("sport")) score += 25;
  if (LOCAL_CLUBS_RE.test(text)) score += 40;
  if (/hollandia|always forward|hv hoorn|wfhc|de blokkers|westfriezen|sport 1889|zwaluwen/.test(text)) {
    score += 15;
  }
  if (/\baz\b|sc heerenveen|knvb|eredivisie|hoofdklasse|beker/.test(text)) {
    score += 12;
  }
  if (/wedstrijd|doelpunt|uitslag|winst|nederlaag|gelijkspel|strafschop/.test(text)) {
    score += 10;
  }
  return score;
}

function scoreCulture(item) {
  const cats = catsText(item);
  const text = itemText(item).toLowerCase();
  let score = ageBonus(item);

  if (/kunst|cultuur|uitgaan/.test(cats)) score += 30;
  if (CULTURE_RE.test(text)) score += 26;
  if (/festival|concert|museum|theater|kermis|open monument/.test(text)) {
    score += 18;
  }
  if (/gemeente|regio|lokaal|wonen|onderwijs/.test(cats)) score += 8;
  if (/hoorn|zwaag|blokker|west[- ]?fries|enkhuizen|medemblik/.test(text)) {
    score += 10;
  }
  return score;
}

function compareByTab(scoreFn) {
  return (a, b) => {
    const dateDiff = new Date(b.pubDate) - new Date(a.pubDate);
    if (dateDiff !== 0) return dateDiff;
    return scoreFn(b) - scoreFn(a);
  };
}

function pickForTab(items, scoreFn) {
  return [...items]
    .sort(compareByTab(scoreFn))
    .slice(0, MAX_ITEMS);
}

function articleBody(description, max = 480) {
  const plain = stripHtml(description).replace(/\s+/g, " ").trim();
  if (!plain) return "Geen samenvatting beschikbaar.";
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max - 1).trimEnd()}…`;
}

function categoryLabel(item) {
  return item.categories[0] || "Nieuws";
}

function textContent(node, selector) {
  const el = node.querySelector(selector);
  return el ? el.textContent.trim() : "";
}

async function fetchViaRss2Json(feedUrl) {
  const endpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`rss2json HTTP ${response.status}`);
  const data = await response.json();
  if (data.status !== "ok" || !Array.isArray(data.items)) {
    throw new Error(data.message || "rss2json gaf geen geldige feed terug");
  }
  return data.items;
}

async function fetchViaAllOrigins(feedUrl) {
  const endpoint = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`AllOrigins HTTP ${response.status}`);
  const xml = await response.text();
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) {
    throw new Error("RSS XML kon niet worden geparsed");
  }

  return [...doc.querySelectorAll("item")].map((item) => {
    const categories = [...item.querySelectorAll("category")].map((c) =>
      c.textContent.trim()
    );
    const encoded = item.getElementsByTagNameNS(
      "http://purl.org/rss/1.0/modules/content/",
      "encoded"
    )[0];

    return {
      title: textContent(item, "title"),
      link: textContent(item, "link"),
      pubDate: textContent(item, "pubDate"),
      description:
        encoded?.textContent?.trim() ||
        textContent(item, "description") ||
        "",
      categories,
    };
  });
}

async function fetchFeed(source) {
  try {
    const items = await fetchViaRss2Json(source.url);
    return {
      source,
      items: normalizeItems(items, source),
      via: "rss2json",
    };
  } catch (primaryError) {
    console.warn(`${source.label} via rss2json mislukt:`, primaryError);
    const items = await fetchViaAllOrigins(source.url);
    return {
      source,
      items: normalizeItems(items, source),
      via: "allorigins",
    };
  }
}

function mergeFeeds(results) {
  const combined = results.flatMap((r) => r.items);
  combined.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  return dedupeSimilar(combined);
}

function bucketCounts(items) {
  const counts = { urgent: 0, cultuur: 0, sport: 0 };
  for (const item of items) {
    counts[item.bucket] = (counts[item.bucket] || 0) + 1;
  }
  return counts;
}

function renderActiveTab() {
  const tab = TABS[activeTab];
  const filtered = tab.filter(allItems);
  const top = pickForTab(filtered, tab.score);

  if (!top.length) {
    digestEl.hidden = false;
    digestEl.innerHTML = `<p class="news-empty">Geen berichten voor “${escapeHtml(tab.title)}”.</p>`;
    return;
  }

  const rows = top
    .map((item, index) => {
      const body = articleBody(item.description);
      const panelId = `news-panel-${index}`;

      return `
        <article class="news-row">
          <button
            type="button"
            class="news-toggle"
            aria-expanded="false"
            aria-controls="${panelId}"
          >
            <span class="news-item-title">${escapeHtml(item.title)}</span>
            <span class="news-chevron" aria-hidden="true"></span>
          </button>
          <div class="news-panel" id="${panelId}" hidden>
            <div class="news-meta">
              <span class="news-source source-${escapeHtml(item.sourceId)}">${escapeHtml(item.sourceLabel)}</span>
              ${escapeHtml(categoryLabel(item))} · ${escapeHtml(formatDate(item.pubDate))}
            </div>
            <p class="news-blurb">${escapeHtml(body)}</p>
            <a
              class="news-open"
              href="${escapeHtml(item.link)}"
              target="_blank"
              rel="noopener noreferrer"
            >Lees op de site →</a>
          </div>
        </article>
      `;
    })
    .join("");

  digestEl.hidden = false;
  digestEl.innerHTML = `<div class="news-rows">${rows}</div>`;

  bindCardToggles();
}

function bindCardToggles() {
  digestEl.querySelectorAll(".news-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest(".news-row");
      const panel = row?.querySelector(".news-panel");
      if (!panel) return;

      const willOpen = panel.hidden;
      digestEl.querySelectorAll(".news-row.is-open").forEach((openRow) => {
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

function setActiveTab(tabId) {
  if (!TABS[tabId]) return;
  activeTab = tabId;
  if (newsDigestEl) {
    newsDigestEl.classList.remove("theme-urgent", "theme-cultuur", "theme-sport");
    newsDigestEl.classList.add(`theme-${tabId}`);
  }
  tabButtons.forEach((btn) => {
    const on = btn.dataset.tab === tabId;
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-selected", on ? "true" : "false");
  });
  if (allItems.length) renderActiveTab();
}

async function loadNews() {
  setStatus("Feeds ophalen…");

  const settled = await Promise.allSettled(FEEDS.map(fetchFeed));
  const ok = settled
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);
  const failed = [];
  settled.forEach((r, i) => {
    if (r.status === "rejected") {
      failed.push(FEEDS[i].label);
      console.error(`${FEEDS[i].label} mislukt:`, r.reason);
    }
  });

  if (!ok.length) {
    setStatus("Kon geen feeds ophalen. Probeer opnieuw.", true);
    digestEl.hidden = false;
    digestEl.innerHTML =
      '<p class="news-empty">Geen berichten geladen. Vernieuw de pagina en probeer opnieuw.</p>';
    return;
  }

  allItems = mergeFeeds(ok);
  renderActiveTab();

  const counts = bucketCounts(allItems);
  const now = new Intl.DateTimeFormat("nl-NL", {
    timeStyle: "medium",
  }).format(new Date());
  const sources = [...new Set(ok.map((r) => r.source.label))].join(" + ");
  const warn = failed.length ? ` · ontbreekt: ${failed.join(", ")}` : "";
  setStatus(
    `${allItems.length} items · U ${counts.urgent} · C ${counts.cultuur} · S ${counts.sport} · ${sources} · ${now}${warn}`,
    failed.length > 0
  );
}

if (digestEl && newsDigestEl) {
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
  });
  loadNews();
}