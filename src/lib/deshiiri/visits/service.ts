import "server-only";
import * as Sentry from "@sentry/nextjs";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/lib/deshiiri/db";
import { push } from "@/lib/deshiiri/line/client";
import { notifyEditors, sendMail } from "@/lib/deshiiri/services/mail";
import { siteOrigin } from "@/lib/deshiiri/site";
import { dueAction, hashToken, newConsentToken, wishesOf, type VisitInput } from "./rules";
import {
  acceptedMail,
  consentedMail,
  guardianMail,
  notArrangedMail,
  receivedMail,
  visitNotice,
  type Mail,
  type PersonView,
  type VisitView,
} from "./texts";

// 見学の申し込み（指示書 R-6）。状態は visit_requests.status で進める：
//   waiting_guardian（18歳未満・保護者待ち）→ sent（職人に届いた）→ accepted（受けた、visit_date で日が決まった）→ done
//                                                                 → declined（見送り） / no_answer（返事なし・同意なし）
// neon-http にはトランザクションがないので、状態の変更は「今の状態が X のときだけ更新」で二重処理を防ぐ。

const { visitRequests: vr, craftspeople: cp } = schema;
type Visit = typeof vr.$inferSelect;
type Person = typeof cp.$inferSelect;

const view = (v: Visit): VisitView => ({ ...v, wishes: v.wishes });
const personView = (p: Person): PersonView => p;

function editorReplyTo() {
  return process.env.EDITOR_NOTIFY_EMAIL?.split(",")[0]?.trim() || undefined;
}

async function mail(m: Mail) {
  await sendMail({ to: m.to.filter(Boolean), subject: m.subject, text: m.text, replyTo: editorReplyTo() });
}

/** 失敗しても申し込みそのものは止めない仕事（メールなど）。Sentry には中身を出さずに残す。 */
async function softly(what: string, task: () => Promise<unknown>) {
  try {
    await task();
  } catch (e) {
    Sentry.captureException(e, { tags: { area: "deshiiri-visit", step: what } });
  }
}

export const consentUrl = (token: string) => `${siteOrigin()}/deshiiri/visit/consent/${token}`;

/** 職人の LINE に申し込みを届ける（プッシュ1通）。 */
async function notifyCraftsperson(v: Visit, p: Person, reminder = false) {
  if (!p.lineUserId) {
    await notifyEditors("【デシイリ】見学の申し込みを LINE で届けられませんでした", `職人：${p.displayName}\nこの職人は LINE とつながっていません。管理画面の「見学の進行」から手で連絡してください。\n${siteOrigin()}/deshiiri/admin/visits`);
    return false;
  }
  await push(p.lineUserId, reminder ? "visit_remind" : "visit_request", visitNotice(view(v), reminder));
  return true;
}

async function deliverToCraftsperson(v: Visit, p: Person) {
  const ok = await notifyCraftsperson(v, p);
  if (ok) await db().update(vr).set({ notifiedAt: new Date() }).where(eq(vr.id, v.id));
}

export type CreateResult = { ok: true; under18: boolean } | { ok: false; error: string };

/** S-3 の送信。職人が受付を止めていたら受け付けない。 */
export async function createVisit(slug: string, d: VisitInput, later: (task: () => Promise<void>) => void): Promise<CreateResult> {
  const [p] = await db().select().from(cp).where(eq(cp.slug, slug)).limit(1);
  if (!p) return { ok: false, error: "職人が見つかりません。" };
  if (!p.visitOpen) return { ok: false, error: "この職人は、いま見学の受付を休んでいます。" };

  const under18 = d.under18 === "yes";
  const token = under18 ? newConsentToken() : null;
  const [v] = await db()
    .insert(vr)
    .values({
      craftspersonId: p.id,
      name: d.name,
      email: d.email,
      under18,
      guardianName: under18 ? d.guardianName : null,
      guardianEmail: under18 ? d.guardianEmail : null,
      guardianToken: token?.hash ?? null,
      schoolOrJob: d.schoolOrJob || null,
      wishes: wishesOf(d),
      message: d.message || null,
      status: under18 ? "waiting_guardian" : "sent",
    })
    .returning();
  await db().insert(schema.events).values({ kind: "visit_submit", targetId: p.id });

  // メールと LINE は画面を返したあとで送る（若者を待たせない）。
  later(async () => {
    await softly("received_mail", () => mail(receivedMail(view(v), personView(p))));
    if (token) await softly("guardian_mail", () => mail(guardianMail(view(v), personView(p), consentUrl(token.token))));
    else await softly("notify", () => deliverToCraftsperson(v, p));
    await softly("editors", () =>
      notifyEditors(
        "【デシイリ】見学の申し込みが届きました",
        `職人：${p.displayName}\n${under18 ? "18歳未満のため、保護者の同意待ちです。" : "職人の LINE に届けました。"}\n${siteOrigin()}/deshiiri/admin/visits`,
      ),
    );
  });
  return { ok: true, under18 };
}

