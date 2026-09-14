"use client";

import { useEffect, useState } from "react";
import { getWorkBySlug } from "@/data/works";
import styles from "./WebShowcaseReel.module.css";

const REEL_SLUGS = ["bokuheki", "the-gallery"];

const SLIDES = REEL_SLUGS.map((slug) => getWorkBySlug(slug))
  .filter((work): work is NonNullable<typeof work> => Boolean(work?.url))
  .map((work) => ({ url: work.url as string, label: work.title }));

export default function WebShowcaseReel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (SLIDES.length < 2) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.reel} aria-hidden="true">
      {SLIDES.map((slide, i) => (
        <div key={slide.url} className={styles.slide} data-active={i === index}>
          <iframe src={slide.url} title={slide.label} loading="lazy" tabIndex={-1} />
        </div>
      ))}
      <span className={styles.caption}>{SLIDES[index]?.label}</span>
    </div>
  );
}
