"use client";

import { useCard } from "@/lib/useCard";
import styles from "./PhotoVideoPlanCard.module.css";

type Tier = {
  name: string;
  content: string;
  time: string;
  price: string;
};

type PhotoVideoPlanCardProps = {
  code: string;
  name: string;
  description: string;
  tiers: Tier[];
  notes: string[];
  revealDelay?: number;
};

export default function PhotoVideoPlanCard({
  code,
  name,
  description,
  tiers,
  notes,
  revealDelay = 0,
}: PhotoVideoPlanCardProps) {
  const ref = useCard<HTMLDivElement>(revealDelay);

  return (
    <div className={styles.card} ref={ref}>
      <span className={`en ${styles.code}`}>{code}</span>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.description}>{description}</p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>プラン</th>
              <th>内容</th>
              <th>目安時間</th>
              <th>価格</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier) => (
              <tr key={tier.name}>
                <td className={`en ${styles.tierName}`}>{tier.name}</td>
                <td>{tier.content}</td>
                <td>{tier.time}</td>
                <td className={styles.price}>{tier.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className={styles.notes}>
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
