#!/usr/bin/env node
/**
 * Schrijf news-data.json als reserve, voor als de live-oproep niet lukt.
 */
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadNewsPayload } from "./news-feeds.mjs";

const OUT = join(dirname(dirname(fileURLToPath(import.meta.url))), "news-data.json");
const payload = await loadNewsPayload();

for (const feed of payload.feeds) console.log(`${feed.label}: ${feed.items.length}`);
for (const failed of payload.failedSources) console.error(`${failed.label} mislukt: ${failed.error}`);

await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`);
const count = payload.feeds.reduce((sum, feed) => sum + feed.items.length, 0);
console.log(`news-data.json: ${count} berichten, ${payload.failedSources.length} bronnen mislukt`);
if (!payload.feeds.length) process.exitCode = 1;
