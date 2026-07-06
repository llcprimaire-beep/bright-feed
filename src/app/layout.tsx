import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Link from "next/link";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "A calm, colorful feed of 100% positive news: acts of kindness, planet wins, science breakthroughs, and happy animals — curated from the world's good-news publications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <header className="border-b border-peach/60 bg-card/70 backdrop-blur sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-3">
              <span
                className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br from-[#fff3e4] to-[#ffddbe] shadow-[0_2px_10px_rgba(232,168,124,0.35)] flex items-center justify-center"
                aria-hidden
              >
                <Logo size={30} />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-2xl font-extrabold tracking-tight">{SITE_NAME}</span>
                <span className="hidden sm:block text-[13px] text-muted font-semibold">
                  {SITE_TAGLINE}
                </span>
              </span>
            </Link>
            <CategoryNav />
          </div>
        </header>
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
