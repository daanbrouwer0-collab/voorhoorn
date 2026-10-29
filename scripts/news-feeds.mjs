/**
 * RSS-feeds voor het lokale nieuws. Zowel de sitefunctie als de cache gebruiken dit.
 */
const PER_FEED = 25;

export const FEEDS = [
  { id: "hoornnieuws", label: "Hoornnieuws", url: "https://hoornnieuws.nl/feed/" },
  { id: "hoornsdagblad", label: "Hoornsdagblad", url: "https://www.hoornsdagblad.nl/newsfeed/general" },
  { id: "hoornsdagblad-sport", label: "Hoornsdagblad", url: "https://www.hoornsdagblad.nl/newsfeed/sport" },
  { id: "rodi", label: "Rodi Hoorn", url: "https://www.rodi.nl/hoorn/rss" },
  { id: "streekomroep", label: "Streekomroep", url: "https://www.streekomroepwestfriesland.nl/feed/" },
  { id: "hoornactueel", label: "HoornActueel", url: "https://www.hoornactueel.nl/feed" },
  { id: "onswestfriesland", label: "OnsWestfriesland", url: "https://onswestfriesland.nl/feed" },
];

function decodeEntities(text) {
  let out = text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  for (let pass = 0; pass < 2; pass += 1) {
    out = out
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&euro;/g, "€")
      .replace(/&eacute;/g, "é")
      .replace(/&euml;/g, "ë")
      .replace(/&egrave;/g, "è")
      .replace(/&iuml;/g, "ï")
      .replace(/&ouml;/g, "ö")
      .replace(/&oacute;/g, "ó")
      .replace(/&uuml;/g, "ü")
      .replace(/&aacute;/g, "á")
      .replace(/&agrave;/g, "à")
      .replace(/&ccedil;/g, "ç")
      .replace(/&ndash;|&#8211;/g, "–")
      .replace(/&mdash;|&#8212;/g, "—")
      .replace(/&hellip;|&#8230;/g, "…")
      .replace(/&rsquo;|&#8217;|&lsquo;|&#8216;/g, "'")
      .replace(/&ldquo;|&rdquo;|&#8220;|&#8221;/g, '"')
      .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
      .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)));
  }
  return out;
}

function stripTags(html) {
  return decodeEntities(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function blocks(xml, tag) {
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "gi");
  return [...xml.matchAll(re)].map((match) => match[1]);
}

function inner(block, tag) {
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = block.match(re);
  return match ? decodeEntities(match[1]).trim() : "";
}

function atomLink(block) {
  const tags = [...block.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
  const preferred = tags.find((tag) => /rel=["']alternate["']/i.test(tag)) || tags[0];
  if (!preferred) return "";
  const href = preferred.match(/href=["']([^"']+)["']/i);
  return href ? decodeEntities(href[1]) : "";
}

function categoriesOf(block) {
  const fromText = [...block.matchAll(/<category\b[^>]*>([\s\S]*?)<\/category>/gi)]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);
  if (fromText.length) return fromText;
  return [...block.matchAll(/<category\b[^>]*term=["']([^"']+)["']/gi)].map((match) =>
    decodeEntities(match[1]).trim()
  );
}

function parseFeed(xml) {
  const items = blocks(xml, "item");
  const entries = items.length ? items : blocks(xml, "entry");
  const atom = !items.length;
  return entries
    .map((block) => {
      const encoded = inner(block, "content:encoded");
      const description = stripTags(
        encoded || inner(block, "description") || inner(block, "summary") || inner(block, "content")
      ).slice(0, 700);
      return {
        title: stripTags(inner(block, "title")) || "Zonder titel",
        link: atom ? atomLink(block) : inner(block, "link") || atomLink(block),
        pubDate: inner(block, "pubDate") || inner(block, "dc:date") || inner(block, "updated") || inner(block, "published"),
        description,
        categories: categoriesOf(block),
      };
    })
    .filter((item) => item.link)
    .slice(0, PER_FEED);
}

async function fetchFeed(source) {
  const response = await fetch(source.url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const xml = await response.text();
  if (!/<(rss|feed|item|entry)\b/i.test(xml)) throw new Error("geen RSS of Atom");
  const items = parseFeed(xml);
  if (!items.length) throw new Error("geen berichten in de feed");
  return items;
}

export async function loadNewsPayload() {
  const results = await Promise.all(
    FEEDS.map(async (source) => {
      try {
        const items = await fetchFeed(source);
        return { feed: { id: source.id, label: source.label, items } };
      } catch (error) {
        const message = error instanceof Error ? error.message : "onbekende fout";
        return { failed: { id: source.id, label: source.label, error: message } };
      }
    })
  );
  return {
    updated: new Date().toISOString(),
    failedSources: results.flatMap((result) => (result.failed ? [result.failed] : [])),
    feeds: results.flatMap((result) => (result.feed ? [result.feed] : [])),
  };
}
