import styles from "./MockWorkNotice.module.css";

export default function MockWorkNotice() {
  return (
    <div className={styles.notice}>
      <span className={`en ${styles.label}`}>
        MOCK WORK — 構造設計力を示すための自主制作事例
      </span>
      <p className={styles.body}>
        以下の事例は、実在する企業様からのご依頼ではなく、Studio
        Poplarが構造設計から仕上げまでの制作プロセスを体現するために自主的に手がけたモックプロジェクトです。架空の事業設定に対しても、実案件と同じ視点——事業の構造を見立て、ブランドを設計し、Web／アプリへ実装する——で取り組んでいます。今後、実際のご依頼事例が増え次第、CLIENT
        WORKとして区別のうえ掲載してまいります。
      </p>
    </div>
  );
}
