import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAvailableDays, getItemsByDay } from "@/lib/data";
import NewsFeed from "@/components/NewsFeed";

export const dynamic = "force-static";

type Params = { date: string };

export function generateStaticParams() {
  return getAvailableDays().map((date) => ({ date }));
}

function formatDay(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { date } = await params;
  return {
    title: `Good News — ${formatDay(date)}`,
    description: `Every uplifting story we gathered on ${formatDay(date)}.`,
  };
}

export default async function ArchiveDayPage({ params }: { params: Promise<Params> }) {
  const { date } = await params;
  const items = getItemsByDay(date);
  if (items.length === 0) notFound();

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-6">☀️ {formatDay(date)}</h1>
      <NewsFeed items={items} />
    </div>
  );
}
