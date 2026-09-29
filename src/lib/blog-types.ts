export type BlogSeries = "field-notes" | "design-notes" | "marketing-notes";

// English badge shown on each post/card.
export const BLOG_SERIES_LABEL: Record<BlogSeries, string> = {
  "field-notes": "FIELD NOTES",
  "design-notes": "DESIGN NOTES",
  "marketing-notes": "MARKETING NOTES",
};

// Japanese label for the /blog filter tabs. A series only gets a tab once a post uses it
// (see BlogIndex), so adding a future pillar is just: add the series here and write a post.
export const BLOG_SERIES_FILTER_LABEL: Record<BlogSeries, string> = {
  "field-notes": "フィールドノート",
  "design-notes": "デザイン",
  "marketing-notes": "マーケティング",
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
