"use client";

import { useActionState } from "react";
import { TRADES, tradeLabel } from "@/lib/deshiiri/trades";
import { createCraftsperson, type FormState } from "./actions";
import styles from "../admin.module.css";

export default function NewCraftspersonForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createCraftsperson, null);
  return (
    <form action={action} className={styles.form}>
      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span>名前（ページに出す名前）</span>
          <input name="displayName" required maxLength={40} placeholder="例 左官 太郎" />
        </label>
        <label className={styles.field}>
          <span>屋号（任意）</span>
          <input name="shopName" maxLength={60} placeholder="例 太郎左官店" />
        </label>
        <label className={styles.field}>
          <span>短い名前（URL）</span>
          <input name="slug" required maxLength={40} pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="例 sakan-taro" />
        </label>
        <label className={styles.field}>
          <span>職種</span>
          <select name="trade" required defaultValue="daiku">
            {TRADES.map((t) => (
              <option key={t} value={t}>
                {tradeLabel(t)}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>市区町村</span>
          <input name="area" required maxLength={40} placeholder="例 横浜市神奈川区" />
        </label>
        <label className={styles.field}>
          <span>代わりに登録した人（任意）</span>
          <input name="proxyRegistrant" maxLength={60} placeholder="例 息子さん（〇〇）" />
        </label>
      </div>
      <label className={styles.field}>
        <span>紹介文（任意・本人に確かめたことだけ）</span>
        <textarea name="intro" rows={3} maxLength={400} />
      </label>
      <div className={styles.meta}>
        <button type="submit" className={styles.button} disabled={pending}>
          {pending ? "登録しています…" : "職人を登録する"}
        </button>
        {state ? (
          <span className={state.ok ? styles.ok : styles.ng} role="status">
            {state.message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
