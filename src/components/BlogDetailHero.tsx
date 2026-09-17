import Image from "next/image";
import { BLOG_SERIES_LABEL, type BlogPostMeta } from "@/lib/blog-types";
import styles from "./BlogDetailHero.module.css";

export default function BlogDetailHero({ post }: { post: BlogPostMeta }) {
  const seriesClass = post.series === "field-notes" ? styles.field : styles.design;

  if (post.coverImage) {
    return (
      <div className={styles.imgHero}>
        <Image src={post.coverImage} alt="" fill priority className={styles.img} sizes="100vw" />
        <div className={styles.scrim} />
        <div className={styles.cap}>
          <span className={`en ${styles.label} ${seriesClass}`}>{BLOG_SERIES_LABEL[post.series]}</span>
          <h1 className={styles.imgTitle}>{post.title}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.plainHero}>
      <div className="wrap">
        <span className={`en ${styles.label} ${seriesClass}`}>{BLOG_SERIES_LABEL[post.series]}</span>
        <h1 className={styles.plainTitle}>{post.title}</h1>
      </div>
    </div>
  );
}
