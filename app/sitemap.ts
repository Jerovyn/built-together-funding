import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://builttogetherfunding.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = [
    { path: "/", priority: 1.0 },
    { path: "/apply/", priority: 0.9 },
    { path: "/how-it-works/", priority: 0.8 },
    { path: "/who-we-help/", priority: 0.8 },
    { path: "/funding-uses/", priority: 0.8 },
    { path: "/about/", priority: 0.7 },
    { path: "/resources/", priority: 0.6 },
    { path: "/contact/", priority: 0.6 },
    { path: "/iso/", priority: 0.5 },
    { path: "/privacy-policy/", priority: 0.3 },
    { path: "/terms/", priority: 0.3 },
    { path: "/disclosures/", priority: 0.3 },
  ];

  const articles = ARTICLES.map((a) => ({
    path: `/resources/${a.slug}/`,
    priority: 0.6,
  }));

  return [...pages, ...articles].map((p) => ({
    url: `${BASE}${p.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p.priority,
  }));
}
