"use client";

import { useState } from "react";
import Link from "next/link";
import { Work, WorkCategory, WORK_CATEGORY_LABELS, COMING_SOON } from "@/data/works";
import WorkCard from "./WorkCard";
import WorkThumb from "./WorkThumb";
import { useCard } from "@/lib/useCard";
import { trackEvent } from "@/lib/gtag";
import styles from "./WorksIndex.module.css";

type Filter = "all" | WorkCategory;

function FeaturedWork({ work }: { work: Work }) {
  const ref = useCard<HTMLAnchorElement>(0);

  return (
    <Link
      href={`/works/${work.slug}`}
      className={styles.featured}
      ref={ref}
      onClick={() => trackEvent("works_detail_click", { work_slug: work.slug, work_title: work.title })}
    >
      <WorkThumb work={work} />
      <div className={styles.featuredBody}>
        <span className={`en ${styles.kicker}`}>FEATURED</span>
        <div className={styles.meta}>
          <span className={`en ${styles.pill}`}>{WORK_CATEGORY_LABELS[work.category]}</span>
          <span className="en">{work.year}</span>
        </div>
        <h3 className={styles.featuredTitle}>{work.title}</h3>
        <p className={styles.featuredSummary}>{work.summary}</p>
        <ul className={styles.roles}>
          {work.role.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>
        <span className={`en ${styles.more}`}>VIEW CASE →</span>
      </div>
    </Link>
  );
}

function ComingSoonCard({ category }: { category: WorkCategory }) {
  const info = COMING_SOON[category];
  if (!info) return null;

  return (
    <div className={styles.soon} data-category={category}>
      <span className={`en ${styles.soonKicker}`}>COMING SOON</span>
      <span className={`en ${styles.pill}`}>{WORK_CATEGORY_LABELS[category]}</span>
      <h3>{info.title}</h3>
      <p>{info.body}</p>
      <Link href={`/contact?category=${category}`} className={`en ${styles.more}`}>
        撮影のご相談はこちら →
      </Link>
    </div>
  );
}

export default function WorksIndex({ works }: { works: Work[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const categories = (Object.keys(WORK_CATEGORY_LABELS) as WorkCategory[]).filter(
    (c) => works.some((w) => w.category === c) || COMING_SOON[c]
  );
  const soon = categories.filter((c) => !works.some((w) => w.category === c) && COMING_SOON[c]);
  const countOf = (c: Filter) => (c === "all" ? works.length : works.filter((w) => w.category === c).length);

  const visible = works.filter((w) => filter === "all" || w.category === filter);
  const featured = filter === "all" ? (works.find((w) => w.type === "client") ?? works[0]) : null;
  const rest = visible.filter((w) => !featured || w.slug !== featured.slug);

  function select(next: Filter) {
    setFilter(next);
    trackEvent("works_filter", { category: next });
  }

  return (
    <>
      <div className={styles.filters} role="group" aria-label="カテゴリで絞り込み">
        {(["all", ...categories] as Filter[]).map((c) => (
          <button
            key={c}
            type="button"
            className={`en ${styles.chip}`}
            aria-pressed={c === filter}
            onClick={() => select(c)}
          >
            {c === "all" ? "ALL" : WORK_CATEGORY_LABELS[c]}
            <small>{c !== "all" && soon.includes(c) ? "SOON" : countOf(c)}</small>
          </button>
        ))}
        {works.some((w) => w.type !== "client") && (
          <span className={styles.legend}>MOCK WORK ＝ 自主制作（架空の案件）/ DEMO WORK ＝ 制作デモ</span>
        )}
      </div>

      {featured && <FeaturedWork work={featured} />}

      <div className={styles.grid}>
        {rest.map((work, i) => (
          <WorkCard key={work.slug} work={work} revealDelay={i * 70} />
        ))}
        {soon
          .filter((c) => filter === "all" || filter === c)
          .map((c) => (
            <ComingSoonCard key={c} category={c} />
          ))}
      </div>
    </>
  );
}
