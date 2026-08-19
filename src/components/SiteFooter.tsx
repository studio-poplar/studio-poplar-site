import Link from "next/link";
import styles from "./SiteFooter.module.css";

const NAV_LINKS = [
  { href: "/about", label: "ABOUT" },
  { href: "/works", label: "WORKS" },
  { href: "/service", label: "SERVICE" },
  { href: "/blog", label: "BLOG" },
  { href: "/contact", label: "CONTACT" },
];

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.top}`}>
        <div>
          <div className={styles.logo}>
            STUDIO <span>POPLAR</span>
          </div>
          <p className={styles.tagline}>WEB / 3D MODEL WEB / APP DESIGN STUDIO — YOKOHAMA</p>
        </div>

        <nav aria-label="フッターナビゲーション" className={styles.footerNav}>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.sns}>
          <span className="mono">SOCIAL</span>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer noopener">
            Instagram
          </a>
          <a href="https://x.com/" target="_blank" rel="noreferrer noopener">
            X
          </a>
          <a href="mailto:info@studiopoplar.com">info@studiopoplar.com</a>
        </div>
      </div>

      <div className={`wrap ${styles.bottom}`}>
        <span className="mono">© {new Date().getFullYear()} STUDIO POPLAR</span>
        <span className="mono">YOKOHAMA, JAPAN</span>
      </div>
    </footer>
  );
}
