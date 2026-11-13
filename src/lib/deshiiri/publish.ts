import "server-only";
import type { messagingApi } from "@line/bot-sdk";
import { and, desc, eq, isNull, lt } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { db, schema } from "@/lib/deshiiri/db";
import { push, text } from "@/lib/deshiiri/line/client";
import { MSG } from "@/lib/deshiiri/line/messages";
import { PUBLIC_TAG, personTag } from "@/lib/deshiiri/public-queries";
import { personPath, personUrl } from "@/lib/deshiiri/site";

// 本人確認・公開・取り下げ（指示書 R-3〜R-5、6章）。
// - 本人確認はプッシュ1通（文章とボタンを1回で）
// - 「OK」直後の公開のお知らせと Instagram 用文章は返信で送る（数えない）
// - 24時間返事がなければ公開し、プッシュで知らせる

const { works, craftspeople } = schema;
type Work = typeof works.$inferSelect;
type Person = typeof craftspeople.$inferSelect;

export const AUTO_PUBLISH_MS = 24 * 60 * 60 * 1000;

const KIND_LABEL: Record<string, string> = { short: "短め", normal: "ふつう", question: "問いかけ" };

/** 公開ページを作り直す（職人ページ・職種一覧）。 */
export function refreshPublic(person: Pick<Person, "slug" | "trade">) {
  revalidateTag(personTag(person.slug), { expire: 0 });
  revalidateTag(PUBLIC_TAG, { expire: 0 });
  revalidatePath(personPath(person.slug));
  revalidatePath(`/deshiiri/shokushu/${person.trade}`);
  revalidatePath("/deshiiri/shokushu");
}

const withdrawButton = (work: Work): messagingApi.TemplateMessage => ({
  type: "template",
  altText: "取り下げるときは「取り下げ」と送ってください",
  template: {
    type: "buttons",
    text: "取り下げたいときは、こちらを押してください。",
    actions: [{ type: "postback", label: "取り下げる", data: `action=withdraw&work=${work.id}`, displayText: "取り下げる" }],
  },
});

/** 編集部が「本人確認へ進める」を押したとき：本人に完成形とボタンをプッシュで送る。 */
export async function sendOwnerReview(workId: string) {
  const [row] = await db()
    .select({ work: works, person: craftspeople })
    .from(works)
    .innerJoin(craftspeople, eq(craftspeople.id, works.craftspersonId))
    .where(eq(works.id, workId))
    .limit(1);
  if (!row) throw new Error("投稿が見つかりません");
  const { work, person } = row;
  if (!person.lineUserId) throw new Error("この職人は LINE とつながっていません");

  const preview = `【${work.publicTitle ?? ""}】\n\n${work.publicBody ?? ""}`;
  await push(person.lineUserId, "owner_review", [
    text(MSG.reviewIntro),
    text(preview),
    {
      type: "template",
      altText: MSG.reviewConfirm,
      template: {
        type: "confirm",
        text: MSG.reviewConfirm,
        actions: [
          { type: "postback", label: "OK", data: `action=owner_ok&work=${work.id}`, displayText: "OK" },
          { type: "postback", label: "直したい", data: `action=owner_fix&work=${work.id}`, displayText: "直したい" },
        ],
      },
    },
  ]);
  await db()
    .update(works)
    .set({ status: "owner_review", ownerReviewSentAt: new Date(), ownerFixRequestedAt: null, ownerFixNote: null })
    .where(eq(works.id, work.id));
}

/** 公開する。owner は本人の OK、auto は24時間の自動公開。すでに公開済みなどで動かなかったら null。 */
export async function publishWork(workId: string, by: "owner" | "auto"): Promise<{ work: Work; person: Person } | null> {
  const now = new Date();
  const [work] = await db()
    .update(works)
    .set({ status: "published", publishedAt: now, ownerOkAt: by === "owner" ? now : null, updatedAt: now })
    .where(and(eq(works.id, workId), eq(works.status, "owner_review")))
    .returning();
  if (!work) return null;
  const [person] = await db().select().from(craftspeople).where(eq(craftspeople.id, work.craftspersonId)).limit(1);
  refreshPublic(person);
  return { work, person };
}

