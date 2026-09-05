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
        </div>
      </section>

      <CtaBand />
    </>
  );
}
