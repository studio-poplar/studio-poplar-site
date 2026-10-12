import Link from "next/link";
import { FanMark } from "./FanMark";
import styles from "./Logo.module.css";

// ロゴ: 扇の印 + 明朝の「デシイリ」 + BY STUDIO POPLAR
export default function Logo() {
  return (
    <Link href="/deshiiri" className={styles.logo}>
      <FanMark className={styles.mark} />
      <span className={styles.text}>
        <b>デシイリ</b>
        <small>BY STUDIO POPLAR</small>
      </span>
    </Link>
  );
}
