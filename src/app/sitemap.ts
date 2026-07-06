import type { MetadataRoute } from "next";
import { getAvailableDays } from "@/lib/data";
import { CATEGORY_SLUGS } from "@/lib/categories";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.1 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/category/${slug}`,
    changeFrequency: "hourly",
    priority: 0.7,
  }));

  const archiveRoutes: MetadataRoute.Sitemap = getAvailableDays().map((date) => ({
    url: `${SITE_URL}/archive/${date}`,
    changeFrequency: "never",
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...archiveRoutes];
}
