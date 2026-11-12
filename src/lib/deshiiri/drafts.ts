import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { and, asc, eq, inArray, lt, ne } from "drizzle-orm";
import { db, schema } from "@/lib/deshiiri/db";
import { requireEnv } from "@/lib/deshiiri/env";
import { awaitingAnswer, GROUP_WINDOW_MS } from "@/lib/deshiiri/line/rules";
import { checkDraft, DraftOutput, hasErrors, type DraftProblem } from "@/lib/deshiiri/writing/draft";
import { SYSTEM_PROMPT, userText } from "@/lib/deshiiri/writing/prompt";
import { nextTemplate } from "@/lib/deshiiri/writing/templates";

// 下書きを作る（指示書 7章「流れ」）。
// - 毎晩 22:00：received の投稿をまとめて Message Batches に出し、drafting にする
// - 30分ごと：バッチの結果を取りに行き、editor_review にして編集部に知らせる
// - 失敗したものは1回だけ通常の API で作り直し、それでもだめなら編集部が手で書く
// Claude に渡すのは職人の写真・一言・職種・紹介文・話し方メモだけ（若者の個人情報は渡さない）。

const MODEL = "claude-sonnet-5-5"; // 指示書 3章で指定
const MAX_TOKENS = 8000;
const BATCH_LIMIT = 50;
/** 写真の保存が終わらないまま、これだけ経ったら、保存できた分で進める。 */
const PHOTO_WAIT_MS = 60 * 60 * 1000;

const { works, workPhotos, craftspeople, batchJobs } = schema;
type Work = typeof works.$inferSelect;
type Person = typeof craftspeople.$inferSelect;
type Photo = typeof workPhotos.$inferSelect;

let client: Anthropic | undefined;
const anthropic = () => (client ??= new Anthropic({ apiKey: requireEnv("ANTHROPIC_API_KEY") }));

const format = zodOutputFormat(DraftOutput);
const jsonFormat = { type: "json_schema" as const, schema: format.schema };

// ---------- 対象の選び方 ----------

/** 下書きに回してよい投稿か（まとめの時間が過ぎ、質問の答え待ちでなく、写真の保存が終わっている）。 */
export function readyForDraft(work: Work, savedPhotos: number, now: Date): boolean {
  if (work.status !== "received") return false;
  if (work.photoCount === 0) return false;
  if (now.getTime() - work.updatedAt.getTime() < GROUP_WINDOW_MS) return false;
  if (awaitingAnswer(work, now)) return false;
  if (savedPhotos < work.photoCount && now.getTime() - work.updatedAt.getTime() < PHOTO_WAIT_MS) return false;
  return true;
}

async function loadContext(workIds: string[]) {
  if (!workIds.length) return [];
  const rows = await db()
    .select({ work: works, person: craftspeople })
    .from(works)
    .innerJoin(craftspeople, eq(craftspeople.id, works.craftspersonId))
    .where(inArray(works.id, workIds));
  const photos = await db().select().from(workPhotos).where(inArray(workPhotos.workId, workIds)).orderBy(asc(workPhotos.sort));
  return rows.map((r) => ({ ...r, photos: photos.filter((p) => p.workId === r.work.id) }));
}

// ---------- リクエストの組み立て ----------

async function buildParams(work: Work, person: Person, photos: Photo[]): Promise<Anthropic.MessageCreateParamsNonStreaming> {
  const { getObject } = await import("@/lib/deshiiri/services/r2");
  const images: Anthropic.ImageBlockParam[] = [];
  for (const p of photos) {
    const obj = await getObject(p.r2Key);
    if (!obj) continue;
    images.push({ type: "image", source: { type: "base64", media_type: "image/webp", data: Buffer.from(obj.body).toString("base64") } });
  }
  const template = nextTemplate(person.lastTemplate);
  return {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    output_config: { effort: "medium", format: jsonFormat },
    messages: [
      {
        role: "user",
        content: [
          ...images,
          {
            type: "text",
            text: userText({
              displayName: person.displayName,
              shopName: person.shopName,
              trade: person.trade,
              area: person.area,
              intro: person.intro,
              voiceNotes: person.voiceNotes,
              template,
              ownerWords: work.ownerWords,
              photoCount: images.length,
            }),
          },
        ],
      },
    ],
  };
}

