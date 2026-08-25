"use client";

import { useCard } from "@/lib/useCard";
import styles from "./PlanCard.module.css";

type PlanCardProps = {
  code: string;
  name: string;
  description: string;
  target: string;
  items: string[];
  price: string;
  delivery: string;
  revealDelay?: number;
};

export default function PlanCard({
  code,
  name,
  description,
  target,
  items,
  price,
  delivery,
  revealDelay = 0,
}: PlanCardProps) {
  const ref = useCard<HTMLDivElement>(revealDelay);

  return (
    <div className={styles.card} ref={ref}>
      <span className={`en ${styles.code}`}>{code}</span>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.description}>{description}</p>

      <span className={`en ${styles.subhead}`}>対象</span>
      <p className={styles.target}>{target}</p>

      <span className={`en ${styles.subhead}`}>制作内容</span>
      <ul className={styles.items}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className={styles.stat}>
        <span className="en">価格</span>
        <strong>{price}</strong>
      </div>
      <div className={styles.stat}>
        <span className="en">納期</span>
        <strong>{delivery}</strong>
      </div>
    </div>
  );
}
