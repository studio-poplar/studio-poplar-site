"use client";

import type { CSSProperties, ReactNode } from "react";
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
  revealDelay?: number;
  icon?: ReactNode;
  accent?: string;
  /** starting price, e.g. { amount: "5", unit: "万円〜" } */
  price?: { amount: string; unit: string };
};

export default function ServiceCard({
  num,
  tag,
  title,
  description,
  items,
  eyebrow,
  revealDelay = 0,
  icon,
  accent,
  price,
}: ServiceCardProps) {
  const ref = useCard<HTMLDivElement>(revealDelay);

  return (
    <div
      className={styles.card}
      ref={ref}
      style={accent ? ({ "--card-accent": accent } as CSSProperties) : undefined}
    >
      {(icon || num) && (
        <div className={styles.head}>
          {icon && <div className={styles.icon}>{icon}</div>}
          {num && <span className={`en ${styles.num}`}>{num}</span>}
        </div>
      )}
      {!num && <span className={`en ${styles.tag}`}>{tag}</span>}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {price && (
        <p className={styles.price}>
          <span className={styles.priceLabel}>料金の目安</span>
          <span>
            <span className={`en ${styles.priceNum}`}>{price.amount}</span>
            <span className={styles.priceUnit}>{price.unit}</span>
          </span>
        </p>
      )}
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
    </div>
  );
}
