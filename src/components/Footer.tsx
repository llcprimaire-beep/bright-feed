import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-peach/60 mt-16 py-8 text-sm text-muted">
      <div className="flex flex-col gap-3 max-w-5xl mx-auto px-4">
        <p>
          {SITE_NAME} gathers uplifting headlines from the world&apos;s good-news publications.
          Every story links straight to its original source — we never republish full articles,
          and all credit belongs to the journalists who reported them.
        </p>
        <p>This site may display ads to keep the good news flowing.</p>
        <nav className="flex gap-4 font-semibold">
          <Link href="/about" className="hover:text-foreground">About</Link>
          <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
