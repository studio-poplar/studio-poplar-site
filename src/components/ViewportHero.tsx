"use client";

import Link from "next/link";
import RegMarks from "./RegMarks";
import { trackEvent } from "@/lib/gtag";
import styles from "./ViewportHero.module.css";

export default function ViewportHero() {
  return (
    <section className={styles.hero}>
      <RegMarks />
      <div className={`wrap ${styles.grid}`}>
        <div>
          <p className="eyebrow mono">WEB / 3D MODEL WEB / APP DESIGN STUDIO</p>
          <h1 className={styles.heading}>
            事業の構造を、
            <br />
            <span className={styles.accentText}>設計</span>する。
          </h1>
          <p className={styles.lead}>
            新規事業や個人開業の&ldquo;らしさ&rdquo;を、Webとアプリという構造物に落とし込む制作スタジオです。ブランドの骨格から仕上げまでを一貫して設計します。
          </p>
          <div className={styles.ctas}>
            <Link href="/contact" className="btn-primary" onClick={() => trackEvent("hero_cta_click")}>
              まずは相談する →
            </Link>
          </div>
          <p className={styles.ctaNote}>相談は無料です。まずは事業の構造からお聞きします。</p>
          <Link href="/works" className={`btn-ghost ${styles.secondaryLink}`}>
            制作実績を見る
          </Link>
        </div>

        <div className={styles.viewport} aria-hidden="true">
          <div className={styles.viewportBar}>
            <span className="mono">VIEWPORT — PERSPECTIVE</span>
            <span className="mono">FOV 35MM</span>
          </div>

          <div className={styles.viewportStage}>
            <div className={styles.scanlines} />
            <div className={styles.grid3d} />

            <svg className={styles.gizmo} viewBox="0 0 100 100">
              <g className={styles.gizmoSpin} transform="translate(50,50)">
                <line x1="0" y1="0" x2="0" y2="-34" stroke="var(--axis-y)" strokeWidth="1.4" />
                <circle cx="0" cy="-34" r="5" fill="var(--axis-y)" />
                <line x1="0" y1="0" x2="30" y2="18" stroke="var(--axis-x)" strokeWidth="1.4" />
                <circle cx="30" cy="18" r="5" fill="var(--axis-x)" />
                <line x1="0" y1="0" x2="-30" y2="18" stroke="var(--axis-z)" strokeWidth="1.4" />
                <circle cx="-30" cy="18" r="5" fill="var(--axis-z)" />
                <circle cx="0" cy="0" r="3" fill="var(--text-soft)" />
              </g>
            </svg>

            <svg className={styles.axo} viewBox="0 0 480 420" preserveAspectRatio="xMidYMid meet">
              <line x1="20" y1="400" x2="460" y2="400" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="2 4" />

              <g transform="translate(70,40)" className={styles.layer}>
                <polygon points="0,60 160,0 320,60 160,120" fill="rgba(242,241,237,0.04)" stroke="var(--border-strong)" strokeWidth="1.2" />
                <polygon points="0,60 160,120 160,150 0,90" fill="rgba(242,241,237,0.02)" stroke="var(--border-strong)" strokeWidth="1.2" />
                <polygon points="320,60 160,120 160,150 320,90" fill="rgba(242,241,237,0.06)" stroke="var(--border-strong)" strokeWidth="1.2" />
              </g>

              <g transform="translate(50,150)" className={styles.layer}>
                <polygon points="0,60 160,0 320,60 160,120" fill="rgba(90,155,224,0.1)" stroke="var(--axis-z)" strokeWidth="1.2" />
                <polygon points="0,60 160,120 160,155 0,95" fill="rgba(90,155,224,0.05)" stroke="var(--axis-z)" strokeWidth="1.2" />
                <polygon points="320,60 160,120 160,155 320,95" fill="rgba(90,155,224,0.14)" stroke="var(--axis-z)" strokeWidth="1.2" />
              </g>

              <g transform="translate(30,255)" className={styles.layer}>
                <polygon points="0,60 160,0 320,60 160,120" fill="rgba(227,168,87,0.16)" stroke="var(--accent)" strokeWidth="1.4" />
                <polygon points="0,60 160,120 160,158 0,98" fill="rgba(227,168,87,0.08)" stroke="var(--accent)" strokeWidth="1.4" />
                <polygon points="320,60 160,120 160,158 320,98" fill="rgba(227,168,87,0.22)" stroke="var(--accent)" strokeWidth="1.4" />
              </g>

              <line x1="390" y1="85" x2="440" y2="60" stroke="var(--border-strong)" strokeWidth="1" />
              <line x1="370" y1="205" x2="440" y2="190" stroke="var(--border-strong)" strokeWidth="1" />
              <line x1="350" y1="325" x2="440" y2="345" stroke="var(--border-strong)" strokeWidth="1" />
            </svg>

            <div className={`${styles.axoLabel} ${styles.l1} mono`}>
              <span className={styles.dot} style={{ background: "var(--border-strong)" }} />
              APPLICATION
            </div>
            <div className={`${styles.axoLabel} ${styles.l2} mono`}>
              <span className={styles.dot} style={{ background: "var(--axis-z)" }} />
              3D MODEL WEB
            </div>
            <div className={`${styles.axoLabel} ${styles.l3} mono`}>
              <span className={styles.dot} style={{ background: "var(--accent)" }} />
              WEB SITE
            </div>
          </div>

          <div className={styles.viewportBar}>
            <span className="mono">X 042.19 / Y 118.02 / Z 006.40</span>
            <span className="mono">● REC</span>
          </div>
        </div>
      </div>
    </section>
  );
}
