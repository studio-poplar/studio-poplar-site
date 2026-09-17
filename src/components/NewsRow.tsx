import Link from "next/link";
import type { NewsPostMeta } from "@/lib/blog-types";
import styles from "./NewsRow.module.css";

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

export default function NewsRow({ news }: { news: NewsPostMeta }) {
  return (
    <Link href={`/news/${news.slug}`} className={styles.row}>
      <time className={`en ${styles.date}`} dateTime={news.date}>
        {formatDate(news.date)}
      </time>
      <h3 className={styles.title}>{news.title}</h3>
      <span className={styles.arrow}>→</span>
    </Link>
  );
}
