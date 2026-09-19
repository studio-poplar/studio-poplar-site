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
      <div className={styles.ghostTextWrap} aria-hidden="true">
        <div className={styles.ghostTextTrack}>
          <span className={styles.ghostText}>STUDIO POPLAR ー 伝えたいことを、伝わる形に。 ー </span>
          <span className={styles.ghostText}>STUDIO POPLAR ー 伝えたいことを、伝わる形に。 ー </span>
        </div>
      </div>
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
                  <span className={`en ${styles.factLabel}`}>WEB</span>
                  <span className={styles.price}>5万円〜</span>
                </li>
                <li>
                  <span className={`en ${styles.factLabel}`}>APP</span>
                  <span className={styles.price}>15万円〜</span>
                </li>
                <li>
                  <span className={`en ${styles.factLabel}`}>PHOTO</span>
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
