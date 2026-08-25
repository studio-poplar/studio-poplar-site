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
            <PlanCard
              code="PLAN-A"
              name="WEB制作"
              description="小規模なコーポレートサイト・LPの制作に。"
              target="新規事業の立ち上げ・個人開業で、まず“顔”となるサイトが必要な方"
              items={[
                "ヒアリング・要件整理",
                "ページ構成・ワイヤーフレーム設計",
                "UIデザイン（〜5ページ想定）",
                "レスポンシブコーディング",
                "公開・基本SEO設定",
              ]}
              price="5万円〜"
              delivery="最短1週間"
              revealDelay={50}
            />
            <PlanCard
              code="PLAN-B"
              name="3Dモデリング活用WEB制作"
              description="空間・プロダクトを3Dで見せるWebサイト制作に。"
              target="空間や商品の質感を、写真だけでは伝えきれない事業者の方"
              items={[
                "ヒアリング・コンセプト設計",
                "3Dモデリング（空間・プロダクト）",
                "Web上での3Dビジュアル実装",
                "インタラクション設計・パフォーマンス最適化",
                "公開・基本SEO設定",
              ]}
              price="15万円〜"
              delivery="最短2週間"
              revealDelay={140}
            />
            <PlanCard
              code="PLAN-C"
              name="アプリ制作"
              description="会員・予約・診断など運用を支えるアプリ制作に。"
              target="会員管理や予約、診断フローなど、事業の運用を仕組み化したい方"
              items={[
                "要件定義・画面設計",
                "UI/UXデザイン",
                "プロトタイプ開発",
                "実装・テスト",
                "リリース・運用サポート",
              ]}
              price="10万円〜"
              delivery="最短2週間"
              revealDelay={230}
            />
          </div>
          <p className={styles.note}>※ 上記は基本プランの目安です。ページ数や機能要件によって変動します。詳細はお問い合わせください。</p>

          <div className={styles.faq}>
            <span className="eyebrow en">FAQ</span>
            <div className={styles.faqList}>
              <div>
                <h3>ページ数や機能を追加したい場合は？</h3>
                <p>基本プランを土台に、追加ページ・機能に応じて個別にお見積りします。まずは要件をお聞かせください。</p>
              </div>
              <div>
                <h3>ご依頼から納品までの流れは？</h3>
                <p>お問い合わせ→ヒアリング→お見積り・ご契約→設計・制作→確認・修正→公開、という流れが基本です。</p>
              </div>
              <div>
                <h3>デザイン案の修正には対応してもらえますか？</h3>
                <p>制作フェーズ内で複数回の確認・修正機会を設けています。回数や範囲は契約時にすり合わせます。</p>
              </div>
              <div>
                <h3>公開後の運用サポートはありますか？</h3>
                <p>軽微な更新や不具合対応から、継続的な保守・改善まで、必要に応じて別途ご相談いただけます。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
