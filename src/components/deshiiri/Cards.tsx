import Link from "next/link";
import type { ArticleMeta, Shokunin } from "@/lib/deshiiri/content";
import { cityLabel, jobLabel } from "@/lib/deshiiri/codes";
import Photo from "./Photo";
import styles from "./Cards.module.css";

// 帖のカード: 写真 4:3 → 英字の番号と町 → 明朝の題。枠線なし。
export function ArticleCard({ article, headingLevel = "h3" }: { article: ArticleMeta; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <Link href={`/deshiiri/articles/${article.slug}`} className={styles.card}>
      <Photo
        src={article.hero}
        alt={article.heroAlt || article.title}
        ratio="4 / 3"
        sizes="(max-width: 880px) 100vw, 380px"
        fuda={jobLabel(article.job)}
        className={styles.cardPhoto}
      />
      <span className={styles.meta}>
        <span>NO.{article.no}</span>
        <i>{article.area}</i>
      </span>
      <Heading className={styles.title}>{article.title}</Heading>
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

// 職人名鑑のカード: 縦長の写真、屋号、仕事／町、CONTACT →
export function PersonCard({ person }: { person: Shokunin }) {
  return (
    <div className={styles.person}>
      <Link href={`/deshiiri/meikan/${person.id}`} className={styles.personLink}>
        <Photo
          src={person.photo}
          alt={`${person.yago}の職人`}
          ratio="3 / 4"
          sizes="(max-width: 880px) 50vw, 280px"
          className={styles.cardPhoto}
        />
        <b className={styles.yago}>{person.yago}</b>
        <span className={styles.personMeta}>
          {jobLabel(person.job)}／{person.area || cityLabel(person.city)}
        </span>
      </Link>
      <Link href={`/deshiiri/contact?to=${person.id}`} className={`d-arrow ${styles.contact}`}>
        CONTACT
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