/** 保護者の同意ページで見せる中身。リンクが古い・違うときは null。 */
export async function findByConsentToken(token: string) {
  const [row] = await db()
    .select({ visit: vr, person: cp })
    .from(vr)
    .innerJoin(cp, eq(cp.id, vr.craftspersonId))
    .where(eq(vr.guardianToken, hashToken(token)))
    .limit(1);
  return row ?? null;
}

/** 保護者の「同意する」「同意しない」。同意したら職人に届ける。 */
export async function answerConsent(token: string, agree: boolean): Promise<"agreed" | "refused" | "gone"> {
  const row = await findByConsentToken(token);
  if (!row) return "gone";
  const now = new Date();
  const [v] = await db()
    .update(vr)
    .set(agree ? { status: "sent", guardianConsentAt: now } : { status: "declined", decidedAt: now })
    .where(and(eq(vr.id, row.visit.id), eq(vr.status, "waiting_guardian")))
    .returning();
  if (!v) return "gone";
  if (!agree) return "refused";
  await softly("notify", () => deliverToCraftsperson(v, row.person));
  await softly("consented_mail", () => mail(consentedMail(view(v), personView(row.person))));
  return "agreed";
}

/** 職人の「受ける」「今回は見送る」。その職人あての、返事待ちの申し込みだけを動かす。 */
export async function answerVisit(visitId: string, craftspersonId: string, accept: boolean) {
  if (!/^[0-9a-f-]{36}$/.test(visitId)) return null;
  const [v] = await db()
    .update(vr)
    .set({ status: accept ? "accepted" : "declined", decidedAt: new Date() })
    .where(and(eq(vr.id, visitId), eq(vr.craftspersonId, craftspersonId), eq(vr.status, "sent")))
    .returning();
  if (!v) return null;
  const [p] = await db().select().from(cp).where(eq(cp.id, craftspersonId)).limit(1);
  await softly(accept ? "accepted_mail" : "declined_mail", () =>
    mail(accept ? acceptedMail(view(v), personView(p)) : notArrangedMail(view(v), personView(p))),
  );
  return view(v);
}

/** 「日が決まった」。受けた申し込みにだけ記録できる（決め直しも可）。 */
export async function recordVisitDate(visitId: string, craftspersonId: string | null, date: Date) {
  if (!/^[0-9a-f-]{36}$/.test(visitId)) return null;
  const where = [eq(vr.id, visitId), eq(vr.status, "accepted")];
  if (craftspersonId) where.push(eq(vr.craftspersonId, craftspersonId));
  const [v] = await db().update(vr).set({ visitDate: date }).where(and(...where)).returning();
  return v ?? null;
}

/** 管理画面（S-6）：実施済みにする。 */
export async function markVisitDone(visitId: string) {
  const [v] = await db()
    .update(vr)
    .set({ status: "done" })
    .where(and(eq(vr.id, visitId), eq(vr.status, "accepted")))
    .returning();
  return v ?? null;
}

/** 1時間ごと：3日で1回だけ知らせ直す／7日で不成立にして若者に知らせる。 */
export async function visitsDue(now = new Date()) {
  const open = await db()
    .select({ visit: vr, person: cp })
    .from(vr)
    .innerJoin(cp, eq(cp.id, vr.craftspersonId))
    .where(inArray(vr.status, ["waiting_guardian", "sent"]));
  const result = { reminded: 0, expired: 0 };
  for (const { visit, person } of open) {
    const due = dueAction(visit, now);
    if (due === "remind") {
      const [v] = await db()
        .update(vr)
        .set({ remindedAt: now })
        .where(and(eq(vr.id, visit.id), eq(vr.status, "sent")))
        .returning();
      if (v) {
        await softly("remind", () => notifyCraftsperson(v, person, true));
        result.reminded++;
      }
    } else if (due === "expire" || due === "expire_guardian") {
      const [v] = await db()
        .update(vr)
        .set({ status: "no_answer", decidedAt: now })
        .where(and(eq(vr.id, visit.id), eq(vr.status, visit.status)))
        .returning();
      if (v) {
        await softly("not_arranged_mail", () => mail(notArrangedMail(view(v), personView(person))));
        result.expired++;
      }
    }
  }
  return result;
}

/** 管理画面（S-6）の一覧。新しい順に 200 件。 */
export async function listVisits() {
  return db()
    .select({ visit: vr, person: { id: cp.id, displayName: cp.displayName, slug: cp.slug, trade: cp.trade } })
    .from(vr)
    .innerJoin(cp, eq(cp.id, vr.craftspersonId))
    .orderBy(desc(vr.createdAt))
    .limit(200);
}
