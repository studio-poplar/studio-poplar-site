"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { trackEvent } from "@/lib/gtag";
import LeafField from "./LeafField";
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
  const cueOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section className={styles.hero} ref={heroRef}>
      <LeafField y={leafY} />
      <div className={`wrap ${styles.inner}`}>
        <motion.div style={{ y: headY, opacity: headOpacity }}>
          <span className={`eyebrow en ${styles.eyebrow}`}>WEB / APP / PHOTO &amp; VIDEO DESIGN</span>
          <h1 className={styles.title}>STUDIO POPLAR.</h1>
        </motion.div>
        <motion.div style={{ y: bodyY, opacity: bodyOpacity }}>
          <p className={styles.subtitle}>
            伝えたいことを、<span className={styles.highlight}>伝わる</span>形に。
          </p>
          <p className={styles.lead}>
            サイトで事業の&ldquo;顔&rdquo;をつくり、
            <br />
            写真と映像で伝わる空気をつくり、
            <br />
            アプリで日々の運用を支える
          </p>
          <ul className={styles.facts}>
            <li>
              <span className="en">WEB</span>5万円〜
            </li>
            <li>
              <span className="en">APP</span>15万円〜
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
        </motion.div>
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
