import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_NAME}.`,
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-neutral max-w-2xl">
      <h1>Privacy Policy</h1>
      <p className="text-sm text-muted">
        Last updated: [fill in the date you publish this page]. [Site operator: replace
        bracketed placeholders before applying for AdSense.]
      </p>

      <h2>Who we are</h2>
      <p>
        {SITE_NAME} ([operator name]) is a news-curation website. Contact:{" "}
        <a href="mailto:vadimkovalev999@gmail.com">vadimkovalev999@gmail.com</a>.
      </p>

      <h2>Information we collect</h2>
      <p>
        Reading this site requires no account and no personal information. Our hosting
        provider (Vercel) keeps standard server logs (IP address, browser type, pages
        visited) for security and performance.
      </p>

      <h2>Cookies and advertising</h2>
      <p>
        This site may display ads served by Google AdSense. Google and its partners use
        cookies to serve ads based on your prior visits to this or other websites. Learn
        more and opt out of personalized advertising at{" "}
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
          Google&apos;s Partner Sites policy
        </a>{" "}
        and{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
          Google Ads Settings
        </a>
        .
      </p>

      <h2>Third-party links and images</h2>
      <p>
        Every story links to its original source, and preview images are served from the
        original publishers&apos; sites. We are not responsible for the privacy practices of
        those external sites.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>This site is not directed at children under 13 and we do not knowingly collect data from them.</p>

      <h2>Changes</h2>
      <p>Updates to this policy will be posted on this page.</p>
    </article>
  );
}
