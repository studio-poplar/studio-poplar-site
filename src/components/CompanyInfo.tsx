import Link from "next/link";
import styles from "./CompanyInfo.module.css";

const ROWS: { label: string; body: React.ReactNode }[] = [
  { label: "屋号", body: "Studio Poplar（スタジオポプラ）" },
  { label: "代表者", body: "伊藤 大起（Ito Daiki）" },
  { label: "事業形態", body: "個人事業" },
  { label: "開業日", body: "2026年9月7日" },
  { label: "所在地", body: "東京都府中市新町3-30-13" },
  {
    label: "事業内容",
    body: (
      <ul className={styles.bullets}>
        <li>WEBデザイン・サイト制作</li>
        <li>アプリのデザイン・制作</li>
        <li>写真撮影</li>
        <li>動画制作・撮影（ドローン撮影を含む）</li>
      </ul>
    ),
  },
  {
    label: "お問い合わせ",
    body: (
      <>
        <a href="mailto:info@studiopoplar.com" className={styles.link}>
          info@studiopoplar.com
        </a>
        <span className={styles.sub}>
          または<Link href="/contact" className={styles.link}>お問い合わせフォーム</Link>より。24時間以内を目安に折り返しご連絡します。
        </span>
      </>
    ),
  },
];

export default function CompanyInfo() {
  return (
    <dl className={styles.list}>
      {ROWS.map((row) => (
        <div key={row.label} className={styles.row}>
          <dt>{row.label}</dt>
          <dd>{row.body}</dd>
        </div>
      ))}
    </dl>
  );
}
