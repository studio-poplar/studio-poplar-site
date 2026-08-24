"use client";

import Link from "next/link";
import CubeField from "./CubeField";
import { trackEvent } from "@/lib/gtag";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <CubeField />
      <div className={`wrap ${styles.inner}`}>
        <span className={`eyebrow en ${styles.eyebrow}`}>WEB / 3D WEB / APP DESIGN</span>
        <h1 className={styles.title}>
          STUDIO
          <br />
          POPLAR.
        </h1>
        <p className={styles.lead}>事業の構造を見立てる力で、新規事業・個人開業の輪郭を描く制作スタジオです。</p>
        <div className={styles.ctas}>
          <Link href="/contact" className="btn-primary" onClick={() => trackEvent("hero_cta_click")}>
            まずは相談する →
          </Link>
          <Link href="/works" className="btn-ghost">
            制作実績を見る
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
