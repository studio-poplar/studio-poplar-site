import Link from "next/link";
import ViewportHero from "@/components/ViewportHero";
import SectionHead from "@/components/SectionHead";
import PillarCard from "@/components/PillarCard";
import WorkCard from "@/components/WorkCard";
import CtaBand from "@/components/CtaBand";
import { works } from "@/data/works";
import styles from "./page.module.css";

export default function Home() {
  const previewWorks = works.slice(0, 3);

  return (
    <>
      <ViewportHero />

      <section className="section" id="service">
        <div className="wrap">
          <SectionHead
            index="01"
            label="SERVICE"
            title="3つの構造で、事業をかたちにする"
            description="どの領域も「使う人の動線」から逆算して設計します。見た目だけでなく、問い合わせや購買につながる構造を重視。"
          />
        </div>
        <div className="wrap">
          <div className={styles.pillars}>
            <PillarCard
              num="A"
              tag="WEB"
              title="WEB制作"
              description={`新規事業・個人開業の“顔”となるコーポレートサイト／LP。ブランドの言語化から設計します。`}
            />
            <PillarCard
              num="B"
              tag="3D WEB"
              title="3Dモデリング活用WEB制作"
              description="空間・プロダクトを3Dで見せるWebサイト。体験としての説得力で、他社と差をつけます。"
            />
            <PillarCard
              num="C"
              tag="APP"
              title="アプリ制作"
              description="会員・予約・診断など、事業の運用を支えるアプリを設計・開発します。"
            />
          </div>
          <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
            <Link href="/service" className="btn-ghost">
              SERVICEの詳細を見る →
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="works">
        <div className="wrap">
          <SectionHead index="02" label="WORKS" title="制作実績" description="3つの領域から代表的な事例をピックアップ。" />
          <div className={styles.worksGrid}>
            {previewWorks.map((work) => (
              <WorkCard key={work.slug} work={work} />
            ))}
          </div>
          <div className={styles.worksFootActions}>
            <Link href="/works" className="btn-ghost">
              WORKS一覧を見る →
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="wrap">
          <div className={styles.about}>
            <blockquote className={styles.quote}>
              &ldquo;ものごとの構造を見立てる力で、
              <br />
              事業の伝わり方を設計する。&rdquo;
            </blockquote>
            <div className={styles.aboutCopy}>
              <span className="mono" style={{ color: "var(--accent)", display: "block", marginBottom: 16 }}>
                03 — ABOUT
              </span>
              <p>
                Studio Poplarは、事業やお店の“らしさ”を装飾ではなく構造として捉え、見た目の前にまず骨格を理解することを大切にしています。
              </p>
              <p>個人・スモールビジネスの新規事業立ち上げに伴走し、Webとアプリという形で事業の輪郭を描きます。</p>
              <div className={styles.credentials}>
                <div>
                  <span className="mono">FOCUS</span>
                  <strong>新規事業・開業支援</strong>
                </div>
                <div>
                  <span className="mono">BASE</span>
                  <strong>横浜</strong>
                </div>
                <div>
                  <span className="mono">TEAM</span>
                  <strong>2〜5名体制</strong>
                </div>
              </div>
              <div style={{ marginTop: 32 }}>
                <Link href="/about" className="btn-ghost">
                  ABOUTを詳しく見る →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
