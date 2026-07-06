import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Parser from "rss-parser";

import { SOURCES } from "./sources.mjs";
import { canonicalId, normalizeTitle, findNearDuplicate } from "./dedupe.mjs";
import { classify } from "./categories.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "..", "data", "items.json");
const MAX_ITEMS = 5000;
const MAX_AGE_DAYS = 180;
const FETCH_UA = "Mozilla/5.0 (compatible; BrightFeedBot)";

const parser = new Parser({
  timeout: 15000,
  headers: { "User-Agent": FETCH_UA },
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail"],
    ],
  },
});

function stripHtml(html) {
  return (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function truncateExcerpt(text, maxLen = 220) {
  const clean = stripHtml(text);
  if (clean.length <= maxLen) return clean;
  const cut = clean.slice(0, maxLen);
  const lastSentence = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  if (lastSentence > maxLen * 0.4) return cut.slice(0, lastSentence + 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLen)}...`;
}

// Image priority: explicit media fields -> first real <img> in content -> og:image from the article page.
function imageFromFeedItem(item) {
  const media = (item.mediaContent || []).find(
    (m) => m?.$?.url && (m.$.medium === "image" || /\.(jpe?g|png|webp|gif)/i.test(m.$.url))
  );
  if (media) return media.$.url;
  if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;
  if (item.enclosure?.url && /image/.test(item.enclosure.type || "")) return item.enclosure.url;
  const html = item["content:encoded"] || item.content || "";
  const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map((m) => m[1]);
  // Skip emoji/spacer/tracking images - real article images are rarely from these hosts
  const real = imgs.find((src) => !/emoji|s\.w\.org|feedburner|pixel|spacer|\.svg/i.test(src));
  return real || null;
}

async function ogImageFromPage(url) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      headers: { "User-Agent": FETCH_UA, Accept: "text/html" },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    // og:image lives in <head>; 100KB caps memory/time
    const html = (await res.text()).slice(0, 100_000);
    const m =
      html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
    if (!m) return null;
    const src = m[1].trim();
    return src.startsWith("http") ? src : null;
  } catch {
    return null;
  }
}

async function loadExisting() {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function fetchSource(source) {
  try {
    const feed = await parser.parseURL(source.url);
    const items = (feed.items || []).map((item) => ({
      title: item.title?.trim() || "(untitled)",
      sourceUrl: item.link,
      publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
      rawExcerpt: item.contentSnippet || item.summary || "",
      feedImage: imageFromFeedItem(item),
      sourceName: source.name,
      defaultCategory: source.category,
    }));
    console.log(
      `[${source.name}] fetched ${items.length} item(s), ${items.filter((i) => i.feedImage).length} with feed images`
    );
    return items;
  } catch (err) {
    console.warn(`[${source.name}] fetch failed (non-fatal): ${err.message}`);
    return [];
  }
}

async function main() {
  const existing = await loadExisting();
  const existingById = new Map(existing.map((it) => [it.id, it]));
  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

  const rawResults = await Promise.all(SOURCES.map(fetchSource));
  const candidates = rawResults.flat().filter((it) => new Date(it.publishedAt).getTime() >= cutoff);

  let newCount = 0;
  let dupCount = 0;
  let mergedCount = 0;
  let ogFetches = 0;

  candidates.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));

  for (const cand of candidates) {
    if (!cand.sourceUrl) continue;
    const id = canonicalId(cand.sourceUrl);
    if (existingById.has(id)) {
      dupCount++;
      continue;
    }

    const normalizedTitle = normalizeTitle(cand.title);
    const excerpt = truncateExcerpt(cand.rawExcerpt);
    const category = classify(cand.title, cand.rawExcerpt, cand.defaultCategory);

    const nearDup = findNearDuplicate(
      { publishedAt: cand.publishedAt, normalizedTitle, sourceUrl: cand.sourceUrl },
      existing
    );

    if (nearDup) {
      const already = nearDup.alsoCoveredBy.some((c) => c.sourceUrl === cand.sourceUrl);
      if (!already) {
        nearDup.alsoCoveredBy.push({ sourceName: cand.sourceName, sourceUrl: cand.sourceUrl });
      }
      existingById.set(id, nearDup);
      mergedCount++;
      continue;
    }

    // Only new items pay the cost of an article-page fetch for og:image.
    let imageUrl = cand.feedImage;
    if (!imageUrl) {
      imageUrl = await ogImageFromPage(cand.sourceUrl);
      ogFetches++;
    }

    const newItem = {
      id,
      title: cand.title,
      normalizedTitle,
      sourceName: cand.sourceName,
      sourceUrl: cand.sourceUrl,
      publishedAt: cand.publishedAt,
      fetchedAt: new Date().toISOString(),
      excerpt,
      imageUrl: imageUrl || null,
      category,
      dedupGroupId: id,
      alsoCoveredBy: [],
    };

    existing.push(newItem);
    existingById.set(id, newItem);
    newCount++;
  }

  const trimmed = existing
    .filter((it) => new Date(it.publishedAt).getTime() >= cutoff)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, MAX_ITEMS);

  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, `${JSON.stringify(trimmed, null, 2)}\n`, "utf-8");

  const withImages = trimmed.filter((it) => it.imageUrl).length;
  console.log(
    `\nDone. ${newCount} new, ${mergedCount} merged, ${dupCount} duplicates skipped, ${ogFetches} og:image lookups. Store: ${trimmed.length} item(s), ${withImages} with images (${Math.round((withImages / Math.max(trimmed.length, 1)) * 100)}%).`
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[fetch-feeds] fatal error:", err);
    process.exit(1);
  });
