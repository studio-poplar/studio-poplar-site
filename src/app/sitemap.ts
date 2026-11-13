import type { MetadataRoute } from "next";
import { works } from "@/data/works";
import { getAllBlogPosts, getAllNewsPosts } from "@/lib/content";
import { siteUrl } from "@/lib/seo";
import { deshiiriSitemap } from "@/lib/deshiiri/sitemap";
import { saasSitemap } from "@/lib/deshiiri/saas-sitemap";

// デシイリの職人ページは LINE から公開されるので、ビルドのときだけでなく1時間ごとに作り直す。
export const revalidate = 3600;

// lastModified is only set where a real date exists (post dates); a build-time
// "now" on every URL would tell search engines everything changes on every deploy.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = getAllBlogPosts();
  const newsPosts = getAllNewsPosts();
  const latestBlogDate = blogPosts[0]?.date;

  const pages: MetadataRoute.Sitemap = [
    { url: siteUrl },
    { url: `${siteUrl}/about` },
    { url: `${siteUrl}/service` },
    { url: `${siteUrl}/service/drone` },
    { url: `${siteUrl}/works` },
    ...works.map((work) => ({ url: `${siteUrl}/works/${work.slug}` })),
    { url: `${siteUrl}/blog`, lastModified: latestBlogDate },
    ...blogPosts.map((post) => ({ url: `${siteUrl}/blog/${post.slug}`, lastModified: post.date })),
    ...(newsPosts.length > 0 ? [{ url: `${siteUrl}/news`, lastModified: newsPosts[0].date }] : []),
    ...newsPosts.map((news) => ({ url: `${siteUrl}/news/${news.slug}`, lastModified: news.date })),
    { url: `${siteUrl}/contact` },
    { url: `${siteUrl}/privacy` },
    ...deshiiriSitemap(siteUrl),
    ...(await saasSitemap(siteUrl)),
  ];

  return pages;
}
