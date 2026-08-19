import Link from "next/link";
import { BlogPost } from "@/data/blog";
import styles from "./BlogCard.module.css";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className={styles.card}>
      <div className={styles.meta}>
        <span className="mono" style={{ color: "var(--accent)" }}>
          {post.category}
        </span>
        <time className="mono" dateTime={post.date}>
          {post.date}
        </time>
      </div>
      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.excerpt}>{post.excerpt}</p>
      <span className={`btn-ghost ${styles.readMore}`}>続きを読む →</span>
    </Link>
  );
}
