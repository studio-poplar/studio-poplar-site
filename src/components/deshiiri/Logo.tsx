"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FanMark } from "./FanMark";
import styles from "./Logo.module.css";

// ロゴ: 扇の印 + 明朝の「デシイリ」 + BY STUDIO POPLAR
// トップにいるときに押しても同じページなので Next.js は動かない。そのときは先頭まで戻す。
export default function Logo() {
  const pathname = usePathname();

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/deshiiri") return; // 別のページからは ScrollToTop が先頭に戻す
    // 同じページへの移動は止めて、スクロールだけにする（移動の処理がスクロールを止めないように）
    event.preventDefault();
    if (window.location.hash) history.replaceState(null, "", "/deshiiri");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
  };

  return (
    <Link href="/deshiiri" className={styles.logo} onClick={onClick}>
      <FanMark className={styles.mark} />
      <span className={styles.text}>
        <b>デシイリ</b>
        <small>BY STUDIO POPLAR</small>
      </span>
    </Link>
  );
}
