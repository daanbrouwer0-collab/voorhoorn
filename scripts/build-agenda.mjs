#!/usr/bin/env node
/**
 * Dagelijks dezelfde agenda opbouwen als Web Agenda
 * en wegschrijven naar agenda-data.json voor de Voorhoorn-site.
 */
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SOURCES, dedupeEvents, loadSource } from "../Web_Agenda/sources.js";
import { agendaPayload } from "../Web_Agenda/app.js";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, "agenda-data.json");
const vueCookies = new Map();

function rememberCookies(response) {
  const raw = typeof response.headers.getSetCookie === "function" ? response.headers.getSetCookie() : [];
  for (const line of raw) {
    const pair = line.split(";")[0];
    const eq = pair.indexOf("=");
    if (eq > 0) vueCookies.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
  }
}

async function fetchText(url) {
  const target = new URL(url);
  const headers = {
    "User-Agent": "Mozilla/5.0 (compatible; VoorhoornAgendaBot/1.0; +https://github.com/voorhoorn)",
    Accept: "text/html,application/json,application/xml,text/xml,*/*",
  };
  if (target.hostname.endsWith("vuecinemas.nl")) {
    headers["User-Agent"] =
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36";
    headers.Accept = "application/json,text/html,*/*";
    headers.Referer = "https://www.vuecinemas.nl/cinema/hoorn/nu-in-de-bioscoop";
    if (vueCookies.size) headers.Cookie = [...vueCookies].map(([name, value]) => `${name}=${value}`).join("; ");
  }
  let response = await fetch(target, { headers, redirect: "follow", signal: AbortSignal.timeout(45000) });
  if (target.hostname.endsWith("vuecinemas.nl")) rememberCookies(response);
  if (response.status === 401 && target.hostname.endsWith("vuecinemas.nl")) {
    const home = await fetch("https://www.vuecinemas.nl/cinema/hoorn/nu-in-de-bioscoop", {
      headers,
      redirect: "follow",
      signal: AbortSignal.timeout(45000),
    });
    rememberCookies(home);
    if (vueCookies.size) headers.Cookie = [...vueCookies].map(([name, value]) => `${name}=${value}`).join("; ");
    response = await fetch(target, { headers, redirect: "follow", signal: AbortSignal.timeout(45000) });
    rememberCookies(response);
  }
  if (!response.ok) throw new Error(`Bron gaf ${response.status}`);
  return response.text();
}

const bySource = {};
const failed = [];
for (const source of SOURCES) {
  try {
    bySource[source.id] = dedupeEvents(await loadSource(source.id, fetchText));
    console.log(`${source.label}: ${bySource[source.id].length}`);
  } catch (error) {
    bySource[source.id] = [];
    const message = error instanceof Error ? error.message : "onbekende fout";
    failed.push({ id: source.id, label: source.label, error: message });
    console.error(`${source.label} mislukt: ${message}`);
  }
}

const payload = agendaPayload(bySource, failed);
await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`agenda-data.json: ${payload.count} afspraken, ${failed.length} bronnen mislukt`);
if (failed.length === SOURCES.length) process.exitCode = 1;
