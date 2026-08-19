import Link from "next/link";
import styles from "./CtaBand.module.css";

export default function CtaBand() {
  return (
    <section className={styles.cta}>
      <div className={`wrap ${styles.inner}`}>
        <span className="mono" style={{ color: "var(--accent)" }}>
          START A PROJECT
        </span>
        <h2 className={styles.title}>まずは、事業の輪郭から話しませんか。</h2>
        <Link href="/contact" className="btn-primary">
          お問い合わせフォームへ →
        </Link>
      </div>
    </section>
  );
}
