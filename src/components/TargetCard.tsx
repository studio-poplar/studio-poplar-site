"use client";

import type { CSSProperties } from "react";
import { useCard } from "@/lib/useCard";
import styles from "./TargetCard.module.css";

type TargetCardProps = {
  tag: string;
  who: string;
  voice: string;
  approach: string;
  entries: { label: string; price: string }[];
  accent: string;
  revealDelay?: number;
};

export default function TargetCard({ tag, who, voice, approach, entries, accent, revealDelay = 0 }: TargetCardProps) {
  const ref = useCard<HTMLDivElement>(revealDelay);

  return (
    <div className={styles.card} ref={ref} style={{ "--card-accent": accent } as CSSProperties}>
      <div className={styles.head}>
        <span className={`en ${styles.tag}`}>{tag}</span>
        <span className={styles.who}>{who}</span>
      </div>

      <p className={styles.voice}>{voice}</p>

      <div className={styles.answer}>
        <span className={`en ${styles.answerLabel}`}>STUDIO POPLAR&rsquo;S APPROACH</span>
        <p className={styles.approach}>{approach}</p>
      </div>

      <ul className={styles.entries}>
        {entries.map((entry) => (
          <li key={entry.label}>
            <span className={`en ${styles.entryLabel}`}>{entry.label}</span>
            <span className={styles.entryPrice}>{entry.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
