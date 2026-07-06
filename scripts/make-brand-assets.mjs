// One-shot generator for the static brand images. Run manually after any
// change to the mark in scripts/brand.mjs, then commit the outputs:
//   node scripts/make-brand-assets.mjs
// Produces: src/app/icon.png (64), src/app/apple-icon.png (180),
// src/app/opengraph-image.png (1200x630), public/brand/instagram-avatar.png (1080).
import fs from "node:fs";
import path from "node:path";
import { createCanvas } from "@napi-rs/canvas";
import {
  registerBrandFonts,
  drawBrandMark,
  drawSoftCircle,
  drawSparkle,
  INK,
  MUTED,
  CREAM,
  SITE_HOST,
  REPO_ROOT,
} from "./brand.mjs";

registerBrandFonts();

function save(canvas, relPath) {
  const abs = path.join(REPO_ROOT, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, canvas.toBuffer("image/png"));
  console.log(`wrote ${relPath}`);
}

// --- Favicon PNG fallback (Safari and older browsers skip SVG icons) ---
{
  const c = createCanvas(64, 64);
  const ctx = c.getContext("2d");
  drawBrandMark(ctx, 32, 33, 13.5);
  save(c, "src/app/icon.png");
}

// --- Apple touch icon (iOS rounds the corners itself; solid bg required) ---
{
  const c = createCanvas(180, 180);
  const ctx = c.getContext("2d");
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, 180, 180);
  drawSoftCircle(ctx, 90, 84, 72, "#ffe1cc", 0.55);
  drawBrandMark(ctx, 90, 92, 38);
  save(c, "src/app/apple-icon.png");
}

// --- Open Graph image for link previews ---
{
  const W = 1200;
  const H = 630;
  const c = createCanvas(W, H);
  const ctx = c.getContext("2d");

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#fff4e6");
  bg.addColorStop(1, CREAM);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  drawSoftCircle(ctx, 1130, -30, 290, "#ffe1cc", 0.5);
  drawSoftCircle(ctx, 40, 640, 230, "#dcf2e5", 0.55);
  drawSoftCircle(ctx, 1090, 540, 130, "#e8e2f7", 0.5);

  drawBrandMark(ctx, 265, 315, 92);

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = INK;
  ctx.font = "800 100px Nunito";
  ctx.fillText("Bright Feed", 470, 305);

  ctx.fillStyle = MUTED;
  ctx.font = "600 38px Nunito";
  ctx.fillText("Only good news, from all over the world", 470, 372);

  ctx.font = "700 30px Nunito";
  const urlW = ctx.measureText(SITE_HOST).width;
  ctx.save();
  ctx.globalAlpha = 0.75;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(470, 416, urlW + 56, 58, 29);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#c4643b";
  ctx.fillText(SITE_HOST, 498, 455);

  save(c, "src/app/opengraph-image.png");
}

// --- Instagram profile avatar (shown circle-cropped in the app) ---
{
  const S = 1080;
  const c = createCanvas(S, S);
  const ctx = c.getContext("2d");

  const bg = ctx.createRadialGradient(540, 500, 120, 540, 540, 780);
  bg.addColorStop(0, "#fff7ec");
  bg.addColorStop(1, "#ffe3c6");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);

  drawBrandMark(ctx, 540, 555, 225);
  drawSparkle(ctx, 220, 260, 34, "#cabcec");

  save(c, "public/brand/instagram-avatar.png");
}
