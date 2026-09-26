import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import PageMasthead from "@/components/PageMasthead";
import ContactForm from "@/components/ContactForm";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "お問い合わせ",
  description: "Studio Poplarへのお問い合わせはこちらから。WEB制作・アプリ制作・写真動画撮影のご相談を承ります。",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageMasthead
        eyebrow="START A PROJECT"
        title="お問い合わせ"
        description="新規事業・個人開業のご相談から、WEB制作／アプリ制作／写真・動画撮影のご相談まで、お気軽にお問い合わせください。"
      />

      <section className="section" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <div className={styles.layout}>
            <div className={styles.infoCard}>
              <span className="eyebrow en">CONTACT INFO</span>
              <p>
                フォームまたはメールにてお気軽にお問い合わせください。
                <br />
                内容を確認後、営業日1〜2日以内にご連絡いたします。
              </p>
              <a href="mailto:info@studiopoplar.com">info@studiopoplar.com</a>
              <div className={styles.snsList}>
                <span className={`en ${styles.snsLabel}`}>SOCIAL</span>
                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer noopener">
                  Instagram
                </a>
                <a href="https://x.com/" target="_blank" rel="noreferrer noopener">
                  X
                </a>
              </div>
            </div>

            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
