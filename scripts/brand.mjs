// Shared brand drawing helpers for Bright Feed image assets (favicons, the
// OG image, Instagram cards). Everything renders with @napi-rs/canvas and the
// committed Nunito fonts so output is pixel-identical on macOS and in
// GitHub Actions. The sun mark geometry mirrors src/app/icon.svg.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GlobalFonts } from "@napi-rs/canvas";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.join(__dirname, "..");
const FONTS_DIR = path.join(REPO_ROOT, "assets", "fonts");

export function registerBrandFonts() {
  for (const weight of [400, 700, 800]) {
    GlobalFonts.registerFromPath(path.join(FONTS_DIR, `Nunito-${weight}.ttf`), "Nunito");
  }
}

export const INK = "#4a4139";
export const MUTED = "#8a7f72";
export const CREAM = "#fbf7f0";
export const SITE_HOST = "brightfeed.vercel.app";

// Per-category palettes; `deep` matches the site's *-deep text colors.
export const CATEGORY_STYLES = {
  people: { top: "#ffe9db", bottom: "#fff8f1", deep: "#c4643b", label: "People & Kindness" },
  planet: { top: "#def3e7", bottom: "#f4fbf5", deep: "#3c7d5a", label: "Our Planet" },
  science: { top: "#eae4f9", bottom: "#f8f5ff", deep: "#6a5aa8", label: "Science & Health" },
  animals: { top: "#fff2c9", bottom: "#fffaf0", deep: "#a07d1c", label: "Animals" },
};

// Gradient sun core + 8 rounded rays: long on the axes, short on the
// diagonals. coreR is the radius of the central circle; rays extend out to
// about 2.04 * coreR.
export function drawSun(ctx, cx, cy, coreR) {
  const rayW = coreR * 0.4;
  const inner = coreR * 1.32;
  const longRay = coreR * 0.72;
  const shortRay = coreR * 0.52;

  for (let i = 0; i < 8; i++) {
    const len = i % 2 === 0 ? longRay : shortRay;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((i * Math.PI) / 4);
    const grad = ctx.createLinearGradient(0, -inner, 0, -(inner + len));
    grad.addColorStop(0, "#f7b280");
    grad.addColorStop(1, "#ef9663");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(-rayW / 2, -(inner + len), rayW, len, rayW / 2);
    ctx.fill();
    ctx.restore();
  }

  const core = ctx.createRadialGradient(
    cx - coreR * 0.35,
    cy - coreR * 0.4,
    coreR * 0.1,
    cx,
    cy,
    coreR
  );
  core.addColorStop(0, "#ffe2ae");
  core.addColorStop(1, "#f09a67");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
  ctx.fill();
}

// Four-point sparkle (concave diamond).
export function drawSparkle(ctx, cx, cy, r, color) {
  const k = r * 0.16;
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx + k, cy - k, cx + r, cy);
  ctx.quadraticCurveTo(cx + k, cy + k, cx, cy + r);
  ctx.quadraticCurveTo(cx - k, cy + k, cx - r, cy);
  ctx.quadraticCurveTo(cx - k, cy - k, cx, cy - r);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Sun plus the two little charms (lavender sparkle up-right, mint dot
// down-left) that give the mark its friendly finishing touch.
export function drawBrandMark(ctx, cx, cy, coreR) {
  drawSun(ctx, cx, cy, coreR);
  const outer = coreR * 2.04;
  const sparkleAngle = (-55 * Math.PI) / 180;
  const dotAngle = (145 * Math.PI) / 180;
  drawSparkle(
    ctx,
    cx + Math.cos(sparkleAngle) * outer * 1.18,
    cy + Math.sin(sparkleAngle) * outer * 1.18,
    coreR * 0.3,
    "#b7a4e3"
  );
  ctx.save();
  ctx.fillStyle = "#9fd0ae";
  ctx.beginPath();
  ctx.arc(
    cx + Math.cos(dotAngle) * outer * 1.15,
    cy + Math.sin(dotAngle) * outer * 1.15,
    coreR * 0.16,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.restore();
}

export function drawSoftCircle(ctx, cx, cy, r, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (!line || ctx.measureText(test).width <= maxWidth) {
      line = test;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Shrink font size until the text fits maxLines; hard-truncates with an
// ellipsis in the (rare) case it still doesn't fit at minSize.
export function fitText(ctx, text, { maxWidth, maxLines, startSize, minSize, weight = 800 }) {
  for (let size = startSize; size >= minSize; size -= 2) {
    ctx.font = `${weight} ${size}px Nunito`;
    const lines = wrapText(ctx, text, maxWidth);
    if (lines.length <= maxLines) return { size, lines };
  }
  ctx.font = `${weight} ${minSize}px Nunito`;
  const lines = wrapText(ctx, text, maxWidth).slice(0, maxLines);
  let last = lines[maxLines - 1];
  while (last.includes(" ") && ctx.measureText(`${last}…`).width > maxWidth) {
    last = last.slice(0, last.lastIndexOf(" "));
  }
  lines[maxLines - 1] = `${last}…`;
  return { size: minSize, lines };
}
