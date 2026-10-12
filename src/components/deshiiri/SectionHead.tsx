import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./SectionHead.module.css";

type Props = {
  num?: string;
  eyebrow: string;
  title: ReactNode;
  as?: "h1" | "h2";
  link?: { href: string; label: string };
  aside?: ReactNode;
};

// 番号（柿色の英字）＋英字ラベル＋明朝の見出し＋右端に VIEW ALL →
export default function SectionHead({ num, eyebrow, title, as: Heading = "h2", link, aside }: Props) {
  return (
    <div className={styles.head}>
      <span className={styles.num}>{num ?? "—"}</span>
      <div>
        <span className="d-eyebrow">{eyebrow}</span>
        <Heading className={styles.title}>{title}</Heading>
      </div>
      {link ? (
        <Link href={link.href} className="d-arrow">
          {link.label}
        </Link>
      ) : (
        (aside ?? <span />)
      )}
    </div>
  );
}
