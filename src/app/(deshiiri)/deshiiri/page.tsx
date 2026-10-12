import Link from "next/link";
import Photo from "@/components/deshiiri/Photo";
import { SampleBadge } from "@/components/deshiiri/SampleNotice";
import SectionHead from "@/components/deshiiri/SectionHead";
import { ArticleCard, PersonGrid } from "@/components/deshiiri/Cards";
import {
  getAllArticles,
  getAllShokunin,
  getBanzuke,
  getFeaturedArticle,
  getIndex,
  getSeriesArticles,
} from "@/lib/deshiiri/content";
import { SERIES, SERIES_ABOUT, jobLabel, type SeriesCode } from "@/lib/deshiiri/codes";
import { dotDate } from "@/lib/deshiiri/format";
import { KOJO, PROMISE } from "@/lib/deshiiri/kojo";
import JsonLd from "@/components/JsonLd";
import { deshiiriMetadata } from "@/lib/deshiiri/seo";
import { siteUrl } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = {
  ...deshiiriMetadata({
    title: "職人と家業のWEBマガジン",
    description: `${PROMISE.title.join("")}${PROMISE.lead}`,
    path: "/deshiiri",
  }),
  title: { absolute: "デシイリ｜職人と家業のWEBマガジン" },
};

export default function DeshiiriHome() {
  const articles = getAllArticles();
  const featured = getFeaturedArticle();
  const latest = articles.filter((a) => a.slug !== featured?.slug).slice(0, 5);
  const [lead, ...rest] = latest;
  const banzuke = getBanzuke();
  const people = getAllShokunin();
  const jobIndex = getIndex("job");
  const cityIndex = getIndex("city");

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "デシイリ",
    alternateName: "デシイリ 職人と家業のWEBマガジン",
    url: `${siteUrl}/deshiiri`,
    description: PROMISE.lead,
    inLanguage: "ja",
    publisher: { "@type": "Organization", name: "Studio Poplar", url: siteUrl },
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      {/* 表紙: 何のサイトで何ができるか + 今月の特集 */}
      <section className={`d-wrap ${styles.cover}`}>
        <div className={styles.promise}>
          <p className={styles.label}>{PROMISE.label}</p>
          <h1 className={styles.title}>
            {PROMISE.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className={styles.lead}>{PROMISE.lead}</p>
          <ol className={styles.can}>
            {PROMISE.can.map((item) => (
              <li key={item.en}>
                <span className={styles.canEn}>{item.en}</span>
                <b>{item.title}</b>
                <span>{item.text}</span>
              </li>
            ))}
          </ol>
          <div className={styles.actions}>
            <Link href="/deshiiri/articles" className="d-btn">
              記事を読む
            </Link>
            <Link href="/deshiiri/contact" className="d-btn ghost">
              職人に連絡する
            </Link>
          </div>
        </div>

        {featured && (
          <Link href={`/deshiiri/articles/${featured.slug}`} className={styles.feature}>
            <div className={styles.featureVisual}>
              {/* 写真の左側に帯を敷き、縦書きで仕事と町を置く */}
              <div className={styles.band} aria-hidden="true">
                <span className={styles.bandLabel}>今月の特集</span>
                <span className={styles.bandJob}>{jobLabel(featured.job)}</span>
                <span className={styles.bandArea}>{featured.area}</span>
              </div>
              <Photo
                src={featured.hero}
                alt={featured.heroAlt || featured.title}
                ratio="4 / 5"
                sizes="(max-width: 880px) 80vw, 560px"
                className={styles.featurePhoto}
                priority
              />
            </div>
            <div className={styles.featureText}>
              <span className={styles.featureMeta}>
                {featured.sample && <SampleBadge />}
                今月の特集｜{jobLabel(featured.job)}｜{featured.area}
              </span>
              <h2 className={styles.featureTitle}>{featured.title}</h2>
              <span className={styles.readMore}>記事を読む</span>
            </div>
          </Link>
        )}
      </section>

      {/* 新着記事: 大きな1本 + 小さな列 */}
      {lead && (
        <section className={`d-wrap ${styles.sec}`}>
          <SectionHead eyebrow="Latest" title="新着記事" link={{ href: "/deshiiri/articles", label: "記事一覧を見る" }} />
          <div className={styles.latest}>
            <ArticleCard article={lead} variant="large" />
            {rest.length > 0 && (
              <div className={styles.latestList}>
                {rest.map((a) => (
                  <ArticleCard key={a.slug} article={a} variant="row" />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* よく読まれている記事（6本そろうまでは編集部のおすすめ） */}
      {banzuke.items.length > 0 && (
        <section className={`d-wrap ${styles.sec}`}>
          <SectionHead
            eyebrow={banzuke.isRanking ? "Ranking" : "Editors' picks"}
            title={banzuke.isRanking ? "よく読まれている記事" : "編集部のおすすめ"}
            aside={
              banzuke.isRanking && banzuke.month ? (
                <span className={styles.month}>{Number(banzuke.month.split("-")[1])}月によく読まれた記事</span>
              ) : undefined
            }
          />
          <ol className={styles.rank}>
            {banzuke.items.map((a, i) => (
              <li key={a.slug}>
                <Link href={`/deshiiri/articles/${a.slug}`}>
                  <span className={styles.rankNo}>{i + 1}</span>
                  <span className={styles.rankText}>
                    <span className={styles.rankMeta}>
                      {a.sample && <SampleBadge />}
                      {jobLabel(a.job)}｜{a.area}
                    </span>
                    <span className={styles.rankTitle}>{a.title}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 職人を探す */}
      {people.length > 0 && (
        <section className={`d-wrap ${styles.sec}`}>
          <SectionHead eyebrow="Craftspeople" title="職人を探す" link={{ href: "/deshiiri/meikan", label: `${people.length}人の職人を見る` }} />
          <PersonGrid people={people.slice(0, 4)} />
        </section>
      )}

      {/* 仕事・町から探す */}
      {jobIndex.length > 0 && (
        <section className={`d-wrap ${styles.sec}`} id="index">
          <SectionHead eyebrow="Index" title="仕事・町から探す" />
          <div className={styles.index}>
            {[
              { head: "仕事から", base: "/deshiiri/shigoto", list: jobIndex },
              { head: "町から", base: "/deshiiri/machi", list: cityIndex },
            ].map((group) => (
              <div key={group.head}>
                <h3 className={styles.indexHead}>{group.head}</h3>
                <ul className={styles.indexList}>
                  {group.list.map((item) => (
                    <li key={item.code}>
                      <Link href={`${group.base}/${item.code}`}>
                        <span>{item.label}</span>
                        <small>{item.articles}本</small>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 連載 */}
      <section className={`d-wrap ${styles.sec}`}>
        <SectionHead eyebrow="Series" title="連載" />
        <div className={styles.series}>
          {(Object.keys(SERIES) as SeriesCode[]).map((code) => {
            const newest = getSeriesArticles(code)[0];
            return (
              <Link key={code} href={`/deshiiri/rensai/${code}`} className={styles.seriesItem}>
                <h3 className={styles.seriesTitle}>{SERIES[code]}</h3>
                <p className={styles.seriesAbout}>{SERIES_ABOUT[code]}</p>
                <p className={styles.seriesLatest}>
                  {newest ? (
                    <>
                      <time>{dotDate(newest.publishedAt)}</time>
                      {newest.title}
                    </>
                  ) : (
                    "第1回は準備中です"
                  )}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 職人の方へ */}
      <section className={styles.band2}>
        <div className={`d-wrap ${styles.band2In}`}>
          <div>
            <span className={styles.band2En}>For craftspeople</span>
            <h2 className={styles.band2Title}>あなたの仕事を、取材させてください。</h2>
            <p>取材と掲載は無料です。記事を読んで興味を持った人からの相談や依頼は、編集部がまとめてお届けします。</p>
          </div>
          <Link href="/deshiiri/for-shokunin" className={`d-btn ${styles.band2Btn}`}>
            取材の相談をする
          </Link>
        </div>
      </section>

      {/* デシイリについて */}
      <section className={`d-wrap ${styles.sec}`}>
        <SectionHead eyebrow="About" title="デシイリについて" />
        <div className={styles.about}>
          <p className={styles.aboutOne}>{KOJO.one}</p>
          <div>
            {KOJO.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className={styles.aboutSign}>{KOJO.signature}</p>
            <Link href="/deshiiri/about" className={styles.aboutLink}>
              デシイリについて詳しく
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
