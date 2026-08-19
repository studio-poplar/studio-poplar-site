import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import PillarCard from "@/components/PillarCard";
import PlanCard from "@/components/PlanCard";
import CtaBand from "@/components/CtaBand";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "SERVICE",
  description:
    "Studio PoplarのSERVICEページ。WEB制作、3Dモデリング活用WEB制作、アプリ制作の3領域と、LIGHT／STANDARD／PREMIUMの制作プラン構成をご案内します。",
};

export default function ServicePage() {
  return (
    <>
      <PageHero
        index="SERVICE"
        eyebrow="THREE STRUCTURES"
        title="3つの構造で、事業をかたちにする。"
        description="WEB制作／3Dモデリング活用WEB制作／アプリ制作の3領域から、事業のフェーズに合わせて構造を設計します。"
      />

      <section className="section">
        <div className="wrap">
          <SectionHead index="01" label="AREAS" title="対応領域" />
          <div className={styles.pillars}>
            <PillarCard
              num="A"
              tag="WEB"
              title="WEB制作"
              description="新規事業・個人開業の顔となるコーポレートサイト／LP。ブランドの言語化から設計します。"
              items={["ヒアリング・要件整理", "情報設計・ワイヤーフレーム", "UIデザイン", "レスポンシブコーディング", "公開・基本SEO設定"]}
            />
            <PillarCard
              num="B"
              tag="3D WEB"
              title="3Dモデリング活用WEB制作"
              description="空間・プロダクトを3Dで見せるWebサイト。体験としての説得力で、他社と差をつけます。"
              items={["3Dモデリング（空間・プロダクト）", "Web上での3Dビジュアル実装", "インタラクション設計", "パフォーマンス最適化", "レスポンシブ対応"]}
            />
            <PillarCard
              num="C"
              tag="APP"
              title="アプリ制作"
              description="会員・予約・診断など、事業の運用を支えるアプリを設計・開発します。"
              items={["要件定義・画面設計", "UI/UXデザイン", "プロトタイプ開発", "実装・テスト", "リリース・運用サポート"]}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead
            index="02"
            label="PLAN"
            title="制作プラン"
            description="事業のフェーズや規模に応じて3段階のプランをご用意しています。金額はご要件に応じてお見積りします。"
          />
          <div className={styles.plans}>
            <PlanCard
              name="LIGHT"
              tagline="開業・小規模事業のスタート地点に。"
              features={[
                "ヒアリング〜公開までの基本設計",
                "テンプレートをベースにしたデザイン",
                "小規模ページ構成を想定",
                "レスポンシブ対応",
                "基本的なSEO設定",
              ]}
            />
            <PlanCard
              name="STANDARD"
              tagline="ブランドの言語化から設計する標準プラン。"
              recommended
              features={[
                "オリジナルデザインでの設計",
                "中規模ページ構成を想定",
                "ブランドの言語化からサポート",
                "レスポンシブ・アクセシビリティ対応",
                "公開後の簡易サポート",
              ]}
            />
            <PlanCard
              name="PREMIUM"
              tagline="3D・アプリを含む拡張要件に対応。"
              features={[
                "フルカスタムデザイン・設計",
                "3Dモデリング／アプリ等の拡張要素に対応",
                "ページ数・機能要件に応じて個別設計",
                "継続的な運用・改善サポート",
                "優先対応",
              ]}
            />
          </div>
          <p className={styles.note}>※ 金額は事業内容・ご要件に応じて個別にお見積りいたします。まずはお気軽にお問い合わせください。</p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
