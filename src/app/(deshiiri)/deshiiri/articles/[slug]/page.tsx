import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import JsonLd from "@/components/JsonLd";
import Photo from "@/components/deshiiri/Photo";
import SectionHead from "@/components/deshiiri/SectionHead";
import { ArticleGrid } from "@/components/deshiiri/Cards";
import { mdxComponents } from "@/components/deshiiri/MdxParts";
import ContactForm from "@/components/deshiiri/ContactForm";
import SampleNotice from "@/components/deshiiri/SampleNotice";
import { getAllArticles, getArticle, getContactPeople, getNextArticles, getShokunin } from "@/lib/deshiiri/content";
import { cityLabel, jobLabel, seriesLabel } from "@/lib/deshiiri/codes";
import { dotDate, jaDate, noLabel } from "@/lib/deshiiri/format";
import { breadcrumbJsonLd, deshiiriMetadata, DESHIIRI_NAME } from "@/lib/deshiiri/seo";
import { siteUrl } from "@/lib/seo";
import styles from "./page.module.css";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/deshiiri/articles/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return deshiiriMetadata({
    title: article.title,
    description: article.lead,
    path: `/deshiiri/articles/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt,
    noindex: article.draft || article.sample,
    image: `/deshiiri/og/${article.slug}`,
  });
}

const HIGHLIGHT_LABELS = ["見どころ 1", "見どころ 2", "見どころ 3"];

export default async function ArticlePage({ params }: PageProps<"/deshiiri/articles/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const person = getShokunin(article.shokunin);
  if (!person) notFound();
  const next = getNextArticles(article);
  const contactPeople = getContactPeople().filter((p) => p.id === person.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.lead,
    datePublished: article.publishedAt,
    inLanguage: "ja",
    mainEntityOfPage: `${siteUrl}/deshiiri/articles/${article.slug}`,
    about: { "@type": "LocalBusiness", name: person.yago, address: person.area },
    author: { "@type": "Organization", name: `${DESHIIRI_NAME}編集部` },
    publisher: { "@type": "Organization", name: "Studio Poplar", url: siteUrl },
  };

  return (
    <article>
      {!article.draft && !article.sample && (
        <>
          <JsonLd data={jsonLd} />
          <JsonLd
            data={breadcrumbJsonLd(siteUrl, [
              { name: jobLabel(article.job), path: `/deshiiri/shigoto/${article.job}` },
              { name: article.title, path: `/deshiiri/articles/${article.slug}` },
            ])}
          />
        </>
      )}
      {article.draft && <p className={styles.draft}>DRAFT — この記事は下書きです。本番には表示されません。</p>}

      <header className={styles.top}>
        <nav className={styles.crumb} aria-label="パンくず">
          <Link href="/deshiiri">デシイリ</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/deshiiri/shigoto/${article.job}`}>{jobLabel(article.job)}</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/deshiiri/machi/${article.city}`}>{cityLabel(article.city)}</Link>
        </nav>
        <p className={styles.kicker}>
          {article.series ? `【${seriesLabel(article.series)}】` : ""}
          {jobLabel(article.job)}｜{article.area}
          <span>{noLabel(article.no)}</span>
        </p>
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.meta}>
          <span>
            {person.yago}（{person.area}）
          </span>
          <span>公開 {dotDate(article.publishedAt)}</span>
          {article.interviewedAt && <span>取材 {jaDate(article.interviewedAt)}</span>}
          <span>読むのにかかる時間 約{article.readingMinutes}分</span>
        </div>
        {article.sample && (
          <div className={styles.sample}>
            <SampleNotice kind="article" />
          </div>
        )}
      </header>

      <figure className={styles.hero}>
        <Photo
          src={article.hero}
          alt={article.heroAlt || article.title}
          ratio="16 / 9"
          sizes="(max-width: 1264px) 100vw, 1200px"
          className={styles.heroPhoto}
          priority
        />
        {article.heroCaption && <figcaption className={styles.cap}>{article.heroCaption}</figcaption>}
      </figure>

      {article.midokoro.length > 0 && (
        <section className={styles.points} aria-label="見どころ">
          <h2 className={styles.pointsHead}>この記事の見どころ</h2>
          <ol>
            {article.midokoro.slice(0, 3).map((point, i) => (
              <li key={point}>
                <span className={styles.pointLabel}>{HIGHLIGHT_LABELS[i]}</span>
                {point}
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className={styles.body}>
        <MDXRemote source={article.body} components={mdxComponents} options={{ blockJS: false }} />
      </div>

      <section className={styles.end} id="renraku" aria-label={`${person.yago}への連絡`}>
        <div className={styles.endIn}>
          <div className={styles.prof}>
            <Photo src={person.photo} alt={`${person.yago}の職人`} ratio="1 / 1" sizes="280px" />
            <span className={styles.smallHead}>この記事の職人</span>
            <Link href={`/deshiiri/meikan/${person.id}`} className={styles.profName}>
              {person.yago}
            </Link>
            <p>
              {person.area}／{jobLabel(person.job)}
              {person.since ? `／${person.since}` : ""}。{person.intro}
            </p>
          </div>
          <div className={styles.contact}>
            <span className={styles.smallHead}>この職人に連絡する</span>
            <h2>{person.yago}に連絡する</h2>
            {!person.sample && (
              <p>
                話を聞いてみたい、仕事を頼みたい、作業場を見てみたい。どんな用件でも大丈夫です。デシイリ編集部が受け取り、{person.yago}
                におつなぎします。
              </p>
            )}
            {person.sample ? (
              <SampleNotice kind="shokunin" />
            ) : (
              <ContactForm people={contactPeople} initialTo={person.id} from={article.slug} lockTo idPrefix="a" />
            )}
            <div className={styles.sponsor}>
              {article.sponsor ? <span>この記事の協賛：{article.sponsor}</span> : <Link href="/deshiiri/sponsor">この記事の協賛について</Link>}
              <span>取材・撮影：Studio Poplar</span>
            </div>
          </div>
        </div>
      </section>

      {next.length > 0 && (
        <section className={`d-wrap ${styles.next}`}>
          <SectionHead eyebrow="Next" title="次に読む" link={{ href: "/deshiiri/articles", label: "記事一覧を見る" }} />
          <ArticleGrid articles={next} />
        </section>
      )}
    </article>
  );
}
