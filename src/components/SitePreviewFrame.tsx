"use client";

import { useLayoutEffect, useRef, useState } from "react";
import styles from "./SitePreviewFrame.module.css";

type SitePreviewFrameProps = {
  url: string;
  label: string;
};

// The site is rendered in a real desktop-sized viewport and scaled to fit the
// frame, so its layout and text sizes match what a visitor sees on a laptop.
const VIEWPORT_WIDTH = 1440;
const VIEWPORT_HEIGHT = 900;

export default function SitePreviewFrame({ url, label }: SitePreviewFrameProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / VIEWPORT_WIDTH);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.frame}>
      <div className={styles.bar}>
        <span className={styles.dots}>
          <span />
          <span />
          <span />
        </span>
        <span className={styles.urlLabel}>{label}</span>
      </div>
      <div className={styles.viewport} ref={viewportRef}>
        {scale !== null && (
          <iframe
            src={url}
            title={label}
            loading="lazy"
            tabIndex={-1}
            aria-hidden="true"
            style={{ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT, transform: `scale(${scale})` }}
          />
        )}
      </div>
    </div>
  );
}
