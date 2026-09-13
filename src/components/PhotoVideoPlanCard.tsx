"use client";

import { useCard } from "@/lib/useCard";
import styles from "./PhotoVideoPlanCard.module.css";

type Tier = {
  name: string;
  content: string;
  time: string;
  price: string;
  setPrice: string;
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

      <div className={styles.tableOuter}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.stickyCol}>プラン</th>
                <th>内容</th>
                <th>目安時間</th>
                <th>価格</th>
                <th className={styles.setPriceHead}>
                  セット割引価格
                  <span>WEB制作／アプリ制作をご契約の方</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier) => (
                <tr key={tier.name}>
                  <td className={`en ${styles.tierName} ${styles.stickyCol}`}>{tier.name}</td>
                  <td>{tier.content}</td>
                  <td>{tier.time}</td>
                  <td className={styles.price}>{tier.price}</td>
                  <td className={styles.setPrice}>{tier.setPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className={styles.scrollHint}>← 横にスクロールできます →</p>

      <ul className={styles.notes}>
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
