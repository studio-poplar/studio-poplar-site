"use client";

import Link from "next/link";
import { Work, WORK_CATEGORY_LABELS } from "@/data/works";
import WorkThumb from "./WorkThumb";
import { useCard } from "@/lib/useCard";
import { trackEvent } from "@/lib/gtag";
import styles from "./WorkCard.module.css";

export default function WorkCard({ work, revealDelay = 0 }: { work: Work; revealDelay?: number }) {
  const ref = useCard<HTMLAnchorElement>(revealDelay);

  return (
    <Link
      href={`/works/${work.slug}`}
      className={styles.card}
      ref={ref}
      onClick={() => trackEvent("works_detail_click", { work_slug: work.slug, work_title: work.title })}
    >
      <WorkThumb work={work} />
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={`en ${styles.pill}`}>{WORK_CATEGORY_LABELS[work.category]}</span>
          <span className="en">{work.year}</span>
        </div>
        <h3 className={styles.title}>{work.title}</h3>
        <p className={styles.summary}>{work.summary}</p>
        <ul className={styles.roles}>
          {work.role.slice(0, 3).map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>
        <span className={`en ${styles.more}`}>VIEW CASE →</span>
      </div>
    </Link>
  );
}
