"use client";

import { useActionState } from "react";
import { applyMigrations, type MigrateResult } from "./actions";
import styles from "./admin.module.css";

export default function Migrate() {
  const [result, action, pending] = useActionState<MigrateResult | null>(async () => applyMigrations(), null);
  return (
    <form action={action}>
      <button type="submit" className={`${styles.button} ${styles.ghost}`} disabled={pending}>
        {pending ? "当てています…" : "表を作る・更新する"}
      </button>
      {result ? (
        <p className={`${styles.note} ${result.ok ? styles.ok : styles.ng}`} aria-live="polite" style={{ marginTop: 12 }}>
          {result.detail}
        </p>
      ) : null}
    </form>
  );
}
