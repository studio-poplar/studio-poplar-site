"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { EDITORIAL_TOPICS, type EditorialTopic } from "@/lib/deshiiri/codes";
import styles from "./Form.module.css";

const TOPICS = Object.keys(EDITORIAL_TOPICS) as EditorialTopic[];

// デシイリ編集部へのお問い合わせ（取材を受けたい／協賛／そのほか）。送信先は連絡フォームと同じ API。
export default function EditorialForm({ initialTopic = "shuzai" }: { initialTopic?: EditorialTopic }) {
  const [topic, setTopic] = useState<EditorialTopic>(TOPICS.includes(initialTopic) ? initialTopic : "shuzai");
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
          kind: "editorial",
          topic,
          name: form.get("name"),
          org: form.get("org") ?? "",
          email: form.get("email"),
          tel: form.get("tel") ?? "",
          message: form.get("message"),
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

  const placeholder =
    topic === "shuzai"
      ? "お仕事の内容、場所、取材で見てほしいところなど"
      : topic === "sponsor"
        ? "協賛を考えている記事や地域、ご希望など"
        : "お問い合わせの内容";

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <fieldset className={styles.field}>
        <legend>
          お問い合わせの種類 <em>必須</em>
        </legend>
        <div className={styles.chips}>
          {TOPICS.map((key) => (
            <label key={key} className={styles.chip}>
              <input type="radio" name="topic" value={key} checked={topic === key} onChange={() => setTopic(key)} />
              {EDITORIAL_TOPICS[key]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.row}>
        <label className={styles.field} htmlFor="e-name">
          <span>
            お名前 <em>必須</em>
          </span>
          <input id="e-name" name="name" required maxLength={80} autoComplete="name" />
        </label>
        <label className={styles.field} htmlFor="e-org">
          <span>{topic === "shuzai" ? "屋号・お店の名前" : "会社名・屋号"}</span>
          <input id="e-org" name="org" maxLength={120} autoComplete="organization" />
        </label>
      </div>
      <div className={styles.row}>
        <label className={styles.field} htmlFor="e-email">
          <span>
            メールアドレス <em>必須</em>
          </span>
          <input id="e-email" name="email" type="email" required maxLength={200} autoComplete="email" />
        </label>
        <label className={styles.field} htmlFor="e-tel">
          <span>電話番号</span>
          <input id="e-tel" name="tel" type="tel" maxLength={40} autoComplete="tel" />
        </label>
      </div>
      <label className={styles.field} htmlFor="e-message">
        <span>
          内容 <em>必須</em>
        </span>
        <textarea id="e-message" name="message" rows={5} required maxLength={2000} placeholder={placeholder} />
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
        {status === "sending" ? "送信しています" : "送信する"}
      </button>
    </form>
  );
}
