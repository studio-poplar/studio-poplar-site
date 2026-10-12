import Link from "next/link";
import Logo from "./Logo";
import styles from "./Footer.module.css";

const READ_LINKS = [
  { href: "/deshiiri/articles", en: "STORIES", ja: "すべての帖" },
  { href: "/deshiiri#index", en: "INDEX", ja: "仕事・町から探す" },
  { href: "/deshiiri/meikan", en: "CRAFTSPEOPLE", ja: "職人名鑑" },
  { href: "/deshiiri/about", en: "ABOUT", ja: "デシイリとは" },
];

const INFO_LINKS = [
  { href: "/deshiiri/contact", label: "職人に連絡する" },
  { href: "/deshiiri/for-shokunin", label: "取材を受けたい職人の方へ" },
  { href: "/deshiiri/sponsor", label: "協賛について" },
  { href: "/deshiiri/privacy", label: "個人情報の取り扱い" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="d-maku" />
      <div className={`d-wrap ${styles.grid}`}>
        <div>
          <Logo />
          <p className={styles.about}>職人と家業の読みもの。横浜・神奈川の仕事を訪ね、聞き書きしています。</p>
        </div>
        <div>
          <span className={`d-eyebrow ${styles.head}`}>MENU</span>
          <ul className={styles.list}>
            {READ_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>
                  <span className={styles.en}>{link.en}</span>
                  {link.ja}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className={`d-eyebrow ${styles.head}`}>CONTACT</span>
          <ul className={styles.list}>
            {INFO_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
            {/* The account does not exist yet; link it once @deshiiri is registered. */}
            <li className={styles.muted}>Instagram @deshiiri（準備中）</li>
            <li>
              <Link href="/">運営：Studio Poplar</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={`d-wrap ${styles.copy}`}>© DESHIIRI / STUDIO POPLAR — studiopoplar.com/deshiiri</div>
    </footer>
  );
}
