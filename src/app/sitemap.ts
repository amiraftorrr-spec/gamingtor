import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/games/cyberpunk-2077",
    "/games/elden-ring",
    "/games/god-of-war",
    "/games/gta-v",
    "/games/last-of-us",
    "/games/red-dead",
  ];

  return routes.map((route) => ({
    url: `http://localhost:3000${route}`,
    lastModified: new Date(),
  }));
}