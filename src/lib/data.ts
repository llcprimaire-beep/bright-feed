import fs from "node:fs";
import path from "node:path";
import type { Category, NewsItem } from "@/types/news";

const DATA_PATH = path.join(process.cwd(), "data", "items.json");

let cache: NewsItem[] | null = null;

// Reads data/items.json once per build (or per dev-server process) - this file
// only ever changes via the fetch-feeds.mjs pipeline + a fresh deploy, never
// at request time, so an in-memory cache is safe and avoids repeated disk I/O
// across every page's static generation.
export function getAllItems(): NewsItem[] {
  if (cache) return cache;
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    cache = JSON.parse(raw) as NewsItem[];
  } catch {
    cache = [];
  }
  return cache;
}

export function getItemsByCategory(category: Category): NewsItem[] {
  return getAllItems().filter((item) => item.category === category);
}

// Calendar day (UTC) an item belongs to, e.g. "2026-07-05".
export function dayKey(isoDate: string): string {
  return isoDate.slice(0, 10);
}

export function getItemsByDay(date: string): NewsItem[] {
  return getAllItems().filter((item) => dayKey(item.publishedAt) === date);
}

export function getAvailableDays(): string[] {
  const days = new Set(getAllItems().map((item) => dayKey(item.publishedAt)));
  return [...days].sort((a, b) => (a < b ? 1 : -1));
}

export function groupByDay(items: NewsItem[]): { day: string; items: NewsItem[] }[] {
  const map = new Map<string, NewsItem[]>();
  for (const item of items) {
    const key = dayKey(item.publishedAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return [...map.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([day, dayItems]) => ({ day, items: dayItems }));
}
