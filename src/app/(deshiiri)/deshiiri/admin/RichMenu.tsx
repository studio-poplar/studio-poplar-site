"use client";

import { useActionState } from "react";
import { setupRichMenu, type MigrateResult } from "./actions";
import styles from "./admin.module.css";

export default function RichMenu() {
  const [result, action, pending] = useActionState<MigrateResult | null>(async () => setupRichMenu(), null);
  return (
    <form action={action}>
      <button type="submit" className={`${styles.button} ${styles.ghost}`} disabled={pending}>
        {pending ? "設定しています…" : "リッチメニューを設定する"}
      </button>
      {result ? (
        <p className={`${styles.note} ${result.ok ? styles.ok : styles.ng}`} aria-live="polite" style={{ marginTop: 12 }}>
          {result.detail}
        </p>
      ) : null}
    </form>
  );
}
