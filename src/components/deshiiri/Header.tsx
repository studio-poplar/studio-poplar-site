"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { href: "/deshiiri/articles", label: "記事を読む", short: "記事", hideOnPhone: false },
  { href: "/deshiiri/meikan", label: "職人を探す", hideOnPhone: true },
  { href: "/deshiiri#index", label: "仕事・町から探す", hideOnPhone: true },
  { href: "/deshiiri/about", label: "デシイリについて", hideOnPhone: true },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`d-wrap ${styles.bar}`}>
        <Logo />
        <nav className={styles.nav} aria-label="デシイリのメニュー">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={`${styles.link} ${link.hideOnPhone ? styles.hideOnPhone : ""}`}>
              {"short" in link ? (
                <>
                  <span className={styles.long}>{link.label}</span>
                  <span className={styles.short}>{link.short}</span>
                </>
              ) : (
                link.label
              )}
            </Link>
          ))}
          <Link href="/deshiiri/contact" className={`d-btn ${styles.cta}`}>
            職人に連絡する
          </Link>
        </nav>
      </div>
    </header>
  );
}
