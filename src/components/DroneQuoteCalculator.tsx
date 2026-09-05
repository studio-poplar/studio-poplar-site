"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DRONE_PLANS, DRONE_ZONES, DRONE_ADDONS } from "@/data/drone-quote";
import { trackEvent } from "@/lib/gtag";
import styles from "./DroneQuoteCalculator.module.css";

function formatYen(value: number) {
  return `¥${value.toLocaleString("ja-JP")}`;
}

export default function DroneQuoteCalculator() {
  const [planId, setPlanId] = useState(DRONE_PLANS[0].id);
  const [zoneId, setZoneId] = useState(DRONE_ZONES[0].id);
  const [addonIds, setAddonIds] = useState<Set<string>>(new Set());

  const plan = DRONE_PLANS.find((p) => p.id === planId)!;
  const zone = DRONE_ZONES.find((z) => z.id === zoneId)!;
  const selectedAddons = DRONE_ADDONS.filter((a) => addonIds.has(a.id));

  const isCustomPlan = plan.basePrice === null;
  const isCustomZone = zone.addPrice === null;
  const addonTotal = selectedAddons.reduce((sum, a) => sum + a.addPrice, 0);
  const total = !isCustomPlan ? plan.basePrice! + (isCustomZone ? 0 : zone.addPrice!) + addonTotal : 0;

  function toggleAddon(id: string) {
    setAddonIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const contactHref = useMemo(() => {
    const lines = [
      "【ドローン撮影 自動見積りより】",
      `プラン: ${plan.label}`,
      `撮影エリア: ${zone.label}`,
      `オプション: ${selectedAddons.length > 0 ? selectedAddons.map((a) => a.label).join("、") : "なし"}`,
    ];
    if (isCustomPlan) {
      lines.push("概算金額: 個別見積り希望");
    } else {
      lines.push(`概算金額: ${formatYen(total)}〜${isCustomZone ? "（＋エリア交通費は別途お見積り）" : ""}`);
    }
    lines.push("", "上記内容でご相談したいです。");
    return `/contact?${new URLSearchParams({ message: lines.join("\n") }).toString()}`;
  }, [plan, zone, selectedAddons, isCustomPlan, isCustomZone, total]);

  return (
    <div className={styles.calc}>
      <fieldset className={styles.group}>
        <legend>プラン</legend>
        {DRONE_PLANS.map((item) => (
          <label key={item.id} className={styles.planOption}>
            <input
              type="radio"
              name="drone-plan"
              value={item.id}
              checked={planId === item.id}
              onChange={() => setPlanId(item.id)}
            />
            <span className={styles.planBody}>
              <span className={styles.planHead}>
                <span className={styles.optionLabel}>{item.label}</span>
                <span className={styles.optionPrice}>{item.basePrice === null ? "要相談" : `${formatYen(item.basePrice)}〜`}</span>
              </span>
              <span className={styles.planDetail}>{item.detail}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <fieldset className={styles.group}>
        <legend>撮影エリア（横浜からの距離）</legend>
        {DRONE_ZONES.map((item) => (
          <label key={item.id} className={styles.option}>
            <input
              type="radio"
              name="drone-zone"
              value={item.id}
              checked={zoneId === item.id}
              onChange={() => setZoneId(item.id)}
            />
            <span className={styles.optionLabel}>{item.label}</span>
            <span className={styles.optionPrice}>
              {item.addPrice === null ? "別途お見積り" : item.addPrice > 0 ? `+${formatYen(item.addPrice)}` : "±0"}
            </span>
          </label>
        ))}
      </fieldset>

      <fieldset className={styles.group}>
        <legend>オプション追加（複数選択可）</legend>
        {DRONE_ADDONS.map((item) => (
          <label key={item.id} className={styles.option}>
            <input type="checkbox" checked={addonIds.has(item.id)} onChange={() => toggleAddon(item.id)} />
            <span className={styles.planBody}>
              <span className={styles.planHead}>
                <span className={styles.optionLabel}>{item.label}</span>
                <span className={styles.optionPrice}>{`+${formatYen(item.addPrice)}`}</span>
              </span>
              {item.detail && <span className={styles.planDetail}>{item.detail}</span>}
            </span>
          </label>
        ))}
      </fieldset>

      <div className={styles.result}>
        <span className={`en ${styles.resultLabel}`}>概算お見積り</span>
        {isCustomPlan ? (
          <strong className={styles.resultQuote}>内容により個別にお見積りします</strong>
        ) : (
          <strong className={styles.resultPrice}>
            {formatYen(total)}〜{isCustomZone && <span className={styles.resultSuffix}>＋交通費別途</span>}
          </strong>
        )}
        <p className={styles.resultNote}>
          ※ こちらは目安の概算金額です。正式な金額は内容確認後にあらためてお見積りいたします。
        </p>
        <Link
          href={contactHref}
          className="btn-primary"
          onClick={() => trackEvent("contact_click", { location: "drone_quote" })}
        >
          この内容で問い合わせる →
        </Link>
      </div>
    </div>
  );
}
