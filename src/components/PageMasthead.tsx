import { ReactNode } from "react";
import styles from "./PageMasthead.module.css";

type PageMastheadProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export default function PageMasthead({ eyebrow, title, description, children }: PageMastheadProps) {
  return (
    <section className={styles.masthead}>
      <div className="wrap">
        <span className={`eyebrow en`}>{eyebrow}</span>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
        {children}
      </div>
    </section>
  );
}
