import Link from "next/link";
import { CATEGORY_SLUGS } from "@/lib/categories";
import { CATEGORY_LABELS, CATEGORY_EMOJI } from "@/types/news";

export default function CategoryNav() {
  return (
    <nav className="flex flex-wrap gap-2 text-sm">
      <Link
        href="/"
        className="rounded-full px-3 py-1.5 font-bold bg-accent/15 text-accent hover:bg-accent/25 transition-colors"
      >
        ✨ Latest
      </Link>
      {CATEGORY_SLUGS.map((slug) => (
        <Link
          key={slug}
          href={`/category/${slug}`}
          className="rounded-full px-3 py-1.5 font-bold text-muted hover:bg-peach/50 hover:text-foreground transition-colors"
        >
          {CATEGORY_EMOJI[slug]} {CATEGORY_LABELS[slug]}
        </Link>
      ))}
    </nav>
  );
}
