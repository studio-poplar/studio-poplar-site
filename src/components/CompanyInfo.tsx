import Link from "next/link";
import styles from "./CompanyInfo.module.css";

const ROWS: { label: string; body: React.ReactNode }[] = [
  { label: "屋号", body: "Studio Poplar（スタジオポプラ）" },
  { label: "代表者", body: "伊藤 大起（Ito Daiki）" },
  { label: "開業日", body: "2026年9月7日" },
  { label: "拠点", body: "神奈川県横浜市" },
  {
    label: "事業内容",
    body: (
      <ul className={styles.bullets}>
        <li>Webサイト設計・制作</li>
        <li>UI/UXデザイン</li>
        <li>写真・ビジュアル制作</li>
        <li>映像制作・ドローン撮影</li>
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
          または<Link href="/contact" className={styles.link}>お問い合わせフォーム</Link>より。内容を確認後、担当者より順次ご連絡いたします。
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
