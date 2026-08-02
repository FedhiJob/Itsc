import type { MetadataRoute } from "next";
import { mainNavigation, siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return mainNavigation.map((item) => ({
    url: `${siteConfig.url}${item.href === "/" ? "" : item.href}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: item.href === "/" ? 1 : 0.8
  }));
}
