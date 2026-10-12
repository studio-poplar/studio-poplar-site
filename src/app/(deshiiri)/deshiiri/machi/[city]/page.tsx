import Link from "next/link";
import { notFound } from "next/navigation";
import SectionHead from "@/components/deshiiri/SectionHead";
import { ArticleGrid, PersonGrid } from "@/components/deshiiri/Cards";
import { getAllArticles, getAllShokunin } from "@/lib/deshiiri/content";
import { CITIES, JOBS, cityLabel, jobLabel } from "@/lib/deshiiri/codes";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, deshiiriMetadata } from "@/lib/deshiiri/seo";
import { siteUrl } from "@/lib/seo";
import styles from "../../list.module.css";

export function generateStaticParams() {
  return Object.keys(CITIES).map((city) => ({ city }));
}

function load(city: string) {
  const people = getAllShokunin().filter((p) => p.city === city);
  const articles = getAllArticles().filter((a) => a.city === city);
  const order = Object.keys(JOBS);
  const jobs = [...new Set(people.map((p) => p.job))].sort((a, b) => order.indexOf(a) - order.indexOf(b)).map(jobLabel);
  return { people, articles, jobs };
}

export async function generateMetadata({ params }: PageProps<"/deshiiri/machi/[city]">) {
  const { city } = await params;
  if (!(city in CITIES)) return { title: { absolute: "ページが見つかりません｜デシイリ" } };
  const label = cityLabel(city);
  const { jobs, people } = load(city);
  const what = jobs.length > 0 ? jobs.join("、") : "職人と家業";
  return deshiiriMetadata({
    title: jobs.length > 0 ? `${label}の職人と家業（${what}）` : `${label}の職人と家業`,
    // Pages with no real craftsperson yet (none, or only イメージ案) stay out of search results.
    noindex: !people.some((p) => !p.sample),
    description: `${label}の${what}を訪ねて、仕事の中身を聞き書きした記事と職人の一覧です。気になった職人には、デシイリから連絡できます。`,
    path: `/deshiiri/machi/${city}`,
  });
}

export default async function MachiPage({ params }: PageProps<"/deshiiri/machi/[city]">) {
  const { city } = await params;
  if (!(city in CITIES)) notFound();
  const label = cityLabel(city);
  const { people, articles, jobs } = load(city);

  return (
    <div className={`d-wrap ${styles.page}`}>
      {people.some((p) => !p.sample) && <JsonLd data={breadcrumbJsonLd(siteUrl, [{ name: `${label}の職人と家業`, path: `/deshiiri/machi/${city}` }])} />}
      <SectionHead as="h1" eyebrow="BY TOWN" title={`${label}の職人と家業`} aside={<Link href="/deshiiri#index" className="d-arrow">INDEX</Link>} />
      <p className={styles.intro}>
        {jobs.length > 0 ? `${label}の${jobs.join("、")}を訪ねました。` : `${label}の取材は準備中です。`}
        記事 {articles.length}本・職人 {people.length}人。
      </p>
      {articles.length > 0 && (
        <section>
          <SectionHead eyebrow="Articles" title={`${label}の記事`} />
          <ArticleGrid articles={articles} />
        </section>
      )}
      {people.length > 0 && (
        <section className={styles.block}>
          <SectionHead eyebrow="Craftspeople" title={`${label}の職人`} />
          <PersonGrid people={people} />
        </section>
      )}
    </div>
  );
}
