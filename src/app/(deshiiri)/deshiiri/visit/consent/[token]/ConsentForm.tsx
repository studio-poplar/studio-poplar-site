"use client";

import { useActionState } from "react";
import styles from "@/components/deshiiri/Form.module.css";
import { consent, type ConsentState } from "./actions";

export default function ConsentForm({ token, name, craftsperson }: { token: string; name: string; craftsperson: string }) {
  const [state, action, pending] = useActionState(consent.bind(null, token), { status: "idle" } as ConsentState);

  if (state.status === "agreed")
    return (
      <p className={styles.done} role="status">
        同意をいただきました。申し込みを{craftsperson}さんにお届けしました。{craftsperson}さんが受けた場合は、{name}さんと保護者の方のメールに日にちの相談が届きます。
      </p>
    );
  if (state.status === "refused")
    return (
      <p className={styles.done} role="status">
        承知しました。この申し込みは取り消しました。{craftsperson}さんには届きません。
      </p>
    );
  if (state.status === "gone")
    return (
      <p className={styles.error} role="alert">
        この申し込みは、すでにお返事済みか、受付が終わっています。
      </p>
    );

  return (
    <form action={action} className={styles.form}>
      {state.status === "error" ? (
        <p className={styles.error} role="alert">
          うまく送れませんでした。時間をおいて、もう一度お試しください。
        </p>
      ) : null}
      <div className={styles.buttons}>
        <button type="submit" name="answer" value="agree" className={`d-btn ${styles.submit}`} disabled={pending}>
          同意する
        </button>
        <button type="submit" name="answer" value="refuse" className={styles.plain} disabled={pending}>
          同意しない
        </button>
      </div>
    </form>
  );
}
