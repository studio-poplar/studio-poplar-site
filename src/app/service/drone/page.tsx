import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import PageMasthead from "@/components/PageMasthead";
import DroneQuoteCalculator from "@/components/DroneQuoteCalculator";
import CtaBand from "@/components/CtaBand";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "ドローン撮影の料金",
  description:
    "Studio Poplarのドローン撮影。最低料金3万円（1時間まで）から、30分単位で加算して計算します。撮影をお受けできない場所も、あらかじめ明記しています。",
  path: "/service/drone",
});

// 許可・承認が必要となる主な飛行。公開前に、国土交通省の最新の案内と照らし合わせること。
const UNAVAILABLE = [
  "人口集中地区の上空",
  "空港などの周辺、および地表から150m以上の空域",
  "夜間の飛行、目視できない範囲での飛行",
  "人・建物・車両などから30m未満の距離での飛行",
  "イベント・催しの会場の上空",
  "危険物の輸送や、物の投下を伴う撮影",
];

const CANCEL_POLICY = [
  "天候不良・機体トラブルなど当方都合による日程変更・中止：費用負担なし",
  "お客様都合による撮影日2週間前までの変更・キャンセル：費用負担なし",
  "撮影日7〜13日前までのキャンセル：お見積金額の30%",
  "撮影日2〜6日前までのキャンセル：お見積金額の50%",
  "撮影当日のキャンセル：お見積金額の全額",
];

export default function DronePage() {
  return (
    <>
      <PageMasthead
        eyebrow="DRONE PHOTOGRAPHY"
        title="ドローン撮影"
        description="写真・動画撮影メニューの一つとして、空撮による素材撮影をお受けします。料金は実際の飛行時間で計算します。"
      />

      <section className="section" style={{ borderBottom: "none" }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div className={styles.notice}>
            <span className={`en ${styles.noticeLabel}`}>撮影をお受けできない場所があります</span>
            <p>現在は、飛行の許可・承認が必要となる場所での撮影をお受けしていません。主に、次のような場所・飛行が該当します。</p>
            <ul className={styles.noticeList}>
              {UNAVAILABLE.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              このほか、公園など管理者が飛行を禁じている場所や、国の重要施設の周辺も対象外です。私有地や施設の敷地では、所有者・管理者の許可が別途必要です。撮影場所が該当するかは、お問い合わせの際にお伺いして確認します。
            </p>
          </div>

          <DroneQuoteCalculator />

          <div className={styles.scope}>
            <span className={`en ${styles.scopeLabel}`}>ご確認ください</span>
            <p>
              <strong>含まれるもの：</strong>
              写真・動画の撮影／基本補正（明るさ・色味の調整）／撮影データの納品
            </p>
            <p>
              <strong>含まれないもの：</strong>
              動画の編集／関東以外への交通費／許可・承認が必要な場所での撮影
            </p>
            <p>
              動画の編集をご希望の場合は、<Link href="/service">写真・動画撮影のプラン</Link>と合わせてご相談ください。
            </p>
          </div>

          <div className={styles.cancelPolicy}>
            <span className={`en ${styles.cancelLabel}`}>キャンセルポリシー</span>
            <ul>
              {CANCEL_POLICY.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
