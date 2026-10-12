import { Suspense } from "react";
import Link from "next/link";
import SectionHead from "@/components/deshiiri/SectionHead";
import ContactForm from "@/components/deshiiri/ContactForm";
import EditorialForm from "@/components/deshiiri/EditorialForm";
import ContactFromQuery, { EditorialFromQuery } from "@/components/deshiiri/ContactFromQuery";
import { getContactPeople } from "@/lib/deshiiri/content";
import { deshiiriMetadata } from "@/lib/deshiiri/seo";
import styles from "./page.module.css";

export const metadata = deshiiriMetadata({
  title: "お問い合わせ",
  description:
    "デシイリで取材した職人への連絡と、デシイリ編集部へのお問い合わせ（取材を受けたい・協賛・そのほか）のページです。どちらも編集部が受け取ります。",
  path: "/deshiiri/contact",
});

export default function ContactPage() {
  const people = getContactPeople();
  return (
    <div className={`d-wrap ${styles.wrap}`}>
      <SectionHead as="h1" eyebrow="Contact" title="お問い合わせ" />
      <p className={styles.intro}>
        職人への連絡と、デシイリ編集部へのお問い合わせは、どちらもこのページから送れます。送った内容は編集部が受け取り、三日以内にメールでご連絡します。
      </p>
      <nav className={styles.jump} aria-label="お問い合わせの種類">
        <a href="#shokunin">
          <b>職人に連絡する</b>
          <span>話を聞きたい・仕事を頼みたい・見学したい・弟子入りの相談</span>
        </a>
        <a href="#henshubu">
          <b>デシイリ編集部へのお問い合わせ</b>
          <span>取材を受けたい・協賛について・そのほか</span>
        </a>
      </nav>

      <section className={styles.page} id="shokunin">
        <div className={styles.side}>
          <h2 className={styles.h2}>職人に連絡する</h2>
          <p>話を聞いてみたい、仕事を頼みたい、作業場を見てみたい。どんな用件でも大丈夫です。</p>
          <ol className={styles.flow}>
            <li>
              <b>01</b>このフォームから送ると、デシイリ編集部に届きます。職人に直接は届きません。
            </li>
            <li>
              <b>02</b>編集部が内容を確かめて、職人に取り次ぎます。
            </li>
            <li>
              <b>03</b>三日以内に、編集部からメールでご連絡します。
            </li>
          </ol>
        </div>
        <div className={styles.main}>
          {people.length > 0 ? (
            <Suspense fallback={<ContactForm people={people} />}>
              <ContactFromQuery people={people} />
            </Suspense>
          ) : (
            <p className={styles.empty}>
              連絡を受け付けている職人は、まだいません。本物の取材記事は、これから順に公開します。
              <br />
              取材を受けたい方は、<a href="#henshubu">下のフォーム</a>からご相談ください。
            </p>
          )}
        </div>
      </section>

      <section className={styles.page} id="henshubu">
        <div className={styles.side}>
          <h2 className={styles.h2}>デシイリ編集部へのお問い合わせ</h2>
          <p>
            取材を受けたい職人・家業の方、協賛を考えている方、サイトについてのご質問はこちらから。取材と掲載は無料です。
          </p>
          <p className={styles.more}>
            <Link href="/deshiiri/for-shokunin">取材を受けたい職人の方へ</Link>
            <Link href="/deshiiri/sponsor">協賛について</Link>
          </p>
        </div>
        <div className={styles.main}>
          <Suspense fallback={<EditorialForm />}>
            <EditorialFromQuery />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
