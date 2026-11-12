import "server-only";
import { createHash, randomInt, randomUUID } from "node:crypto";
import { and, count, desc, eq, gte, isNull, lt, sql } from "drizzle-orm";
import { db, schema } from "@/lib/deshiiri/db";
import { processPhoto } from "@/lib/deshiiri/photos";
import { downloadContent } from "./client";
import {
  GROUP_WINDOW_MS,
  INVITE_FAIL_LIMIT,
  INVITE_TTL_MS,
  MAX_PHOTOS,
  QUESTION_WINDOW_MS,
  awaitingAnswer,
  canTakePhoto,
  joinWords,
  needsQuestion,
} from "./rules";

// LINE で届いたものを「仕事の一日」（works）にまとめる処理（指示書 7章「流れ」1）。
// Neon の HTTP 接続はトランザクションが使えないので、競合は「条件つき UPDATE」と一意制約で防ぐ。

const { craftspeople, inviteCodes, works, workPhotos, lineEvents, events } = schema;
type Craftsperson = typeof craftspeople.$inferSelect;
type Work = typeof works.$inferSelect;

/** ログや記録に LINE の user ID を直接残さないための置き換え。 */
export function hashLineUser(userId: string) {
  return createHash("sha256").update(`deshiiri:${userId}`).digest("hex").slice(0, 32);
}

/** 同じ webhook イベントを2回処理しないよう、初めて見たときだけ true。 */
export async function markEventSeen(webhookEventId: string): Promise<boolean> {
  const rows = await db().insert(lineEvents).values({ webhookEventId }).onConflictDoNothing().returning();
  return rows.length > 0;
}

export async function findByLineUser(userId: string): Promise<Craftsperson | undefined> {
  const [row] = await db().select().from(craftspeople).where(eq(craftspeople.lineUserId, userId)).limit(1);
  return row;
}

// ---------- 招待コード ----------

export type RedeemResult =
  | { ok: true; person: Craftsperson }
  | { ok: false; reason: "invalid" | "expired" | "used" | "too_many" };

export async function redeemInvite(userId: string, code: string, now = new Date()): Promise<RedeemResult> {
  const who = hashLineUser(userId);
  const [{ n }] = await db()
    .select({ n: count() })
    .from(events)
    .where(and(eq(events.kind, "invite_fail"), eq(events.targetId, who), gte(events.at, new Date(now.getTime() - 3600_000))));
  if (n >= INVITE_FAIL_LIMIT) return { ok: false, reason: "too_many" };

  const fail = async (reason: "invalid" | "expired" | "used"): Promise<RedeemResult> => {
    await db().insert(events).values({ kind: "invite_fail", targetId: who });
    return { ok: false, reason };
  };

  const [invite] = await db().select().from(inviteCodes).where(eq(inviteCodes.code, code)).limit(1);
  if (!invite) return fail("invalid");
  if (invite.usedAt) return fail("used");
  if (invite.expiresAt.getTime() < now.getTime()) return fail("expired");

  // 先にコードを使用済みにする（同時に2人が送っても1人だけ通す）。
  const claimed = await db()
    .update(inviteCodes)
    .set({ usedAt: now })
    .where(and(eq(inviteCodes.code, code), isNull(inviteCodes.usedAt)))
    .returning();
  if (claimed.length === 0) return fail("used");

  const linked = await db()
    .update(craftspeople)
    .set({ lineUserId: userId })
    .where(and(eq(craftspeople.id, invite.craftspersonId), isNull(craftspeople.lineUserId)))
    .returning();
  if (linked.length === 0) return fail("used");

  await db().insert(events).values({ kind: "invite_ok", targetId: invite.craftspersonId });
  return { ok: true, person: linked[0] };
}

/** 管理画面から招待コードを出す。6けたの数字、14日有効。前のコードは無効にしない（使われた時点で1つだけ通る）。 */
export async function issueInviteCode(craftspersonId: string, now = new Date()) {
  for (let i = 0; i < 20; i++) {
    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    const rows = await db()
      .insert(inviteCodes)
      .values({ code, craftspersonId, expiresAt: new Date(now.getTime() + INVITE_TTL_MS) })
      .onConflictDoNothing()
      .returning();
    if (rows.length) return rows[0];
  }
  throw new Error("招待コードを作れませんでした");
}

