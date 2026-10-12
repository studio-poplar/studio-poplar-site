"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { AGE_GROUPS, CONTACT_PURPOSES, type ContactPurpose } from "@/lib/deshiiri/codes";
import styles from "./Form.module.css";

export type ContactPerson = {
  id: string;
  yago: string;
  label: string; // 「大工／横浜市戸塚区」
  contact: Record<ContactPurpose, boolean>;
};

type Props = {
  people: ContactPerson[];
  initialTo?: string;
  // Article slug the reader came from, sent with the mail and the analytics event.
  from?: string;
  // On an article or craftsperson page the craftsperson is fixed, so no picker is shown.
  lockTo?: boolean;
  idPrefix?: string;
};

const PURPOSES = Object.keys(CONTACT_PURPOSES) as ContactPurpose[];

export default function ContactForm({ people, initialTo = "", from = "", lockTo = false, idPrefix = "c" }: Props) {
  const router = useRouter();
  const [to, setTo] = useState(people.some((p) => p.id === initialTo) ? initialTo : "");
  const person = people.find((p) => p.id === to);
  const allowed = PURPOSES.filter((key) => !person || person.contact[key]);
  const [purpose, setPurpose] = useState<ContactPurpose>(allowed.includes("hanashi") ? "hanashi" : allowed[0]);
  const [age, setAge] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  const activePurpose = allowed.includes(purpose) ? purpose : allowed[0];
  const needsVisitInfo = activePurpose === "kengaku" || activePurpose === "deshiiri";
  const id = (name: string) => `${idPrefix}-${name}`;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!to) {
      setStatus("error");
      setError("連絡したい職人を選んでください。");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/deshiiri/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "contact",
          to,
          purpose: activePurpose,
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message") ?? "",
          age: needsVisitInfo ? age || undefined : undefined,
          dates: needsVisitInfo ? (form.get("dates") ?? "") : "",
          from,
          agree: form.get("agree") === "on",
          website: form.get("website") ?? "",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "送信に失敗しました。時間をおいてお試しください。");
      track("deshiiri_contact", { shokunin: to, purpose: activePurpose, from: from || "(none)" });
      router.push("/deshiiri/contact/thanks");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "送信に失敗しました。");
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate={false}>
      {!lockTo && (
        <label className={styles.field} htmlFor={id("to")}>
          <span>
            連絡したい職人 <em>必須</em>
          </span>
          <select id={id("to")} value={to} onChange={(e) => setTo(e.target.value)} required>
            <option value="">選んでください</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.yago}（{p.label}）
              </option>
            ))}
          </select>
        </label>
      )}

      <fieldset className={styles.field}>
        <legend>
          用件 <em>必須</em>
        </legend>
        <div className={styles.chips}>
          {allowed.map((key) => (
            <label key={key} className={styles.chip}>
              <input
                type="radio"
                name="purpose"
                value={key}
                checked={activePurpose === key}
                onChange={() => setPurpose(key)}
              />
              {CONTACT_PURPOSES[key]}
            </label>
          ))}
        </div>
      </fieldset>

      {needsVisitInfo && (
        <div className={styles.visit}>
          <fieldset className={styles.field}>
            <legend>
              年代 <em>必須</em>
            </legend>
            <div className={styles.chips}>
              {AGE_GROUPS.map((g) => (
                <label key={g} className={styles.chip}>
                  <input type="radio" name="age" value={g} checked={age === g} onChange={() => setAge(g)} required />
                  {g}
                </label>
              ))}
            </div>
          </fieldset>
          {age === "10代" && (
            <p className={styles.note}>
              10代の方は、見学や弟子入りの相談の前に、保護者の方の同意をもらってください。編集部からの返信のときに、保護者の方の同意を確認します。
            </p>
          )}
          <label className={styles.field} htmlFor={id("dates")}>
            <span>行けそうな日</span>
            <input id={id("dates")} name="dates" placeholder="例：11月の土曜の午前" maxLength={300} />
          </label>
        </div>
      )}

      <div className={styles.row}>
        <label className={styles.field} htmlFor={id("name")}>
          <span>
            お名前 <em>必須</em>
          </span>
          <input id={id("name")} name="name" required maxLength={80} autoComplete="name" />
        </label>
        <label className={styles.field} htmlFor={id("email")}>
          <span>
            メールアドレス <em>必須</em>
          </span>
          <input id={id("email")} name="email" type="email" required maxLength={200} autoComplete="email" />
        </label>
      </div>

      <label className={styles.field} htmlFor={id("message")}>
        <span>ひとこと</span>
        <textarea id={id("message")} name="message" rows={4} maxLength={2000} />
      </label>

      {/* honeypot: hidden from people, filled in by bots */}
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
