import SectionHead from "@/components/deshiiri/SectionHead";
import { PersonGrid } from "@/components/deshiiri/Cards";
import { getAllShokunin } from "@/lib/deshiiri/content";
import Link from "next/link";
import { saasPagesIndexed } from "@/lib/deshiiri/saas-public";
import { deshiiriMetadata } from "@/lib/deshiiri/seo";
import styles from "../list.module.css";

export const metadata = deshiiriMetadata({
  title: "職人一覧",
  description: "デシイリで取材した、横浜・神奈川の職人と家業の一覧です。気になった職人には、話を聞きたい・仕事を頼みたいなどの用件で連絡できます。",
  path: "/deshiiri/meikan",
});

export default function MeikanPage() {
  const people = getAllShokunin();
  return (
    <div className={`d-wrap ${styles.page}`}>
      <SectionHead
        as="h1"
        eyebrow="Craftspeople"
        title="職人一覧"
        aside={<span className={styles.count}>{people.length}人</span>}
      />
      <p className={styles.intro}>
        これまでに取材した職人と家業です。連絡はデシイリ編集部が受け取り、職人におつなぎします。
      </p>
      {saasPagesIndexed() ? (
        <p className={styles.intro}>
          職人が LINE で送ってくる「仕事の一日」は、<Link href="/deshiiri/shokushu">職種から職人を探す</Link>で読めます。仕事場の見学も申し込めます。
        </p>
      ) : null}
      {people.length > 0 ? <PersonGrid people={people} /> : <p className={styles.empty}>準備中です。</p>}
    </div>
  );
}
