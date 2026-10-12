import { notFound } from "next/navigation";
import SectionHead from "@/components/deshiiri/SectionHead";
import { ArticleGrid } from "@/components/deshiiri/Cards";
import { getSeriesArticles } from "@/lib/deshiiri/content";
import { SERIES, SERIES_ABOUT as ABOUT, seriesLabel } from "@/lib/deshiiri/codes";
import { deshiiriMetadata } from "@/lib/deshiiri/seo";
import styles from "../../list.module.css";

export function generateStaticParams() {
  return Object.keys(SERIES).map((series) => ({ series }));
}

export async function generateMetadata({ params }: PageProps<"/deshiiri/rensai/[series]">) {
  const { series } = await params;
  if (!(series in SERIES)) return { title: { absolute: "ページが見つかりません｜デシイリ" } };
  return deshiiriMetadata({
    title: `連載「${seriesLabel(series)}」`,
    description: `デシイリの連載「${seriesLabel(series)}」。${ABOUT[series] ?? ""}`,
    path: `/deshiiri/rensai/${series}`,
  });
}

export default async function RensaiPage({ params }: PageProps<"/deshiiri/rensai/[series]">) {
  const { series } = await params;
  if (!(series in SERIES)) notFound();
  const articles = getSeriesArticles(series);

  return (
    <div className={`d-wrap ${styles.page}`}>
      <SectionHead as="h1" eyebrow="Series" title={seriesLabel(series)} aside={<span className={styles.count}>{articles.length}本</span>} />
      <p className={styles.intro}>{ABOUT[series]}</p>
      {articles.length > 0 ? <ArticleGrid articles={articles} /> : <p className={styles.empty}>第1回は準備中です。</p>}
    </div>
  );
}
