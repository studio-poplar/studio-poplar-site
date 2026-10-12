import Link from "next/link";
import { deshiiriMetadata } from "@/lib/deshiiri/seo";
import styles from "../page.module.css";

export const metadata = deshiiriMetadata({
  title: "送信しました",
  description: "デシイリへのご連絡を受け付けました。",
  path: "/deshiiri/contact/thanks",
  noindex: true,
});

export default function ThanksPage() {
  return (
    <div className={`d-wrap ${styles.thanks}`}>
      <span className="d-eyebrow">THANK YOU</span>
      <h1 className={styles.thanksTitle}>受け付けました。</h1>
      <p>ご連絡ありがとうございます。入力いただいたメールアドレスに、受け付けのメールをお送りしました。</p>
      <ol className={styles.flow}>
        <li>
          <b>01</b>デシイリ編集部が内容を確かめて、職人に取り次ぎます。
        </li>
        <li>
          <b>02</b>三日以内に、編集部からメールでご連絡します。職人の返事や、日程の相談はそのメールで行います。
        </li>
        <li>
          <b>03</b>受け付けのメールが届かないときは、迷惑メールのフォルダを確かめてください。
        </li>
      </ol>
      <div className={styles.actions}>
        <Link href="/deshiiri/articles" className="d-btn">
          ほかの記事を読む
        </Link>
        <Link href="/deshiiri" className="d-btn ghost">
          デシイリのトップへ
        </Link>
      </div>
    </div>
  );
}
