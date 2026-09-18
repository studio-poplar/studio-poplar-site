import styles from "./AboutBlock.module.css";

type AboutBlockProps = {
  num: string;
  label: string;
  quote: string;
  body: string;
};

export default function AboutBlock({ num, label, quote, body }: AboutBlockProps) {
  return (
    <div className={styles.grid}>
      <div className={styles.head}>
        <div className={styles.eyebrowRow}>
          <span className={`en ${styles.index}`}>{num}</span>
          <span className={`en ${styles.label}`}>{label}</span>
        </div>
      </div>
      <p className={styles.quote}>{quote}</p>
      <p className={styles.body}>{body}</p>
    </div>
  );
}
