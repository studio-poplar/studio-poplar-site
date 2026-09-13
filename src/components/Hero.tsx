"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/gtag";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`wrap ${styles.inner}`}>
        <span className={`eyebrow en ${styles.eyebrow}`}>WEB / APP / PHOTO &amp; VIDEO DESIGN</span>
        <h1 className={styles.title}>STUDIO POPLAR.</h1>
        <p className={styles.subtitle}>伝えたいことを、伝わる形に。</p>
        <p className={styles.lead}>
          事業を始めるとき、頭の中にあることをそのまま人に伝えるのは難しい。まずはお話をうかがい、直接確かめながら、サイトや写真、アプリのかたちにしていく。
        </p>
        <div className={styles.ctas}>
          <Link href="/contact" className="btn-primary" onClick={() => trackEvent("hero_cta_click")}>
            まずは相談する →
          </Link>
          <Link href="/works" className="btn-ghost">
            実績を見る
          </Link>
        </div>
      </div>
      <div className={styles.scrollcue}>
        <span>SCROLL</span>
        <span className={styles.line} />
      </div>
    </section>
  );
}
