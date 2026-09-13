import Link from "next/link";
import Hero from "@/components/Hero";
import SectionHead from "@/components/SectionHead";
import ServiceRow from "@/components/ServiceRow";
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
  { k: "FOCUS", v: "伝わるアウトプット" },
  { k: "APPROACH", v: "Web × App × Photo/Video" },
  { k: "STYLE", v: "対話から、かたちに" },
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
            <SectionHead index="01" label="SERVICE" title="できることは3つです" />
          </Reveal>
          <div>
            <ServiceRow
              num="01"
              tag="WEB"
              title="サイトをつくる"
              description="はじめての開業やお店の“顔”になるサイトを、話を聞きながらつくります。"
              visual="web"
            />
            <ServiceRow
              num="02"
              tag="APP"
              title="仕組みをつくる"
              description="予約や会員管理、診断など、日々の運用をラクにする仕組みをつくります。"
              visual="app"
              reverse
            />
            <ServiceRow
              num="03"
              tag="PHOTO & VIDEO"
              title="見せ方をつくる"
              description="写真や映像で、言葉だけでは伝わらない雰囲気を伝えます。"
              visual="photo-video"
            />
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="02" label="WORKS" title="制作実績" />
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
            <AboutBlock
              index="03 — ABOUT"
              quote="伝えたいことは、伝わるとは限らない。"
              body="新しい事業ほど、伝えたいことは多く、言葉にしづらい。Studio Poplarは、代表・伊藤の直接ヒアリングを通じて、“本当に伝えたかったこと”とのズレなく、サイトやアプリ、写真・映像に落とし込む。"
            />
          </Reveal>
          <Credentials items={ABOUT_CREDENTIALS} />
        </div>
      </section>

      <section className="section soft">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="04" label="BLOG" title="BLOG" />
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
