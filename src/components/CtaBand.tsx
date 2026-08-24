"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/gtag";
import styles from "./CtaBand.module.css";

export default function CtaBand() {
  return (
    <section className={styles.cta}>
      <div className="wrap">
        <span className="eyebrow en">START A PROJECT</span>
        <h2 className={styles.title}>まずは、事業の輪郭から話しませんか。</h2>
        <Link href="/contact" className="btn-primary" onClick={() => trackEvent("contact_click", { location: "cta_band" })}>
          お問い合わせフォームへ →
        </Link>
      </div>
    </section>
  );
}
