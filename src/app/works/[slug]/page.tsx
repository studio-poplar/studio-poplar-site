import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RegMarks from "@/components/RegMarks";
import CtaBand from "@/components/CtaBand";
import WorkTypeBadge from "@/components/WorkTypeBadge";
import { getWorkBySlug, works, WORK_CATEGORY_LABELS } from "@/data/works";
import styles from "./page.module.css";

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata(props: PageProps<"/works/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const work = getWorkBySlug(slug);

  if (!work) {
    return { title: "WORKS" };
  }

  return {
    title: work.title,
    description: work.summary,
    openGraph: {
      title: `${work.title}｜Studio Poplar`,
      description: work.summary,
    },
  };
}

export default async function WorkDetailPage(props: PageProps<"/works/[slug]">) {
  const { slug } = await props.params;
  const work = getWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  return (
    <>
      <section className={styles.hero}>
        <RegMarks />
        <div className="wrap">
          <Link href="/works" className={styles.back}>
            ← WORKS一覧へ戻る
          </Link>
          <div className={styles.badgeRow}>
            <span className={`mono ${styles.tag}`}>{WORK_CATEGORY_LABELS[work.category]}</span>
            <WorkTypeBadge type={work.type} />
          </div>
          <h1 className={styles.title}>{work.title}</h1>
          <div className={`${styles.metaRow} mono`}>
            <div>
              <span style={{ color: "var(--text-soft)", display: "block", marginBottom: 4 }}>CLIENT</span>
              {work.client}
            </div>
            <div>
              <span style={{ color: "var(--text-soft)", display: "block", marginBottom: 4 }}>YEAR</span>
              {work.year}
            </div>
          </div>
          <div className={styles.thumb} aria-hidden="true">
            <span className="mono">{work.thumbLabel}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className={styles.body}>
            <div>
              <div className={styles.overview}>
                <p>{work.overview}</p>
              </div>
              {work.sections.map((section) => (
                <div className={styles.storySection} key={section.heading}>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                </div>
              ))}
            </div>

            <aside className={styles.sidebar}>
              <div className={styles.sidebarCard}>
                <span className="mono">ROLE</span>
                <ul>
                  {work.role.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.sidebarCard}>
                <span className="mono">STACK</span>
                <ul>
                  {work.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <div className={styles.footNav}>
            <Link href="/works" className="btn-ghost">
              ← WORKS一覧へ戻る
            </Link>
            <Link href="/contact" className="btn-primary">
              類似のご相談をする →
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
