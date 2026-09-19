import type { MetadataRoute } from "next";
import { works } from "@/data/works";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/about", "/works", "/service", "/blog", "/contact", ...works.map((work) => `/works/${work.slug}`)];

  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));
}
