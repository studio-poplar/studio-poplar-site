import Link from "next/link";
import Hero from "@/components/Hero";
import SectionHead from "@/components/SectionHead";
import ServiceCard from "@/components/ServiceCard";
import WorkCard from "@/components/WorkCard";
import BlogCard from "@/components/BlogCard";
import AboutBlock from "@/components/AboutBlock";
import Credentials from "@/components/Credentials";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { works } from "@/data/works";
import { blogPosts } from "@/data/blog";
import styles from "./page.module.css";

const ABOUT_CREDENTIALS = [
  { k: "FOCUS", v: "事業の骨格設計" },
  { k: "APPROACH", v: "Web × App × Brand" },
  { k: "STYLE", v: "構想から実装まで" },
];

export default function Home() {
  const previewWorks = works.slice(0, 3);
  const previewPosts = blogPosts.slice(0, 3);

  return (
    <>
      <Hero />

      <section className="section">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead
              index="01"
              label="SERVICE"
              title="3つの構造で、事業をかたちにする"
              description="どの領域も「使う人の動線」から逆算して設計します。見た目だけでなく、問い合わせや購買につながる構造を重視。"
            />
          </Reveal>
          <div className="grid-3">
            <ServiceCard num="A" tag="WEB" title="WEB制作" description="新規事業・個人開業の顔となるコーポレートサイト／LP。ブランドの言語化から設計します。" revealDelay={50} />
            <ServiceCard num="B" tag="3D WEB" title="3Dモデリング活用WEB制作" description="空間・プロダクトを3Dで見せるWebサイト。体験としての説得力で、他社と差をつけます。" revealDelay={140} />
            <ServiceCard num="C" tag="APP" title="アプリ制作" description="会員・予約・診断など、事業の運用を支えるアプリを設計・開発します。" revealDelay={230} />
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="02" label="WORKS" title="制作実績" description="3つの領域から代表的な事例をピックアップ。すべて構造設計力を示すための自主制作（MOCK WORK）です。" />
          </Reveal>
          <div className={`grid-3 ${styles.worksGrid}`}>
            {previewWorks.map((work, i) => (
              <WorkCard key={work.slug} work={work} revealDelay={i * 90} />
            ))}
          </div>
          <div className={styles.centerLink}>
            <Link href="/works" className="btn-ghost">
              WORKS一覧を見る →
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="wrap">
          <Reveal>
            <AboutBlock index="03 — ABOUT" quote="事業の骨格を見つけ、伝わる形にする。" body="Studio Poplarは、事業やお店の“らしさ”を表面的なデザインではなく、その根底にある構造から捉えます。何を届け、誰に選ばれ、どう続いていくのか。その骨格を整理し、Webとアプリを通じて伝わる形へと設計します。" />
          </Reveal>
          <Credentials items={ABOUT_CREDENTIALS} />
        </div>
      </section>

      <section className="section soft">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="04" label="BLOG" title="BLOG" description="制作の考え方や事例、Studio Poplarの視点をお届けします。" />
          </Reveal>
          <div className="grid-3">
            {previewPosts.map((post, i) => (
              <BlogCard key={post.slug} post={post} revealDelay={i * 90} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