/** 「OK」直後の返信に入れるもの：公開のお知らせ＋URL、Instagram 用文章（最大5吹き出し）。 */
export function publishedReply(work: Work, person: Person): messagingApi.Message[] {
  const ig = (work.instagramTexts ?? []).slice(0, 2);
  return [
    text(MSG.published(personUrl(person.slug))),
    ...(ig.length ? [text(MSG.instagramIntro), ...ig.map((i) => text(`（${KIND_LABEL[i.kind] ?? i.kind}）\n${i.text}`))] : []),
    withdrawButton(work),
  ].slice(0, 5);
}

/** 取り下げる（本人がいつでも）。 */
export async function withdrawWork(workId: string, craftspersonId: string): Promise<Work | null> {
  const [work] = await db()
    .update(works)
    .set({ status: "withdrawn", updatedAt: new Date() })
    .where(and(eq(works.id, workId), eq(works.craftspersonId, craftspersonId), eq(works.status, "published")))
    .returning();
  if (!work) return null;
  const [person] = await db().select().from(craftspeople).where(eq(craftspeople.id, craftspersonId)).limit(1);
  refreshPublic(person);
  return work;
}

/** 公開中の記事（新しい順、取り下げの候補に出す）。 */
export async function publishedOf(craftspersonId: string, limit = 3) {
  return db()
    .select()
    .from(works)
    .where(and(eq(works.craftspersonId, craftspersonId), eq(works.status, "published")))
    .orderBy(desc(works.publishedAt))
    .limit(limit);
}

/** 本人が「直したい」を押した。次に届く文字を、この投稿の直してほしい点として受け取る。 */
export async function requestFix(workId: string, craftspersonId: string): Promise<boolean> {
  const rows = await db()
    .update(works)
    .set({ ownerFixRequestedAt: new Date(), ownerFixNote: null })
    .where(and(eq(works.id, workId), eq(works.craftspersonId, craftspersonId), eq(works.status, "owner_review")))
    .returning({ id: works.id });
  return rows.length > 0;
}

/** 「直したい」のあとに届いた文字を受け取り、編集部の確認待ちに戻す。受け取ったら true。 */
export async function takeFixNote(craftspersonId: string, note: string): Promise<boolean> {
  const since = new Date(Date.now() - AUTO_PUBLISH_MS);
  const [work] = await db()
    .select()
    .from(works)
    .where(and(eq(works.craftspersonId, craftspersonId), eq(works.status, "owner_review"), isNull(works.ownerFixNote)))
    .orderBy(desc(works.ownerFixRequestedAt))
    .limit(1);
  if (!work?.ownerFixRequestedAt || work.ownerFixRequestedAt < since) return false;
  await db()
    .update(works)
    .set({ ownerFixNote: note.trim(), status: "editor_review", updatedAt: new Date() })
    .where(eq(works.id, work.id));
  const { notifyEditors } = await import("@/lib/deshiiri/services/mail");
  await notifyEditors("【デシイリ】本人から直してほしい点が届きました", `確認待ちの一覧から開いてください。\n${note.trim().slice(0, 300)}`).catch(
    () => undefined,
  );
  return true;
}

/** 1時間ごと：24時間返事のない本人確認を公開し、プッシュで知らせる。直したいが押されたものは公開しない。 */
export async function autoPublishDue(now = new Date()): Promise<number> {
  const due = await db()
    .select()
    .from(works)
    .where(
      and(
        eq(works.status, "owner_review"),
        lt(works.ownerReviewSentAt, new Date(now.getTime() - AUTO_PUBLISH_MS)),
        isNull(works.ownerFixRequestedAt),
      ),
    );
  let count = 0;
  for (const w of due) {
    const result = await publishWork(w.id, "auto");
    if (!result) continue;
    count++;
    if (result.person.lineUserId) {
      await push(result.person.lineUserId, "auto_published", [
        text(MSG.autoPublished(result.work.publicTitle ?? "", personUrl(result.person.slug))),
      ]).catch(() => undefined);
    }
  }
  return count;
}
