import styles from "./MockWorkNotice.module.css";

export default function MockWorkNotice() {
  return (
    <div className={styles.notice}>
      <span className={`en ${styles.label}`}>CLIENT WORK / DEMO WORK / MOCK WORK</span>
      <p className={styles.body}>
        CLIENT WORKは実在のご依頼をもとに制作・公開した事例、DEMO
        WORKは架空の事業設定に対してStudio
        Poplarが実際に構築・公開した自主制作の実例、MOCK
        WORKは構造設計から仕上げまでの制作プロセスを体現するための概念提案です。いずれも実案件と同じ視点——事業の構造を見立て、ブランドを設計し、Web／アプリへ実装する——で取り組んでいます。
      </p>
    </div>
  );
}
