"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import styles from "@/components/deshiiri/Form.module.css";
import { submitVisit, type VisitFormState } from "./actions";

export default function VisitForm({ slug, name }: { slug: string; name: string }) {
  const [state, action, pending] = useActionState(submitVisit.bind(null, slug), { status: "idle" } as VisitFormState);
  const [under18, setUnder18] = useState("");
  const err = (k: string) =>
    state.status === "error" && state.fields?.[k] ? (
      <small className={styles.error} role="alert">
        {state.fields[k]}
      </small>
    ) : null;

  if (state.status === "done") {
    return (
      <div className={styles.done} role="status">
        <p>
          <strong>申し込みを受け付けました。</strong>
        </p>
        {state.under18 ? (
          <p>
            保護者の方に、同意のお願いをメールで送りました。保護者の方が同意すると、{name}さんに届きます。
          </p>
        ) : (
          <p>{name}さんにお届けしました。</p>
        )}
        <p>
          受け付けのメールを送りました。{name}さんが「受ける」と返事をしたら、{name}さんからメールで日にちの相談が届きます。
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} action={action}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>
            お名前 <em>必須</em>
          </span>
          <input name="name" required maxLength={40} autoComplete="name" />
          {err("name")}
        </label>
        <label className={styles.field}>
          <span>
            メールアドレス <em>必須</em>
          </span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" />
          {err("email")}
        </label>
      </div>

      <fieldset className={styles.field}>
        <legend>
          18歳未満ですか <em>必須</em>
        </legend>
        <div className={styles.chips}>
          {[
            ["yes", "18歳未満"],
            ["no", "18歳以上"],
          ].map(([v, label]) => (
            <label key={v} className={styles.chip}>
              <input type="radio" name="under18" value={v} required checked={under18 === v} onChange={() => setUnder18(v)} />
              {label}
            </label>
          ))}
        </div>
        {err("under18")}
      </fieldset>

      {under18 === "yes" ? (
        <div className={styles.visit}>
          <p className={styles.note}>
            18歳未満の方は、保護者の方の同意をいただいてから職人さんにお届けします。保護者の方に、同意のお願いのメールを送ります。
          </p>
          <div className={styles.row}>
            <label className={styles.field}>
              <span>
                保護者の方のお名前 <em>必須</em>
              </span>
              <input name="guardianName" required maxLength={40} />
              {err("guardianName")}
            </label>
            <label className={styles.field}>
              <span>
                保護者の方のメールアドレス <em>必須</em>
              </span>
              <input name="guardianEmail" type="email" required maxLength={200} />
              {err("guardianEmail")}
            </label>
          </div>
        </div>
      ) : null}

      <label className={styles.field}>
        <span>学校・学年、またはお仕事</span>
        <input name="schoolOrJob" maxLength={60} placeholder="例：高校2年、大学1年、会社員" />
        {err("schoolOrJob")}
      </label>

      <fieldset className={styles.field}>
        <legend>
          都合のよい時期（3つまで） <em>1つ以上</em>
        </legend>
        <input name="wish1" maxLength={60} placeholder="例：12月の土曜の午前" aria-label="都合のよい時期 1" />
        <input name="wish2" maxLength={60} placeholder="例：冬休み（12月26日〜28日）" aria-label="都合のよい時期 2" />
        <input name="wish3" maxLength={60} placeholder="例：1月の日曜" aria-label="都合のよい時期 3" />
        {err("wish1")}
      </fieldset>

      <label className={styles.field}>
        <span>ひとこと</span>
        <textarea name="message" rows={4} maxLength={400} placeholder="見てみたいこと、聞いてみたいことなど" />
        {err("message")}
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
      {err("agree")}

      <p className={styles.note}>
        メールアドレスは、{name}さんが「受ける」と返事をしたときだけ{name}さんに伝えます。
      </p>

      {state.status === "error" ? (
        <p className={styles.error} role="alert">
          {state.message}
        </p>
      ) : null}

      <button type="submit" className={`d-btn ${styles.submit}`} disabled={pending}>
        {pending ? "送っています" : "見学を申し込む"}
      </button>
    </form>
  );
}
