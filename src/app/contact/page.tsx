import type { Metadata } from "next";
import { Suspense } from "react";
import PageMasthead from "@/components/PageMasthead";
import ContactForm from "@/components/ContactForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "CONTACT",
  description: "Studio Poplarへのお問い合わせはこちらから。WEB制作・3Dモデリング活用WEB制作・アプリ制作のご相談を承ります。",
};

export default function ContactPage() {
  return (
    <>
      <PageMasthead
        eyebrow="START A PROJECT"
        title="お問い合わせ"
        description="新規事業・個人開業のご相談から、WEB制作／3Dモデリング活用WEB制作／アプリ制作のご相談まで、お気軽にお問い合わせください。"
      />

      <section className="section" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <div className={styles.layout}>
            <div className={styles.infoCard}>
              <span className="eyebrow en">CONTACT INFO</span>
              <p>フォームまたはメールにて承っております。内容を確認の上、担当より折り返しご連絡いたします。</p>
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
