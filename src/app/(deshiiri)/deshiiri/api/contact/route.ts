import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { parseRequest, type ContactInput, type ShuzaiInput } from "@/lib/deshiiri/contact";
import { getArticle, getShokunin } from "@/lib/deshiiri/content";
import { CONTACT_PURPOSES, jobLabel } from "@/lib/deshiiri/codes";

// 連絡フォームと取材相談フォームの送信先。
// 代表のメール（DESHIIRI_TO_EMAIL）に届き、送った人には自動返信する。職人には直接送らない。

const LIMIT = 3;
const WINDOW_MS = 60_000;
// Best effort: on serverless each instance keeps its own log, which is enough to stop a burst.
const hits = new Map<string, number[]>();

function allow(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) return false;
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

function clientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function nowJst() {
  return new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
}

type Mail = { subject: string; body: string; replyTo: string; autoReply: { to: string; subject: string; body: string } };

function contactMail(d: ContactInput): Mail | { error: string } {
  const person = getShokunin(d.to);
  if (!person) return { error: "連絡したい職人が見つかりません。" };
  if (!person.contact[d.purpose]) return { error: "この職人は、その用件の連絡を受け付けていません。" };
  const purpose = CONTACT_PURPOSES[d.purpose];
  const article = d.from ? getArticle(d.from) : undefined;
  const lines = [
    `連絡したい職人：${person.yago}（${jobLabel(person.job)}／${person.area}）`,
    `用件：${purpose}`,
    `お名前：${d.name}`,
    `メールアドレス：${d.email}`,
    d.age ? `年代：${d.age}` : null,
    d.dates ? `行けそうな日：${d.dates}` : null,
    d.age === "10代" ? "※10代のため、保護者の同意を確認してください" : null,
    "",
    "ひとこと：",
    d.message || "（なし）",
    "",
    `どの記事から：${article ? `${article.title}（/deshiiri/articles/${article.slug}）` : d.from || "（記事以外から）"}`,
    `送信日時：${nowJst()}`,
  ].filter((l) => l !== null);

  return {
    subject: `【デシイリ】${person.yago}へ${purpose}`,
    body: lines.join("\n"),
    replyTo: d.email,
    autoReply: {
      to: d.email,
      subject: "【デシイリ】ご連絡を受け付けました",
      body: [
        `${d.name} 様`,
        "",
        "デシイリにご連絡いただき、ありがとうございます。",
        "受け付けました。三日以内にデシイリ編集部からご連絡します。",
        "",
        `連絡したい職人：${person.yago}`,
        `用件：${purpose}`,
        "",
        "このメールは送信専用です。心当たりのない場合は、このメールを破棄してください。",
        "",
        "デシイリ — 職人と家業の読みもの",
        "運営：Studio Poplar　https://studiopoplar.com/deshiiri",
      ].join("\n"),
    },
  };
}

function shuzaiMail(d: ShuzaiInput): Mail {
  return {
    subject: `【デシイリ取材相談】${d.yago}`,
    body: [
      `お名前：${d.name}`,
      `屋号・お店の名前：${d.yago}`,
      `お仕事：${d.job}`,
      `場所：${d.area}`,
      `メールアドレス：${d.email}`,
      `電話番号：${d.tel || "（なし）"}`,
      "",
      "ひとこと：",
      d.message || "（なし）",
      "",
      `送信日時：${nowJst()}`,
    ].join("\n"),
    replyTo: d.email,
    autoReply: {
      to: d.email,
      subject: "【デシイリ】取材のご相談を受け付けました",
      body: [
        `${d.name} 様`,
        "",
        "デシイリに取材のご相談をいただき、ありがとうございます。",
        "受け付けました。三日以内にデシイリ編集部からご連絡します。",
        "",
        "このメールは送信専用です。心当たりのない場合は、このメールを破棄してください。",
        "",
        "デシイリ — 職人と家業の読みもの",
        "運営：Studio Poplar　https://studiopoplar.com/deshiiri",
      ].join("\n"),
    },
  };
}

export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "送信内容を読み取れませんでした。" }, { status: 400 });
  }

  const parsed = parseRequest(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "入力内容を確認してください。" }, { status: 400 });
  }
  const data = parsed.data;

  // Honeypot filled in: pretend it worked so bots don't retry.
  if (data.website) return NextResponse.json({ ok: true });

  if (!allow(clientIp(request))) {
    return NextResponse.json({ error: "短い時間に送信が続いています。1分ほど待ってから、もう一度お試しください。" }, { status: 429 });
  }

  const mail = data.kind === "contact" ? contactMail(data) : shuzaiMail(data);
  if ("error" in mail) return NextResponse.json({ error: mail.error }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.DESHIIRI_TO_EMAIL;
  const from = process.env.DESHIIRI_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // Local development without keys: print the mail instead of sending it.
    if (process.env.NODE_ENV === "development") {
      console.info(`[deshiiri] (未送信・開発用) ${mail.subject}\n${mail.body}\n--- 自動返信 → ${mail.autoReply.to}\n${mail.autoReply.body}`);
      return NextResponse.json({ ok: true, dev: true });
    }
    console.error("[deshiiri] RESEND_API_KEY / DESHIIRI_TO_EMAIL / DESHIIRI_FROM_EMAIL が設定されていません");
    return NextResponse.json({ error: "ただいま送信できません。時間をおいてお試しください。" }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  const sender = `デシイリ編集部 <${from}>`;
  const notice = await resend.emails.send({ from: sender, to, subject: mail.subject, text: mail.body, replyTo: mail.replyTo });
  if (notice.error) {
    console.error("[deshiiri] notice mail failed", notice.error);
    return NextResponse.json({ error: "送信に失敗しました。時間をおいてお試しください。" }, { status: 502 });
  }

  // The notice already reached the editor, so a failed auto-reply is logged but not shown as an error.
  const reply = await resend.emails.send({
    from: sender,
    to: mail.autoReply.to,
    subject: mail.autoReply.subject,
    text: mail.autoReply.body,
    replyTo: to,
  });
  if (reply.error) console.error("[deshiiri] auto-reply failed", reply.error);

  return NextResponse.json({ ok: true });
}
