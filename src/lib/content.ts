import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost, BlogPostMeta, BlogSeries, NewsPost, NewsPostMeta } from "./blog-types";

export type { BlogSeries, BlogPostMeta, BlogPost, NewsPostMeta, NewsPost } from "./blog-types";
export { BLOG_SERIES_LABEL } from "./blog-types";

const BLOG_DIR = path.join(process.cwd(), "content/blog");
const NEWS_DIR = path.join(process.cwd(), "content/news");

function slugFromFilename(filename: string) {
  return filename.replace(/\.mdx?$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function listContentFiles(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
}

export function getAllBlogPosts(): BlogPostMeta[] {
  const files = listContentFiles(BLOG_DIR);
  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
    const { data } = matter(raw);
    return {
      slug: slugFromFilename(filename),
      title: data.title as string,
      series: data.series as BlogSeries,
      date: data.date as string,
      excerpt: data.excerpt as string,
      coverImage: data.coverImage as string | undefined,
      location: data.location as string | undefined,
      shootingNote: data.shootingNote as string | undefined,
      tags: data.tags as string[] | undefined,
      ctaText: data.ctaText as string | undefined,
    };
  });
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const files = listContentFiles(BLOG_DIR);
  const filename = files.find((f) => slugFromFilename(f) === slug);
  if (!filename) return undefined;
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title as string,
    series: data.series as BlogSeries,
    date: data.date as string,
    excerpt: data.excerpt as string,
    coverImage: data.coverImage as string | undefined,
    location: data.location as string | undefined,
    shootingNote: data.shootingNote as string | undefined,
    tags: data.tags as string[] | undefined,
    ctaText: data.ctaText as string | undefined,
    content,
  };
}

export function getAllNewsPosts(): NewsPostMeta[] {
  const files = listContentFiles(NEWS_DIR);
  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(NEWS_DIR, filename), "utf8");
    const { data } = matter(raw);
    return {
      slug: slugFromFilename(filename),
      title: data.title as string,
      date: data.date as string,
    };
  });
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getNewsPostBySlug(slug: string): NewsPost | undefined {
  const files = listContentFiles(NEWS_DIR);
  const filename = files.find((f) => slugFromFilename(f) === slug);
  if (!filename) return undefined;
  const raw = fs.readFileSync(path.join(NEWS_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    content,
  };
}
