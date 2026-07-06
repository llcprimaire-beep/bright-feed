import Link from "next/link";
import { getAllItems, getAvailableDays } from "@/lib/data";
import NewsFeed from "@/components/NewsFeed";

export const dynamic = "force-static";

const HOMEPAGE_ITEM_COUNT = 60;

function formatDay(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function Home() {
  const items = getAllItems().slice(0, HOMEPAGE_ITEM_COUNT);
  const recentDays = getAvailableDays().slice(0, 7);

  return (
    <div>
      <p className="text-base text-muted font-semibold mb-8 max-w-2xl">
        Take a breath. Here&apos;s what went <span className="text-accent">right</span> in the
        world today — kind people, healing science, thriving nature, and very good animals.
      </p>

      <NewsFeed items={items} />

      {recentDays.length > 0 && (
        <section className="mt-12">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-muted mb-3">
            Browse by day
          </h2>
          <div className="flex flex-wrap gap-2">
            {recentDays.map((day) => (
              <Link
                key={day}
                href={`/archive/${day}`}
                className="rounded-full bg-card px-3 py-1.5 text-sm font-bold text-muted hover:text-foreground shadow-sm hover:shadow transition-all"
              >
                {formatDay(day)}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
