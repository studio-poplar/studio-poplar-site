import { Suspense } from "react";
import SectionHead from "@/components/deshiiri/SectionHead";
import ContactForm from "@/components/deshiiri/ContactForm";
import ContactFromQuery from "@/components/deshiiri/ContactFromQuery";
import { getContactPeople } from "@/lib/deshiiri/content";
import { deshiiriMetadata } from "@/lib/deshiiri/seo";
import styles from "./page.module.css";

export const metadata = deshiiriMetadata({
  title: "職人に連絡する",
  description: "デシイリで取材した職人への連絡フォームです。話を聞いてみたい、仕事を頼みたい、見学してみたいなどの用件を、デシイリ編集部が受け取っておつなぎします。",
  path: "/deshiiri/contact",
});

export default function ContactPage() {
  const people = getContactPeople();
  return (
    <div className={`d-wrap ${styles.page}`}>
      <div className={styles.side}>
        <SectionHead as="h1" eyebrow="CONTACT" title="職人に連絡する" />
        <p>
          話を聞いてみたい、仕事を頼みたい、作業場を見てみたい。どんな用件でも大丈夫です。デシイリ編集部が受け取り、職人におつなぎします。
        </p>
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
          <p>掲載している職人はまだいません。</p>
        )}
      </div>
    </div>
  );
}
