import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://builttogetherfunding.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep private/utility routes out of the index.
        disallow: ["/admin/", "/upload/", "/book/", "/api/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