// ---------- 写真と一言のまとめ ----------

async function recentOpenWorks(craftspersonId: string, now: Date): Promise<Work[]> {
  return db()
    .select()
    .from(works)
    .where(
      and(
        eq(works.craftspersonId, craftspersonId),
        eq(works.status, "received"),
        gte(works.updatedAt, new Date(now.getTime() - GROUP_WINDOW_MS)),
      ),
    )
    .orderBy(desc(works.updatedAt))
    .limit(5);
}

/** 写真1枚ぶんの席を取る。取れたら何枚目かを返す。 */
async function claimPhotoSlot(workId: string, now: Date): Promise<number | null> {
  const rows = await db()
    .update(works)
    .set({ photoCount: sql`${works.photoCount} + 1`, updatedAt: now })
    .where(and(eq(works.id, workId), lt(works.photoCount, MAX_PHOTOS)))
    .returning({ photoCount: works.photoCount });
  return rows[0]?.photoCount ?? null;
}

export type PhotoSlot = { work: Work; index: number; overflow: boolean };

/** 届いた写真をどの投稿に入れるかを決め、席を取る。 */
export async function addPhoto(person: Craftsperson, imageSetId: string | null, now = new Date()): Promise<PhotoSlot> {
  let overflow = false;

  // 1. 同じ組（imageSet）がすでにあれば、そこへ。
  if (imageSetId) {
    const [same] = await db().select().from(works).where(eq(works.lineImageSetId, imageSetId)).limit(1);
    if (same) {
      const index = await claimPhotoSlot(same.id, now);
      if (index) return { work: same, index, overflow };
      overflow = true;
    }
  }

  // 2. 10分以内の、まだ入る投稿があればそこへ（先に一言だけ届いていた場合など）。
  for (const candidate of await recentOpenWorks(person.id, now)) {
    if (!canTakePhoto(candidate, overflow ? null : imageSetId, now)) continue;
    const index = await claimPhotoSlot(candidate.id, now);
    if (!index) continue;
    if (imageSetId && !overflow && !candidate.lineImageSetId) {
      await db()
        .update(works)
        .set({ lineImageSetId: imageSetId })
        .where(and(eq(works.id, candidate.id), isNull(works.lineImageSetId)))
        .catch(() => undefined); // 別の投稿がこの組を使っていたら、組の印は付けない
    }
    return { work: candidate, index, overflow };
  }

  // 3. 新しい投稿を作る。同じ組の写真が同時に届いても1件になるよう、組の ID は一意。
  const inserted = await db()
    .insert(works)
    .values({ craftspersonId: person.id, lineImageSetId: overflow ? null : imageSetId, updatedAt: now })
    .onConflictDoNothing()
    .returning();
  let work = inserted[0];
  if (!work && imageSetId) {
    [work] = await db().select().from(works).where(eq(works.lineImageSetId, imageSetId)).limit(1);
  }
  if (!work) throw new Error("投稿を作れませんでした");
  const index = (await claimPhotoSlot(work.id, now)) ?? 1;
  return { work, index, overflow };
}

export type WordsResult =
  | { kind: "answer"; work: Work }
  | { kind: "words"; work: Work; askQuestion: boolean };

/** 届いた一言を投稿にまとめる。質問への答えなら、その投稿に足す。 */
export async function addWords(person: Craftsperson, message: string, now = new Date()): Promise<WordsResult> {
  const recent = await recentOpenWorksForAnswer(person.id, now);
  const waiting = recent.find((w) => awaitingAnswer(w, now));
  if (waiting) {
    const [work] = await db()
      .update(works)
      .set({ ownerWords: joinWords(waiting.ownerWords, message), updatedAt: now })
      .where(eq(works.id, waiting.id))
      .returning();
    return { kind: "answer", work };
  }

  const [target] = await recentOpenWorks(person.id, now);
  let work: Work;
  if (target) {
    [work] = await db()
      .update(works)
      .set({ ownerWords: joinWords(target.ownerWords, message), updatedAt: now })
      .where(eq(works.id, target.id))
      .returning();
  } else {
    [work] = await db()
      .insert(works)
      .values({ craftspersonId: person.id, ownerWords: message.trim(), updatedAt: now })
      .returning();
  }

  const askQuestion = needsQuestion(work.ownerWords, work.ownerQuestionAt);
  if (askQuestion) {
    [work] = await db()
      .update(works)
      .set({ ownerQuestionAt: now, updatedAt: now })
      .where(eq(works.id, work.id))
      .returning();
  }
  return { kind: "words", work, askQuestion };
}

