"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/gtag";
import LeafField from "./LeafField";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <LeafField />
      <div className={`wrap ${styles.inner}`}>
        <span className={`eyebrow en ${styles.eyebrow}`}>WEB / APP / PHOTO &amp; VIDEO DESIGN</span>
        <h1 className={styles.title}>STUDIO POPLAR.</h1>
        <p className={styles.subtitle}>
          伝えたいことを、<span className={styles.highlight}>伝わる</span>形に。
        </p>
        <p className={styles.lead}>頭の中にあることを、そのまま伝えるのは難しい。話を聞きながら、サイトや写真、アプリのかたちにしていく。</p>
        <ul className={styles.facts}>
          <li>
            <span className="en">WEB</span>5万円〜
          </li>
          <li>
            <span className="en">APP</span>10万円〜
          </li>
          <li>
            <span className="en">PHOTO &amp; VIDEO</span>4万円〜
          </li>
        </ul>
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
