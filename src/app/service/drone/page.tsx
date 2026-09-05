import type { Metadata } from "next";
import PageMasthead from "@/components/PageMasthead";
import DroneQuoteCalculator from "@/components/DroneQuoteCalculator";
import CtaBand from "@/components/CtaBand";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "DRONE",
  description: "Studio Poplarのドローン撮影オプション（準備中）。",
  robots: { index: false, follow: false },
};

export default function DronePage() {
  return (
    <>
      <PageMasthead
        eyebrow="OPTIONAL SERVICE"
        title="ドローン撮影オプション"
        description="WEB制作・3Dモデリング活用WEB制作の素材となる空撮写真・映像を、企画から撮影までワンストップでご提供します。"
      />

      <section className="section" style={{ borderBottom: "none" }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div className={styles.notice}>
            <span className={`en ${styles.noticeLabel}`}>準備中のオプションです</span>
            <p>
              本ページ・自動見積りは公開準備中のコンテンツです。操縦者資格・機体登録・賠償保険の手続きが整い次第、正式にご案内します。
            </p>
          </div>

          <DroneQuoteCalculator />

          <div className={styles.cancelPolicy}>
            <span className={`en ${styles.cancelLabel}`}>キャンセルポリシー（案）</span>
            <ul>
              <li>天候不良・機体トラブルなど当方都合による日程変更・中止：費用負担なし</li>
              <li>お客様都合による撮影日2週間前までの変更・キャンセル：費用負担なし</li>
              <li>撮影日7〜13日前までのキャンセル：お見積金額の30%</li>
              <li>撮影日2〜6日前までのキャンセル：お見積金額の50%</li>
              <li>撮影当日のキャンセル：お見積金額の全額</li>
            </ul>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
