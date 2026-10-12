"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import styles from "./Form.module.css";

// 取材の相談フォーム（/deshiiri/for-shokunin）。送信先は連絡フォームと同じ API。
export default function ShuzaiForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/deshiiri/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "shuzai",
          name: form.get("name"),
          yago: form.get("yago"),
          job: form.get("job"),
          area: form.get("area"),
          email: form.get("email"),
          tel: form.get("tel") ?? "",
          message: form.get("message") ?? "",
          agree: form.get("agree") === "on",
          website: form.get("website") ?? "",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "送信に失敗しました。時間をおいてお試しください。");
      formEl.reset();
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "送信に失敗しました。");
    }
  }

  if (status === "done") {
    return (
      <p className={styles.done} role="status">
        受け付けました。三日以内にデシイリ編集部からご連絡します。
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.row}>
        <label className={styles.field} htmlFor="s-name">
          <span>
            お名前 <em>必須</em>
          </span>
          <input id="s-name" name="name" required maxLength={80} autoComplete="name" />
        </label>
        <label className={styles.field} htmlFor="s-yago">
          <span>
            屋号・お店の名前 <em>必須</em>
          </span>
          <input id="s-yago" name="yago" required maxLength={120} autoComplete="organization" />
        </label>
      </div>
      <div className={styles.row}>
        <label className={styles.field} htmlFor="s-job">
          <span>
            お仕事 <em>必須</em>
          </span>
          <input id="s-job" name="job" required maxLength={120} placeholder="例：畳の新調と表替え" />
        </label>
        <label className={styles.field} htmlFor="s-area">
          <span>
            場所（市町村） <em>必須</em>
          </span>
          <input id="s-area" name="area" required maxLength={120} placeholder="例：藤沢市" />
        </label>
      </div>
      <div className={styles.row}>
        <label className={styles.field} htmlFor="s-email">
          <span>
            メールアドレス <em>必須</em>
          </span>
          <input id="s-email" name="email" type="email" required maxLength={200} autoComplete="email" />
        </label>
        <label className={styles.field} htmlFor="s-tel">
          <span>電話番号</span>
          <input id="s-tel" name="tel" type="tel" maxLength={40} autoComplete="tel" />
        </label>
      </div>
      <label className={styles.field} htmlFor="s-message">
        <span>ひとこと</span>
        <textarea id="s-message" name="message" rows={4} maxLength={2000} placeholder="仕事のこと、取材で見てほしいところなど" />
      </label>

      <div className={styles.hp} aria-hidden="true">
        <label>
          website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className={styles.agree}>
        <input type="checkbox" name="agree" required />
        <span>
          <Link href="/deshiiri/privacy" target="_blank">
            個人情報の取り扱い
          </Link>
          に同意します <em>必須</em>
        </span>
      </label>

      {status === "error" && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={`d-btn ${styles.submit}`} disabled={status === "sending"}>
        {status === "sending" ? "送信しています" : "取材の相談を送る"}
      </button>
    </form>
  );
}
