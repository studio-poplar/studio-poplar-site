import SectionHead from "@/components/deshiiri/SectionHead";
import ShuzaiForm from "@/components/deshiiri/ShuzaiForm";
import { deshiiriMetadata } from "@/lib/deshiiri/seo";
import styles from "../doc.module.css";

export const metadata = deshiiriMetadata({
  title: "取材を受けたい職人の方へ",
  description: "デシイリの取材と掲載は無料です。記事を読んだ人からの連絡は、デシイリ編集部がまとめてお届けします。取材の相談はこのページのフォームから。",
  path: "/deshiiri/for-shokunin",
});

export default function ForShokuninPage() {
  return (
    <div className={`d-wrap ${styles.page}`}>
      <SectionHead as="h1" eyebrow="FOR CRAFTSPEOPLE" title="あなたの仕事を、取材させてください。" />
      <p className={styles.lead}>
        取材と掲載は無料です。記事を読んで興味を持った人からの連絡は、編集部がまとめてお届けします。
      </p>
      <div className={styles.split}>
        <div className={styles.body}>
          <h2>取材から掲載まで</h2>
          <ol className={styles.points}>
            <li>
              <b>01</b>このページのフォームから、取材の相談を送ってください。三日以内に編集部からご連絡します。
            </li>
            <li>
              <b>02</b>電話かメールで、仕事の内容と、取材に伺える日を相談します。
            </li>
            <li>
              <b>03</b>作業場や現場に伺って、話を聞き、写真を撮ります。
            </li>
            <li>
              <b>04</b>原稿と写真をお見せして、載せてよいものだけを掲載します。
            </li>
          </ol>

          <h2>読者からの連絡</h2>
          <p>
            記事の最後に、読んだ人が連絡できるフォームを付けます。用件は「話を聞いてみたい」「仕事を頼みたい」「見学してみたい」「弟子入りの相談」の四つで、受けたくない用件は出さないようにできます。
          </p>
          <p>連絡はまず編集部が受け取ります。職人のメールアドレスや電話番号を、読者に直接お伝えすることはありません。</p>

          <h2>費用</h2>
          <p>取材・撮影・掲載に費用はかかりません。</p>
        </div>
        <div>
          <span className="d-eyebrow">FORM</span>
          <h2 className={styles.formHead}>取材の相談をする</h2>
          <ShuzaiForm />
        </div>
      </div>
    </div>
  );
}
