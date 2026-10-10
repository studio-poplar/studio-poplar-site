import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  FALLBACK_ACK,
  MAX_FREE_TEXT_LENGTH,
  MAX_USER_TURNS,
  TOTAL_QUESTIONS,
  getQuestion,
  type BusinessStage,
} from "@/lib/hearing-chat";
import { guardFreeText } from "@/lib/hearing-chat-guard";

export const runtime = "nodejs";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xoeayveb";
const SHEETS_WEBHOOK_URL = process.env.HEARING_CHAT_SHEETS_WEBHOOK_URL;
const MODEL = process.env.HEARING_CHAT_MODEL || "claude-haiku-4-5-20251001";

// Best-effort in-memory throttles. They reset on cold start and are per
// instance — a pragmatic guard given the project has no shared KV/Redis store
// today, not a hard distributed rate limit. Everything here is counted on the
// server: nothing the client sends (userTurnCount etc.) can lift a limit.
const HOUR_MS = 60 * 60 * 1000;

// A full session makes at most one reflect call per free-text question plus
// one follow-up each, so this allows three complete sessions per IP per hour.
const REFLECTS_PER_SESSION = (TOTAL_QUESTIONS - 1) * 2;
const REFLECTS_PER_IP_PER_HOUR = REFLECTS_PER_SESSION * 3;
// Ceiling on Claude calls per instance per hour across all visitors. Past it,
// visitors get the fixed acknowledgment instead — the chat keeps working, only
// the API spend stops.
const MODEL_CALLS_PER_HOUR = 200;
const NOTIFIES_PER_IP_PER_HOUR = 3;
const MAX_TRACKED_IPS = 5000;

const reflectLog = new Map<string, number[]>();
const notifyLog = new Map<string, number[]>();
let modelCallLog: number[] = [];

function recentWithin(times: number[], now: number): number[] {
  return times.filter((t) => t > now - HOUR_MS);
}

// Records a hit and reports whether it was within the limit.
function allowHit(log: Map<string, number[]>, key: string, limit: number): boolean {
  const now = Date.now();
  if (log.size > MAX_TRACKED_IPS) {
    for (const [k, times] of log) {
      if (recentWithin(times, now).length === 0) log.delete(k);
    }
  }
  const recent = recentWithin(log.get(key) ?? [], now);
  if (recent.length >= limit) {
    log.set(key, recent);
    return false;
  }
  recent.push(now);
  log.set(key, recent);
  return true;
}

function allowModelCall(): boolean {
  const now = Date.now();
  modelCallLog = recentWithin(modelCallLog, now);
  if (modelCallLog.length >= MODEL_CALLS_PER_HOUR) return false;
  modelCallLog.push(now);
  return true;
}

// Vercel overwrites x-forwarded-for with the real client address, so the
// first entry can't be spoofed by the visitor in production.
function clientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

// ---- POST — called only for free-text answers ----

type ReflectBody = {
  step: number; // 1-indexed question number this answer is for
  userAnswer: string;
  alreadyFollowedUp: boolean;
  userTurnCount: number;
  businessStage?: BusinessStage | null;
};

const SYSTEM_PROMPT = `あなたはStudio Poplar(WEB制作・アプリ制作・写真動画撮影を手がける小さなデザインスタジオ)のサイトに組み込まれた「AIヒアリング」の聞き手です。

絶対的な制約:
- あなたは相槌と深掘り判定だけを行います。提案・アドバイス・解決策・サイト構成案は一切出しません。
- ユーザーの発言内容そのものを否定・評価・分析しません。あくまで受け止めるだけです。
- 出力は必ず1〜2文、絵文字なし。です・ます調だが距離は近い、丁寧だが堅くない、話しやすい先輩のようなトーンです。

以下のいずれかに該当する場合のみ needs_followup を true にしてください:
- 具体的な出来事や場面(いつ・どこで・誰と)が書かれていない
- 数値・期間・固有名詞など、具体性を判断できる手がかりが一切ない
- 一般論・理想論のみで、本人の実体験が書かれていない

以下の場合は needs_followup を false にしてください:
- 「わからない」「特にない」など、本人が明確に「これ以上ない」と示している
- すでに具体的なエピソードや数値が含まれている
- 入力が質問の意図から大きく外れている、または個人情報・不適切な内容を含む

良い相槌の例:
- 「そうだったんですね、それは伝わりにくくてもどかしいですよね。」
- 「なるほど、そこがずっと引っかかっていたんですね。」
- 「ありがとうございます、状況がよく分かりました。」

避けるべき相槌の例(事務的・カウンセラー的すぎる):
- 「承知いたしました。」(事務的すぎる)
- 「そのお気持ち、とてもよく分かります。あなたは一人ではありません。」(重すぎる/カウンセラー的)

相手の回答が過去の経験に対して懐疑的・皮肉・冷めたトーンである場合、過度にポジティブな相槌(「素晴らしいですね」「一緒に頑張りましょう」等)は避け、淡々と落ち着いたトーンで受け止めてください。

必ず次のJSON形式のみで出力してください。他のテキストは一切含めないこと:
{"reflection": "回答を踏まえた1〜2文の相槌", "needs_followup": true または false, "followup_question": "深掘りが必要な場合のみ1つの質問文。不要な場合は空文字"}`;

type ReflectResult = {
  reflection: string;
  needs_followup: boolean;
  followup_question: string;
};

