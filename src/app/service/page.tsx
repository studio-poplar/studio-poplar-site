import type { Metadata } from "next";
import PageMasthead from "@/components/PageMasthead";
import SectionHead from "@/components/SectionHead";
import ServiceCard from "@/components/ServiceCard";
import WebQuoteCalculator from "@/components/WebQuoteCalculator";
import AppQuoteCalculator from "@/components/AppQuoteCalculator";
import PhotoVideoQuoteCalculator from "@/components/PhotoVideoQuoteCalculator";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "SERVICE",
  description: "Studio PoplarのSERVICEページ。WEB制作、アプリ制作、写真・動画撮影の3領域と、制作プランの構成・価格帯をご案内します。",
};

const FLOW_STEPS = [
  "まずはオンラインにてお打ち合わせ",
  "サイト構成・写真プランなど、具体案を提示",
  "制作・撮影",
  "公開・納品",
];

export default function ServicePage() {
  return (
    <>
      <PageMasthead
        eyebrow="THREE THINGS"
        title="3つのかたちで、伝わる。"
        description="話を聞きながら、サイト・アプリ・写真や映像のかたちにしていきます。"
      />

      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="01" label="AREAS" title="扱う、3つの手段。" />
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
            <div>
              <div className={styles.planHeader}>
                <span className={`en ${styles.planCode}`}>PLAN-A</span>
                <h3>WEB制作</h3>
                <p>これから事業を始める方、まず“顔”になるサイトが欲しい方に。下記の選択に応じて概算金額が自動で変わります。</p>
              </div>
              <WebQuoteCalculator />
            </div>
            <div>
              <div className={styles.planHeader}>
                <span className={`en ${styles.planCode}`}>PLAN-B</span>
                <h3>アプリ制作</h3>
                <p>予約や会員管理の仕組みが欲しい方に。下記の選択に応じて概算金額が自動で変わります。</p>
              </div>
              <AppQuoteCalculator />
            </div>
          </div>

          <div className={styles.photoVideoWrap}>
            <div className={styles.planHeader}>
              <span className={`en ${styles.planCode}`}>PLAN-C</span>
              <h3>写真・動画撮影</h3>
              <p>言葉だけでは伝わらない雰囲気を残したい方に。</p>
            </div>
            <PhotoVideoQuoteCalculator />
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
                <span className={styles.flowText}>{step}</span>
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
                <p>基本プランに、デザイン確認・修正2回までを含みます。3回目以降の大幅な修正は別途ご相談となります。</p>
              </div>
              <div>
                <h3>公開後の運用サポート・保守費用はどのくらいですか？</h3>
                <p>月額の固定契約は設けていません。更新・保守が必要になったタイミングで、その都度内容に応じてお見積りします。</p>
              </div>
              <div>
                <h3>写真・動画だけの依頼はできますか？</h3>
                <p>可能です。WEB制作・アプリ制作と組み合わせる場合は、セット割引価格（半額）が適用されます。</p>
              </div>
              <div>
                <h3>支払い条件について教えてください</h3>
                <p>ご契約時に着手金として半額、納品時に残金をお支払いいただいております。</p>
              </div>
              <div>
                <h3>打ち合わせはオンライン・対面どちらですか？</h3>
                <p>オンライン打合せ（Zoom・Google Meetなど）を基本としています。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
