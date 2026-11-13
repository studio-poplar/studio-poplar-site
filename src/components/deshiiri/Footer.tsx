import Link from "next/link";
import { saasPagesIndexed } from "@/lib/deshiiri/saas-public";
import Logo from "./Logo";
import styles from "./Footer.module.css";

const READ_LINKS = [
  { href: "/deshiiri/articles", label: "記事を読む" },
  { href: "/deshiiri/meikan", label: "職人を探す" },
  { href: "/deshiiri#index", label: "仕事・町から探す" },
  { href: "/deshiiri/about", label: "デシイリについて" },
];

const INFO_LINKS = [
  { href: "/deshiiri/contact", label: "お問い合わせ（職人・編集部）" },
  { href: "/deshiiri/for-shokunin", label: "取材を受けたい職人の方へ" },
  { href: "/deshiiri/sponsor", label: "協賛について" },
  { href: "/deshiiri/privacy", label: "個人情報の取り扱い" },
];

// 職種一覧（LINE で仕事の一日を送っている職人）は、正式に案内するまで出さない（DESHIIRI_SAAS_PUBLIC=1 で出る）。
const SHOKUSHU_LINK = { href: "/deshiiri/shokushu", label: "職種から職人を探す" };

export default function Footer() {
  const readLinks = saasPagesIndexed() ? [READ_LINKS[0], READ_LINKS[1], SHOKUSHU_LINK, ...READ_LINKS.slice(2)] : READ_LINKS;
  return (
    <footer className={styles.footer}>
      <div className="d-maku" />
      <div className={`d-wrap ${styles.grid}`}>
        <div>
          <Logo />
          <p className={styles.about}>
            横浜・神奈川の職人と家業を取材するWEBマガジン。記事を読んで、そのまま職人に相談・依頼できます。
          </p>
        </div>
        <div>
          <span className={styles.head}>読む・探す</span>
          <ul className={styles.list}>
            {readLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className={styles.head}>連絡・お問い合わせ</span>
          <ul className={styles.list}>
            {INFO_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
            <li>
              <a href="https://www.instagram.com/deshiiri.mag/" target="_blank" rel="noopener">
                Instagram @deshiiri.mag
              </a>
            </li>
            <li>
              <Link href="/">運営：Studio Poplar</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={`d-wrap ${styles.copy}`}>© DESHIIRI / STUDIO POPLAR</div>
    </footer>
  );
}