/** 質問の答えを待っている投稿（30分以内）。 */
async function recentOpenWorksForAnswer(craftspersonId: string, now: Date): Promise<Work[]> {
  return db()
    .select()
    .from(works)
    .where(
      and(
        eq(works.craftspersonId, craftspersonId),
        eq(works.status, "received"),
        gte(works.ownerQuestionAt, new Date(now.getTime() - QUESTION_WINDOW_MS)),
      ),
    )
    .orderBy(desc(works.ownerQuestionAt))
    .limit(3);
}

// ---------- 写真の保存（返信のあとで行う） ----------

async function ensureDriveFolder(person: Craftsperson): Promise<string> {
  if (person.driveFolderId) return person.driveFolderId;
  const [fresh] = await db().select({ driveFolderId: craftspeople.driveFolderId }).from(craftspeople).where(eq(craftspeople.id, person.id)).limit(1);
  if (fresh?.driveFolderId) return fresh.driveFolderId;
  const { createFolder } = await import("@/lib/deshiiri/services/drive");
  const id = await createFolder(`${person.displayName}（${person.slug}）`);
  const [row] = await db()
    .update(craftspeople)
    .set({ driveFolderId: id })
    .where(and(eq(craftspeople.id, person.id), isNull(craftspeople.driveFolderId)))
    .returning();
  if (row) return id;
  // 同時に別の写真がフォルダを作っていた場合は、先に保存された方を使い、こちらで作ったフォルダはゴミ箱へ移す。
  const [current] = await db().select().from(craftspeople).where(eq(craftspeople.id, person.id)).limit(1);
  if (current?.driveFolderId && current.driveFolderId !== id) {
    const { trashFile } = await import("@/lib/deshiiri/services/drive");
    await trashFile(id).catch(() => undefined);
    return current.driveFolderId;
  }
  return id;
}

/** LINE から写真を受け取り、縮小・メタデータ削除して、原本をドライブ・表示用を R2 に置く。 */
export async function savePhoto(person: Craftsperson, workId: string, index: number, messageId: string) {
  const raw = await downloadContent(messageId);
  const photo = await processPhoto(raw);

  const { putObject } = await import("@/lib/deshiiri/services/r2");
  const r2Key = `works/${workId}/${index}-${randomUUID().slice(0, 8)}.webp`;
  await putObject(r2Key, photo.display, "image/webp");

  let driveFileId: string | null = null;
  try {
    const { uploadFile } = await import("@/lib/deshiiri/services/drive");
    const folder = await ensureDriveFolder(person);
    const date = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
    driveFileId = await uploadFile(`${date}_${workId.slice(0, 8)}_${index}.jpg`, photo.original, "image/jpeg", folder);
  } catch (e) {
    // 原本の保存に失敗しても、表示用があれば投稿は進められる。編集部が気づけるよう Sentry に送る。
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureException(e, { tags: { step: "drive_original" } });
  }

  await db().insert(workPhotos).values({
    workId,
    r2Key,
    driveFileId,
    width: photo.width,
    height: photo.height,
    sort: index,
  });
}

// ---------- メニューの操作 ----------

export async function toggleVisitOpen(person: Craftsperson): Promise<boolean> {
  const [row] = await db()
    .update(craftspeople)
    .set({ visitOpen: sql`not ${craftspeople.visitOpen}` })
    .where(eq(craftspeople.id, person.id))
    .returning({ visitOpen: craftspeople.visitOpen });
  return row.visitOpen;
}
