"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HERO_SLIDES as SLIDES, type HeroSlide } from "@/data/heroSlides";
import styles from "./HeroSlideshow.module.css";

const INTERVAL_MS = 5500;

function SlideVideo({ video, active, autoPlay }: { video: NonNullable<HeroSlide["video"]>; active: boolean; autoPlay: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active && autoPlay) el.play().catch(() => {});
    else el.pause();
  }, [active, autoPlay]);

  return <video ref={ref} className={styles.photo} src={video.src} poster={video.poster} muted loop playsInline preload="metadata" aria-hidden="true" />;
}

export default function HeroSlideshow({ autoPlay }: { autoPlay: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!autoPlay || paused) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [index, paused, autoPlay]);

  return (
    <div
      className={styles.root}
      role="group"
      aria-roledescription="carousel"
      aria-label="サービス紹介"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {SLIDES.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={slide.key}
            className={`${styles.slide} ${styles[`v${i}`]}`}
            data-active={active}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${SLIDES.length}`}
            aria-hidden={!active}
            inert={!active}
          >
            {slide.video && <SlideVideo video={slide.video} active={active} autoPlay={autoPlay} />}
            {slide.image && <Image src={slide.image} alt="" fill sizes="(min-width: 900px) 45vw, 100vw" className={styles.shot} priority={i === 0} />}
            {(slide.image || slide.video) && <span className={styles.scrim} aria-hidden="true" />}
            <span className={`en ${styles.tag}`}>{slide.tag}</span>
            <p className={styles.title}>{slide.title}</p>
            <p className={styles.text}>{slide.text}</p>
            <Link href={slide.href} className={`en ${styles.cta}`}>
              {slide.cta} →
            </Link>
          </div>
        );
      })}

      <div className={styles.dots}>
        {SLIDES.map((slide, i) => (
          <button
            key={slide.key}
            type="button"
            className={styles.dot}
            data-active={i === index}
            aria-label={`${i + 1}枚目のスライドを表示`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
