import styles from "./PillarCard.module.css";

type PillarCardProps = {
  num: string;
  tag: string;
  title: string;
  description: string;
  items?: string[];
};

export default function PillarCard({ num, tag, title, description, items }: PillarCardProps) {
  return (
    <div className={styles.pillar}>
      <span className={styles.num} aria-hidden="true">
        {num}
      </span>
      <span className={`mono ${styles.tag}`}>{tag}</span>
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
