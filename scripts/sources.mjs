// RSS sources for the positive-news pipeline. Every source here is a
// dedicated good-news outlet, so no sentiment filtering is applied -
// the curation IS the source selection.

export const SOURCES = [
  {
    name: "Good News Network",
    url: "https://www.goodnewsnetwork.org/feed/",
    kind: "rss",
    category: "people",
  },
  {
    name: "Positive News",
    url: "https://www.positive.news/feed/",
    kind: "rss",
    category: "people",
  },
  {
    name: "The Optimist Daily",
    url: "https://www.optimistdaily.com/feed/",
    kind: "rss",
    category: "science",
  },
  {
    name: "Reasons to be Cheerful",
    url: "https://reasonstobecheerful.world/feed/",
    kind: "rss",
    category: "planet",
  },
  {
    name: "Good Good Good",
    url: "https://www.goodgoodgood.co/rss",
    kind: "rss",
    category: "people",
  },
  {
    name: "Upworthy",
    url: "https://www.upworthy.com/feeds/feed.rss",
    kind: "rss",
    category: "people",
  },
  {
    name: "Nice News",
    url: "https://nicenews.com/feed/",
    kind: "rss",
    category: "people",
  },
  {
    name: "BrightVibes",
    url: "https://www.brightvibes.com/feed/",
    kind: "rss",
    category: "planet",
  },
];
