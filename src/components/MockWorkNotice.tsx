import WorkTypeBadge from "./WorkTypeBadge";
import styles from "./MockWorkNotice.module.css";

const LEGEND: { type: "client" | "demo" | "mock"; meaning: string }[] = [
  { type: "client", meaning: "実際のご依頼で制作・公開" },
  { type: "demo", meaning: "自主制作・実際に公開中" },
  { type: "mock", meaning: "構想のみ・未制作" },
];

export default function MockWorkNotice() {
  return (
    <div className={styles.notice}>
      {LEGEND.map((item) => (
        <div key={item.type} className={styles.item}>
          <WorkTypeBadge type={item.type} />
          <span>{item.meaning}</span>
        </div>
      ))}
    </div>
  );
}
