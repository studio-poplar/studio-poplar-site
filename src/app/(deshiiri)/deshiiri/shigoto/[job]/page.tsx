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

// Every job in the code table gets a page, so links never 404 while a job has no stories yet.
export function generateStaticParams() {
  return Object.keys(JOBS).map((job) => ({ job }));
}

function load(job: string) {
  const people = getAllShokunin().filter((p) => p.job === job);
  const articles = getAllArticles().filter((a) => a.job === job);
  const order = Object.keys(CITIES);
  const towns = [...new Set(people.map((p) => p.city))].sort((a, b) => order.indexOf(a) - order.indexOf(b)).map(cityLabel);
  return { people, articles, towns };
}

export async function generateMetadata({ params }: PageProps<"/deshiiri/shigoto/[job]">) {
  const { job } = await params;
  if (!(job in JOBS)) return { title: { absolute: "ページが見つかりません｜デシイリ" } };
  const label = jobLabel(job);
  const { towns, people } = load(job);
  const where = towns.length > 0 ? towns.join("・") : "横浜・神奈川";
  return deshiiriMetadata({
    title: towns.length > 0 ? `神奈川の${label}（${where}）` : `神奈川の${label}`,
    description: `${where}の${label}を訪ねて、仕事の中身を聞き書きした記事と職人の一覧です。気になった職人には、デシイリから連絡できます。`,
    path: `/deshiiri/shigoto/${job}`,
    // Pages with no real craftsperson yet (none, or only イメージ案) stay out of search results.
    noindex: !people.some((p) => !p.sample),
  });
}

export default async function ShigotoPage({ params }: PageProps<"/deshiiri/shigoto/[job]">) {
  const { job } = await params;
  if (!(job in JOBS)) notFound();
  const label = jobLabel(job);
  const { people, articles, towns } = load(job);

  return (
    <div className={`d-wrap ${styles.page}`}>
      {people.some((p) => !p.sample) && <JsonLd data={breadcrumbJsonLd(siteUrl, [{ name: `神奈川の${label}`, path: `/deshiiri/shigoto/${job}` }])} />}
      <SectionHead as="h1" eyebrow="BY CRAFT" title={`神奈川の${label}`} aside={<Link href="/deshiiri#index" className="d-arrow">INDEX</Link>} />
      <p className={styles.intro}>
        {towns.length > 0
          ? `${towns.join("、")}で${label}の仕事をする人を訪ねました。`
          : `${label}の取材は準備中です。`}
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
