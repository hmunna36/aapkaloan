import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/loans",
    "/loans/secured",
    "/loans/unsecured",
    "/funding-solutions",
    "/funding-solutions/school-funding",
    "/resources",
    "/contact",
  ];
  return routes.map((r) => ({
    url: `${site.url}${r}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: r === "" ? 1 : r.split("/").length === 2 ? 0.8 : 0.6,
  }));
}
