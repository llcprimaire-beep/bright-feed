import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `What ${SITE_NAME} is and how its good-news curation works.`,
};

export default function AboutPage() {
  return (
    <article className="prose prose-neutral max-w-2xl">
      <h1>About {SITE_NAME}</h1>

      <p>
        The news can feel heavy. {SITE_NAME} is the other half of the story: a calm,
        colorful feed made of 100% positive news — acts of kindness, science and medicine
        moving forward, wins for the planet, and animals being wonderful.
      </p>

      <h2>Where the stories come from</h2>
      <p>
        We gather headlines several times a day from publications dedicated to good news,
        including Good News Network, Positive News, Nice News, The Optimist Daily, Reasons
        to be Cheerful, Good Good Good, and Upworthy. Every card shows the headline, a short
        excerpt, and a preview image, and links straight to the original article — we never
        republish full stories, and all reporting credit belongs to the original journalists.
      </p>

      <h2>How this site is funded</h2>
      <p>
        {SITE_NAME} may display ads (Google AdSense). Advertising never influences which
        stories appear — the feed is assembled automatically from the sources above.
      </p>

      <h2>Contact</h2>
      <p>
        Spotted a problem or want to suggest a source? Email{" "}
        <a href="mailto:vadimkovalev999@gmail.com">vadimkovalev999@gmail.com</a>.
      </p>

      <p className="text-sm text-muted">
        [Site operator: confirm the contact email above and consider adding your name here
        before applying for AdSense.]
      </p>
    </article>
  );
}
