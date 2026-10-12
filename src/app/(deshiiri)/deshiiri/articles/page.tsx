import SectionHead from "@/components/deshiiri/SectionHead";
import ArticleFilter from "@/components/deshiiri/ArticleFilter";
import { ArticleCard } from "@/components/deshiiri/Cards";
import { getAllArticles, getIndex } from "@/lib/deshiiri/content";
import { deshiiriMetadata } from "@/lib/deshiiri/seo";
import styles from "../list.module.css";

export const metadata = deshiiriMetadata({
  title: "すべての帖",
  description: "デシイリのすべての記事（帖）を新しい順に並べています。大工・畳・味噌などの仕事や、横浜・藤沢などの町で絞り込めます。",
  path: "/deshiiri/articles",
});

export default function ArticlesPage() {
  const articles = getAllArticles();
  const toOption = ({ code, label }: { code: string; label: string }) => ({ code, label });

  return (
    <div className={`d-wrap ${styles.page}`}>
      <SectionHead as="h1" eyebrow="STORIES" title="すべての帖" aside={<span className="d-eyebrow">{articles.length} STORIES</span>} />
      {articles.length > 0 ? (
        <ArticleFilter
          jobs={getIndex("job").filter((j) => j.articles > 0).map(toOption)}
          cities={getIndex("city").filter((c) => c.articles > 0).map(toOption)}
          items={articles.map((a) => ({ slug: a.slug, job: a.job, city: a.city, card: <ArticleCard article={a} /> }))}
        />
      ) : (
        <p className={styles.empty}>最初の帖は準備中です。</p>
      )}
    </div>
  );
}
