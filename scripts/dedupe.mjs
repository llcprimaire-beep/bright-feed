import crypto from "node:crypto";
import levenshtein from "fast-levenshtein";

const STOPWORDS = new Set([
  "the", "a", "an", "to", "for", "of", "in", "on", "with", "says", "say",
  "launches", "launch", "announces", "announce", "announced", "new", "and",
  "is", "are", "at", "by", "as", "it", "its", "how", "why", "what", "after",
  "over", "into", "amid", "unveils", "unveiled", "release", "released",
  "releases", "report", "reports", "reveals", "revealed",
]);

export function canonicalId(url) {
  return crypto.createHash("sha256").update(url).digest("hex").slice(0, 16);
}

export function normalizeTitle(title) {
  const stripped = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((tok) => tok && !STOPWORDS.has(tok));
  return stripped.join(" ");
}

function similarity(a, b) {
  if (!a || !b) return 0;
  const distance = levenshtein.get(a, b);
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - distance / maxLen;
}

const NEAR_DUP_THRESHOLD = 0.82;
const NEAR_DUP_WINDOW_MS = 72 * 60 * 60 * 1000; // 72 hours

/**
 * Given a new candidate item and the existing store (sorted desc by publishedAt),
 * find a near-duplicate among items published within the last 72h.
 * Returns the matching existing item, or null.
 */
export function findNearDuplicate(candidate, existingItems) {
  const candidateTime = new Date(candidate.publishedAt).getTime();
  for (const existing of existingItems) {
    const existingTime = new Date(existing.publishedAt).getTime();
    if (Math.abs(candidateTime - existingTime) > NEAR_DUP_WINDOW_MS) continue;
    if (existing.sourceUrl === candidate.sourceUrl) continue; // exact dup, handled elsewhere
    const sim = similarity(candidate.normalizedTitle, existing.normalizedTitle);
    if (sim >= NEAR_DUP_THRESHOLD) return existing;
  }
  return null;
}
