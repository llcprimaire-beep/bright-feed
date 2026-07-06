export const CATEGORIES = ["people", "planet", "science", "animals"];

// Keyword overrides applied on top of a source's default category.
// First matching rule wins; if nothing matches, the source default is kept.
const RULES = [
  { category: "animals", keywords: ["dog", "puppy", "cat", "kitten", "animal", "wildlife", "elephant", "whale", "dolphin", "bird", "penguin", "turtle", "rescue pet", "shelter pet", "panda", "otter", "bear cub"] },
  { category: "planet", keywords: ["climate", "solar", "renewable", "ocean", "forest", "reforestation", "conservation", "recycl", "clean energy", "wind power", "biodiversity", "national park", "river", "coral"] },
  { category: "science", keywords: ["cancer", "treatment", "vaccine", "cure", "breakthrough", "discovery", "researchers", "study", "scientists", "medical", "therapy", "alzheimer", "diabetes", "surgery", "drug"] },
];

export function classify(title, description, defaultCategory) {
  const text = `${title} ${description || ""}`.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) return rule.category;
  }
  return defaultCategory;
}
