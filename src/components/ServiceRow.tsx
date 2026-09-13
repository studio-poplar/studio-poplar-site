"use client";

import type { ReactElement } from "react";
import { useReveal } from "@/lib/useReveal";
import styles from "./ServiceRow.module.css";

type Visual = "web" | "app" | "photo-video";

function WebVisual() {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={styles.svg}>
      <rect x="24" y="24" width="272" height="192" rx="4" stroke="currentColor" strokeWidth="1.4" />
      <line x1="24" y1="60" x2="296" y2="60" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="42" cy="42" r="3" fill="currentColor" />
      <circle cx="56" cy="42" r="3" fill="currentColor" />
      <circle cx="70" cy="42" r="3" fill="currentColor" />
      <rect x="48" y="84" width="120" height="80" rx="2" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <line x1="188" y1="88" x2="272" y2="88" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <line x1="188" y1="104" x2="272" y2="104" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
      <line x1="188" y1="120" x2="248" y2="120" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
      <line x1="48" y1="180" x2="150" y2="180" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
    </svg>
  );
}

function AppVisual() {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={styles.svg}>
      <rect x="120" y="20" width="100" height="200" rx="14" stroke="currentColor" strokeWidth="1.4" />
      <line x1="150" y1="34" x2="190" y2="34" stroke="currentColor" strokeWidth="1.4" />
      <rect x="132" y="52" width="76" height="44" rx="2" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <rect x="132" y="104" width="76" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <rect x="132" y="126" width="76" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <circle cx="170" cy="190" r="9" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function PhotoVideoVisual() {
  return (
    <svg viewBox="0 0 320 240" fill="none" className={styles.svg}>
      <circle cx="160" cy="120" r="76" stroke="currentColor" strokeWidth="1.4" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1="160"
          y1="120"
          x2={160 + 76 * Math.cos((i * Math.PI) / 4)}
          y2={120 + 76 * Math.sin((i * Math.PI) / 4)}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />
      ))}
      <circle cx="160" cy="120" r="34" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="160" cy="120" r="6" fill="currentColor" />
    </svg>
  );
}

const VISUALS: Record<Visual, () => ReactElement> = {
  web: WebVisual,
  app: AppVisual,
  "photo-video": PhotoVideoVisual,
};

type ServiceRowProps = {
  num: string;
  tag: string;
  title: string;
  description: string;
  visual: Visual;
  reverse?: boolean;
  revealDelay?: number;
};

export default function ServiceRow({ num, tag, title, description, visual, reverse = false, revealDelay = 0 }: ServiceRowProps) {
  const ref = useReveal<HTMLDivElement>(revealDelay);
  const VisualComponent = VISUALS[visual];

  return (
    <div className={`${styles.row} ${reverse ? styles.reverse : ""}`} ref={ref}>
      <div className={styles.visual}>
        <VisualComponent />
      </div>
      <div className={styles.copy}>
        <span className={`en ${styles.num}`}>{num}</span>
        <span className={`en ${styles.tag}`}>{tag}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}
