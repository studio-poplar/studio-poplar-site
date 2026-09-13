"use client";

import Link from "next/link";
import { useCard } from "@/lib/useCard";
import { PHOTO_VIDEO_TIERS, SET_DISCOUNT_RATE } from "@/data/photo-video-quote";
import { trackEvent } from "@/lib/gtag";
import styles from "./PhotoVideoQuoteCalculator.module.css";

function formatYen(value: number) {
  return `${value.toLocaleString("ja-JP")}円`;
}

const CONTACT_HREF = `/contact?${new URLSearchParams({
  message: [
    "【写真・動画撮影について】",
    ...PHOTO_VIDEO_TIERS.map(
      (tier) => `${tier.label}: ${formatYen(tier.price)}（セット割引時 ${formatYen(Math.round(tier.price * (1 - SET_DISCOUNT_RATE)))}）`
    ),
    "",
    "上記プランについて相談したいです。",
  ].join("\n"),
}).toString()}`;

export default function PhotoVideoQuoteCalculator({ revealDelay = 0 }: { revealDelay?: number }) {
  const ref = useCard<HTMLDivElement>(revealDelay);

  return (
    <div className={styles.card} ref={ref}>
      <div className={styles.tableOuter}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.stickyCol}>プラン</th>
                <th>内容</th>
                <th>目安時間</th>
                <th>価格</th>
                <th className={styles.setPriceHead}>
                  セット割引価格
                  <span>WEB制作／アプリ制作をご契約の方</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {PHOTO_VIDEO_TIERS.map((tier) => (
                <tr key={tier.id}>
                  <td className={`en ${styles.tierName} ${styles.stickyCol}`}>{tier.label}</td>
                  <td>{tier.content}</td>
                  <td>{tier.time}</td>
                  <td className={styles.price}>{formatYen(tier.price)}</td>
                  <td className={styles.setPrice}>{formatYen(Math.round(tier.price * (1 - SET_DISCOUNT_RATE)))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className={styles.scrollHint}>← 横にスクロールできます →</p>

      <ul className={styles.notes}>
        <li>データ納品はWeb用・SNS用・印刷用にあわせて書き出します。</li>
        <li>セット割引価格は、WEB制作・アプリ制作のいずれかをご契約いただいた方が対象です。</li>
      </ul>

      <Link
        href={CONTACT_HREF}
        className={`btn-primary ${styles.contactButton}`}
        onClick={() => trackEvent("contact_click", { location: "photo_video_quote" })}
      >
        この内容で問い合わせる →
      </Link>
    </div>
  );
}
