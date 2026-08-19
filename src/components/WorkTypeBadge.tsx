import { WorkType, WORK_TYPE_LABELS } from "@/data/works";
import styles from "./WorkTypeBadge.module.css";

export default function WorkTypeBadge({ type }: { type: WorkType }) {
  return (
    <span className={`mono ${styles.badge}`} data-type={type}>
      {WORK_TYPE_LABELS[type]}
    </span>
  );
}
