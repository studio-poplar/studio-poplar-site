import { z } from "zod";
import { AGE_GROUPS } from "./codes";

// Server-side validation for the 連絡 and 取材相談 forms (kept out of the client bundle).

const text = (max: number) => z.string().trim().max(max, `${max}文字以内で入力してください`);

export const contactSchema = z
  .object({
    kind: z.literal("contact"),
    to: z.string().min(1, "連絡したい職人を選んでください"),
    purpose: z.enum(["hanashi", "irai", "kengaku", "deshiiri"], { message: "用件を選んでください" }),
    name: text(80).min(1, "お名前を入力してください"),
    email: z.email("メールアドレスの形式を確認してください").max(200),
    message: text(2000).optional().default(""),
    age: z.enum(AGE_GROUPS).optional(),
    dates: text(300).optional().default(""),
    from: z.string().max(200).optional().default(""),
    agree: z.literal(true, { message: "個人情報の取り扱いへの同意が必要です" }),
    website: z.string().optional().default(""), // honeypot
  })
  .refine((d) => !(d.purpose === "kengaku" || d.purpose === "deshiiri") || d.age, {
    message: "年代を選んでください",
    path: ["age"],
  });

export const shuzaiSchema = z.object({
  kind: z.literal("shuzai"),
  name: text(80).min(1, "お名前を入力してください"),
  yago: text(120).min(1, "屋号・お店の名前を入力してください"),
  job: text(120).min(1, "お仕事の内容を入力してください"),
  area: text(120).min(1, "場所（市町村）を入力してください"),
  email: z.email("メールアドレスの形式を確認してください").max(200),
  tel: text(40).optional().default(""),
  message: text(2000).optional().default(""),
  agree: z.literal(true, { message: "個人情報の取り扱いへの同意が必要です" }),
  website: z.string().optional().default(""), // honeypot
});

export const editorialSchema = z.object({
  kind: z.literal("editorial"),
  topic: z.enum(["shuzai", "sponsor", "other"], { message: "お問い合わせの種類を選んでください" }),
  name: text(80).min(1, "お名前を入力してください"),
  org: text(120).optional().default(""),
  email: z.email("メールアドレスの形式を確認してください").max(200),
  tel: text(40).optional().default(""),
  message: text(2000).min(1, "お問い合わせの内容を入力してください"),
  agree: z.literal(true, { message: "個人情報の取り扱いへの同意が必要です" }),
  website: z.string().optional().default(""), // honeypot
});

// Picked by `kind` so the reader gets the specific message, not a generic union error.
export function parseRequest(raw: unknown) {
  const kind = (raw as { kind?: unknown } | null)?.kind;
  if (kind === "shuzai") return shuzaiSchema.safeParse(raw);
  if (kind === "editorial") return editorialSchema.safeParse(raw);
  return contactSchema.safeParse(raw);
}

export type ContactInput = z.infer<typeof contactSchema>;
export type ShuzaiInput = z.infer<typeof shuzaiSchema>;
export type EditorialInput = z.infer<typeof editorialSchema>;
