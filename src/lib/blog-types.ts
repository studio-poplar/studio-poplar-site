export type BlogSeries = "field-notes" | "design-notes";

export const BLOG_SERIES_LABEL: Record<BlogSeries, string> = {
  "field-notes": "FIELD NOTES",
  "design-notes": "DESIGN NOTES",
};

export type BlogPostMeta = {
  slug: string;
  title: string;
  series: BlogSeries;
  date: string;
  excerpt: string;
  coverImage?: string;
  location?: string;
  shootingNote?: string;
  tags?: string[];
  ctaText?: string;
};

export type BlogPost = BlogPostMeta & { content: string };

export type NewsPostMeta = {
  slug: string;
  title: string;
  date: string;
};

export type NewsPost = NewsPostMeta & { content: string };
