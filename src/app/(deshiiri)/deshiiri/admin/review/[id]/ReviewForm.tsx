"use client";

import { useActionState } from "react";
import { generateNow, returnWork, saveReview, type ReviewState } from "../actions";
import styles from "../../admin.module.css";

type Props = {
  workId: string;
  status: string;
  title: string;
  body: string;
  editorQuestions: string;
  photos: { id: string; src: string; alt: string; width: number; height: number }[];
  instagram: { kind: string; text: string }[];
};

const KIND = { short: "短め", normal: "ふつう", question: "問いかけ" } as Record<string, string>;
const count = (s: string) => [...s.replace(/\s/g, "")].length;

function Status({ state }: { state: ReviewState }) {
  if (!state) return null;
  return (
    <span className={state.ok ? styles.ok : styles.ng} role="status">
      {state.message}
    </span>
  );
}

export default function ReviewForm(p: Props) {
  const [saved, save, saving] = useActionState<ReviewState, FormData>(saveReview, null);
  const [returned, doReturn, returning] = useActionState<ReviewState, FormData>(returnWork, null);
  const [made, make, making] = useActionState<ReviewState, FormData>(generateNow, null);
  const editable = p.status === "editor_review";
  const igRows = p.instagram.length ? p.instagram : [{ kind: "short", text: "" }, { kind: "normal", text: "" }, { kind: "question", text: "" }];

  return (
    <>
      {p.status === "received" || p.status === "drafting" || p.status === "editor_review" ? (
        <form action={make} className={styles.meta}>
          <input type="hidden" name="workId" value={p.workId} />
          <button type="submit" className={`${styles.button} ${styles.ghost}`} disabled={making}>
            {making ? "下書きを作っています…（1分ほど）" : p.status === "editor_review" ? "下書きを作り直す" : "今すぐ下書きを作る（テスト用）"}
          </button>
          <Status state={made} />
        </form>
      ) : null}

      <form action={save} className={styles.form}>
        <input type="hidden" name="workId" value={p.workId} />
        <label className={styles.field}>
          <span>見出し（{count(p.title)}字・20字以内）</span>
          <input name="title" defaultValue={p.title} maxLength={40} disabled={!editable} />
        </label>
        <label className={styles.field}>
          <span>本文（120〜250字）</span>
          <textarea name="body" defaultValue={p.body} rows={8} disabled={!editable} />
        </label>

        {p.photos.length ? (
          <fieldset className={styles.field}>
            <legend>写真と代替テキスト</legend>
            <div className={styles.altGrid}>
              {p.photos.map((ph) => (
                <label key={ph.id} className={styles.altItem}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- 非公開の写真なので next/image の最適化を通さない */}
                  <img src={ph.src} alt="" width={ph.width} height={ph.height} loading="lazy" />
                  <input type="hidden" name="altId" value={ph.id} />
                  <input name="alt" defaultValue={ph.alt} placeholder="写っているもの" disabled={!editable} />
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        <label className={styles.field}>
          <span>確認したいこと（本人に聞くこと・載せてよいかの確認）</span>
          <textarea name="editorQuestions" defaultValue={p.editorQuestions} rows={3} disabled={!editable} />
        </label>

        <fieldset className={styles.field}>
          <legend>Instagram 用文章（本人に返信で渡す案）</legend>
          {igRows.map((ig, i) => (
            <label key={i} className={styles.field}>
              <span>{KIND[ig.kind] ?? ig.kind}</span>
              <input type="hidden" name="igKind" value={ig.kind} />
              <textarea name="igText" defaultValue={ig.text} rows={4} disabled={!editable} />
            </label>
          ))}
        </fieldset>

        {editable ? (
          <div className={styles.meta}>
            <button type="submit" name="intent" value="proceed" className={styles.button} disabled={saving}>
              この内容で本人確認へ進める
            </button>
            <button type="submit" name="intent" value="save" className={`${styles.button} ${styles.ghost}`} disabled={saving}>
              保存だけする
            </button>
            <Status state={saved} />
          </div>
        ) : (
          <p className={styles.note}>この投稿は今、編集部の確認待ちではないので直せません。</p>
        )}
      </form>

      {editable ? (
        <form action={doReturn} className={`${styles.form} ${styles.section}`}>
          <input type="hidden" name="workId" value={p.workId} />
          <label className={styles.field}>
            <span>差し戻す理由（載せない場合）</span>
            <textarea name="reason" rows={2} placeholder="例 写真にお客様の表札が写っているため" />
          </label>
          <div className={styles.meta}>
            <button type="submit" className={`${styles.button} ${styles.ghost}`} disabled={returning}>
              差し戻す
            </button>
            <Status state={returned} />
          </div>
        </form>
      ) : null}
    </>
  );
}
