/**
 * Lokale server voor Web Agenda.
 * Start via start.sh of “Start Web Agenda”.
 * De browser mag de meeste bronnen niet zelf ophalen (CORS).
 * Deze server haalt alleen de vaste Hoorn-agenda-sites op.
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PORT = Number(process.env.PORT || 8787);
const MAX_BYTES = 3_000_000;

const ALLOWED_HOSTS = new Set([
  "komnaarhoorn.nl",
  "www.komnaarhoorn.nl",
  "manifesto-hoorn.nl",
  "www.manifesto-hoorn.nl",
  "netwerkhoorn.nl",
  "www.netwerkhoorn.nl",
  "hoorn.bestuurlijkeinformatie.nl",
  "www.inhoorn.nl",
  "inhoorn.nl",
  "westfrieseuitagenda.nl",
  "www.westfrieseuitagenda.nl",
  "www.bibliotheekhoorn.nl",
  "bibliotheekhoorn.nl",
  "www.hotelhoorn.com",
  "hotelhoorn.com",
  "muziekladder.nl",
  "www.muziekladder.nl",
  "www.huisverloren.nl",
  "huisverloren.nl",
  "swaf.nl",
  "www.swaf.nl",
  "popronde.nl",
  "www.popronde.nl",
  "kamermuziekfestivalhoorn.nl",
  "www.kamermuziekfestivalhoorn.nl",
  "oosterkerkhoorn.nl",
  "www.oosterkerkhoorn.nl",
  "cinemaoostereiland.nl",
  "www.cinemaoostereiland.nl",
  "hetpark.nl",
  "www.hetpark.nl",
  "pakhuishoorn.nl",
  "www.pakhuishoorn.nl",
  "vuecinemas.nl",
  "www.vuecinemas.nl",
]);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function allowedUrl(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password) return null;
  if (!ALLOWED_HOSTS.has(url.hostname)) return null;
  return url;
}

const vueCookies = new Map();

function rememberCookies(response) {
  const raw = typeof response.headers.getSetCookie === "function" ? response.headers.getSetCookie() : [];
  for (const line of raw) {
    const pair = line.split(";")[0];
    const eq = pair.indexOf("=");
    if (eq > 0) vueCookies.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
  }
}

function proxyHeaders(target) {
  const headers = {
    "User-Agent": "Mozilla/5.0 (compatible; WebAgenda/1.0; +local)",
    Accept: "text/html,application/json,application/xml,text/xml,*/*",
  };
  if (target.hostname === "vuecinemas.nl" || target.hostname === "www.vuecinemas.nl") {
    headers["User-Agent"] =
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36";
    headers.Accept = "application/json,text/html,*/*";
    headers.Referer = "https://www.vuecinemas.nl/cinema/hoorn/nu-in-de-bioscoop";
    if (vueCookies.size) {
      headers.Cookie = [...vueCookies].map(([name, value]) => `${name}=${value}`).join("; ");
    }
  }
  return headers;
}

async function fetchAllowed(target) {
  const response = await fetch(target, {
    headers: proxyHeaders(target),
    redirect: "follow",
    signal: AbortSignal.timeout(45000),
  });
  if (target.hostname.endsWith("vuecinemas.nl")) rememberCookies(response);
  return response;
}

async function proxy(target) {
  let response = await fetchAllowed(target);
  if (response.status === 401 && target.hostname.endsWith("vuecinemas.nl")) {
    const home = allowedUrl("https://www.vuecinemas.nl/cinema/hoorn/nu-in-de-bioscoop");
    if (home) await fetchAllowed(home);
    response = await fetchAllowed(target);
  }
  const finalUrl = allowedUrl(response.url);
  if (!finalUrl) {
    return { status: 502, body: "Redirect buiten de toegestane bronnen." };
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > MAX_BYTES) {
    return { status: 502, body: "Bron is te groot." };
  }
  return {
    status: response.status,
    body: buffer,
    type: "text/plain; charset=utf-8",
  };
}

function filePath(urlPath) {
  const requested = (urlPath === "/" ? "index.html" : urlPath).replace(/^\/+/, "");
  if (!requested || requested.includes("..") || requested.includes("\0")) return null;
  const root = ROOT.endsWith(sep) ? ROOT : `${ROOT}${sep}`;
  const full = join(ROOT, requested);
  if (!full.startsWith(root)) return null;
  return full;
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
    if (url.pathname === "/api/fetch") {
      const target = allowedUrl(url.searchParams.get("url") || "");
      if (!target) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Alleen de vaste agenda-bronnen zijn toegestaan.");
        return;
      }
      const result = await proxy(target);
      res.writeHead(result.status, {
        "Content-Type": result.type || "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      });
      res.end(result.body);
      return;
    }

    const path = filePath(url.pathname);
    if (!path) {
      res.writeHead(403).end("Verboden");
      return;
    }
    const body = await readFile(path);
    res.writeHead(200, {
      "Content-Type": TYPES[extname(path)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(body);
  } catch (error) {
    const missing = error && error.code === "ENOENT";
    res.writeHead(missing ? 404 : 502, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(missing ? "Niet gevonden" : "Ophalen mislukt");
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Web Agenda: http://127.0.0.1:${PORT}`);
});
