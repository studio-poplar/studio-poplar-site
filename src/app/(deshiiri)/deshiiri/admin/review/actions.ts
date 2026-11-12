"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { assertAdmin } from "@/lib/deshiiri/admin-auth";
import { db, schema } from "@/lib/deshiiri/db";
import { draftNow } from "@/lib/deshiiri/drafts";
import { findBannedWords } from "@/lib/deshiiri/writing/banned-words";

// S-5 確認待ち（指示書 M2）。編集部が下書きを直し、本人確認へ進めるか差し戻す。
// 本人への LINE 送信は M3 で足す（ここでは状態を owner_review にするまで）。

export type ReviewState = { ok: boolean; message: string } | null;

const Edit = z.object({
  workId: z.string().uuid(),
  title: z.string().trim().min(1, "見出しを入れてください").max(40),
  body: z.string().trim().min(1, "本文を入れてください").max(1000),
  editorQuestions: z.string().trim().max(1000).optional(),
});

function readEdit(form: FormData) {
  const parsed = Edit.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "入力を確かめてください" } as const;
  const alts = form.getAll("alt").map(String);
  const altIds = form.getAll("altId").map(String);
  const instagram = form
    .getAll("igText")
    .map(String)
    .map((text, i) => ({ kind: String(form.getAll("igKind")[i] ?? "normal") as "short" | "normal" | "question", text: text.trim() }))
    .filter((x) => x.text);
  return { value: { ...parsed.data, alts, altIds, instagram } } as const;
}

async function save(v: NonNullable<ReturnType<typeof readEdit>["value"]>) {
  const [work] = await db().select().from(schema.works).where(eq(schema.works.id, v.workId)).limit(1);
  if (!work) throw new Error("not found");
  await db()
    .update(schema.works)
    .set({
      publicTitle: v.title,
      publicBody: v.body,
      instagramTexts: v.instagram,
      editorQuestions: v.editorQuestions || null,
      updatedAt: new Date(),
    })
    .where(eq(schema.works.id, v.workId));
  for (const [i, id] of v.altIds.entries()) {
    await db().update(schema.workPhotos).set({ alt: v.alts[i] ?? "" }).where(eq(schema.workPhotos.id, id));
  }
  return work;
}

export async function saveReview(_prev: ReviewState, form: FormData): Promise<ReviewState> {
  const editor = await assertAdmin();
  const r = readEdit(form);
  if (!r.value) return { ok: false, message: r.error ?? "入力を確かめてください" };
  const intent = String(form.get("intent") ?? "save");

  if (intent === "proceed") {
    const banned = findBannedWords([r.value.title, r.value.body, ...r.value.alts, ...r.value.instagram.map((i) => i.text)].join("\n"));
    if (banned.length) return { ok: false, message: `使わない言葉が入っています：${banned.join("、")}` };
  }

  const work = await save(r.value);
  if (intent === "proceed") {
    if (work.status !== "editor_review") return { ok: false, message: "この投稿は確認待ちではありません" };
    await db().update(schema.works).set({ status: "owner_review", reviewer: editor }).where(eq(schema.works.id, work.id));
    revalidatePath("/deshiiri/admin/review");
    return { ok: true, message: "本人確認へ進めました（LINE での本人確認は M3 でつなぎます）" };
  }
  revalidatePath(`/deshiiri/admin/review/${work.id}`);
  return { ok: true, message: "保存しました" };
}

export async function returnWork(_prev: ReviewState, form: FormData): Promise<ReviewState> {
  const editor = await assertAdmin();
  const workId = z.string().uuid().parse(form.get("workId"));
  const reason = String(form.get("reason") ?? "").trim();
  if (!reason) return { ok: false, message: "差し戻す理由を書いてください" };
  await db()
    .update(schema.works)
    .set({ status: "returned", returnReason: reason, reviewer: editor, updatedAt: new Date() })
    .where(eq(schema.works.id, workId));
  revalidatePath("/deshiiri/admin/review");
  return { ok: true, message: "差し戻しました" };
}

/** テスト用（管理画面のみ）：夜を待たずに、この投稿の下書きを今すぐ作る。 */
export async function generateNow(_prev: ReviewState, form: FormData): Promise<ReviewState> {
  await assertAdmin();
  const workId = z.string().uuid().parse(form.get("workId"));
  const result = await draftNow(workId);
  revalidatePath(`/deshiiri/admin/review/${workId}`);
  return result.ok ? { ok: true, message: "下書きを作りました" } : { ok: false, message: `作れませんでした：${result.reason}` };
}
