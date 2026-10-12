import Link from "next/link";
import Photo from "@/components/deshiiri/Photo";
import SectionHead from "@/components/deshiiri/SectionHead";
import { ArticleGrid, PersonGrid } from "@/components/deshiiri/Cards";
import {
  getAllArticles,
  getAllShokunin,
  getBanzuke,
  getCounts,
  getFeaturedArticle,
  getIndex,
  getSeriesArticles,
} from "@/lib/deshiiri/content";
import { BANZUKE_RANKS, JOBS, SERIES, jobLabel, type SeriesCode } from "@/lib/deshiiri/codes";
import { choLabel } from "@/lib/deshiiri/format";
import { KOJO } from "@/lib/deshiiri/kojo";
import { deshiiriMetadata } from "@/lib/deshiiri/seo";
import styles from "./page.module.css";

export const metadata = {
  ...deshiiriMetadata({
    title: "職人と家業の読みもの",
    description:
      "横浜・神奈川の大工、畳屋、味噌蔵、梨農家を訪ねて、仕事の中身を聞き書きしています。読んで気になった職人には、ここから連絡できます。",
    path: "/deshiiri",
  }),
  // The home page title is the name first: 「デシイリ｜職人と家業の読みもの」.
  title: { absolute: "デシイリ｜職人と家業の読みもの" },
};

const HIGHLIGHT_LABELS = ["其の一", "其の二", "其の三"];

