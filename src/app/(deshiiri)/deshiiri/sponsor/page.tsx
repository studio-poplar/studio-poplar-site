import Link from "next/link";
import SectionHead from "@/components/deshiiri/SectionHead";
import { deshiiriMetadata } from "@/lib/deshiiri/seo";
import styles from "../doc.module.css";

export const metadata = deshiiriMetadata({
  title: "協賛について",
  description: "デシイリの記事への協賛についてのご案内です。協賛は記事の最後に表記し、記事の内容には関わりません。",
  path: "/deshiiri/sponsor",
});

export default function SponsorPage() {
  return (
    <div className={`d-wrap ${styles.page}`}>
      <SectionHead as="h1" eyebrow="Sponsor" title="協賛について" />
      <div className={styles.body}>
        <p>
          デシイリの取材と掲載は、職人の方からお金をいただかずに続けています。その費用の一部を、記事ごとの協賛で支えていただける方を探しています。
        </p>

        <h2>協賛の考え方</h2>
        <ul>
          <li>協賛は一つの記事ごとにお受けし、その記事の最後に「この記事の協賛」としてお名前を載せます。</li>
          <li>記事の題・内容・取材先は編集部が決めます。協賛によって記事の内容が変わることはありません。</li>
          <li>取材先の職人と、協賛いただく方とのあいだに取引の条件を付けることはありません。</li>
        </ul>

        <h2>お問い合わせ</h2>
        <p>
          協賛の内容と費用は、ご相談のうえでお伝えします。運営の Studio Poplar の
          <Link href="/contact">お問い合わせフォーム</Link>
          から、「デシイリの協賛について」とお書き添えのうえご連絡ください。
        </p>
      </div>
    </div>
  );
}
