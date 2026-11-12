import Link from "next/link";
import SectionHead from "@/components/deshiiri/SectionHead";
import { requireAdminPage } from "@/lib/deshiiri/admin-auth";
import { fmtDay, statusLabel } from "@/lib/deshiiri/visits/rules";
import { listVisits } from "@/lib/deshiiri/visits/service";
import { setVisitDate, setVisitDone } from "./actions";
import styles from "../admin.module.css";

// S-6 見学の進行：申込み → 保護者待ち → 届いた → 受けた → 日が決まった → 実施。
// 若者の連絡先はここ（編集部だけ）と、職人が「受ける」を押したときの LINE の返信にしか出さない。

const STEPS = ["申し込み", "保護者の同意", "職人に届いた", "受けた", "日が決まった", "実施"] as const;

function stepOf(status: string, hasDate: boolean, under18: boolean): number {
  if (status === "waiting_guardian") return 1;
  if (status === "sent") return 2;
  if (status === "accepted") return hasDate ? 4 : 3;
  if (status === "done") return 5;
  return under18 ? 1 : 0;
}

const fmt = (d: Date | null) =>
  d ? d.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
const ymd = (d: Date | null) => (d ? new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(d) : "");

export default async function VisitsPage() {
  await requireAdminPage();
  const rows = await listVisits();
  const openRows = rows.filter((r) => ["waiting_guardian", "sent", "accepted"].includes(r.visit.status));
  const closedRows = rows.filter((r) => !openRows.includes(r));

  const card = ({ visit: v, person: p }: (typeof rows)[number]) => {
    const now = stepOf(v.status, Boolean(v.visitDate), v.under18);
    const ended = v.status === "declined" || v.status === "no_answer";
    return (
      <article key={v.id} className={styles.card}>
        <h3>
          {p.displayName} ← {v.name}
          <small>{[v.under18 ? "18歳未満" : "", v.schoolOrJob ?? ""].filter(Boolean).join("・")}</small>
        </h3>
        <ol className={styles.flow} aria-label="進み具合">
          {STEPS.map((s, i) =>
            i === 1 && !v.under18 ? null : (
              <li key={s} data-state={ended ? (i <= now ? "done" : "off") : i < now ? "done" : i === now ? "now" : "off"}>
                {s}
              </li>
            ),
          )}
        </ol>
        <p>
          <strong>{statusLabel(v.status, Boolean(v.visitDate))}</strong>
          {v.visitDate ? `：${fmtDay(v.visitDate)}` : ""}
        </p>
        <p className={styles.note}>
          希望の時期：{v.wishes.join("／")}
          {v.message ? <><br />ひとこと：{v.message}</> : null}
        </p>
        <p className={styles.note}>
          申し込み {fmt(v.createdAt)}
          {v.under18 ? `／保護者の同意 ${fmt(v.guardianConsentAt)}` : ""}／職人に届いた {fmt(v.notifiedAt)}
          {v.remindedAt ? `／再通知 ${fmt(v.remindedAt)}` : ""}／返事 {fmt(v.decidedAt)}
        </p>
        <details>
          <summary>連絡先（編集部だけが見られます）</summary>
          <p className={styles.note}>
            {v.email}
            {v.under18 ? `／保護者：${v.guardianName ?? ""} ${v.guardianEmail ?? ""}` : ""}
          </p>
        </details>
        {v.status === "accepted" ? (
          <div className={styles.inline}>
            <form action={setVisitDate}>
              <input type="hidden" name="id" value={v.id} />
              <label>
                見学の日 <input type="date" name="date" defaultValue={ymd(v.visitDate)} required />
              </label>
              <button type="submit" className={`${styles.button} ${styles.ghost}`}>
                記録する
              </button>
            </form>
            {v.visitDate ? (
              <form action={setVisitDone}>
                <input type="hidden" name="id" value={v.id} />
                <button type="submit" className={styles.button}>
                  実施済みにする
                </button>
              </form>
            ) : null}
          </div>
        ) : null}
      </article>
    );
  };

  return (
    <div className={`d-wrap ${styles.page}`}>
      <p className={styles.crumb}>
        <Link href="/deshiiri/admin">編集部</Link> / 見学の進行
      </p>
      <SectionHead as="h1" eyebrow="VISITS" title="見学の進行" />
      <p className={styles.note}>
        職人の返事がないときは3日後に1回だけ知らせ直し、7日たつと「調整がつかなかった」にして申し込んだ人にメールします（1時間ごと）。
        日にちの相談は職人と申し込んだ人とのメールで進みます。困っていそうなときだけ、編集部から連絡してください。
      </p>
      <section className={styles.section}>
        <h2>進行中（{openRows.length}）</h2>
        {openRows.length ? <div className={styles.cards}>{openRows.map(card)}</div> : <p className={styles.note}>ありません。</p>}
      </section>
      <section className={styles.section}>
        <h2>終わったもの（{closedRows.length}）</h2>
        {closedRows.length ? <div className={styles.cards}>{closedRows.map(card)}</div> : <p className={styles.note}>ありません。</p>}
      </section>
    </div>
  );
}
