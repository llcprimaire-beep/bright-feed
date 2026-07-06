import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of use for ${SITE_NAME}.`,
};

export default function TermsPage() {
  return (
    <article className="prose prose-neutral max-w-2xl">
      <h1>Terms of Use</h1>
      <p className="text-sm text-muted">Last updated: [fill in the date you publish this page].</p>

      <h2>What this site is</h2>
      <p>
        {SITE_NAME} aggregates and links to publicly available positive news from
        third-party publishers. Headlines, short excerpts, and preview images are shown
        alongside a link to the original source. We do not host or claim ownership of the
        articles we link to — all rights belong to their original publishers.
      </p>

      <h2>No warranty on accuracy</h2>
      <p>
        We do not independently verify third-party reporting. Content is provided
        &quot;as is&quot; — always check the original source.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {SITE_NAME} and its operator are not liable
        for damages arising from use of this site or reliance on linked content.
      </p>

      <h2>Advertising</h2>
      <p>
        This site may display third-party ads (e.g. Google AdSense). See our{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>Acceptable use</h2>
      <p>Don&apos;t scrape or disrupt this site for other visitors.</p>

      <h2>Contact</h2>
      <p>
        Questions? Email <a href="mailto:vadimkovalev999@gmail.com">vadimkovalev999@gmail.com</a>.
      </p>
    </article>
  );
}
