"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { WEB_TIERS, WEB_OPTIONS } from "@/data/web-quote";
import { trackEvent } from "@/lib/gtag";
import styles from "./QuoteCalculator.module.css";

function formatYen(value: number) {
  return `${value.toLocaleString("ja-JP")}円`;
}

export default function WebQuoteCalculator() {
  const [tierId, setTierId] = useState(WEB_TIERS[0].id);
  const [optionIds, setOptionIds] = useState<Set<string>>(new Set());

  const tier = WEB_TIERS.find((t) => t.id === tierId)!;
  const selectedOptions = WEB_OPTIONS.filter((o) => optionIds.has(o.id));
  const isCustom = tier.basePrice === null;
  const optionTotal = selectedOptions.reduce((sum, o) => sum + o.addPrice, 0);
  const total = !isCustom ? tier.basePrice! + optionTotal : 0;

  function toggleOption(id: string) {
    setOptionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const contactHref = useMemo(() => {
    const lines = [
      "【WEB制作 自動見積りより】",
      `ページ規模: ${tier.label}`,
      `納期目安: ${tier.delivery}`,
      `追加機能: ${selectedOptions.length > 0 ? selectedOptions.map((o) => o.label).join("、") : "なし"}`,
      isCustom ? "概算金額: 個別見積り希望" : `概算金額: ${formatYen(total)}`,
      "",
      "上記内容でご相談したいです。",
    ];
    return `/contact?${new URLSearchParams({ message: lines.join("\n") }).toString()}`;
  }, [tier, selectedOptions, isCustom, total]);

  return (
    <div className={styles.calc}>
      <fieldset className={styles.group}>
        <legend>ページ規模</legend>
        {WEB_TIERS.map((item) => (
          <label key={item.id} className={styles.tierOption}>
            <input type="radio" name="web-tier" value={item.id} checked={tierId === item.id} onChange={() => setTierId(item.id)} />
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
        <legend>追加機能（複数選択可）</legend>
        {WEB_OPTIONS.map((item) => (
          <label key={item.id} className={styles.option}>
            <input type="checkbox" checked={optionIds.has(item.id)} onChange={() => toggleOption(item.id)} />
            <span className={styles.optionLabel}>{item.label}</span>
            <span className={styles.optionPrice}>{`+${formatYen(item.addPrice)}`}</span>
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
        <Link href={contactHref} className="btn-primary" onClick={() => trackEvent("contact_click", { location: "web_quote" })}>
          この内容で問い合わせる →
        </Link>
      </div>

      <div className={styles.scope}>
        <span className={`en ${styles.scopeLabel}`}>ご確認ください</span>
        <p>
          <strong>含まれるもの：</strong>
          ヒアリングから公開までの制作一式／デザイン確認2回まで
        </p>
        <p>
          <strong>含まれないもの：</strong>
          2年目以降のドメイン・サーバー更新費用／原稿・写真素材のご用意（別途ご相談も可能です）／3回目以降の大幅な修正
        </p>
      </div>
    </div>
  );
}
