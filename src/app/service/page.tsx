import type { Metadata } from "next";
import PageMasthead from "@/components/PageMasthead";
import SectionHead from "@/components/SectionHead";
import ServiceCard from "@/components/ServiceCard";
import PlanCard from "@/components/PlanCard";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "SERVICE",
  description:
    "Studio PoplarのSERVICEページ。WEB制作、3Dモデリング活用WEB制作、アプリ制作の3領域と、制作プランの構成・価格帯をご案内します。",
};

export default function ServicePage() {
  return (
    <>
      <PageMasthead
        eyebrow="THREE STRUCTURES"
        title="3つの構造で、事業をかたちにする。"
        description="WEB制作／3Dモデリング活用WEB制作／アプリ制作の3領域から、事業のフェーズに合わせて構造を設計します。"
      />

      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="01" label="AREAS" title="対応領域" />
          </Reveal>
          <div className="grid-3">
            <ServiceCard
              num="A"
              tag="WEB"
              title="WEB制作"
              description="ヒアリング・要件整理／情報設計・ワイヤーフレーム／UIデザイン／レスポンシブコーディング／公開・基本SEO設定"
              revealDelay={50}
            />
            <ServiceCard
              num="B"
              tag="3D WEB"
              title="3Dモデリング活用WEB制作"
              description="3Dモデリング（空間・プロダクト）／Web上での3Dビジュアル実装／インタラクション設計／パフォーマンス最適化"
              revealDelay={140}
            />
            <ServiceCard
              num="C"
              tag="APP"
              title="アプリ制作"
              description="要件定義・画面設計／UI/UXデザイン／プロトタイプ開発／実装・テスト／リリース・運用サポート"
              revealDelay={230}
            />
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="02" label="PLAN" title="制作プラン" />
          </Reveal>
          <div className="grid-3">
            <PlanCard code="PLAN-A" name="WEB制作" description="小規模なコーポレートサイト・LPの制作に。" price="5万円〜" delivery="最短1週間" revealDelay={50} />
            <PlanCard
              code="PLAN-B"
              name="3Dモデリング活用WEB制作"
              description="空間・プロダクトを3Dで見せるWebサイト制作に。"
              price="15万円〜"
              delivery="最短2週間"
              revealDelay={140}
            />
            <PlanCard code="PLAN-C" name="アプリ制作" description="会員・予約・診断など運用を支えるアプリ制作に。" price="10万円〜" delivery="最短2週間" revealDelay={230} />
          </div>
          <p className={styles.note}>※ 上記は基本プランの目安です。ページ数や機能要件によって変動します。詳細はお問い合わせください。</p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
