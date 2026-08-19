import Link from "next/link";
import { Work, WORK_CATEGORY_LABELS } from "@/data/works";
import styles from "./WorkCard.module.css";

export default function WorkCard({ work }: { work: Work }) {
  return (
    <Link href={`/works/${work.slug}`} className={styles.card}>
      <div className={styles.thumb} data-category={work.category}>
        <span className="mono">{work.thumbLabel}</span>
      </div>
      <div className={styles.body}>
        <span className={`mono ${styles.tag}`}>{WORK_CATEGORY_LABELS[work.category]}</span>
        <h3 className={styles.title}>{work.title}</h3>
        <p className={styles.summary}>{work.summary}</p>
      </div>
    </Link>
  );
}