function parseReflectResult(raw: string): ReflectResult | null {
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    if (typeof parsed.reflection !== "string") return null;
    return {
      reflection: parsed.reflection,
      needs_followup: Boolean(parsed.needs_followup),
      followup_question: typeof parsed.followup_question === "string" ? parsed.followup_question : "",
    };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);

  let body: ReflectBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません。" }, { status: 400 });
  }

  const { step, userAnswer, alreadyFollowedUp, userTurnCount } = body;
  const businessStage: BusinessStage | null =
    body.businessStage === "existing" || body.businessStage === "starting" ? body.businessStage : null;

  if (
    typeof step !== "number" ||
    step < 1 ||
    step > TOTAL_QUESTIONS ||
    typeof userAnswer !== "string" ||
    !userAnswer.trim()
  ) {
    return NextResponse.json({ error: "リクエストの形式が正しくありません。" }, { status: 400 });
  }

  if (userAnswer.length > MAX_FREE_TEXT_LENGTH) {
    return NextResponse.json({ error: `回答は${MAX_FREE_TEXT_LENGTH}文字以内でお願いします。` }, { status: 400 });
  }

  if (!allowHit(reflectLog, ip, REFLECTS_PER_IP_PER_HOUR)) {
    return NextResponse.json({ error: "アクセスが混み合っています。しばらくしてから再度お試しください。" }, { status: 429 });
  }
  // userTurnCount comes from the client, so this only stops an honest client
  // that has run long; the per-IP limit above is the actual guard.
  if (typeof userTurnCount === "number" && userTurnCount > MAX_USER_TURNS) {
    return NextResponse.json({ error: "セッションの上限に達しました。お手数ですがお問い合わせフォームからご連絡ください。" }, { status: 429 });
  }

  const guarded = guardFreeText(userAnswer, Boolean(alreadyFollowedUp));
  if (guarded) {
    return NextResponse.json(guarded);
  }

  if (!process.env.ANTHROPIC_API_KEY || !allowModelCall()) {
    return NextResponse.json({ reflection: FALLBACK_ACK, needs_followup: false, followup_question: "" });
  }

  const question = getQuestion(step, businessStage);
  const userPrompt = `設問: ${question.text}\nユーザーの回答: ${userAnswer}${
    alreadyFollowedUp ? "\n(この設問はすでに一度深掘りしています。needs_followupは必ずfalseにしてください)" : ""
  }`;

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 200,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const raw = textBlock && textBlock.type === "text" ? textBlock.text.trim() : "";
    const parsed = parseReflectResult(raw);

    if (!parsed) {
      return NextResponse.json({ reflection: FALLBACK_ACK, needs_followup: false, followup_question: "" });
    }

    return NextResponse.json({
      reflection: parsed.reflection,
      needs_followup: alreadyFollowedUp ? false : parsed.needs_followup,
      followup_question: alreadyFollowedUp ? "" : parsed.followup_question,
    });
  } catch (error) {
    console.error("hearing-chat reflect error", error);
    // API failures must not stall the conversation for the visitor.
    return NextResponse.json({ reflection: FALLBACK_ACK, needs_followup: false, followup_question: "" });
  }
}

// ---- notify — called once, when the session reaches the closing message ----

export type HearingChatAnswer = {
  question: string;
  label: string | null;
  freeText: string | null;
  categories?: string[];
};

type NotifyBody = {
  answers: HearingChatAnswer[];
  transcript: string;
};

// Generous bounds for a real session (user turns are capped at
// MAX_FREE_TEXT_LENGTH each); anything past them didn't come from the chat UI.
const MAX_FIELD_LENGTH = 1000;
const MAX_TRANSCRIPT_LENGTH = 12000;
// Multi-select answers list one category per chosen chip, duplicates included.
const MAX_CATEGORIES = 20;

function isValidAnswer(a: unknown): a is HearingChatAnswer {
  if (typeof a !== "object" || a === null) return false;
  const { question, label, freeText, categories } = a as Record<string, unknown>;
  const optionalText = (v: unknown) => v === null || (typeof v === "string" && v.length <= MAX_FIELD_LENGTH);
  return (
    typeof question === "string" &&
    question.length <= MAX_FIELD_LENGTH &&
    optionalText(label) &&
    optionalText(freeText) &&
    (label !== null || freeText !== null) &&
    (categories === undefined ||
      (Array.isArray(categories) && categories.length <= MAX_CATEGORIES && categories.every((c) => typeof c === "string" && c.length <= 20)))
  );
}

export async function PUT(request: NextRequest) {
  let body: NotifyBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません。" }, { status: 400 });
  }

  // A finished session always carries exactly one answer per question.
  if (
    !Array.isArray(body.answers) ||
    body.answers.length !== TOTAL_QUESTIONS ||
    !body.answers.every(isValidAnswer) ||
    typeof body.transcript !== "string" ||
    body.transcript.length > MAX_TRANSCRIPT_LENGTH
  ) {
    return NextResponse.json({ error: "リクエストの形式が正しくありません。" }, { status: 400 });
  }

  // Checked after validation so a malformed retry doesn't use up the quota.
  if (!allowHit(notifyLog, clientIp(request), NOTIFIES_PER_IP_PER_HOUR)) {
    return NextResponse.json({ error: "送信回数の上限に達しました。しばらくしてから再度お試しください。" }, { status: 429 });
  }

  const summary = body.answers
    .map((a, i) => `Q${i + 1}(${a.question})\n${a.label ?? a.freeText ?? ""}`)
    .join("\n\n");

  const results = await Promise.allSettled([
    fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: "【AIヒアリング】新しい事前カルテが届きました",
        summary,
        transcript: body.transcript,
      }),
    }),
    SHEETS_WEBHOOK_URL
      ? fetch(SHEETS_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: body.answers, transcript: body.transcript, submittedAt: new Date().toISOString() }),
        })
      : Promise.resolve(null),
  ]);

  const formspreeOk = results[0].status === "fulfilled";

  return NextResponse.json({ ok: formspreeOk }, { status: formspreeOk ? 200 : 502 });
}
