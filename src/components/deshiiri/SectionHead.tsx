import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./SectionHead.module.css";

type Props = {
  // Small English label beside the title, e.g. "LATEST" (optional)
  eyebrow?: string;
  title: ReactNode;
  as?: "h1" | "h2";
  link?: { href: string; label: string };
  aside?: ReactNode;
};

// 雑誌の見出し: 上に罫線、明朝の見出し＋小さな英字、右端に「一覧を見る →」
export default function SectionHead({ eyebrow, title, as: Heading = "h2", link, aside }: Props) {
  return (
    <div className={`${styles.head} ${Heading === "h1" ? styles.page : ""}`}>
      <div className={styles.titles}>
        <Heading className={styles.title}>{title}</Heading>
        {eyebrow && <span className={styles.en}>{eyebrow}</span>}
      </div>
      {link ? (
        <Link href={link.href} className={styles.link}>
          {link.label}
        </Link>
      ) : (
        aside
      )}
    </div>
  );
}
