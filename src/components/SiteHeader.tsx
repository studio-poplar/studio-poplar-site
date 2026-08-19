"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/gtag";
import styles from "./SiteHeader.module.css";

const NAV_LINKS = [
  { href: "/about", label: "ABOUT" },
  { href: "/works", label: "WORKS" },
  { href: "/service", label: "SERVICE" },
  { href: "/blog", label: "BLOG" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.bar}`}>
        <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
          STUDIO <span>POPLAR</span>
        </Link>

        <nav className={styles.nav} aria-label="メインナビゲーション">
          <ul>
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link href={link.href} aria-current={active ? "page" : undefined} className={active ? styles.active : undefined}>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link
          href="/contact"
          className={styles.contactCta}
          onClick={() => trackEvent("contact_click", { location: "header" })}
        >
          お問い合わせ
        </Link>

        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="mono">{open ? "CLOSE" : "MENU"}</span>
        </button>
      </div>

      <div id="mobile-nav" className={styles.mobileNav} data-open={open} inert={!open}>
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/contact"
              onClick={() => {
                setOpen(false);
                trackEvent("contact_click", { location: "header_mobile" });
              }}
            >
              CONTACT
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
