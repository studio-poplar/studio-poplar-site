import type { MetadataRoute } from "next";
import { works } from "@/data/works";
import { blogPosts } from "@/data/blog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/works", "/service", "/blog", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const workRoutes = works.map((work) => ({
    url: `${siteUrl}/works/${work.slug}`,
    lastModified: new Date(),
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...workRoutes, ...blogRoutes];
}
