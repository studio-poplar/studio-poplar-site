import Link from "next/link";
import styles from "./page.module.css";

// Stage 1 (foundation): hero only, to check fonts, colours and the header/footer.
// The counts, ticker and sections 01–06 are added once the content files exist (stage 2–4).
export default function DeshiiriHome() {
  return (
    <section className={`d-wrap ${styles.hero}`}>
      <div>
        <span className="d-eyebrow">
          YOKOHAMA / KANAGAWA <b>—</b> 職人と家業の読みもの
        </span>
        <h1 className={styles.title}>
          職人と家業の、
          <br />
          まだ知られていない話。
        </h1>
        <p className={styles.lead}>
          横浜・神奈川の大工、畳屋、味噌蔵、梨農家を訪ねて、仕事の中身を聞き書きしています。読んで気になった職人には、ここから連絡できます。
        </p>
        <div className={styles.actions}>
          <Link href="/deshiiri/articles" className="d-btn">
            最新の帖を読む
          </Link>
          <Link href="/deshiiri/meikan" className="d-btn ghost">
            職人名鑑を見る
          </Link>
        </div>
      </div>
    </section>
  );
}
