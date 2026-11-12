import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";

// 見学の申し込み（指示書 R-6・S-3・S-6）の決まりごと。DB や LINE に触らないものだけをここに置く（テストしやすいように）。

export const VISIT_STATUSES = ["waiting_guardian", "sent", "accepted", "declined", "no_answer", "done"] as const;
export type VisitStatus = (typeof VISIT_STATUSES)[number];

/** 管理画面（S-6）に出す名前。accepted で日付があるものは「日が決まった」と出す。 */
export function statusLabel(status: VisitStatus, hasDate: boolean): string {
  if (status === "accepted" && hasDate) return "日が決まった";
  return {
    waiting_guardian: "保護者の同意待ち",
    sent: "職人に届いた（返事待ち）",
    accepted: "受けた（日にち調整中）",
    declined: "見送り",
    no_answer: "調整がつかなかった",
    done: "実施",
  }[status];
}

const DAY = 24 * 60 * 60 * 1000;
/** 職人の返事がないとき、1回だけ知らせ直すまでの時間。 */
export const REMIND_AFTER_MS = 3 * DAY;
/** 職人の返事（または保護者の同意）がないまま、不成立にするまでの時間。 */
export const EXPIRE_AFTER_MS = 7 * DAY;

const text = (max: number) => z.string().trim().max(max, `${max}文字以内で入力してください`);

export const visitSchema = z
  .object({
    name: text(40).min(1, "お名前を入力してください"),
    email: z.email("メールアドレスの形式を確かめてください").max(200),
    under18: z.enum(["yes", "no"], { message: "18歳未満かどうかを選んでください" }),
    guardianName: text(40).optional().default(""),
    guardianEmail: z.union([z.literal(""), z.email("保護者の方のメールアドレスの形式を確かめてください").max(200)]).default(""),
    schoolOrJob: text(60).optional().default(""),
    wish1: text(60).optional().default(""),
    wish2: text(60).optional().default(""),
    wish3: text(60).optional().default(""),
    message: text(400).optional().default(""),
    agree: z.literal("on", { message: "個人情報の取り扱いへの同意が必要です" }),
    website: z.string().optional().default(""), // ロボットよけ（人には見えない欄）
  })
  .superRefine((d, ctx) => {
    if (![d.wish1, d.wish2, d.wish3].some(Boolean)) {
      ctx.addIssue({ code: "custom", path: ["wish1"], message: "都合のよい時期を1つ以上入れてください" });
    }
    if (d.under18 === "yes") {
      if (!d.guardianName) ctx.addIssue({ code: "custom", path: ["guardianName"], message: "保護者の方のお名前を入力してください" });
      if (!d.guardianEmail) ctx.addIssue({ code: "custom", path: ["guardianEmail"], message: "保護者の方のメールアドレスを入力してください" });
      else if (d.guardianEmail.toLowerCase() === d.email.toLowerCase()) {
        ctx.addIssue({ code: "custom", path: ["guardianEmail"], message: "保護者の方ご本人のメールアドレスを入力してください" });
      }
    }
  });

export type VisitInput = z.infer<typeof visitSchema>;

export const wishesOf = (d: Pick<VisitInput, "wish1" | "wish2" | "wish3">) => [d.wish1, d.wish2, d.wish3].filter(Boolean);

/** 保護者の同意のリンク。DB には SHA-256 だけを残し、リンクそのものはメールにしか残らない。 */
export function newConsentToken() {
  const token = randomBytes(24).toString("base64url");
  return { token, hash: hashToken(token) };
}
export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
export const isTokenShape = (t: string) => /^[A-Za-z0-9_-]{32}$/.test(t);

/** 定時の仕事で、この申し込みに何をするか。 */
export type VisitDue = "remind" | "expire" | "expire_guardian" | null;
export function dueAction(
  v: { status: VisitStatus; createdAt: Date; notifiedAt: Date | null; remindedAt: Date | null },
  now: Date,
): VisitDue {
  const age = (d: Date) => now.getTime() - d.getTime();
  if (v.status === "waiting_guardian") return age(v.createdAt) >= EXPIRE_AFTER_MS ? "expire_guardian" : null;
  if (v.status !== "sent") return null;
  const since = v.notifiedAt ?? v.createdAt;
  if (age(since) >= EXPIRE_AFTER_MS) return "expire";
  if (v.notifiedAt && !v.remindedAt && age(v.notifiedAt) >= REMIND_AFTER_MS) return "remind";
  return null;
}

/** LINE の日付選び（YYYY-MM-DD）を、日本時間のその日の 0:00 として持つ。 */
export function parseVisitDate(s: string | undefined): Date | null {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00+09:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export const fmtDay = (d: Date) =>
  d.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo", month: "long", day: "numeric", weekday: "short" });

/** 今日（日本時間）の YYYY-MM-DD。LINE の日付選びの下限に使う。 */
export const todayJst = (now = new Date()) =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(now);
