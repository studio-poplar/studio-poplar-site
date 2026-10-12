import Link from "next/link";
import styles from "./list.module.css";

export default function DeshiiriNotFound() {
  return (
    <div className={`d-wrap ${styles.page}`}>
      <span className="d-eyebrow">404 — NOT FOUND</span>
      <h1 className={styles.notFoundTitle}>このページは見つかりませんでした。</h1>
      <p className={styles.intro}>記事が移動したか、アドレスが変わった可能性があります。</p>
      <Link href="/deshiiri" className="d-btn">
        デシイリのトップへ
      </Link>
    </div>
  );
}
