"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/gtag";
import styles from "./ContactCTA.module.css";

const DEFAULT_TEXT = "撮影やサイト制作のご相談はこちらから。";

export default function ContactCTA({ text }: { text?: string }) {
  return (
    <div className={styles.box}>
      <p>{text || DEFAULT_TEXT}</p>
      <Link href="/contact" className="btn-primary" onClick={() => trackEvent("contact_click", { location: "blog_cta" })}>
        お問い合わせフォームへ<span className="btn-arrow">→</span>
      </Link>
    </div>
  );
}
