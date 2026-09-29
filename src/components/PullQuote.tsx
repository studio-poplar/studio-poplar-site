import type { ReactNode } from "react";
import type { BlogSeries } from "@/lib/blog-types";
import styles from "./PullQuote.module.css";

const SERIES_CLASS: Record<BlogSeries, string> = { "field-notes": "field", "design-notes": "design", "marketing-notes": "marketing" };

export default function PullQuote({ children, series }: { children: ReactNode; series?: BlogSeries }) {
  const cls = series ? styles[SERIES_CLASS[series]] : styles.design;
  return <div className={`${styles.pull} ${cls}`}>{children}</div>;
}
