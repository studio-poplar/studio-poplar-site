import Link from "next/link";
import SectionHead from "@/components/deshiiri/SectionHead";
import { KOJO } from "@/lib/deshiiri/kojo";
import { deshiiriMetadata } from "@/lib/deshiiri/seo";
import styles from "../doc.module.css";

export const metadata = deshiiriMetadata({
  title: "デシイリとは",
  description: "デシイリは、横浜・神奈川の職人と家業を訪ねて、仕事の中身を聞き書きする読みものです。運営はStudio Poplar。",
  path: "/deshiiri/about",
});

export default function AboutPage() {
  return (
    <div className={`d-wrap ${styles.page}`}>
      <SectionHead as="h1" eyebrow="ABOUT" title="デシイリとは" />
      <div className={styles.body}>
        <p className={styles.kojoOne}>{KOJO.one}</p>
        {KOJO.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p className={styles.sign}>{KOJO.signature}</p>

        <h2>書き方の決まり</h2>
        <ul>
          <li>本人の言葉と、確かめた事実と数字で書きます。飾りの言葉で盛りません。</li>
          <li>どの帖にも「正直に、きついこと」の章を入れます。仕事の良いところだけを書きません。</li>
          <li>題は、その仕事のまだ知られていない一点から付けます。</li>
          <li>写真と名前は、ご本人が掲載に同意したものだけを載せます。</li>
        </ul>

        <h2>連絡のしくみ</h2>
        <p>
          記事を読んで気になった職人には、各帖の最後や
          <Link href="/deshiiri/meikan">職人名鑑</Link>
          から連絡できます。連絡はデシイリ編集部が受け取り、職人に取り次ぎます。職人に直接メールが届くことはありません。
        </p>

        <h2>運営</h2>
        <p>
          デシイリは、横浜のWEB・アプリ・写真の制作スタジオ <Link href="/">Studio Poplar</Link>{" "}
          が運営しています。取材・撮影・編集も Studio Poplar が行います。
        </p>

        <p className={styles.sub}>
          取材を受けたい方は<Link href="/deshiiri/for-shokunin">取材を受けたい職人の方へ</Link>、協賛については
          <Link href="/deshiiri/sponsor">協賛について</Link>をご覧ください。
        </p>
      </div>
    </div>
  );
}
