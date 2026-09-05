"use client";

import { FormEvent, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/gtag";
import styles from "./ContactForm.module.css";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xoeayveb";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const prefilledMessage = useSearchParams().get("message") ?? "";

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
        <select id="category" name="category" defaultValue="" required>
          <option value="" disabled>
            選択してください
          </option>
          <option value="web">WEB制作について</option>
          <option value="3dweb">3Dモデリング活用WEB制作について</option>
          <option value="app">アプリ制作について</option>
          <option value="other">その他のご相談</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="message">
          お問い合わせ内容 <span className={styles.required}>必須</span>
        </label>
        <textarea id="message" name="message" rows={7} required defaultValue={prefilledMessage} />
      </div>

      <div className={styles.checkboxField}>
        <input type="checkbox" id="privacy" name="privacy" required />
        <label htmlFor="privacy">
          プライバシーポリシーに同意の上、送信します <span className={styles.required}>必須</span>
        </label>
      </div>

      <button type="submit" className={`btn-primary ${styles.submit}`} disabled={status === "submitting"}>
        {status === "submitting" ? "送信中…" : "送信する →"}
      </button>

      <p className={styles.note} role="status">
        {status === "success" && "送信しました。お問い合わせありがとうございます。折り返しご連絡いたします。"}
        {status === "error" &&
          "送信に失敗しました。お手数ですが下記メールアドレスへ直接ご連絡ください。"}
        {status === "idle" && "※ ご入力いただいた内容は info@studiopoplar.com へ届きます。"}
      </p>
    </form>
  );
}
