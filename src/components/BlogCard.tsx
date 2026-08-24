"use client";

import Link from "next/link";
import { BlogPost } from "@/data/blog";
import { useCard } from "@/lib/useCard";
import styles from "./BlogCard.module.css";

export default function BlogCard({ post, revealDelay = 0 }: { post: BlogPost; revealDelay?: number }) {
  const ref = useCard<HTMLAnchorElement>(revealDelay);

  return (
    <Link href={`/blog#${post.slug}`} className={styles.card} ref={ref}>
      <div className={styles.meta}>
        <span className={`en ${styles.cat}`}>{post.category}</span>
        <time className="en" dateTime={post.date}>
          {post.date}
        </time>
      </div>
      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.excerpt}>{post.excerpt}</p>
    </Link>
  );
}
