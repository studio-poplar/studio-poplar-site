"use client";

import { useActionState } from "react";
import type { CardInfo, VoiceNotes } from "@/lib/deshiiri/db/schema";
import { TRADES, tradeLabel, type Trade } from "@/lib/deshiiri/trades";
import { updateCraftsperson, type FormState } from "../actions";
import styles from "../../admin.module.css";

type Props = {
  id: string;
  displayName: string;
  shopName: string | null;
  trade: Trade;
  area: string;
  intro: string | null;
  proxyRegistrant: string | null;
  featured: boolean;
  foundingMember: boolean;
  consentAt: string | null;
  voiceNotes: VoiceNotes;
  cardInfo: CardInfo;
};

export default function EditForm(p: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateCraftsperson, null);
  const v = p.voiceNotes;
  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="id" value={p.id} />
      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span>名前</span>
          <input name="displayName" defaultValue={p.displayName} required maxLength={40} />
        </label>
        <label className={styles.field}>
          <span>屋号（任意）</span>
          <input name="shopName" defaultValue={p.shopName ?? ""} maxLength={60} />
        </label>
        <label className={styles.field}>
          <span>職種</span>
          <select name="trade" defaultValue={p.trade}>
            {TRADES.map((t) => (
              <option key={t} value={t}>
                {tradeLabel(t)}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>市区町村</span>
          <input name="area" defaultValue={p.area} required maxLength={40} />
        </label>
        <label className={styles.field}>
          <span>代わりに登録した人（任意）</span>
          <input name="proxyRegistrant" defaultValue={p.proxyRegistrant ?? ""} maxLength={60} />
        </label>
      </div>
      <label className={styles.field}>
        <span>紹介文（本人に確かめたことだけ）</span>
        <textarea name="intro" defaultValue={p.intro ?? ""} rows={3} maxLength={400} />
      </label>
      <label className={styles.check}>
        <input type="checkbox" name="featured" defaultChecked={p.featured} /> 職種一覧で先頭に出す（編集部が選んだ人）
      </label>
      <label className={styles.check}>
        <input type="checkbox" name="consented" defaultChecked={Boolean(p.consentAt)} /> 規約への同意をもらった
        {p.consentAt ? `（${p.consentAt} に記録）` : "（入れると、保存した日時を記録します）"}
      </label>
      <label className={styles.check}>
        <input type="checkbox" name="foundingMember" defaultChecked={p.foundingMember} /> 創業メンバー
      </label>

      <fieldset className={styles.field}>
        <legend>話し方メモ（Instagram 用文章に反映します）</legend>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span>一人称</span>
            <input name="firstPerson" defaultValue={v.firstPerson ?? ""} placeholder="例 自分／うち／俺" maxLength={20} />
          </label>
          <label className={styles.field}>
            <span>語尾</span>
            <input name="endings" defaultValue={v.endings ?? ""} placeholder="例 〜だね、〜です" maxLength={60} />
          </label>
          <label className={styles.field}>
            <span>方言</span>
            <input name="dialect" defaultValue={v.dialect ?? ""} placeholder="例 少し横浜ことば" maxLength={60} />
          </label>
          <label className={styles.field}>
            <span>口癖</span>
            <input name="habits" defaultValue={v.habits ?? ""} placeholder="例 「まあ、」から話し始める" maxLength={120} />
          </label>
          <label className={styles.field}>
            <span>絵文字</span>
            <select name="emoji" defaultValue={v.emoji === true ? "yes" : v.emoji === false ? "no" : ""}>
              <option value="">わからない</option>
              <option value="yes">使う</option>
              <option value="no">使わない</option>
            </select>
          </label>
        </div>
        <label className={styles.field}>
          <span>そのほかのメモ</span>
          <textarea name="memo" defaultValue={v.memo ?? ""} rows={2} maxLength={300} />
        </label>
      </fieldset>

      <fieldset className={styles.field}>
        <legend>職人ページの名刺（公開してよいものだけ）</legend>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span>電話（任意）</span>
            <input name="phone" defaultValue={p.cardInfo.phone ?? ""} maxLength={30} />
          </label>
          <label className={styles.field}>
            <span>営業時間（任意）</span>
            <input name="hours" defaultValue={p.cardInfo.hours ?? ""} maxLength={60} />
          </label>
          <label className={styles.field}>
            <span>ウェブサイト（任意）</span>
            <input name="website" defaultValue={p.cardInfo.website ?? ""} maxLength={200} />
          </label>
          <label className={styles.field}>
            <span>Instagram（任意）</span>
            <input name="instagram" defaultValue={p.cardInfo.instagram ?? ""} placeholder="@なし" maxLength={60} />
          </label>
        </div>
      </fieldset>

      <div className={styles.meta}>
        <button type="submit" className={styles.button} disabled={pending}>
          {pending ? "保存しています…" : "保存する"}
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
