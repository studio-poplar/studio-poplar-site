import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import WorkThumb from "@/components/WorkThumb";
import WorkTypeBadge from "@/components/WorkTypeBadge";
import SitePreviewFrame from "@/components/SitePreviewFrame";
import { works, getWorkBySlug, WORK_CATEGORY_LABELS, WORK_CONTACT_CATEGORY } from "@/data/works";
import styles from "./page.module.css";

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) return {};
  return {
    title: work.title,
    description: work.summary,
  };
}

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) notFound();

  const index = works.findIndex((w) => w.slug === work.slug);
  const neighbors = [
    { dir: "PREVIOUS", work: works[(index - 1 + works.length) % works.length] },
    { dir: "NEXT", work: works[(index + 1) % works.length] },
  ];

  const desktopShots = work.images?.filter((image) => image.device === "desktop") ?? [];
  const mobileShots = work.images?.filter((image) => image.device === "mobile") ?? [];

  const consultHref = `/contact?${new URLSearchParams({
    category: WORK_CONTACT_CATEGORY[work.category],
    message: `【制作事例「${work.title}」を見て】\n\n【以下に詳細をご記入ください】\n`,
  }).toString()}`;

  return (
    <>
      <div className="wrap">
        <nav className={styles.crumbs} aria-label="パンくず">
          <Link href="/works">WORKS</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{work.title}</span>
        </nav>

        <header className={styles.head}>
          <div className={styles.tags}>
            <WorkTypeBadge type={work.type} />
            <span className={`en ${styles.pill}`}>{WORK_CATEGORY_LABELS[work.category]}</span>
          </div>
          <h1>{work.title}</h1>
          <p className={styles.client}>
            <span className="en">CLIENT</span>
            {work.client}
          </p>
        </header>

        <div className={styles.preview}>
          {work.url ? (
            <>
              <SitePreviewFrame url={work.url} label={work.title} />
              <div className={styles.site}>
                <span className="en">{work.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                <a href={work.url} target="_blank" rel="noreferrer noopener" className="en">
                  サイトを見る ↗
                </a>
              </div>
            </>
          ) : (
            <WorkThumb work={work} showBadge={false} />
          )}
        </div>

        <section className={styles.overview}>
          <h2 className="en">OVERVIEW</h2>
          <p>{work.overview}</p>
        </section>

        {(desktopShots.length > 0 || mobileShots.length > 0) && (
          <section className={styles.screens} aria-label="画面イメージ">
            <h2 className="en">SCREENS</h2>
            {desktopShots.length > 0 && (
              <div className={styles.shots}>
                {desktopShots.map((shot) => (
                  <figure key={shot.src} className={styles.shot}>
                    <Image src={shot.src} alt={shot.alt} width={1440} height={900} sizes="(min-width: 900px) 560px, 100vw" />
                    <figcaption>{shot.caption}</figcaption>
                  </figure>
                ))}
              </div>
            )}
            {mobileShots.length > 0 && (
              <div className={styles.phoneShots}>
                {mobileShots.map((shot) => (
                  <figure key={shot.src} className={styles.phoneShot}>
                    <div className={styles.phoneFrame}>
                      <Image src={shot.src} alt={shot.alt} width={780} height={1688} sizes="240px" />
                    </div>
                    <figcaption>{shot.caption}</figcaption>
                  </figure>
                ))}
              </div>
            )}
            {work.imageNote && <p className={styles.imageNote}>{work.imageNote}</p>}
          </section>
        )}

        <ol className={styles.steps}>
          {work.sections.map((section, i) => {
            const no = String(i + 1).padStart(2, "0");
            return (
              <li key={section.heading} data-last={i === work.sections.length - 1}>
                <span className={`en ${styles.ghostNo}`} aria-hidden="true">
                  {no}
                </span>
                <span className={`en ${styles.no}`}>{no}</span>
                <h3>{section.heading}</h3>
                <p>{section.body}</p>
              </li>
            );
          })}
        </ol>

        <aside className={styles.consult}>
          <span className={`en ${styles.consultLabel}`}>CONSULT</span>
          <h2>この事例のようなご相談は、こちらから。</h2>
          <p>お問い合わせ種別（{WORK_CATEGORY_LABELS[work.category]}）は、あらかじめ選択された状態で開きます。</p>
          <Link href={consultHref} className="btn-primary">
            この内容で相談する<span className="btn-arrow">→</span>
          </Link>
        </aside>

        <nav className={styles.neighbors} aria-label="ほかの制作事例">
          {neighbors.map(({ dir, work: other }) => (
            <Link key={dir} href={`/works/${other.slug}`} className={styles.neighbor}>
              <WorkThumb work={other} showBadge={false} />
              <div className={styles.neighborBody}>
                <span className={`en ${styles.dir}`}>{dir}</span>
                <h3>{other.title}</h3>
                <span className={`en ${styles.more}`}>VIEW CASE →</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
