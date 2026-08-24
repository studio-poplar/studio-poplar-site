import styles from "./Credentials.module.css";

export default function Credentials({ items }: { items: { k: string; v: string }[] }) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <div key={item.k} className={styles.item}>
          <span className={`en ${styles.k}`}>{item.k}</span>
          <strong>{item.v}</strong>
        </div>
      ))}
    </div>
  );
}
