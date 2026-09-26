"use client";

import { FormEvent, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/gtag";
import { CONTACT_PREFILL_KEY } from "@/lib/hearing-chat";
import styles from "./ContactForm.module.css";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xoeayveb";

const CATEGORIES = [
  { value: "web", label: "WEB制作について" },
  { value: "app", label: "アプリ制作について" },
  { value: "photo-video", label: "写真・動画撮影について" },
  { value: "other", label: "その他のご相談" },
] as const;

type Status = "idle" | "submitting" | "success" | "error";

// Only ever runs client-side: the page renders this inside <Suspense> with
// useSearchParams, so there is no server HTML to mismatch.
function readChatPrefill(): string {
  try {
    return sessionStorage.getItem(CONTACT_PREFILL_KEY) ?? "";
  } catch {
    return "";
  }
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const params = useSearchParams();
  const categoryParam = params.get("category");
  const defaultCategory = CATEGORIES.some((c) => c.value === categoryParam) ? (categoryParam as string) : "";
  const [message, setMessage] = useState(() =>
    params.get("from") === "chat" ? readChatPrefill() : (params.get("message") ?? "")
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(event.currentTarget),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("success");
        trackEvent("form_submit");
        formRef.current?.reset();
        setMessage("");
        try {
          sessionStorage.removeItem(CONTACT_PREFILL_KEY);
        } catch {
          // ignore
        }
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
      <input type="text" name="_gotcha" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

      <div className={styles.field}>
        <label htmlFor="name">
          お名前 <span className={styles.required}>必須</span>
        </label>
        <input type="text" id="name" name="name" autoComplete="name" required />
      </div>

      <div className={styles.field}>
        <label htmlFor="company">会社名・屋号</label>
        <input type="text" id="company" name="company" autoComplete="organization" />
      </div>

      <div className={styles.field}>
        <label htmlFor="email">
          メールアドレス <span className={styles.required}>必須</span>
        </label>
        <input type="email" id="email" name="email" autoComplete="email" required />
      </div>

      <div className={styles.field}>
        <label htmlFor="category">
          お問い合わせ種別 <span className={styles.required}>必須</span>
        </label>
        <select id="category" name="category" defaultValue={defaultCategory} required>
          <option value="">選択してください</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="message">
          お問い合わせ内容 <span className={styles.required}>必須</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={7}
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>

      <div className={styles.checkboxField}>
        <input type="checkbox" id="privacy" name="privacy" required />
        <label htmlFor="privacy">
          <a href="/privacy" target="_blank" rel="noreferrer noopener">
            プライバシーポリシー
          </a>
          に同意の上、送信します <span className={styles.required}>必須</span>
        </label>
      </div>

      <button type="submit" className={`btn-primary ${styles.submit}`} disabled={status === "submitting"}>
        {status === "submitting" ? (
          "送信中…"
        ) : (
          <>
            送信する<span className="btn-arrow">→</span>
          </>
        )}
      </button>

      <p className={styles.note} role="status">
        {status === "success" && "送信しました。お問い合わせありがとうございます。営業日1〜2日以内にご連絡いたします。"}
        {status === "error" &&
          "送信に失敗しました。お手数ですが下記メールアドレスへ直接ご連絡ください。"}
        {status === "idle" && "※ ご入力いただいた内容は info@studiopoplar.com へ届きます。"}
      </p>
    </form>
  );
}
