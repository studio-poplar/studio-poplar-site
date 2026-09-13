"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PHOTO_VIDEO_TIERS, SET_DISCOUNT_RATE } from "@/data/photo-video-quote";
import { trackEvent } from "@/lib/gtag";
import styles from "./QuoteCalculator.module.css";

function formatYen(value: number) {
  return `¥${value.toLocaleString("ja-JP")}`;
}

export default function PhotoVideoQuoteCalculator() {
  const [tierId, setTierId] = useState(PHOTO_VIDEO_TIERS[0].id);
  const [setDiscount, setSetDiscount] = useState(false);

  const tier = PHOTO_VIDEO_TIERS.find((t) => t.id === tierId)!;
  const total = setDiscount ? Math.round(tier.price * (1 - SET_DISCOUNT_RATE)) : tier.price;

  const contactHref = useMemo(() => {
    const lines = [
      "【写真・動画撮影 自動見積りより】",
      `プラン: ${tier.label}（${tier.content}／${tier.time}）`,
      `セット割引: ${setDiscount ? "適用（WEB制作・アプリ制作をご契約）" : "なし"}`,
      `概算金額: ${formatYen(total)}〜`,
      "",
      "上記内容でご相談したいです。",
    ];
    return `/contact?${new URLSearchParams({ message: lines.join("\n") }).toString()}`;
  }, [tier, setDiscount, total]);

  return (
    <div className={styles.calc}>
      <fieldset className={styles.group}>
        <legend>プラン</legend>
        {PHOTO_VIDEO_TIERS.map((item) => (
          <label key={item.id} className={styles.tierOption}>
            <input type="radio" name="photo-video-tier" value={item.id} checked={tierId === item.id} onChange={() => setTierId(item.id)} />
            <span className={styles.optionBody}>
              <span className={styles.optionHead}>
                <span className={`en ${styles.optionLabel}`}>{item.label}</span>
                <span className={styles.optionPrice}>{`${formatYen(item.price)}〜`}</span>
              </span>
              <span className={styles.optionDetail}>
                {item.content}／目安時間: {item.time}
              </span>
            </span>
          </label>
        ))}
      </fieldset>

      <fieldset className={styles.group}>
        <legend>セット割引</legend>
        <label className={styles.option}>
          <input type="checkbox" checked={setDiscount} onChange={() => setSetDiscount((v) => !v)} />
          <span className={styles.optionBody}>
            <span className={styles.optionLabel}>WEB制作・アプリ制作をご契約の方</span>
            <span className={styles.optionDetail}>いずれかをご契約の場合、写真・動画撮影が半額になります</span>
          </span>
          <span className={styles.optionPrice}>{setDiscount ? "−50%" : ""}</span>
        </label>
      </fieldset>

      <div className={styles.result}>
        <span className={`en ${styles.resultLabel}`}>概算お見積り</span>
        <strong className={styles.resultPrice}>{formatYen(total)}〜</strong>
        {setDiscount && <p className={styles.resultDiscountNote}>セット割引適用済み（通常 {formatYen(tier.price)}〜）</p>}
        <p className={styles.resultNote}>※ こちらは目安の概算金額です。正式な金額は内容確認後にあらためてお見積りいたします。</p>
        <Link href={contactHref} className="btn-primary" onClick={() => trackEvent("contact_click", { location: "photo_video_quote" })}>
          この内容で問い合わせる →
        </Link>
      </div>

      <div className={styles.scope}>
        <p>
          <strong>データ納品：</strong>
          Web用・SNS用・印刷用にあわせて書き出します。
        </p>
        <p>
          <strong>セット割引：</strong>
          WEB制作・アプリ制作のいずれかをご契約いただいた方が対象です。
        </p>
      </div>
    </div>
  );
}
