"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DRONE_FLIGHTS, DRONE_ZONES, DRONE_UNIT_MINUTES, DRONE_UNIT_PRICE } from "@/data/drone-quote";
import { trackEvent } from "@/lib/gtag";
import styles from "./DroneQuoteCalculator.module.css";

function formatYen(value: number) {
  return `¥${value.toLocaleString("ja-JP")}`;
}

export default function DroneQuoteCalculator() {
  const [flightId, setFlightId] = useState(DRONE_FLIGHTS[0].id);
  const [zoneId, setZoneId] = useState(DRONE_ZONES[0].id);

  const flight = DRONE_FLIGHTS.find((f) => f.id === flightId)!;
  const zone = DRONE_ZONES.find((z) => z.id === zoneId)!;

  const isCustomFlight = flight.units === null;
  const isCustomZone = zone.addPrice === null;
  const total = flight.units === null ? 0 : flight.units * DRONE_UNIT_PRICE + (zone.addPrice ?? 0);

  const contactHref = useMemo(() => {
    const lines = [
      "【ドローン撮影 自動見積りより】",
      `飛行時間の目安: ${flight.label}`,
      `撮影エリア: ${zone.label}`,
    ];
    if (isCustomFlight) {
      lines.push("概算金額: 個別見積り希望");
    } else {
      lines.push(`概算金額: ${formatYen(total)}〜${isCustomZone ? "（＋エリア交通費は別途お見積り）" : ""}`);
    }
    lines.push("", "【撮影したい場所（住所または施設名）】", "", "【以下に詳細をご記入ください】", "");
    return `/contact?${new URLSearchParams({ category: "photo-video", message: lines.join("\n") }).toString()}`;
  }, [flight, zone, isCustomFlight, isCustomZone, total]);

  return (
    <div className={styles.calc}>
      <fieldset className={styles.group}>
        <legend>飛行時間の目安（{DRONE_UNIT_MINUTES}分単位）</legend>
        {DRONE_FLIGHTS.map((item) => (
          <label key={item.id} className={styles.option}>
            <input
              type="radio"
              name="drone-flight"
              value={item.id}
              checked={flightId === item.id}
              onChange={() => setFlightId(item.id)}
            />
            <span className={styles.optionLabel}>
              {item.label}
              {item.id === DRONE_FLIGHTS[0].id && <span className={styles.optionTag}>最低料金</span>}
            </span>
            <span className={styles.optionPrice}>{item.units === null ? "個別見積り" : formatYen(item.units * DRONE_UNIT_PRICE)}</span>
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

      <div className={styles.result}>
        <span className={`en ${styles.resultLabel}`}>概算お見積り</span>
        {isCustomFlight ? (
          <strong className={styles.resultQuote}>内容により個別にお見積りします</strong>
        ) : (
          <strong className={styles.resultPrice}>
            {formatYen(total)}
            {isCustomZone && <span className={styles.resultSuffix}>＋交通費別途</span>}
          </strong>
        )}
        <p className={styles.resultNote}>
          ※ 料金は実際の飛行時間で、{DRONE_UNIT_MINUTES}分単位（切り上げ）で精算します。表示は目安の概算金額で、正式な金額は撮影場所を確認したうえで、あらためてお見積りします。
        </p>
        <Link
          href={contactHref}
          className="btn-primary"
          onClick={() => trackEvent("contact_click", { location: "drone_quote" })}
        >
          この内容で問い合わせる<span className="btn-arrow">→</span>
        </Link>
      </div>
    </div>
  );
}
