"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { useCard } from "@/lib/useCard";
import styles from "./ServiceCard.module.css";

type ServiceCardProps = {
  num?: string;
  tag: string;
  title: string;
  description: string;
  items?: string[];
  /** small heading above the item list */
  eyebrow?: string;
  href?: string;
  cta?: string;
  revealDelay?: number;
  icon?: ReactNode;
  accent?: string;
};

export default function ServiceCard({
  num,
  tag,
  title,
  description,
  items,
  eyebrow,
  href,
  cta = "詳しく見る",
  revealDelay = 0,
  icon,
  accent,
}: ServiceCardProps) {
  const ref = useCard<HTMLDivElement>(revealDelay);

  return (
    <div
      className={styles.card}
      ref={ref}
      style={accent ? ({ "--card-accent": accent } as CSSProperties) : undefined}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      {num && <span className={`en ${styles.num}`}>{num}</span>}
      {!num && <span className={`en ${styles.tag}`}>{tag}</span>}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {items && items.length > 0 && (
        <div className={eyebrow ? styles.extra : undefined}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <ul className={eyebrow ? styles.itemsPlain : styles.items}>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {href && (
        <div className={styles.footer}>
          <Link href={href} className={`en ${styles.link}`}>
            {cta} →
          </Link>
        </div>
      )}
    </div>
  );
}