type Parsed = { ok: true; draft: DraftOutput; problems: DraftProblem[] } | { ok: false; reason: string };

function parseMessage(message: { stop_reason: string | null; content: Array<{ type: string; text?: string }> }, work: Work, photoCount: number): Parsed {
  if (message.stop_reason === "refusal") return { ok: false, reason: "AI が下書きを断りました" };
  if (message.stop_reason === "max_tokens") return { ok: false, reason: "下書きが途中で切れました" };
  const text = message.content.find((b) => b.type === "text")?.text;
  if (!text) return { ok: false, reason: "下書きが空でした" };
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, reason: "下書きの形が崩れていました" };
  }
  const parsed = DraftOutput.safeParse(json);
  if (!parsed.success) return { ok: false, reason: "下書きの形が決まりと違いました" };
  const problems = checkDraft(parsed.data, work.ownerWords, photoCount);
  if (hasErrors(problems)) return { ok: false, reason: problems.filter((p) => p.level === "error").map((p) => p.message).join("／") };
  return { ok: true, draft: parsed.data, problems };
}

// ---------- 結果の保存 ----------

async function applyDraft(work: Work, person: Person, photos: Photo[], draft: DraftOutput) {
  await db()
    .update(works)
    .set({
      status: "editor_review",
      draft: { title: draft.title, body: draft.body, alts: draft.alts },
      publicTitle: draft.title,
      publicBody: draft.body,
      instagramTexts: draft.instagram,
      editorQuestions: draft.editor_questions.join("\n") || null,
      template: draft.template === "none" ? null : draft.template,
      updatedAt: new Date(),
    })
    .where(eq(works.id, work.id));
  for (const [i, photo] of photos.entries()) {
    const alt = draft.alts[i];
    if (alt) await db().update(workPhotos).set({ alt }).where(eq(workPhotos.id, photo.id));
  }
  if (draft.template !== "none") {
    await db().update(craftspeople).set({ lastTemplate: draft.template }).where(eq(craftspeople.id, person.id));
  }
}

async function applyFailure(work: Work, reason: string) {
  await db()
    .update(works)
    .set({
      status: "editor_review",
      draft: null,
      editorQuestions: `下書きを作れませんでした（${reason}）。編集部で書いてください。`,
      updatedAt: new Date(),
    })
    .where(eq(works.id, work.id));
}

/** 1件だけ、通常の API で作る（「今すぐ作る」と、バッチで失敗したものの作り直し）。 */
export async function draftNow(workId: string): Promise<{ ok: boolean; reason?: string }> {
  const [ctx] = await loadContext([workId]);
  if (!ctx) return { ok: false, reason: "投稿が見つかりません" };
  const params = await buildParams(ctx.work, ctx.person, ctx.photos);
  await db().update(works).set({ status: "drafting" }).where(eq(works.id, workId));

  let parsed: Parsed;
  try {
    // 安全上の理由で断られたときは、サーバー側で別のモデルに回して続けてもらう。
    const message = await anthropic().beta.messages.create({
      ...params,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    });
    parsed = parseMessage(message, ctx.work, ctx.photos.length);
  } catch (e) {
    parsed = { ok: false, reason: e instanceof Anthropic.APIError ? `API エラー ${e.status}` : "通信に失敗しました" };
  }

  if (parsed.ok) {
    await applyDraft(ctx.work, ctx.person, ctx.photos, parsed.draft);
    return { ok: true };
  }
  await applyFailure(ctx.work, parsed.reason);
  return { ok: false, reason: parsed.reason };
}

// ---------- 夜のまとめ処理 ----------

