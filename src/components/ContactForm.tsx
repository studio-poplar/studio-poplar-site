"use client";

import { FormEvent, useState } from "react";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
        <label htmlFor="category">お問い合わせ種別</label>
        <select id="category" name="category" defaultValue="web">
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
        <textarea id="message" name="message" rows={7} required />
      </div>

      <div className={styles.checkboxField}>
        <input type="checkbox" id="privacy" name="privacy" required />
        <label htmlFor="privacy">
          プライバシーポリシーに同意の上、送信します <span className={styles.required}>必須</span>
        </label>
      </div>

      <button type="submit" className={`btn-primary ${styles.submit}`}>
        送信する →
      </button>

      <p className={styles.note} role="status">
        {submitted
          ? "送信フォームは現在準備中です。恐れ入りますが下記メールアドレスへ直接ご連絡ください。"
          : "※ 現在フォームからの送信機能は準備中です。お急ぎの場合は下記メールアドレスへ直接ご連絡ください。"}
      </p>
    </form>
  );
}
