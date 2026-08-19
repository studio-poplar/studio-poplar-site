import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import CtaBand from "@/components/CtaBand";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "ABOUT",
  description:
    "Studio Poplarについて。事業やお店の“らしさ”を構造として捉え、新規事業・個人開業の立ち上げに伴走する制作スタジオの考え方と体制をご紹介します。",
};

const FLOW_STEPS = [
  { title: "ヒアリング", body: "事業の目的・ターゲット・強みを言語化します。" },
  { title: "構造設計", body: "情報設計とサイトマップ、動線を組み立てます。" },
  { title: "デザイン", body: "ビューポート思考でUIを具体化します。" },
  { title: "実装", body: "レスポンシブ・アクセシビリティに配慮し構築します。" },
  { title: "公開・運用", body: "公開後の改善や更新にも伴走します。" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        index="ABOUT"
        eyebrow="OUR STRUCTURE"
        title="事業の構造を、見立てる。"
        description="Studio Poplarは、装飾よりも先に構造を設計する制作スタジオです。新規事業・個人開業の立ち上げに伴走し、Webとアプリという形で事業の輪郭を描きます。"
      />

      <section className="section">
        <div className="wrap">
          <SectionHead index="01" label="PHILOSOPHY" title="装飾ではなく、構造として捉える" />
          <div className={styles.philosophy}>
            <blockquote className={styles.quote}>
              &ldquo;ものごとの構造を見立てる力で、
              <br />
              事業の伝わり方を設計する。&rdquo;
            </blockquote>
            <div className={styles.copy}>
              <p>
                事業やお店の魅力は、色やレイアウトといった装飾の前に、誰に・何を・どの順番で伝えるかという構造でほとんど決まります。Studio
                Poplarは、その構造をソフトウェアのビューポートを組み立てるように設計します。
              </p>
              <p>
                新規事業や個人開業では、事業の“顔”となるWebサイトやアプリが唯一の接点になることも少なくありません。骨格から仕上げまでを一貫して設計することで、立ち上げ期から信頼を積み上げられる状態を目指します。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead index="02" label="PROFILE" title="運営体制" />
          <div className={styles.credentials}>
            <div className={styles.credCard}>
              <span className="mono">FOCUS</span>
              <h3>新規事業・開業支援</h3>
              <p>新規事業や個人開業を検討する事業者を対象に、Web・アプリの設計から制作までを支援します。</p>
            </div>
            <div className={styles.credCard}>
              <span className="mono">BASE</span>
              <h3>横浜</h3>
              <p>横浜を拠点に活動。対応エリアは全国のWeb・アプリ制作案件を中心としています。</p>
            </div>
            <div className={styles.credCard}>
              <span className="mono">TEAM</span>
              <h3>2〜5名体制</h3>
              <p>少人数体制だからこそ、事業の背景まで理解した上での提案・実装を行います。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead index="03" label="FLOW" title="制作の流れ" description="ヒアリングから公開後の運用まで、一貫して伴走します。" />
          <div className={styles.flow}>
            {FLOW_STEPS.map((step, index) => (
              <div className={styles.flowStep} key={step.title}>
                <span className={styles.num}>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