/** 毎晩 22:00：下書きに回せる投稿をまとめてバッチに出す。 */
export async function submitNightlyBatch(now = new Date()): Promise<{ submitted: number; batchId?: string }> {
  const candidates = await db()
    .select()
    .from(works)
    .where(and(eq(works.status, "received"), lt(works.updatedAt, new Date(now.getTime() - GROUP_WINDOW_MS))))
    .orderBy(asc(works.createdAt))
    .limit(BATCH_LIMIT * 2);
  const saved = candidates.length
    ? await db().select({ workId: workPhotos.workId }).from(workPhotos).where(inArray(workPhotos.workId, candidates.map((w) => w.id)))
    : [];
  const ready = candidates
    .filter((w) => readyForDraft(w, saved.filter((s) => s.workId === w.id).length, now))
    .slice(0, BATCH_LIMIT);
  if (!ready.length) return { submitted: 0 };

  const contexts = await loadContext(ready.map((w) => w.id));
  const requests = await Promise.all(
    contexts.map(async (c) => ({ custom_id: c.work.id, params: await buildParams(c.work, c.person, c.photos) })),
  );
  const batch = await anthropic().messages.batches.create({ requests });
  await db().insert(batchJobs).values({ id: batch.id, workIds: ready.map((w) => w.id), status: batch.processing_status });
  await db()
    .update(works)
    .set({ status: "drafting" })
    .where(inArray(works.id, ready.map((w) => w.id)));
  return { submitted: ready.length, batchId: batch.id };
}

/** 30分ごと：終わったバッチの結果を取り込む。 */
export async function collectBatches(): Promise<{ drafted: number; failed: number }> {
  const open = await db().select().from(batchJobs).where(ne(batchJobs.status, "ended"));
  let drafted = 0;
  let failed = 0;

  for (const job of open) {
    const batch = await anthropic().messages.batches.retrieve(job.id);
    if (batch.processing_status !== "ended") continue;

    const contexts = await loadContext(job.workIds);
    const byId = new Map(contexts.map((c) => [c.work.id, c]));
    const handled = new Set<string>();

    for await (const result of await anthropic().messages.batches.results(job.id)) {
      const ctx = byId.get(result.custom_id);
      if (!ctx || ctx.work.status !== "drafting") continue; // 取り下げ・手書きなどで先に進んだもの
      handled.add(result.custom_id);
      const parsed: Parsed =
        result.result.type === "succeeded"
          ? parseMessage(result.result.message, ctx.work, ctx.photos.length)
          : { ok: false, reason: `バッチで ${result.result.type}` };
      if (parsed.ok) {
        await applyDraft(ctx.work, ctx.person, ctx.photos, parsed.draft);
        drafted++;
      } else {
        // 1回だけ通常の API で作り直す。
        const retry = await draftNow(ctx.work.id);
        if (retry.ok) drafted++;
        else failed++;
      }
    }

    // 結果に出てこなかったもの（まれ）も作り直す。
    for (const c of contexts) {
      if (handled.has(c.work.id) || c.work.status !== "drafting") continue;
      const retry = await draftNow(c.work.id);
      if (retry.ok) drafted++;
      else failed++;
    }

    await db().update(batchJobs).set({ status: "ended", endedAt: new Date() }).where(eq(batchJobs.id, job.id));
  }

  if (drafted + failed > 0) {
    const { notifyEditors } = await import("@/lib/deshiiri/services/mail");
    const site =
      process.env.VERCEL_ENV === "preview"
        ? "https://deshiiri-preview.studiopoplar.com"
        : (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.studiopoplar.com");
    await notifyEditors(
      `【デシイリ】確認待ちが ${drafted + failed} 件あります`,
      `下書きができました：${drafted} 件\n下書きを作れなかったもの（手で書く）：${failed} 件\n\n確認待ちの一覧：${site}/deshiiri/admin/review`,
    ).catch(() => undefined);
  }
  return { drafted, failed };
}
