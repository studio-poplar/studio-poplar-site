import Link from "next/link";
import { notFound } from "next/navigation";
import SectionHead from "@/components/deshiiri/SectionHead";
import { getPublicPerson } from "@/lib/deshiiri/public-queries";
import { saasPagesIndexed } from "@/lib/deshiiri/saas-public";
import { deshiiriMetadata } from "@/lib/deshiiri/seo";
import { tradeLabel } from "@/lib/deshiiri/trades";
import styles from "./page.module.css";

// S-2 職人ページ。最初に開かれたときに作って保存し、公開・取り下げのときに作り直す（lib/deshiiri/publish.ts）。
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "long", day: "numeric" });

export async function generateMetadata({ params }: PageProps<"/deshiiri/p/[slug]">) {
  const { slug } = await params;
  const data = await getPublicPerson(slug);
  if (!data) return { title: { absolute: "ページが見つかりません｜デシイリ" } };
  const { person, works } = data;
  const label = tradeLabel(person.trade);
  return deshiiriMetadata({
    title: `${person.displayName}（${person.area}の${label}）`,
    description: `${person.area}の${label}、${person.displayName}${person.shopName ? `（${person.shopName}）` : ""}の仕事の一日。${works[0]?.title ?? ""}`,
    path: `/deshiiri/p/${person.slug}`,
    noindex: !saasPagesIndexed(),
  });
}

export default async function PersonPage({ params }: PageProps<"/deshiiri/p/[slug]">) {
  const { slug } = await params;
  const data = await getPublicPerson(slug);
  if (!data) notFound();
  const { person, works } = data;
  const label = tradeLabel(person.trade);
  const card = person.card;

  return (
    <div className={`d-wrap ${styles.page}`}>
      <header className={styles.head}>
        <span className="d-eyebrow">
          CRAFTSPERSON <b>—</b> {label}
        </span>
        <h1 className={styles.name}>{person.displayName}</h1>
        {person.shopName ? <p className={styles.shop}>{person.shopName}</p> : null}
        <dl className={styles.facts}>
          <div>
            <dt>仕事</dt>
            <dd>
              <Link href={`/deshiiri/shokushu/${person.trade}`}>{label}</Link>
            </dd>
          </div>
          <div>
            <dt>町</dt>
            <dd>{person.area}</dd>
          </div>
          {card.hours ? (
            <div>
              <dt>営業</dt>
              <dd>{card.hours}</dd>
            </div>
          ) : null}
          {card.phone ? (
            <div>
              <dt>電話</dt>
              <dd>
                <a href={`tel:${card.phone.replace(/[^\d+]/g, "")}`}>{card.phone}</a>
              </dd>
            </div>
          ) : null}
        </dl>
        {person.intro ? <p className={styles.intro}>{person.intro}</p> : null}
        {card.website || card.instagram ? (
          <ul className={styles.links}>
            {card.website ? (
              <li>
                <a href={card.website} className="d-arrow" target="_blank" rel="noopener">
                  WEBSITE
                </a>
              </li>
            ) : null}
            {card.instagram ? (
              <li>
                <a href={`https://www.instagram.com/${card.instagram.replace(/^@/, "")}/`} className="d-arrow" target="_blank" rel="noopener">
                  INSTAGRAM
                </a>
              </li>
            ) : null}
          </ul>
        ) : null}

        <div className={styles.visit} id="kengaku">
          <span className="d-eyebrow">VISIT</span>
          <h2>仕事場を見学する</h2>
          {person.visitOpen ? (
            <p className={styles.note}>見学の申し込みは、まもなくこのページから受け付けます。</p>
          ) : (
            <p className={styles.note}>ただいま受付を休んでいます。</p>
          )}
        </div>
      </header>

      <section className={styles.days}>
        <SectionHead eyebrow="A Day at Work" title="仕事の一日" />
        {works.map((w, i) => (
          <article key={w.id} className={styles.day}>
            <time className={styles.date} dateTime={w.publishedAt}>
              {fmtDate(w.publishedAt)}
            </time>
            <h3 className={styles.title}>{w.title}</h3>
            {w.photos.length ? (
              <div className={styles.photos} data-count={w.photos.length}>
                {w.photos.map((p, j) => (
                  // eslint-disable-next-line @next/next/no-img-element -- R2 の写真を /deshiiri/img から縮小済みで配る
                  <img
                    key={p.key}
                    src={`/deshiiri/img/${p.key}`}
                    alt={p.alt}
                    width={p.width}
                    height={p.height}
                    loading={i === 0 && j === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 && j === 0 ? "high" : undefined}
                    decoding="async"
                  />
                ))}
              </div>
            ) : null}
            <p className={styles.body}>{w.body}</p>
          </article>
        ))}
      </section>

      <p className={styles.made}>
        このページは <Link href="/deshiiri">デシイリ</Link> で作成しています。
      </p>
    </div>
  );
}
