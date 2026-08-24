import styles from "./AboutBlock.module.css";

type AboutBlockProps = {
  index: string;
  quote: string;
  body: string;
};

export default function AboutBlock({ index, quote, body }: AboutBlockProps) {
  return (
    <div className={styles.grid}>
      <span className={`eyebrow ${styles.eyebrow}`}>{index}</span>
      <p className={styles.quote}>{quote}</p>
      <p className={styles.body}>{body}</p>
    </div>
  );
}
