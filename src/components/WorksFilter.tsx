"use client";

import { useMemo, useState } from "react";
import { Work, WorkCategory, WORK_CATEGORY_LABELS } from "@/data/works";
import WorkCard from "./WorkCard";
import styles from "./WorksFilter.module.css";

const FILTERS: { value: WorkCategory | "all"; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "web", label: WORK_CATEGORY_LABELS.web },
  { value: "3dweb", label: WORK_CATEGORY_LABELS["3dweb"] },
  { value: "app", label: WORK_CATEGORY_LABELS.app },
];

export default function WorksFilter({ works }: { works: Work[] }) {
  const [active, setActive] = useState<WorkCategory | "all">("all");

  const filtered = useMemo(
    () => (active === "all" ? works : works.filter((work) => work.category === active)),
    [active, works]
  );

  return (
    <div>
      <div className={styles.filterBar} role="group" aria-label="制作実績をカテゴリで絞り込む">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={styles.filterBtn}
            aria-pressed={active === filter.value}
            data-active={active === filter.value}
            onClick={() => setActive(filter.value)}
          >
            <span className="mono">{filter.label}</span>
          </button>
        ))}
      </div>

      <p className={styles.count} aria-live="polite">
        {filtered.length}件の実績を表示中
      </p>

      <div className={styles.grid}>
        {filtered.map((work) => (
          <WorkCard key={work.slug} work={work} />
        ))}
      </div>
    </div>
  );
}
