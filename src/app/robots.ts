import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fanaticspeedteam.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/backstage", "/backstage/*", "/api/*"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
