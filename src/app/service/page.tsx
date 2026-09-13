import type { Metadata } from "next";
import PageMasthead from "@/components/PageMasthead";
import SectionHead from "@/components/SectionHead";
import ServiceCard from "@/components/ServiceCard";
import PlanCard from "@/components/PlanCard";
import PhotoVideoPlanCard from "@/components/PhotoVideoPlanCard";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "SERVICE",
  description: "Studio PoplarのSERVICEページ。WEB制作、アプリ制作、写真・動画撮影の3領域と、制作プランの構成・価格帯をご案内します。",
};

const FLOW_STEPS = [
  "まずはお問い合わせ・ヒアリング",
  "サイト構成・写真プランなど、具体案を提示",
  "制作・撮影",
  "公開・納品",
];

export default function ServicePage() {
  return (
    <>
      <PageMasthead
        eyebrow="THREE THINGS"
        title="できることは3つです。"
        description="話を聞きながら、サイト・アプリ・写真や映像のかたちにしていきます。"
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
              title="サイトをつくる"
              description="ヒアリング／構成・ワイヤーフレーム／デザイン／コーディング／公開"
              revealDelay={50}
            />
            <ServiceCard
              num="B"
              tag="APP"
              title="仕組みをつくる"
              description="要件整理／画面設計／デザイン／開発・テスト／リリース"
              revealDelay={140}
            />
            <ServiceCard
              num="C"
              tag="PHOTO & VIDEO"
              title="見せ方をつくる"
              description="撮影プランの相談／撮影／レタッチ・編集／納品"
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
          <div className={styles.planGrid}>
            <PlanCard
              code="PLAN-A"
              name="WEB制作"
              description="小さなサイトやページが必要な方に。"
              target="これから事業を始める方、まず“顔”になるサイトが欲しい方"
              items={["ヒアリング", "構成設計", "デザイン（〜5ページ）", "コーディング", "公開"]}
              price="5万円〜"
              delivery="最短1週間"
              revealDelay={50}
            />
            <PlanCard
              code="PLAN-B"
              name="アプリ制作"
              description="予約や会員管理の仕組みが欲しい方に。"
              target="日々の運用をラクにしたい方"
              items={["要件整理", "画面設計", "デザイン", "開発・テスト", "リリース"]}
              price="10万円〜"
              delivery="最短2週間"
              revealDelay={140}
            />
          </div>

          <div className={styles.photoVideoWrap}>
            <PhotoVideoPlanCard
              code="PLAN-C"
              name="写真・動画撮影"
              description="言葉だけでは伝わらない雰囲気を残したい方に。"
              tiers={[
                { name: "Light", content: "プロフィール・スナップ撮影", time: "2時間", price: "4万円〜" },
                { name: "Standard", content: "商品・店舗・イベント撮影", time: "半日（4時間）", price: "8万円〜" },
                { name: "Premium", content: "撮影＋SNS/PR用ショート動画編集込み", time: "1日（8時間）", price: "16万円〜" },
              ]}
              notes={["データ納品はWeb用・SNS用・印刷用にあわせて書き出します。", "Web制作とのセット依頼は、別途割引を個別にご相談ください。"]}
              revealDelay={230}
            />
          </div>

          <p className={styles.note}>※ 上記は基本プランの目安です。ページ数や機能要件によって変動します。詳細はお問い合わせください。</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="03" label="FLOW" title="ご依頼の流れ" />
          </Reveal>
          <ol className={styles.flow}>
            {FLOW_STEPS.map((step, i) => (
              <li key={step}>
                <span className={`en ${styles.flowNum}`}>{String(i + 1).padStart(2, "0")}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section soft">
        <div className="wrap">
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
              <div>
                <h3>写真・動画だけの依頼はできますか？</h3>
                <p>可能です。Web制作と組み合わせる場合は、別途セット割引をご相談いただけます。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
