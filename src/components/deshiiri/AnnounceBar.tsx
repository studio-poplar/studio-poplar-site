"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import styles from "./AnnounceBar.module.css";

// 先行公開のお知らせ帯。ページの上に細く出し、× で閉じると次から出さない（この端末だけ）。
// ポップアップ（画面をふさぐ窓）にしないのは、読み始めを妨げず、スマホの検索評価も下げないため。
const KEY = "deshiiri-announce-2026-10";

function readClosed() {
  try {
    return localStorage.getItem(KEY) === "closed";
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export default function AnnounceBar() {
  // Server render: treated as closed, so the bar appears only after the browser has checked storage.
  const closedBefore = useSyncExternalStore(subscribe, readClosed, () => true);
  const [closedNow, setClosedNow] = useState(false);

  if (closedBefore || closedNow) return null;

  const close = () => {
    setClosedNow(true);
    try {
      localStorage.setItem(KEY, "closed");
    } catch {
      // private mode etc.: it simply shows again next time
    }
  };

  return (
    <div className={styles.bar} role="region" aria-label="お知らせ">
      <p className={styles.text}>
        <b>先行公開中</b>
        <span className={styles.long}>いま載せている記事は、形を見ていただくためのイメージ案です。</span>
        取材させていただける職人・家業の方を探しています。
        <Link href="/deshiiri/for-shokunin" className={styles.link}>
          取材の相談
        </Link>
      </p>
      <button type="button" className={styles.close} onClick={close} aria-label="お知らせを閉じる">
        ×
      </button>
    </div>
  );
}
