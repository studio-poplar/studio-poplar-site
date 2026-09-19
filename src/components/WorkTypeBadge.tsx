import { WorkType, WORK_TYPE_LABELS } from "@/data/works";
import styles from "./WorkTypeBadge.module.css";

export default function WorkTypeBadge({ type }: { type: WorkType }) {
  // real client work needs no label; only demo / self-made cases are marked
  if (type === "client") return null;
  return (
    <span className={styles.badge} data-type={type}>
      {WORK_TYPE_LABELS[type]}
    </span>
  );
}
