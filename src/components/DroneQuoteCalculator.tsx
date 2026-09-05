"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DRONE_MENUS,
  DRONE_TIME_OPTIONS,
  DRONE_ZONE_OPTIONS,
  DRONE_DELIVERY_OPTIONS,
  type DroneMenu,
  type DroneOption,
} from "@/data/drone-quote";
import { trackEvent } from "@/lib/gtag";
import styles from "./DroneQuoteCalculator.module.css";

function formatYen(value: number) {
  return `¥${value.toLocaleString("ja-JP")}`;
}

function OptionGroup<T extends { id: string; label: string }>({
  legend,
  name,
  items,
  selectedId,
  onChange,
  priceOf,
}: {
  legend: string;
  name: string;
  items: T[];
  selectedId: string;
  onChange: (id: string) => void;
  priceOf: (item: T) => string;
}) {
  return (
    <fieldset className={styles.group}>
      <legend>{legend}</legend>
      {items.map((item) => (
        <label key={item.id} className={styles.option}>
          <input
            type="radio"
            name={name}
            value={item.id}
            checked={selectedId === item.id}
            onChange={() => onChange(item.id)}
          />
          <span className={styles.optionLabel}>{item.label}</span>
          <span className={styles.optionPrice}>{priceOf(item)}</span>
        </label>
      ))}
    </fieldset>
  );
}

export default function DroneQuoteCalculator() {
  const [menuId, setMenuId] = useState(DRONE_MENUS[0].id);
  const [timeId, setTimeId] = useState(DRONE_TIME_OPTIONS[0].id);
  const [zoneId, setZoneId] = useState(DRONE_ZONE_OPTIONS[0].id);
  const [deliveryId, setDeliveryId] = useState(DRONE_DELIVERY_OPTIONS[0].id);

  const menu = DRONE_MENUS.find((m) => m.id === menuId) as DroneMenu;
  const time = DRONE_TIME_OPTIONS.find((t) => t.id === timeId) as DroneOption;
  const zone = DRONE_ZONE_OPTIONS.find((z) => z.id === zoneId) as DroneOption;
  const delivery = DRONE_DELIVERY_OPTIONS.find((d) => d.id === deliveryId) as DroneOption;

  const total = menu.basePrice + time.addPrice + zone.addPrice + delivery.addPrice;

  const contactHref = useMemo(() => {
    const summary = [
      "【ドローン撮影 自動見積りより】",
      `撮影メニュー: ${menu.label}`,
      `撮影時間: ${time.label}`,
      `撮影場所: ${zone.label}`,
      `納品形式: ${delivery.label}`,
      `概算金額: ${formatYen(total)}〜`,
      "",
      "上記内容でご相談したいです。",
    ].join("\n");
    return `/contact?${new URLSearchParams({ message: summary }).toString()}`;
  }, [menu, time, zone, delivery, total]);

  return (
    <div className={styles.calc}>
      <OptionGroup
        legend="撮影メニュー"
        name="drone-menu"
        items={DRONE_MENUS}
        selectedId={menuId}
        onChange={setMenuId}
        priceOf={(item) => `${formatYen(item.basePrice)}〜`}
      />
      <OptionGroup
        legend="撮影時間・拘束時間"
        name="drone-time"
        items={DRONE_TIME_OPTIONS}
        selectedId={timeId}
        onChange={setTimeId}
        priceOf={(item) => (item.addPrice > 0 ? `+${formatYen(item.addPrice)}` : "±0")}
      />
      <OptionGroup
        legend="撮影場所（横浜からの距離）"
        name="drone-zone"
        items={DRONE_ZONE_OPTIONS}
        selectedId={zoneId}
        onChange={setZoneId}
        priceOf={(item) => (item.addPrice > 0 ? `+${formatYen(item.addPrice)}` : "±0")}
      />
      <OptionGroup
        legend="納品形式"
        name="drone-delivery"
        items={DRONE_DELIVERY_OPTIONS}
        selectedId={deliveryId}
        onChange={setDeliveryId}
        priceOf={(item) => (item.addPrice > 0 ? `+${formatYen(item.addPrice)}` : "±0")}
      />

      <div className={styles.result}>
        <span className={`en ${styles.resultLabel}`}>概算お見積り</span>
        <strong className={styles.resultPrice}>{formatYen(total)}〜</strong>
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
