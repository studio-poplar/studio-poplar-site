"use client";

import { useCard } from "@/lib/useCard";
import styles from "./ServiceCard.module.css";

type ServiceCardProps = {
  num?: string;
  tag: string;
  title: string;
  description: string;
  items?: string[];
  revealDelay?: number;
};

export default function ServiceCard({ num, tag, title, description, items, revealDelay = 0 }: ServiceCardProps) {
  const ref = useCard<HTMLDivElement>(revealDelay);

  return (
    <div className={styles.card} ref={ref}>
      {num && <span className={`en ${styles.num}`}>{num}</span>}
      <span className={`en ${styles.tag}`}>{tag}</span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {items && items.length > 0 && (
        <ul className={styles.items}>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
