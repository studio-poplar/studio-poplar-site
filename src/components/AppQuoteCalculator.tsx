"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { APP_TIERS, APP_BACKEND_OPTIONS } from "@/data/app-quote";
import { trackEvent } from "@/lib/gtag";
import styles from "./QuoteCalculator.module.css";

function formatYen(value: number) {
  return `${value.toLocaleString("ja-JP")}円`;
}

export default function AppQuoteCalculator() {
  const [tierId, setTierId] = useState(APP_TIERS[0].id);
  const [backendId, setBackendId] = useState(APP_BACKEND_OPTIONS[0].id);

  const tier = APP_TIERS.find((t) => t.id === tierId)!;
  const backend = APP_BACKEND_OPTIONS.find((b) => b.id === backendId)!;
  const isCustom = tier.basePrice === null;
  const total = !isCustom ? tier.basePrice! + backend.addPrice : 0;

  const contactHref = useMemo(() => {
    const lines = [
      "【アプリ制作 自動見積りより】",
      `画面規模: ${tier.label}`,
      `納期目安: ${tier.delivery}`,
      `バックエンド連携: ${backend.label}`,
      isCustom ? "概算金額: 個別見積り希望" : `概算金額: ${formatYen(total)}`,
      "",
      "上記内容でご相談したいです。",
    ];
    return `/contact?${new URLSearchParams({ message: lines.join("\n") }).toString()}`;
  }, [tier, backend, isCustom, total]);

  return (
    <div className={styles.calc}>
      <fieldset className={styles.group}>
        <legend>画面規模</legend>
        {APP_TIERS.map((item) => (
          <label key={item.id} className={styles.tierOption}>
            <input type="radio" name="app-tier" value={item.id} checked={tierId === item.id} onChange={() => setTierId(item.id)} />
            <span className={styles.optionBody}>
              <span className={styles.optionHead}>
                <span className={styles.optionLabel}>{item.label}</span>
                <span className={styles.optionPrice}>{item.basePrice === null ? "要相談" : formatYen(item.basePrice)}</span>
              </span>
              <span className={styles.optionDetail}>
                {item.detail}／納期目安: {item.delivery}
              </span>
            </span>
          </label>
        ))}
      </fieldset>

      <fieldset className={styles.group}>
        <legend>バックエンド連携</legend>
        {APP_BACKEND_OPTIONS.map((item) => (
          <label key={item.id} className={styles.option}>
            <input type="radio" name="app-backend" value={item.id} checked={backendId === item.id} onChange={() => setBackendId(item.id)} />
            <span className={styles.optionLabel}>{item.label}</span>
            <span className={styles.optionPrice}>{item.addPrice > 0 ? `+${formatYen(item.addPrice)}` : "±0"}</span>
          </label>
        ))}
      </fieldset>

      <div className={styles.result}>
        <span className={`en ${styles.resultLabel}`}>概算お見積り</span>
        {isCustom ? (
          <strong className={styles.resultQuote}>内容により個別にお見積りします</strong>
        ) : (
          <strong className={styles.resultPrice}>{formatYen(total)}</strong>
        )}
        <p className={styles.resultNote}>※ こちらは目安の概算金額です。正式な金額は内容確認後にあらためてお見積りいたします。</p>
        <Link href={contactHref} className="btn-primary" onClick={() => trackEvent("contact_click", { location: "app_quote" })}>
          この内容で問い合わせる →
        </Link>
      </div>

      <div className={styles.scope}>
        <p>
          <strong>含まれるもの：</strong>
          要件整理からリリースまでの制作一式／デザイン確認2回まで
        </p>
        <p>
          <strong>含まれないもの：</strong>
          アプリストア（App Store／Google Play）の登録費用・審査対応／原稿・素材のご用意（別途ご相談も可能です）／3回目以降の大幅な修正
        </p>
      </div>
    </div>
  );
}
