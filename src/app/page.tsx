import Link from "next/link";
import Hero from "@/components/Hero";
import SectionHead from "@/components/SectionHead";
import ServiceShowcase from "@/components/ServiceShowcase";
import WorkCard from "@/components/WorkCard";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { works, getWorkBySlug } from "@/data/works";
import styles from "./page.module.css";

const PREVIEW_WORK_SLUGS = ["bokuheki", "shindan-app", "atelier-mokuha-photo"];

export default function Home() {
  const previewWorks = PREVIEW_WORK_SLUGS.map((slug) => getWorkBySlug(slug)).filter(
    (work): work is (typeof works)[number] => Boolean(work)
  );

  return (
    <>
      <Hero />

      <section className={`section ${styles.firstSection}`}>
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="01" label="SERVICE" title="何から、かたちにする？" />
          </Reveal>
          <ServiceShowcase />
        </div>
      </section>

      <section className="section soft">
        <div className="wrap">
          <Reveal className="section-head">
            <SectionHead index="02" label="WORKS" title="制作実績" accent />
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

      <CtaBand />
    </>
  );
}
