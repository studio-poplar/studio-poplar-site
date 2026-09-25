import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageMasthead from "@/components/PageMasthead";
import SectionHead from "@/components/SectionHead";
import ServiceCard from "@/components/ServiceCard";
import { AREA_ICONS } from "@/components/serviceIcons";
import WebQuoteCalculator from "@/components/WebQuoteCalculator";
import AppQuoteCalculator from "@/components/AppQuoteCalculator";
import PhotoVideoQuoteCalculator from "@/components/PhotoVideoQuoteCalculator";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "サービス｜WEB制作・アプリ制作・写真動画撮影",
  description: "Studio Poplarのサービス。WEBサイト制作、アプリ制作、写真・動画撮影の3領域について、制作の流れ、料金の目安、よくあるご質問をご案内します。",
  path: "/service",
});

const FLOW_STEPS = [
  {
    text: "まずはオンラインにてお打ち合わせ",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 5h16v10H9l-4 4V5z" />
      </svg>
    ),
  },
  {
    text: "サイト構成・写真プランなど、具体案を提示",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M9 12h6M9 16h6" />
      </svg>
    ),
  },
  {
    text: "制作・撮影",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
      </svg>
    ),
  },
  {
    text: "公開・納品",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12l3 3 5-6" />
      </svg>
    ),
  },
];

// One source for the visible FAQ and its FAQPage structured data, so the two can't drift apart.
const FAQS = [
  {
    q: "ページ数や機能を追加したい場合は？",
    a: "基本プランを土台に、追加ページ・機能に応じて個別にお見積りします。まずは要件をお聞かせください。",
  },
  {
    q: "ご依頼から納品までの流れは？",
    a: "お問い合わせ→ヒアリング→お見積り・ご契約→設計・制作→確認・修正→公開、という流れが基本です。",
  },
  {
    q: "デザイン案の修正には対応してもらえますか？",
    a: "基本プランに、デザイン確認・修正2回までを含みます。3回目以降の大幅な修正は別途ご相談となります。",
  },
  {
    q: "公開後の運用サポート・保守費用はどのくらいですか？",
    a: "月額の固定契約は設けていません。更新・保守が必要になったタイミングで、その都度内容に応じてお見積りします。",
  },
  {
    q: "写真・動画だけの依頼はできますか？",
    a: "可能です。WEB制作・アプリ制作と組み合わせる場合は、セット割引価格（半額）が適用されます。",
  },
  {
    q: "支払い条件について教えてください",
    a: "ご契約時に着手金として半額、納品時に残金をお支払いいただいております。",
  },
  {
    q: "打ち合わせはオンライン・対面どちらですか？",
    a: "オンライン打合せ（Zoom・Google Meetなど）を基本としています。",
  },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function ServicePage() {
  return (
    <>
      <JsonLd data={FAQ_JSON_LD} />
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
              num="WEB"
              tag="WEB"
              title="サイトをつくる"
              description="話を聞きながら、事業の“顔”になるサイトを設計します。"
              eyebrow="含まれること"
              items={[
                "スマホでも見やすいレスポンシブ対応",
                "問い合わせ・予約フォームの実装",
                "公開後の表示速度・SEOの基本対応",
              ]}
              icon={AREA_ICONS.web}
              accent="var(--brand)"
              revealDelay={50}
            />
            <ServiceCard
              num="APP"
              tag="APP"
              title="仕組みをつくる"
              description="予約・会員管理など、日々の運用を支える仕組みをつくります。"
              eyebrow="含まれること"
              items={["LINEログインなど、使い慣れた手段での認証", "管理画面から自分で更新できる設計", "公開後の不具合対応・動作確認"]}
              icon={AREA_ICONS.app}
              accent="var(--system)"
              revealDelay={140}
            />
            <ServiceCard
              num="PHOTO & VIDEO"
              tag="PHOTO & VIDEO"
              title="見せ方をつくる"
              description="言葉だけでは伝わらない空気を、写真と映像で残します。"
              eyebrow="含まれること"
              items={["撮影プランのご相談・ロケハン", "用途に合わせたレタッチ・編集", "Web用・SNS用・印刷用データの納品"]}
              icon={AREA_ICONS.photo}
              accent="var(--second)"
              revealDelay={230}
            />
          </div>
        </div>
      </section>

      <section id="plan" className="section soft">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="02" label="PLAN" title="制作プラン" accent />
          </Reveal>

          <div className={styles.planGrid}>
            <div className={styles.planCol}>
              <div className={styles.planHeader}>
                <h3>WEB制作</h3>
                <p>これから事業を始める方、まず“顔”になるサイトが欲しい方に。下記の選択に応じて概算金額が自動で変わります。</p>
              </div>
              <WebQuoteCalculator />
            </div>
            <div className={styles.planCol}>
              <div className={styles.planHeader}>
                <h3>アプリ制作</h3>
                <p>予約や会員管理の仕組みが欲しい方に。下記の選択に応じて概算金額が自動で変わります。</p>
              </div>
              <AppQuoteCalculator />
            </div>
          </div>

          <div className={styles.photoVideoWrap}>
            <div className={styles.planHeader}>
              <h3>写真・動画撮影</h3>
              <p>言葉だけでは伝わらない雰囲気を残したい方に。下記の選択に応じて概算金額が自動で変わります。</p>
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
              <li key={step.text}>
                <span className={styles.flowGhost}>{String(i + 1).padStart(2, "0")}</span>
                <div className={styles.flowIcon}>{step.icon}</div>
                <span className={`en ${styles.flowNum}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.flowText}>{step.text}</span>
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
              {FAQS.map((faq) => (
                <div key={faq.q}>
                  <h3>
                    <span className={styles.faqMarkQ}>問</span>
                    {faq.q}
                  </h3>
                  <p>
                    <span className={styles.faqMarkA}>答</span>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
