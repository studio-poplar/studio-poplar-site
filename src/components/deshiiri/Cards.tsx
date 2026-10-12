import Link from "next/link";
import type { ArticleMeta, Shokunin } from "@/lib/deshiiri/content";
import { cityLabel, jobLabel, seriesLabel } from "@/lib/deshiiri/codes";
import { dotDate } from "@/lib/deshiiri/format";
import Photo from "./Photo";
import styles from "./Cards.module.css";

type CardProps = {
  article: ArticleMeta;
  // large: lead story of a grid / row: small photo on the left (lists)
  variant?: "default" | "large" | "row";
  headingLevel?: "h2" | "h3";
};

// 記事のカード: 写真 → 仕事｜町 → 明朝の題 → 日付。枠線なし。
export function ArticleCard({ article, variant = "default", headingLevel = "h3" }: CardProps) {
  const Heading = headingLevel;
  const ratio = variant === "large" ? "3 / 2" : variant === "row" ? "1 / 1" : "4 / 3";
  const sizes = variant === "large" ? "(max-width: 880px) 100vw, 720px" : variant === "row" ? "120px" : "(max-width: 880px) 100vw, 380px";
  return (
    <Link href={`/deshiiri/articles/${article.slug}`} className={`${styles.card} ${styles[variant]}`}>
      <Photo src={article.hero} alt={article.heroAlt || article.title} ratio={ratio} sizes={sizes} className={styles.cardPhoto} />
      <span className={styles.body}>
        <span className={styles.meta}>
          {article.series && <b>【{seriesLabel(article.series)}】</b>}
          {jobLabel(article.job)}｜{article.area}
        </span>
        <Heading className={styles.title}>{article.title}</Heading>
        {variant === "large" && <span className={styles.lead}>{article.lead}</span>}
        <time className={styles.date} dateTime={article.publishedAt}>
          {dotDate(article.publishedAt)}
        </time>
      </span>
    </Link>
  );
}

export function ArticleGrid({ articles }: { articles: ArticleMeta[] }) {
  return (
    <div className={styles.grid}>
      {articles.map((a) => (
        <ArticleCard key={a.slug} article={a} />
      ))}
    </div>
  );
}

// 職人のカード: 縦長の写真、屋号、仕事／町、連絡する →
export function PersonCard({ person }: { person: Shokunin }) {
  return (
    <div className={styles.person}>
      <Link href={`/deshiiri/meikan/${person.id}`} className={styles.personLink}>
        <Photo src={person.photo} alt={`${person.yago}の職人`} ratio="3 / 4" sizes="(max-width: 880px) 50vw, 280px" className={styles.cardPhoto} />
        <span className={styles.personMeta}>
          {jobLabel(person.job)}｜{person.area || cityLabel(person.city)}
        </span>
        <b className={styles.yago}>{person.yago}</b>
      </Link>
      <Link href={`/deshiiri/contact?to=${person.id}`} className={styles.contact}>
        この職人に連絡する
      </Link>
    </div>
  );
}

export function PersonGrid({ people }: { people: Shokunin[] }) {
  return (
    <div className={styles.people}>
      {people.map((p) => (
        <PersonCard key={p.id} person={p} />
      ))}
    </div>
  );
}
