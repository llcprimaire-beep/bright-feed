// Auto-publishes today's card-1 to Instagram via the Content Publishing API
// ("Instagram API with Instagram Login" flavor - no Facebook Page needed).
// Reads public/ig/latest.json, waits until the image is live on the site
// (the API fetches it by public URL), then creates + publishes the media.
//
// Required env (GitHub repo secrets - see INSTAGRAM-SETUP.md):
//   IG_USER_ID       - Instagram account ID from the Meta app dashboard
//   IG_ACCESS_TOKEN  - long-lived access token (60 days; regenerate & update)
// Optional env:
//   IG_GRAPH_HOST    - defaults to graph.instagram.com; set graph.facebook.com
//                      if you connected through a Facebook Page instead
//   SITE_URL         - defaults to https://brightfeed.vercel.app
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { IG_USER_ID, IG_ACCESS_TOKEN } = process.env;
const HOST = process.env.IG_GRAPH_HOST || "graph.instagram.com";
const API = `https://${HOST}/v23.0`;
const SITE_URL = process.env.SITE_URL || "https://brightfeed.vercel.app";

if (!IG_USER_ID || !IG_ACCESS_TOKEN) {
  console.log("IG_USER_ID / IG_ACCESS_TOKEN not set - skipping Instagram publish");
  process.exit(0);
}

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const latest = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "public", "ig", "latest.json"), "utf-8")
);

const today = new Date().toISOString().slice(0, 10);
if (latest.date !== today) {
  console.log(`latest.json is for ${latest.date}, not today (${today}) - skipping`);
  process.exit(0);
}

const card = latest.cards[0];
const imageUrl = `${SITE_URL}${card.file}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForImage() {
  for (let i = 1; i <= 20; i++) {
    try {
      const res = await fetch(imageUrl, { method: "HEAD" });
      if (res.ok) {
        console.log(`image is live: ${imageUrl}`);
        return;
      }
      console.log(`attempt ${i}: image not deployed yet (HTTP ${res.status})`);
    } catch (err) {
      console.log(`attempt ${i}: ${err.message}`);
    }
    await sleep(30_000);
  }
  throw new Error(`image never became reachable: ${imageUrl}`);
}

async function api(pathname, params) {
  const res = await fetch(`${API}/${pathname}`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ ...params, access_token: IG_ACCESS_TOKEN }),
  });
  const body = await res.json();
  if (!res.ok || body.error) {
    throw new Error(`${pathname} failed: ${JSON.stringify(body.error ?? body)}`);
  }
  return body;
}

async function apiGet(pathname, params) {
  const qs = new URLSearchParams({ ...params, access_token: IG_ACCESS_TOKEN });
  const res = await fetch(`${API}/${pathname}?${qs}`);
  const body = await res.json();
  if (!res.ok || body.error) {
    throw new Error(`GET ${pathname} failed: ${JSON.stringify(body.error ?? body)}`);
  }
  return body;
}

await waitForImage();

console.log(`creating media container for: ${card.title}`);
const container = await api(`${IG_USER_ID}/media`, {
  image_url: imageUrl,
  caption: card.caption,
});

for (let i = 0; i < 10; i++) {
  const { status_code: status } = await apiGet(container.id, { fields: "status_code" });
  if (status === "FINISHED") break;
  if (status === "ERROR" || status === "EXPIRED") {
    throw new Error(`container status: ${status}`);
  }
  console.log(`container status: ${status}, waiting...`);
  await sleep(5_000);
}

const published = await api(`${IG_USER_ID}/media_publish`, { creation_id: container.id });
console.log(`published media id: ${published.id}`);

try {
  const { permalink } = await apiGet(published.id, { fields: "permalink" });
  console.log(`post is live: ${permalink}`);
} catch {
  console.log("published (permalink lookup failed, check the account feed)");
}
