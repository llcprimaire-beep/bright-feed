// Daily Instagram card generator. Picks the freshest stories (one per
// category where possible), renders branded 1080x1350 cards, and writes them
// plus ready-to-paste captions to public/ig/<date>/ so they're downloadable
// from the live site at /instagram. Runs in the instagram.yml workflow;
// idempotent for same-day re-runs.
//
//   node scripts/ig-cards.mjs
import fs from "node:fs";
import path from "node:path";
import { createCanvas } from "@napi-rs/canvas";
import {
  registerBrandFonts,
  drawBrandMark,
  drawSoftCircle,
  fitText,
  CATEGORY_STYLES,
  INK,
  MUTED,
  SITE_HOST,
  REPO_ROOT,
} from "./brand.mjs";

const W = 1080;
const H = 1350;
const CARD_COUNT = 3;
const MAX_AGE_HOURS = 48;
const KEEP_DAYS = 14;

const BASE_TAGS =
  "#goodnews #positivenews #upliftingnews #happynews #brightside #positivevibes #dailygoodnews #wholesome";
const CATEGORY_TAGS = {
  people: "#kindness #humanity #actsofkindness",
  planet: "#planet #environment #sustainability",
  science: "#science #health #breakthrough",
  animals: "#animals #wildlife #animallovers",
};
const BULLETS = ["💛", "🌿", "✨"];

registerBrandFonts();

const items = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "data", "items.json"), "utf-8"));
const now = new Date();
const today = now.toISOString().slice(0, 10);

// Freshest first; fall back to the newest stored items on a slow news day.
const usable = items.filter((it) => it.title && it.title.length <= 150);
const fresh = usable.filter(
  (it) => now - new Date(it.publishedAt) < MAX_AGE_HOURS * 3600 * 1000
);
const pool = (fresh.length >= CARD_COUNT ? fresh : usable.slice(0, 30)).sort(
  (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
);

if (pool.length === 0) {
  console.log("no stories available - nothing to render");
  process.exit(0);
}

// Prefer category variety, then fill with the freshest leftovers.
const picked = [];
const seenCats = new Set();
for (const it of pool) {
  if (picked.length >= CARD_COUNT) break;
  if (!seenCats.has(it.category)) {
    picked.push(it);
    seenCats.add(it.category);
  }
}
for (const it of pool) {
  if (picked.length >= CARD_COUNT) break;
  if (!picked.includes(it)) picked.push(it);
}

const dateLabel = now
  .toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" })
  .toUpperCase();

function renderCard(item) {
  const pal = CATEGORY_STYLES[item.category] ?? CATEGORY_STYLES.people;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, pal.top);
  bg.addColorStop(1, pal.bottom);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  drawSoftCircle(ctx, -50, -30, 250, "#ffffff", 0.4);
  drawSoftCircle(ctx, 1120, 400, 190, "#ffffff", 0.3);
  drawSoftCircle(ctx, 920, 1330, 240, pal.top, 0.6);

  drawBrandMark(ctx, W / 2, 190, 48);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // "GOOD NEWS · JULY 6" pill
  const pillText = `GOOD NEWS  ·  ${dateLabel}`;
  ctx.font = "700 26px Nunito";
  const pillW = ctx.measureText(pillText).width + 76;
  ctx.save();
  ctx.globalAlpha = 0.65;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(W / 2 - pillW / 2, 330, pillW, 58, 29);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = pal.deep;
  ctx.fillText(pillText, W / 2, 368);

  // Headline, vertically centered in the middle zone of the card
  const { size, lines } = fitText(ctx, item.title, {
    maxWidth: 880,
    maxLines: 7,
    startSize: 74,
    minSize: 46,
  });
  const lineHeight = size * 1.22;
  const blockH = lines.length * lineHeight;
  const zoneCenter = 750;
  let y = zoneCenter - blockH / 2 + size * 0.8;
  ctx.font = `800 ${size}px Nunito`;
  ctx.fillStyle = INK;
  for (const line of lines) {
    ctx.fillText(line, W / 2, y);
    y += lineHeight;
  }

  // Three soft dots as a divider
  const dotsY = y - lineHeight + 64;
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = pal.deep;
  for (const dx of [-28, 0, 28]) {
    ctx.beginPath();
    ctx.arc(W / 2 + dx, dotsY, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.font = "600 30px Nunito";
  ctx.fillStyle = MUTED;
  ctx.fillText(`via ${item.sourceName}`, W / 2, dotsY + 62);

  ctx.font = "800 34px Nunito";
  ctx.fillStyle = INK;
  ctx.fillText("Bright Feed", W / 2, 1252);
  ctx.font = "600 25px Nunito";
  ctx.fillStyle = MUTED;
  ctx.fillText(SITE_HOST, W / 2, 1294);

  return canvas.toBuffer("image/png");
}

function firstSentence(text, max = 180) {
  if (!text) return "";
  const m = String(text).match(/^.{20,}?[.!?](?=\s|$)/s);
  let s = (m ? m[0] : String(text)).trim();
  if (s.length > max) s = `${s.slice(0, max - 1).trimEnd()}…`;
  return s;
}

function cardCaption(item) {
  const parts = [
    `${item.title} ☀️`,
    firstSentence(item.excerpt),
    `📰 Story via ${item.sourceName} — read the full article through the link in our bio (${SITE_HOST})`,
    `${BASE_TAGS} ${CATEGORY_TAGS[item.category] ?? ""}`.trim(),
  ];
  return parts.filter(Boolean).join("\n\n");
}

const groupCaption = [
  "Today's dose of good news ☀️",
  picked.map((it, i) => `${BULLETS[i % BULLETS.length]} ${it.title}`).join("\n\n"),
  `Full stories → link in bio (${SITE_HOST})`,
  BASE_TAGS,
].join("\n\n");

const igRoot = path.join(REPO_ROOT, "public", "ig");
const outDir = path.join(igRoot, today);
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const cardsMeta = [];
picked.forEach((item, i) => {
  const name = `card-${i + 1}.png`;
  fs.writeFileSync(path.join(outDir, name), renderCard(item));
  const caption = cardCaption(item);
  fs.writeFileSync(path.join(outDir, `caption-${i + 1}.txt`), `${caption}\n`);
  cardsMeta.push({
    file: `/ig/${today}/${name}`,
    title: item.title,
    sourceName: item.sourceName,
    sourceUrl: item.sourceUrl,
    category: item.category,
    caption,
  });
  console.log(`card ${i + 1}: [${item.category}] ${item.title}`);
});
fs.writeFileSync(path.join(outDir, "caption-all.txt"), `${groupCaption}\n`);

fs.writeFileSync(
  path.join(igRoot, "latest.json"),
  JSON.stringify(
    {
      date: today,
      generatedAt: now.toISOString(),
      siteHost: SITE_HOST,
      cards: cardsMeta,
      groupCaption,
    },
    null,
    2
  )
);

// Keep the working tree lean - drop folders older than KEEP_DAYS.
const cutoff = new Date(now - KEEP_DAYS * 24 * 3600 * 1000).toISOString().slice(0, 10);
for (const entry of fs.readdirSync(igRoot)) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(entry) && entry < cutoff) {
    fs.rmSync(path.join(igRoot, entry), { recursive: true, force: true });
    console.log(`pruned old folder ${entry}`);
  }
}

console.log(`done: ${cardsMeta.length} cards in public/ig/${today}/`);
