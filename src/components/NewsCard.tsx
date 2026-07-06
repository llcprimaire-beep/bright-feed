import type { NewsItem, Category } from "@/types/news";
import { CATEGORY_LABELS, CATEGORY_EMOJI } from "@/types/news";

const PILL_STYLES: Record<Category, string> = {
  people: "bg-peach text-peach-deep",
  planet: "bg-mint text-mint-deep",
  science: "bg-lavender text-lavender-deep",
  animals: "bg-butter text-butter-deep",
};

// Soft per-category gradient shown when a story has no image.
const FALLBACK_GRADIENTS: Record<Category, string> = {
  people: "from-peach to-butter",
  planet: "from-mint to-lavender",
  science: "from-lavender to-peach",
  animals: "from-butter to-mint",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="break-inside-avoid mb-6 rounded-3xl bg-card shadow-[0_2px_12px_rgba(122,98,74,0.08)] overflow-hidden hover:shadow-[0_6px_24px_rgba(122,98,74,0.14)] hover:-translate-y-0.5 transition-all duration-200">
      <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="block">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full aspect-[16/10] object-cover bg-gradient-to-br from-peach/40 to-mint/40"
          />
        ) : (
          <div
            className={`w-full aspect-[16/10] bg-gradient-to-br ${FALLBACK_GRADIENTS[item.category]} flex items-center justify-center text-5xl`}
            aria-hidden
          >
            {CATEGORY_EMOJI[item.category]}
          </div>
        )}
      </a>

      <div className="p-5 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-xs">
          <span className={`rounded-full px-2.5 py-1 font-bold ${PILL_STYLES[item.category]}`}>
            {CATEGORY_EMOJI[item.category]} {CATEGORY_LABELS[item.category]}
          </span>
          <span className="text-muted font-semibold ml-auto">
            {item.sourceName} · {formatDate(item.publishedAt)}
          </span>
        </div>

        <h3 className="text-lg font-extrabold leading-snug">
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            {item.title}
          </a>
        </h3>

        {item.excerpt && <p className="text-sm text-muted leading-relaxed">{item.excerpt}</p>}

        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-bold text-accent hover:underline underline-offset-2 mt-0.5"
        >
          Read at {item.sourceName} →
        </a>
      </div>
    </article>
  );
}
