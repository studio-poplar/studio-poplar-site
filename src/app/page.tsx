import Link from "next/link";
import Hero from "@/components/Hero";
import SectionHead from "@/components/SectionHead";
import ServiceShowcase from "@/components/ServiceShowcase";
import WorkCard from "@/components/WorkCard";
import BlogCard from "@/components/BlogCard";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { works, getWorkBySlug } from "@/data/works";
import { blogPosts } from "@/data/blog";
import styles from "./page.module.css";

const PREVIEW_WORK_SLUGS = ["bokuheki", "shindan-app", "atelier-mokuha-photo"];

export default function Home() {
  const previewWorks = PREVIEW_WORK_SLUGS.map((slug) => getWorkBySlug(slug)).filter(
    (work): work is (typeof works)[number] => Boolean(work)
  );
  const previewPosts = blogPosts.slice(0, 3);

  return (
    <>
      <Hero />

      <section className={`section ${styles.firstSection}`}>
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="01" label="SERVICE" title="3つのかたちで、伝わる。" />
          </Reveal>
          <ServiceShowcase />
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

      <section className="section soft">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="03" label="BLOG" title="BLOG" />
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
