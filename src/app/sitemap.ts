import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fanaticspeedteam.vercel.app";
  const now = new Date();

  const routes = [
    "/",
    "/zglos-pojazd",
    "/regulamin",
    "/o-stowarzyszeniu",
    "/zostan-wystawca",
    "/wesprzyj",
    "/kontakt",
    "/polityka-prywatnosci"
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now
  }));
}
