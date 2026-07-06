export type Category = "people" | "planet" | "science" | "animals";

export type SourceRef = {
  sourceName: string;
  sourceUrl: string;
};

export type NewsItem = {
  id: string;
  title: string;
  normalizedTitle: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  fetchedAt: string;
  excerpt: string;
  imageUrl: string | null;
  category: Category;
  dedupGroupId: string;
  alsoCoveredBy: SourceRef[];
};

export const CATEGORY_LABELS: Record<Category, string> = {
  people: "People & Kindness",
  planet: "Our Planet",
  science: "Science & Health",
  animals: "Animals",
};

export const CATEGORY_EMOJI: Record<Category, string> = {
  people: "💛",
  planet: "🌿",
  science: "✨",
  animals: "🐾",
};
