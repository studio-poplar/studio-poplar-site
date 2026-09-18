import styles from "./SectionHead.module.css";

type SectionHeadProps = {
  index: string;
  label: string;
  title: string;
  accent?: boolean;
};

export default function SectionHead({ index, label, title, accent }: SectionHeadProps) {
  return (
    <div>
      <div className={`${styles.kickerRule} ${accent ? styles.kickerRuleAccent : ""}`} />
      <div className={styles.eyebrowRow}>
        <span className={`en ${styles.index}`}>{index}</span>
        <span className={`en ${styles.label}`}>{label}</span>
      </div>
      <h2>{title}</h2>
    </div>
  );
}
