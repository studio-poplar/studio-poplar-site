import type { ReactNode } from "react";
import type { BlogSeries } from "@/lib/blog-types";
import styles from "./PullQuote.module.css";

export default function PullQuote({ children, series }: { children: ReactNode; series?: BlogSeries }) {
  return (
    <div className={`${styles.pull} ${series === "field-notes" ? styles.field : styles.design}`}>{children}</div>
  );
}
