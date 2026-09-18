"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import LeafField from "./LeafField";
import HearingChatLauncher from "./HearingChat";
import styles from "./Hero.module.css";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const leafY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -60]);
  const headY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -140]);
  const headOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bodyY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -90]);
  const bodyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const visualY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -50]);
  const visualOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section className={styles.hero} ref={heroRef}>
      <LeafField y={leafY} />
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.grid}>
          <div>
            <motion.div style={{ y: headY, opacity: headOpacity }}>
              <span className={styles.tag}>総合デザイン プラットフォーム</span>
              <h1 className={styles.title}>STUDIO POPLAR</h1>
            </motion.div>
            <motion.div style={{ y: bodyY, opacity: bodyOpacity }}>
              <p className={styles.subtitle}>
                伝えたいことを、<span className={styles.highlight}>伝わる</span>形に。
              </p>
              <p className={styles.lead}>
                <b>サイト</b>で事業の&ldquo;顔&rdquo;をつくり、
                <br />
                <b>写真と映像</b>で伝わる空気をつくり、
                <br />
                <b>アプリ</b>で日々の運用を支える
              </p>
              <ul className={styles.facts}>
                <li>
                  <svg className={styles.factIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="5" width="18" height="14" rx="1.5" />
                    <line x1="3" y1="9.2" x2="21" y2="9.2" />
                    <circle cx="6" cy="7.1" r="0.6" fill="currentColor" stroke="none" />
                  </svg>
                  <span className={`en ${styles.factLabel}`}>WEB</span>
                  <span className={styles.price}>5万円〜</span>
                </li>
                <li>
                  <svg className={styles.factIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="4" width="7" height="7" rx="1" />
                    <rect x="13" y="4" width="7" height="7" rx="1" />
                    <rect x="4" y="13" width="7" height="7" rx="1" />
                    <rect x="13" y="13" width="7" height="7" rx="1" />
                  </svg>
                  <span className={`en ${styles.factLabel}`}>APP</span>
                  <span className={styles.price}>15万円〜</span>
                </li>
                <li>
                  <svg className={styles.factIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
                    <circle cx="12" cy="13.3" r="3.1" />
                  </svg>
                  <span className={`en ${styles.factLabel}`}>PHOTO &amp; VIDEO</span>
                  <span className={styles.price}>6万円〜</span>
                </li>
              </ul>
              <div className={styles.ctas}>
                <Link href="/service" className="btn-ghost">
                  サービスを見る
                </Link>
                <HearingChatLauncher />
              </div>
            </motion.div>
          </div>
          <motion.div className={styles.visual} style={{ y: visualY, opacity: visualOpacity }} aria-hidden="true">
            <div className={styles.mediaFrame}>
              <svg className={styles.playIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
                <circle cx="12" cy="12" r="9" />
                <path d="M10 8.4v7.2l6-3.6z" fill="currentColor" stroke="none" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
      <motion.div style={{ opacity: cueOpacity }}>
        <div className={styles.scrollcue}>
          <span>SCROLL</span>
          <span className={styles.line} />
        </div>
      </motion.div>
    </section>
  );
}
