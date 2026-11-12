"use client";

import { useActionState } from "react";
import { backupNow, testWarning, type OpsResult } from "./actions";
import styles from "../admin.module.css";

function Button({ label, busy, run }: { label: string; busy: string; run: () => Promise<OpsResult> }) {
  const [result, action, pending] = useActionState<OpsResult>(async () => run(), null);
  return (
    <form action={action}>
      <button type="submit" className={`${styles.button} ${styles.ghost}`} disabled={pending}>
        {pending ? busy : label}
      </button>
      {result ? (
        <p className={`${styles.note} ${result.ok ? styles.ok : styles.ng}`} aria-live="polite" style={{ marginTop: 12 }}>
          {result.detail}
        </p>
      ) : null}
    </form>
  );
}

export function BackupButton() {
  return <Button label="今すぐバックアップする" busy="保存しています…" run={backupNow} />;
}

export function WarningButton() {
  return <Button label="警告を試しに出す" busy="送っています…" run={testWarning} />;
}
