"use client";

import Link from "next/link";
import { Work, WORK_CATEGORY_LABELS } from "@/data/works";
import WorkTypeBadge from "./WorkTypeBadge";
import SitePreviewFrame from "./SitePreviewFrame";
import { useCard } from "@/lib/useCard";
import { trackEvent } from "@/lib/gtag";
import styles from "./WorkCard.module.css";

export default function WorkCard({ work, revealDelay = 0 }: { work: Work; revealDelay?: number }) {
  const ref = useCard<HTMLAnchorElement>(revealDelay);

  return (
    <Link
      href={`/works#${work.slug}`}
      className={styles.card}
      ref={ref}
      onClick={() => trackEvent("works_detail_click", { work_slug: work.slug, work_title: work.title })}
    >
      <div className={styles.thumbWrap}>
        {work.url ? (
          <>
            <span className={styles.badgeInline}>
              <WorkTypeBadge type={work.type} />
            </span>
            <SitePreviewFrame url={work.url} label={work.title} />
          </>
        ) : (
          <div className={styles.thumb} data-category={work.category}>
            <span className={styles.badgeWrap}>
              <WorkTypeBadge type={work.type} />
            </span>
            <span className="en">{work.thumbLabel}</span>
          </div>
        )}
      </div>
      <div className={styles.body}>
        <span className={`en ${styles.tag}`}>{WORK_CATEGORY_LABELS[work.category]}</span>
        <h3 className={styles.title}>{work.title}</h3>
        <p className={styles.summary}>{work.summary}</p>
      </div>
    </Link>
  );
}
