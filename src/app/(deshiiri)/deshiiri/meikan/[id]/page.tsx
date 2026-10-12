import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import Photo from "@/components/deshiiri/Photo";
import SectionHead from "@/components/deshiiri/SectionHead";
import { ArticleGrid } from "@/components/deshiiri/Cards";
import ContactForm from "@/components/deshiiri/ContactForm";
import { getAllShokunin, getArticlesByShokunin, getContactPeople, getShokunin } from "@/lib/deshiiri/content";
import { jobLabel } from "@/lib/deshiiri/codes";
import { deshiiriMetadata } from "@/lib/deshiiri/seo";
import { siteUrl } from "@/lib/seo";
import styles from "./page.module.css";

export function generateStaticParams() {
  return getAllShokunin().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/deshiiri/meikan/[id]">) {
  const { id } = await params;
  const person = getShokunin(id);
  if (!person) return {};
  return deshiiriMetadata({
    title: `${person.yago}（${person.area}の${jobLabel(person.job)}）`,
    description: `${person.area}の${jobLabel(person.job)}、${person.yago}。${person.intro}`,
    path: `/deshiiri/meikan/${person.id}`,
    noindex: person.draft,
  });
}

export default async function ShokuninPage({ params }: PageProps<"/deshiiri/meikan/[id]">) {
  const { id } = await params;
  const person = getShokunin(id);
  if (!person) notFound();
  const articles = getArticlesByShokunin(person.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: person.yago,
    description: person.intro,
    address: { "@type": "PostalAddress", addressRegion: "神奈川県", addressLocality: person.area },
    url: `${siteUrl}/deshiiri/meikan/${person.id}`,
    ...(person.links.site ? { sameAs: [person.links.site] } : {}),
  };

  return (
    <>
      {!person.draft && <JsonLd data={jsonLd} />}
      <section className={`d-wrap ${styles.top}`}>
        <Photo src={person.photo} alt={`${person.yago}の職人`} ratio="3 / 4" sizes="(max-width: 880px) 100vw, 420px" priority />
        <div className={styles.info}>
          <span className="d-eyebrow">
            CRAFTSPERSON <b>—</b> {jobLabel(person.job)}
          </span>
          <h1 className={styles.yago}>{person.yago}</h1>
          <dl className={styles.facts}>
            <div>
              <dt>仕事</dt>
              <dd>
                <Link href={`/deshiiri/shigoto/${person.job}`}>{jobLabel(person.job)}</Link>
              </dd>
            </div>
            <div>
              <dt>町</dt>
              <dd>
                <Link href={`/deshiiri/machi/${person.city}`}>{person.area}</Link>
              </dd>
            </div>
            {person.since && (
              <div>
                <dt>創業</dt>
                <dd>{person.since}</dd>
              </div>
            )}
          </dl>
          <p className={styles.intro}>{person.intro}</p>
          {(person.links.site || person.links.instagram) && (
            <ul className={styles.links}>
              {person.links.site && (
                <li>
                  <a href={person.links.site} className="d-arrow" target="_blank" rel="noopener">
                    WEBSITE
                  </a>
                </li>
              )}
              {person.links.instagram && (
                <li>
                  <a href={person.links.instagram} className="d-arrow" target="_blank" rel="noopener">
                    INSTAGRAM
                  </a>
                </li>
              )}
            </ul>
          )}

          <div className={styles.contact} id="renraku">
            <span className="d-eyebrow">CONTACT</span>
            <h2>{person.yago}に連絡する</h2>
            <p className={styles.note}>連絡はデシイリ編集部が受け取り、{person.yago}におつなぎします。</p>
            <ContactForm people={getContactPeople().filter((p) => p.id === person.id)} initialTo={person.id} lockTo idPrefix="m" />
          </div>
        </div>
      </section>

      <section className={`d-wrap ${styles.stories}`}>
        <SectionHead eyebrow="STORIES" title={`${person.yago}の帖`} />
        {articles.length > 0 ? <ArticleGrid articles={articles} /> : <p className={styles.empty}>記事は準備中です。</p>}
      </section>
    </>
  );
}
