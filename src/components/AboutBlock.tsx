import styles from "./AboutBlock.module.css";

type AboutBlockProps = {
  index: string;
  quote: string;
  body: string;
};

export default function AboutBlock({ index, quote, body }: AboutBlockProps) {
  return (
    <div className={styles.grid}>
      <p className={styles.quote}>{quote}</p>
      <div className={styles.copy}>
        <span className="eyebrow">{index}</span>
        <p>{body}</p>
      </div>
    </div>
  );
}
