import styles from "./PlanCard.module.css";

type PlanCardProps = {
  name: string;
  tagline: string;
  features: string[];
  recommended?: boolean;
};

export default function PlanCard({ name, tagline, features, recommended }: PlanCardProps) {
  return (
    <div className={styles.plan} data-recommended={recommended}>
      {recommended && <span className={`mono ${styles.badge}`}>RECOMMENDED</span>}
      <span className="mono" style={{ color: "var(--accent)" }}>
        PLAN
      </span>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.tagline}>{tagline}</p>
      <span className={styles.priceNote}>お見積り致します</span>
      <ul className={styles.features}>
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </div>
  );
}
