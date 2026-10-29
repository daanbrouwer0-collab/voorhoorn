import { loadNewsPayload } from "../../scripts/news-feeds.mjs";

export default async () => {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
  };
  try {
    const payload = await loadNewsPayload();
    return new Response(JSON.stringify(payload), {
      status: payload.feeds.length ? 200 : 502,
      headers,
    });
  } catch {
    return new Response(JSON.stringify({ updated: null, failedSources: [], feeds: [] }), {
      status: 502,
      headers,
    });
  }
};

export const config = { path: "/api/news" };
