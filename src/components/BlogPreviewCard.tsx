"use client";

import Link from "next/link";
import { useCard } from "@/lib/useCard";
import { BLOG_SERIES_LABEL, type BlogPostMeta } from "@/lib/blog-types";
import styles from "./BlogPreviewCard.module.css";

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

const SERIES_CLASS: Record<string, string> = { "field-notes": "field", "design-notes": "design", "marketing-notes": "marketing" };

export default function BlogPreviewCard({ post, revealDelay = 0 }: { post: BlogPostMeta; revealDelay?: number }) {
  const ref = useCard<HTMLAnchorElement>(revealDelay);

  return (
    <Link href={`/blog/${post.slug}`} className={styles.card} ref={ref}>
      <div className={styles.meta}>
        <span className={`en ${styles.cat} ${styles[SERIES_CLASS[post.series]]}`}>
          {BLOG_SERIES_LABEL[post.series]}
        </span>
        <time className="en" dateTime={post.date}>
          {formatDate(post.date)}
        </time>
      </div>
      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.excerpt}>{post.excerpt}</p>
    </Link>
  );
}
