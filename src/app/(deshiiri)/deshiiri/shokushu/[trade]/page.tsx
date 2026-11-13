import Link from "next/link";
import { notFound } from "next/navigation";
import SectionHead from "@/components/deshiiri/SectionHead";
import { listByTrade } from "@/lib/deshiiri/public-queries";
import { saasPagesIndexed } from "@/lib/deshiiri/saas-public";
import { deshiiriMetadata } from "@/lib/deshiiri/seo";
import { TRADES, tradeLabel, type Trade } from "@/lib/deshiiri/trades";
// 公開・取り下げ・受付の休止がすぐ反映されるよう、ページは毎回その場で組み立てる（作り置きのページは、
// 作り直しの合図のあとも古いものを1回出してしまうため）。DB の結果は lib/deshiiri/public-queries.ts で
// タグ付きでキャッシュし、公開・取り下げのときに即時に捨てる（{ expire: 0 }）ので、毎回 DB を読むわけではない。
export const dynamic = "force-dynamic";

import styles from "../../list.module.css";
import own from "../shokushu.module.css";

// S-1 職種一覧。編集部が選んだ人 → 最近の仕事の一日がある順。90日更新がない人は出さない。
const FEW = 3;

const isTrade = (t: string): t is Trade => (TRADES as readonly string[]).includes(t);

export async function generateMetadata({ params }: PageProps<"/deshiiri/shokushu/[trade]">) {
  const { trade } = await params;
  if (!isTrade(trade)) return { title: { absolute: "ページが見つかりません｜デシイリ" } };
  const label = tradeLabel(trade);
  return deshiiriMetadata({
    title: `神奈川の${label}の職人`,
    description: `横浜・神奈川の${label}の職人が送ってくる仕事の一日。気になった人の仕事場は見学できます。`,
    path: `/deshiiri/shokushu/${trade}`,
    noindex: !saasPagesIndexed(),
  });
}

export default async function TradePage({ params }: PageProps<"/deshiiri/shokushu/[trade]">) {
  const { trade } = await params;
  if (!isTrade(trade)) notFound();
  const label = tradeLabel(trade);
  const people = await listByTrade(trade);

  return (
    <div className={`d-wrap ${styles.page}`}>
      <SectionHead
        as="h1"
        eyebrow="BY TRADE"
        title={`神奈川の${label}の職人`}
        aside={
          <Link href="/deshiiri/shokushu" className="d-arrow">
            職種一覧
          </Link>
        }
      />
      {people.length ? (
        <div className={own.cards}>
          {people.map((p) => {
            const photo = p.latestWork?.photos[0];
            return (
              <Link key={p.slug} href={`/deshiiri/p/${p.slug}`} className={own.card}>
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- R2 の写真を /deshiiri/img から縮小済みで配る
                  <img src={`/deshiiri/img/${photo.key}`} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
                ) : null}
                <h2>{p.displayName}</h2>
                <p className={own.meta}>
                  {p.area}
                  {p.shopName ? `・${p.shopName}` : ""}
                </p>
                {p.latestWork ? <p className={own.latest}>{p.latestWork.title}</p> : null}
              </Link>
            );
          })}
        </div>
      ) : null}
      {people.length < FEW ? <p className={own.notice}>この職種の職人を取材中です。</p> : null}
    </div>
  );
}
