"use client";

import { useActionState } from "react";
import { runChecks, type CheckResult } from "./actions";
import styles from "./admin.module.css";

export default function Checks() {
  const [results, action, pending] = useActionState<CheckResult[] | null>(async () => runChecks(), null);
  return (
    <form action={action}>
      <button type="submit" className={`${styles.button} ${styles.ghost}`} disabled={pending}>
        {pending ? "確認しています…" : "接続を確かめる"}
      </button>
      {results ? (
        <div className={styles.checks} aria-live="polite">
          {results.map((r) => (
            <div key={r.service} className={styles.checkRow}>
              <strong>{r.service}</strong>
              <span className={r.ok ? styles.ok : styles.ng}>{r.ok ? "OK" : "NG"}</span>
              <span>{r.detail}</span>
            </div>
          ))}
        </div>
      ) : null}
    </form>
  );
}
