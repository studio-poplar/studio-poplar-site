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
    text: "お問い合わせ（営業日1〜2日以内にご返信）",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="5" width="18" height="14" rx="1.5" />
        <path d="M3.5 6l8.5 7 8.5-7" />
      </svg>
    ),
  },
  {
    text: "オンラインでヒアリング",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 5h16v10H9l-4 4V5z" />
      </svg>
    ),
  },
  {
    text: "サイト構成・写真プランなどの具体案とお見積り、ご契約",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M9 12h6M9 16h6" />
      </svg>
    ),
  },
  {
    text: "設計・制作・撮影",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
      </svg>
    ),
  },
  {
    text: "確認・修正（2回まで含む）",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 20h4L19 9l-4-4L4 16v4z" />
        <path d="M13 7l4 4" />
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

// What the WEB maintenance plan covers. Writing down what it doesn't cover
// (and what isn't taken on at all) is the point: it keeps the plan small
// enough for one person to honour.
const MAINTENANCE_SCOPE = [
  {
    tone: "mtIn",
    title: "月額に含まれるもの",
    note: "毎月、決まった手順で行います",
    items: [
      "セキュリティ更新（サイトを動かすソフトウェアの更新）",
      "月1回の動作確認",
      "軽微な修正 月1回（文字・画像の差し替えなど、30分以内）",
      "表示されないなどの不具合が起きたときの一次対応",
    ],
  },
  {
    tone: "mtQuote",
    title: "別途お見積りになるもの",
    note: "内容をお聞きし、金額に合意してから着手します",
    items: ["ページの追加", "デザインの変更", "機能の追加", "撮影・素材づくり"],
  },
  {
    tone: "mtOut",
    title: "お引き受けしていないこと",
    note: "少人数で、約束を確実に守るためです",
    items: ["24時間・休日の即時対応", "回数無制限の修正", "SNS・広告の運用代行", "他社が制作したサイトの保守"],
  },
] as const;

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
    a: "公開直後の動作確認までは制作費に含みます。それ以降は、任意加入の保守プラン（月額5,000円・税込5,500円）をご用意しています。セキュリティ更新・月1回の動作確認・軽微な修正（月1回）などが含まれ、ページ追加などプランに含まれない作業は都度お見積りします。アプリの保守は個別にお見積りします。",
  },
  {
    q: "写真・動画だけの依頼はできますか？",
    a: "可能です。WEB制作・アプリ制作と組み合わせる場合は、セット割引価格（半額）が適用されます。ドローン撮影も同様に半額となります。",
  },
  {
    q: "支払い条件について教えてください",
    a: "ご契約時に着手金として半額、納品時に残金をお支払いいただいております。",
  },
  {
    q: "契約後に、お客様都合でキャンセルする場合はどうなりますか？",
    a: "着手金のお支払い後にキャンセルされる場合、その時点までの作業内容に応じて、実費・工数分を差し引いたうえで残額を返金いたします。ドローン撮影のキャンセルについては、ドローン撮影ページの規定が優先されます。",
  },
  {
    q: "打ち合わせはオンライン・対面どちらですか？",
    a: "オンライン打合せ（Zoom・Google Meetなど）を基本としています。",
  },
  {
    q: "お問い合わせから、どのくらいで返信がありますか？",
    a: "営業日1〜2日以内にご連絡いたします。",
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
                "公開時の表示速度・SEOの基本チェック",
              ]}
              icon={AREA_ICONS.web}
              accent="var(--brand)"
              price={{ amount: "5", unit: "万円〜" }}
              revealDelay={50}
            />
            <ServiceCard
              num="APP"
              tag="APP"
              title="仕組みをつくる"
              description="予約・会員管理など、日々の運用を支える仕組みをつくります。"
              eyebrow="含まれること"
              items={["LINEログインなど、使い慣れた手段での認証", "管理画面から自分で更新できる設計", "公開直後の動作確認（以降の保守は個別にお見積り）"]}
              icon={AREA_ICONS.app}
              accent="var(--system)"
              price={{ amount: "15", unit: "万円〜" }}
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
              price={{ amount: "6", unit: "万円〜" }}
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

      <section id="maintenance" className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="03" label="MAINTENANCE" title="公開後の保守と費用" />
          </Reveal>

          <div className={styles.mtTop}>
            <div className={styles.mtPrice}>
              <span className={`en ${styles.mtTag}`}>WEB MAINTENANCE</span>
              <h3>保守プラン（任意）</h3>
              <p className={styles.mtAmount}>
                <span className="en">5,000</span>円<span className={styles.mtPer}>／月</span>
              </p>
              <p className={styles.mtTax}>税込 5,500円</p>
            </div>
            <div className={styles.mtLead}>
              <p>
                公開したサイトを、安全に動く状態に保つための月額プランです。加入は任意で、加入しない場合は必要なときに都度お見積りで対応します。
              </p>
              <dl className={styles.mtFacts}>
                <div>
                  <dt>対応の速さ</dt>
                  <dd>ご依頼から営業日1〜2日以内に着手</dd>
                </div>
                <div>
                  <dt>アプリの保守</dt>
                  <dd>規模と連携するサービスに応じて、個別にお見積り</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className={styles.mtScope}>
            {MAINTENANCE_SCOPE.map((col) => (
              <div key={col.title} className={`${styles.mtCol} ${styles[col.tone]}`}>
                <h4>{col.title}</h4>
                <p className={styles.mtColNote}>{col.note}</p>
                <ul>
                  {col.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.costs}>
            <h3>制作費・保守費とは別にかかる費用</h3>
            <p>次の費用は、別途実費をご負担いただきます。Studio Poplarが上乗せすることはありません。</p>
            <ul>
              <li>サーバー・ドメインの費用（1年目から。お客様の名義でご契約いただきます。取得の手続きは代行料1万円で承ります）</li>
              <li>決済サービスの手数料</li>
              <li>有料API・外部サービス（SaaS）の利用料</li>
            </ul>
            <p>Studio Poplarはサイバー保険に加入して運用しています。</p>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="04" label="FLOW" title="ご依頼の流れ" />
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

      <section className="section">
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
