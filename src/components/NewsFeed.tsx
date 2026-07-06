import type { NewsItem } from "@/types/news";
import NewsCard from "./NewsCard";
import AdSlot from "./AdSlot";

const AD_EVERY = 8;

// Masonry-style columns: cards flow top-to-bottom then across, which reads
// as a relaxed pinboard rather than a rigid grid.
export default function NewsFeed({ items }: { items: NewsItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted py-12 text-center font-semibold">
        Nothing here yet — check back soon for more good news. ☀️
      </p>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      {items.map((item, i) => (
        <div key={item.id} className="contents">
          <NewsCard item={item} />
          {(i + 1) % AD_EVERY === 0 && <AdSlot slot={`feed-${i + 1}`} />}
        </div>
      ))}
    </div>
  );
}
