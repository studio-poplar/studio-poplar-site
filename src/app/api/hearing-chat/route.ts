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

// Best-effort in-memory per-IP throttle. Resets on cold start; this is a
// pragmatic guard given the project has no shared KV/Redis store today, not a
// hard distributed rate limit.
const SESSION_STARTS_PER_IP_PER_HOUR = 10;
const ipSessionLog = new Map<string, number[]>();

function checkAndLogSessionStart(ip: string): boolean {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;
  const recent = (ipSessionLog.get(ip) ?? []).filter((t) => t > hourAgo);
  if (recent.length >= SESSION_STARTS_PER_IP_PER_HOUR) {
    ipSessionLog.set(ip, recent);
    return false;
  }
  recent.push(now);
  ipSessionLog.set(ip, recent);
  return true;
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
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

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

  if (typeof userTurnCount === "number" && userTurnCount === 1 && !checkAndLogSessionStart(ip)) {
    return NextResponse.json({ error: "アクセスが混み合っています。しばらくしてから再度お試しください。" }, { status: 429 });
  }
  if (typeof userTurnCount === "number" && userTurnCount > MAX_USER_TURNS) {
    return NextResponse.json({ error: "セッションの上限に達しました。お手数ですがお問い合わせフォームからご連絡ください。" }, { status: 429 });
  }

  const guarded = guardFreeText(userAnswer, Boolean(alreadyFollowedUp));
  if (guarded) {
    return NextResponse.json(guarded);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
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

export async function PUT(request: NextRequest) {
  let body: NotifyBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません。" }, { status: 400 });
  }

  if (!Array.isArray(body.answers) || typeof body.transcript !== "string") {
    return NextResponse.json({ error: "リクエストの形式が正しくありません。" }, { status: 400 });
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
