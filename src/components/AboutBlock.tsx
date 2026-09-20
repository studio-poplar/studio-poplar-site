import styles from "./AboutBlock.module.css";

type AboutBlockProps = {
  num: string;
  label: string;
  /** one string, or one entry per line (so the line breaks fall where the meaning does) */
  quote: string | string[];
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
      <p className={styles.quote}>
        {(Array.isArray(quote) ? quote : [quote]).map((line) => (
          <span key={line} className={styles.line}>
            {line}
          </span>
        ))}
      </p>
      <p className={styles.body}>{body}</p>
    </div>
  );
}
