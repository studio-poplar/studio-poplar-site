"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./HeroSlideshow.module.css";

type Slide = {
  key: string;
  tag: string;
  title: string;
  text: string;
  href: string;
  cta: string;
  // Optional photo: when set it sits under the gradient, so real images can be
  // dropped in later without touching the layout.
  image?: string;
};

const SLIDES: Slide[] = [
  {
    key: "web",
    tag: "WEB",
    title: "伝わる“顔”を、つくる。",
    text: "ヒアリングから、事業の顔になるサイトを設計・制作します。",
    href: "/service",
    cta: "WEB制作を見る",
  },
  {
    key: "app",
    tag: "APP",
    title: "日々の運用を、支える。",
    text: "予約や会員管理など、運用の負担を減らす仕組みをつくります。",
    href: "/service",
    cta: "アプリ制作を見る",
  },
  {
    key: "photo",
    tag: "PHOTO & VIDEO",
    title: "雰囲気ごと、残す。",
    text: "言葉だけでは伝わらない空気を、写真と映像で形にします。",
    href: "/service",
    cta: "撮影プランを見る",
  },
  {
    key: "drone",
    tag: "DRONE",
    title: "空からの視点を、味方に。",
    text: "上空からの映像で、場所や空間の魅力を伝えます。",
    href: "/service/drone",
    cta: "ドローン撮影を見る",
  },
];

const INTERVAL_MS = 5500;

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
            {slide.image && <Image src={slide.image} alt="" fill sizes="(min-width: 900px) 45vw, 100vw" className={styles.photo} priority={i === 0} />}
            <span className={`en ${styles.ghost}`} aria-hidden="true">
              {slide.tag.split(" ")[0]}
            </span>
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