export default function DeshiiriHome() {
  const counts = getCounts();
  const articles = getAllArticles();
  const featured = getFeaturedArticle();
  const latest = articles.filter((a) => a.slug !== featured?.slug).slice(0, 6);
  const banzuke = getBanzuke();
  const people = getAllShokunin();
  const jobIndex = getIndex("job");
  const cityIndex = getIndex("city");
  const tickerWords = Object.values(JOBS).join(" — ");
  const latestHref = articles[0] ? `/deshiiri/articles/${articles[0].slug}` : "/deshiiri/articles";

  return (
    <>
      {/* 1. ヒーロー */}
      <section className={`d-wrap ${styles.hero}`}>
        <div>
          <span className="d-eyebrow">
            YOKOHAMA / KANAGAWA <b>—</b> 職人と家業の読みもの
          </span>
          <h1 className={styles.title}>
            職人と家業の、
            <br />
            まだ知られていない話。
          </h1>
          <p className={styles.lead}>
            横浜・神奈川の大工、畳屋、味噌蔵、梨農家を訪ねて、仕事の中身を聞き書きしています。読んで気になった職人には、ここから連絡できます。
          </p>
          <div className={styles.actions}>
            <Link href={latestHref} className="d-btn">
              最新の帖を読む
            </Link>
            <Link href="/deshiiri/meikan" className="d-btn ghost">
              職人名鑑を見る
            </Link>
          </div>
        </div>
        <dl className={styles.stats} aria-label="これまでの掲載">
          <div>
            <dt>帖（記事）</dt>
            <dd>{counts.articles}</dd>
          </div>
          <div>
            <dt>職人・家業</dt>
            <dd>{counts.shokunin}</dd>
          </div>
          <div>
            <dt>仕事の種類</dt>
            <dd>{counts.jobs}</dd>
          </div>
        </dl>
      </section>

      {/* 2. ティッカー */}
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.run}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i}>
              CRAFT — <em>{tickerWords} — </em>STORIES —{" "}
            </span>
          ))}
        </div>
      </div>

      {/* 3. 01 今月の特集 */}
      {featured && (
        <section className={`d-wrap ${styles.sec}`}>
          <SectionHead num="01" eyebrow="FEATURE" title="今月の特集" />
          <Link href={`/deshiiri/articles/${featured.slug}`} className={styles.feature}>
            <Photo
              src={featured.hero}
              alt={featured.heroAlt || featured.title}
              ratio="3 / 2"
              sizes="(max-width: 880px) 100vw, 680px"
              fuda={jobLabel(featured.job)}
              fudaKaki
              className={styles.featurePhoto}
              priority
            />
            <div>
              <span className="d-eyebrow">
                {choLabel(featured.no)} <b>—</b> {featured.area}
              </span>
              <h3 className={styles.featureTitle}>{featured.title}</h3>
              <p className={styles.featureLead}>{featured.lead}</p>
              {featured.midokoro.length > 0 && (
                <ul className={styles.midokoro}>
                  {featured.midokoro.slice(0, 2).map((point, i) => (
                    <li key={point}>
                      <span>{HIGHLIGHT_LABELS[i]}</span>
                      {point}
                    </li>
                  ))}
                </ul>
              )}
              <span className="d-arrow">READ STORY</span>
            </div>
          </Link>
        </section>
      )}

      {/* 4. 02 新しい帖 */}
      {latest.length > 0 && (
        <section className={`d-wrap ${styles.sec}`}>
          <SectionHead num="02" eyebrow="NEW STORIES" title="新しい帖" link={{ href: "/deshiiri/articles", label: "VIEW ALL" }} />
          <ArticleGrid articles={latest} />
        </section>
      )}

      {/* 5. 03 読まれ番付（6本未満のうちは編集部のおすすめ） */}
      {banzuke.items.length > 0 && (
        <section className={`d-wrap ${styles.sec}`}>
          <SectionHead
            num="03"
            eyebrow={banzuke.isRanking ? "RANKING" : "EDITORS' PICKS"}
            title={banzuke.isRanking ? "読まれ番付" : "編集部のおすすめ"}
            aside={
              banzuke.isRanking && banzuke.month ? (
                <span className={`d-eyebrow ${styles.month}`}>{Number(banzuke.month.split("-")[1])}月の閲覧数</span>
              ) : undefined
            }
          />
          <ol className={styles.rank}>
            {banzuke.items.map((a, i) => (
              <li key={a.slug}>
                <Link href={`/deshiiri/articles/${a.slug}`}>
                  <span className={banzuke.isRanking ? styles.pos : styles.posNum}>
                    {banzuke.isRanking ? BANZUKE_RANKS[i] : String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.rankTitle}>
                    {a.title}
                    <small>
                      {jobLabel(a.job)}／{a.area}
                    </small>
                  </span>
                  {a.views !== null && <span className={styles.views}>{a.views.toLocaleString("en-US")} views</span>}
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 6. 04 仕事から、町から探す */}
      {jobIndex.length > 0 && (
        <section className={`d-wrap ${styles.sec}`} id="index">
          <SectionHead num="04" eyebrow="INDEX" title="仕事から、町から探す" />
          <div className={styles.index}>
            <div>
              <h3 className={styles.indexHead}>BY CRAFT</h3>
              <ul className={styles.pills}>
                {jobIndex.map((j) => (
                  <li key={j.code}>
                    <Link href={`/deshiiri/shigoto/${j.code}`}>
                      {j.label}
                      <small>{j.articles}</small>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={styles.indexHead}>BY TOWN</h3>
              <ul className={styles.pills}>
                {cityIndex.map((c) => (
                  <li key={c.code}>
                    <Link href={`/deshiiri/machi/${c.code}`}>
                      {c.label}
                      <small>{c.articles}</small>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className={styles.indexNote}>数字は帖の数です。</p>
        </section>
      )}

      {/* 7. 05 職人名鑑 */}
      {people.length > 0 && (
        <section className={`d-wrap ${styles.sec}`}>
          <SectionHead
            num="05"
            eyebrow="CRAFTSPEOPLE"
            title="職人名鑑"
            link={{ href: "/deshiiri/meikan", label: `VIEW ALL ${people.length}` }}
          />
          <PersonGrid people={people.slice(0, 4)} />
        </section>
      )}

      {/* 8. 06 連載 */}
      <section className={`d-wrap ${styles.sec}`}>
        <SectionHead num="06" eyebrow="SERIES" title="連載" />
        <div className={styles.series}>
          {(Object.keys(SERIES) as SeriesCode[]).map((code) => {
            const newest = getSeriesArticles(code)[0];
            return (
              <Link key={code} href={`/deshiiri/rensai/${code}`} className={styles.seriesCard}>
                <Photo
                  src={newest?.hero}
                  alt={newest?.heroAlt || SERIES[code]}
                  ratio="4 / 3"
                  sizes="(max-width: 880px) 100vw, 380px"
                  className={styles.seriesPhoto}
                />
                <span className="d-eyebrow">SERIES</span>
                <h3 className={styles.seriesTitle}>{SERIES[code]}</h3>
                <p className={styles.seriesLatest}>{newest ? newest.title : "第一回は準備中です。"}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 9. 職人向けの帯 */}
      <section className={styles.band}>
        <div className={`d-wrap ${styles.bandIn}`}>
          <div>
            <span className="d-eyebrow">FOR CRAFTSPEOPLE</span>
            <h2 className={styles.bandTitle}>
              あなたの仕事を、
              <br />
              取材させてください。
            </h2>
            <p>取材と掲載は無料です。記事を読んで興味を持った人からの連絡は、編集部がまとめてお届けします。</p>
          </div>
          <Link href="/deshiiri/for-shokunin" className="d-btn">
            取材の相談をする
          </Link>
        </div>
      </section>

      {/* 10. 口上 */}
      <section className={`d-wrap ${styles.kojo}`} id="kojo">
        <div>
          <span className="d-eyebrow">ABOUT</span>
          <h2 className={styles.kojoHead}>口上</h2>
        </div>
        <div>
          <p className={styles.kojoOne}>{KOJO.one}</p>
          {KOJO.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className={styles.kojoSign}>{KOJO.signature}</p>
          <Link href="/deshiiri/about" className="d-arrow">
            ABOUT DESHIIRI
          </Link>
        </div>
      </section>
    </>
  );
}
