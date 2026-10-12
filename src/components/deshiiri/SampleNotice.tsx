import styles from "./SampleNotice.module.css";

// イメージ案の記事・職人に出す注意書き。架空の内容を実在のものと誤解されないようにする。
export default function SampleNotice({ kind }: { kind: "article" | "shokunin" }) {
  return (
    <p className={styles.notice} role="note">
      <b>イメージ案（仮）</b>
      {kind === "article"
        ? "この記事は、デシイリの記事の形を見ていただくための仮の内容です。登場する職人・お店・数字・言葉は実在しません。"
        : "この職人・お店は、掲載の形を見ていただくための仮のものです。実在しないため、連絡は受け付けていません。"}
    </p>
  );
}

// カードの小さな印
export function SampleBadge() {
  return <span className={styles.badge}>イメージ案</span>;
}
