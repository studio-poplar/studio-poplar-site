"use client";

import Link from "next/link";
import Image from "next/image";
import { useReveal } from "@/lib/useReveal";
import { BLOG_SERIES_LABEL, type BlogPostMeta } from "@/lib/blog-types";
import styles from "./BlogCard.module.css";

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

const SERIES_CLASS: Record<string, string> = { "field-notes": "field", "design-notes": "design", "marketing-notes": "marketing" };

export default function BlogCard({ post, revealDelay = 0 }: { post: BlogPostMeta; revealDelay?: number }) {
  const ref = useReveal<HTMLAnchorElement>(revealDelay);
  const hasImage = Boolean(post.coverImage);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`${styles.card} ${styles[SERIES_CLASS[post.series]]} ${hasImage ? "" : styles.noImg}`}
      ref={ref}
    >
      <div>
        <span className={`en ${styles.label}`}>
          <span className={styles.dot} />
          {BLOG_SERIES_LABEL[post.series]}
        </span>
        <h2 className={styles.title}>{post.title}</h2>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <time className={`en ${styles.date}`} dateTime={post.date}>
          {formatDate(post.date)}
        </time>
      </div>
      {hasImage && (
        <div className={styles.imgWrap}>
          <Image src={post.coverImage!} alt="" fill className={styles.img} sizes="180px" />
        </div>
      )}
    </Link>
  );
}
