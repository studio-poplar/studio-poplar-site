import Link from "next/link";
import styles from "./Logo.module.css";

// 丸囲みの「弟」の印 + 明朝の「デシイリ」 + BY STUDIO POPLAR. Built in CSS, no image.
export default function Logo() {
  return (
    <Link href="/deshiiri" className={styles.logo}>
      <span className={styles.mark} aria-hidden="true">
        弟
      </span>
      <span className={styles.text}>
        <b>デシイリ</b>
        <small>BY STUDIO POPLAR</small>
      </span>
    </Link>
  );
}
