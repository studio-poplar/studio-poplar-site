import RegMarks from "./RegMarks";
import styles from "./PageHero.module.css";

type PageHeroProps = {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
};

export default function PageHero({ index, eyebrow, title, description }: PageHeroProps) {
  return (
    <section className={styles.hero}>
      <RegMarks />
      <div className={styles.scanlines} aria-hidden="true" />
      <div className={`wrap ${styles.inner}`}>
        <p className="mono" style={{ color: "var(--accent)" }}>
          {index} — {eyebrow}
        </p>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </section>
  );
}
