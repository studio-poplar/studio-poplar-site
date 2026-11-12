import Link from "next/link";
import SectionHead from "@/components/deshiiri/SectionHead";
import { tradeCounts } from "@/lib/deshiiri/public-queries";
import { saasPagesIndexed } from "@/lib/deshiiri/saas-public";
import { deshiiriMetadata } from "@/lib/deshiiri/seo";
import { TRADES, tradeLabel } from "@/lib/deshiiri/trades";
// 90日更新がない人を外すため、公開・取り下げがなくても1日1回は作り直す。
export const revalidate = 86400;

import styles from "../list.module.css";
import own from "./shokushu.module.css";

// S-1 職種一覧の入口。
export const metadata = deshiiriMetadata({
  title: "職種から職人を探す",
  description: "横浜・神奈川の大工・左官・瓦・畳・建具の職人が、LINE で送ってくる仕事の一日。職種ごとに読めます。",
  path: "/deshiiri/shokushu",
  noindex: !saasPagesIndexed(),
});

export default async function ShokushuIndex() {
  const counts = await tradeCounts();
  return (
    <div className={`d-wrap ${styles.page}`}>
      <SectionHead as="h1" eyebrow="BY TRADE" title="職種から職人を探す" />
      <p className={styles.intro}>職人が送ってくる「仕事の一日」を、職種ごとに並べています。</p>
      <ul className={own.trades}>
        {TRADES.map((t) => (
          <li key={t}>
            <Link href={`/deshiiri/shokushu/${t}`}>
              <span>{tradeLabel(t)}</span>
              <span className={styles.count}>{counts[t]} 人</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
