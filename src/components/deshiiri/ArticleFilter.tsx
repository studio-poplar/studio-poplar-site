"use client";

import { useState, type ReactNode } from "react";
import styles from "./ArticleFilter.module.css";

type Option = { code: string; label: string };
type Item = { slug: string; job: string; city: string; card: ReactNode };

// すべての帖: 仕事・町で絞り込む。Cards are rendered on the server and passed in.
export default function ArticleFilter({ jobs, cities, items }: { jobs: Option[]; cities: Option[]; items: Item[] }) {
  const [job, setJob] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const shown = items.filter((i) => (!job || i.job === job) && (!city || i.city === city));

  const group = (label: string, options: Option[], value: string | null, set: (v: string | null) => void) => (
    <div className={styles.group} role="group" aria-label={label}>
      <span className={styles.label}>{label}</span>
      <div className={styles.chips}>
        <button type="button" aria-pressed={value === null} onClick={() => set(null)}>
          すべて
        </button>
        {options.map((o) => (
          <button key={o.code} type="button" aria-pressed={value === o.code} onClick={() => set(value === o.code ? null : o.code)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className={styles.filters}>
        {group("仕事", jobs, job, setJob)}
        {group("町", cities, city, setCity)}
      </div>
      <p className={styles.count} aria-live="polite">
        {shown.length}本
      </p>
      {shown.length > 0 ? (
        <div className={styles.grid}>
          {shown.map((i) => (
            <div key={i.slug}>{i.card}</div>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>この組み合わせの記事はまだありません。</p>
      )}
    </>
  );
}
