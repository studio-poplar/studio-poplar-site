import Link from "next/link";
import SectionHead from "@/components/deshiiri/SectionHead";
import { deshiiriMetadata } from "@/lib/deshiiri/seo";
import styles from "../doc.module.css";

export const metadata = deshiiriMetadata({
  title: "個人情報の取り扱い",
  description: "デシイリの連絡フォームと取材相談フォームで受け取る個人情報の範囲、使い道、職人にお伝えする範囲についてのご案内です。",
  path: "/deshiiri/privacy",
});

export default function PrivacyPage() {
  return (
    <div className={`d-wrap ${styles.page}`}>
      <SectionHead as="h1" eyebrow="PRIVACY" title="個人情報の取り扱い" />
      <div className={styles.body}>
        <p>
          デシイリ（運営：Studio Poplar）は、連絡フォームと取材相談フォームでお預かりする個人情報を、次のとおり取り扱います。Studio Poplar
          全体の方針は<Link href="/privacy">プライバシーポリシー</Link>をご覧ください。
        </p>

        <h2>受け取る情報</h2>
        <ul>
          <li>連絡フォーム：連絡したい職人、用件、お名前、メールアドレス、ひとこと、どの記事から来たか。見学・弟子入りの相談のときは、年代と行けそうな日</li>
          <li>取材相談フォーム：お名前、屋号・お店の名前、お仕事、場所、メールアドレス、電話番号（任意）、ひとこと</li>
          <li>編集部へのお問い合わせフォーム：お問い合わせの種類、お名前、屋号・会社名（任意）、メールアドレス、電話番号（任意）、内容</li>
        </ul>

        <h2>使い道</h2>
        <p>
          いただいた情報は、職人への取り次ぎと、そのためのご連絡にだけ使います。取材相談の情報は、取材の相談とそのためのご連絡にだけ使います。広告やメールマガジンには使いません。
        </p>

        <h2>職人にお伝えする範囲</h2>
        <p>
          編集部が内容を確かめたうえで、お名前・用件・ひとこと（見学や弟子入りの相談では、年代と行けそうな日）を職人にお伝えします。メールアドレスは、職人と直接やりとりすることにご本人が同意されたときだけお伝えします。
        </p>

        <h2>保存</h2>
        <p>
          送信内容はメールで編集部に届きます。サイトのデータベースには保存しません。メールの送信には Resend（Resend, Inc.）を使っています。
        </p>

        <h2>アクセス解析</h2>
        <p>
          デシイリでは、読まれている記事を知るために Vercel Web Analytics を使っています。連絡フォームを送信したときは、どの職人へ・どの用件で・どの記事から送られたかを記録します。お名前やメールアドレスは記録しません。
        </p>

        <h2>第三者への提供</h2>
        <p>法令に基づく場合を除き、ご本人の同意なく、上に書いた範囲を超えて第三者に提供することはありません。</p>

        <h2>開示・訂正・削除</h2>
        <p>
          お預かりした情報の開示・訂正・削除をご希望のときは、info@studiopoplar.com までご連絡ください。ご本人であることを確かめたうえで対応します。
        </p>

        <p className={styles.sub}>制定：2026年10月</p>
      </div>
    </div>
  );
}
