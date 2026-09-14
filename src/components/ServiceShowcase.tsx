"use client";

import { useEffect, useState } from "react";
import { useReveal } from "@/lib/useReveal";
import styles from "./ServiceShowcase.module.css";

const WEB_STEPS = ["ヒアリング", "構成・ワイヤーフレーム", "デザイン", "コーディング", "公開"];

function WebIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect x="4" y="6" width="32" height="26" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <line x1="4" y1="13" x2="36" y2="13" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}

function AppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <rect x="12" y="4" width="16" height="32" rx="4" stroke="currentColor" strokeWidth="1.4" />
      <line x1="17" y1="9" x2="23" y2="9" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function PhotoVideoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export default function ServiceShowcase() {
  const ref = useReveal<HTMLDivElement>(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const id = setInterval(() => {
      setStepIndex((i) => (i + 1) % WEB_STEPS.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.grid} ref={ref}>
      <div className={styles.feature}>
        <div>
          <WebIcon className={styles.featureIcon} />
          <span className={`en ${styles.featureTag}`}>01 — WEB</span>
          <h3 className={styles.featureTitle}>サイトをつくる</h3>
          <p className={styles.featureDesc}>
            はじめての開業やお店の&ldquo;顔&rdquo;になるサイトを、話を聞きながらつくります。
          </p>
        </div>

        <div className={styles.process} aria-live="polite">
          <span className={`en ${styles.processLabel}`}>制作の流れ</span>
          <div className={styles.processStep}>
            <span className={`en ${styles.processNum}`}>{String(stepIndex + 1).padStart(2, "0")}</span>
            <span className={styles.processText}>{WEB_STEPS[stepIndex]}</span>
          </div>
          <div className={styles.dots}>
            {WEB_STEPS.map((step, i) => (
              <span key={step} className={i === stepIndex ? styles.dotActive : styles.dot} />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.side}>
        <div className={styles.card}>
          <AppIcon className={styles.cardIcon} />
          <span className={`en ${styles.cardTag}`}>02 — APP</span>
          <h4 className={styles.cardTitle}>仕組みをつくる</h4>
          <p className={styles.cardDesc}>予約や会員管理、診断など、日々の運用をラクにする仕組みをつくります。</p>
        </div>
        <div className={styles.card}>
          <PhotoVideoIcon className={styles.cardIcon} />
          <span className={`en ${styles.cardTag}`}>03 — PHOTO &amp; VIDEO</span>
          <h4 className={styles.cardTitle}>見せ方をつくる</h4>
          <p className={styles.cardDesc}>写真や映像で、言葉だけでは伝わらない雰囲気を伝えます。</p>
        </div>
      </div>
    </div>
  );
}
