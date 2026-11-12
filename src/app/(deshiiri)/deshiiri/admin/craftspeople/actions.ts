"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { assertAdmin } from "@/lib/deshiiri/admin-auth";
import { db, schema } from "@/lib/deshiiri/db";
import { issueInviteCode } from "@/lib/deshiiri/line/intake";
import { TRADES } from "@/lib/deshiiri/trades";

const NewCraftsperson = z.object({
  displayName: z.string().trim().min(1, "名前を入れてください").max(40),
  shopName: z.string().trim().max(60).optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "短い名前は英小文字・数字・ハイフンで入れてください（例 sakan-taro）")
    .max(40),
  trade: z.enum(TRADES),
  area: z.string().trim().min(1, "市区町村を入れてください").max(40),
  intro: z.string().trim().max(400).optional(),
  proxyRegistrant: z.string().trim().max(60).optional(),
});

export type FormState = { ok: boolean; message: string } | null;

export async function createCraftsperson(_prev: FormState, form: FormData): Promise<FormState> {
  await assertAdmin();
  const parsed = NewCraftsperson.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "入力を確かめてください" };
  const v = parsed.data;

  const [dup] = await db().select({ id: schema.craftspeople.id }).from(schema.craftspeople).where(eq(schema.craftspeople.slug, v.slug)).limit(1);
  if (dup) return { ok: false, message: `短い名前「${v.slug}」はもう使われています` };

  await db().insert(schema.craftspeople).values({
    displayName: v.displayName,
    shopName: v.shopName || null,
    slug: v.slug,
    trade: v.trade,
    area: v.area,
    intro: v.intro || null,
    proxyRegistrant: v.proxyRegistrant || null,
  });
  revalidatePath("/deshiiri/admin/craftspeople");
  return { ok: true, message: `${v.displayName}さんを登録しました。続けて招待コードを出してください。` };
}

export async function issueInvite(craftspersonId: string) {
  await assertAdmin();
  const id = z.string().uuid().parse(craftspersonId);
  await issueInviteCode(id);
  revalidatePath("/deshiiri/admin/craftspeople");
}

/** 一覧用。最新の招待コードも一緒に返す。 */
export async function listCraftspeople() {
  await assertAdmin();
  const people = await db().select().from(schema.craftspeople).orderBy(desc(schema.craftspeople.createdAt));
  const codes = await db().select().from(schema.inviteCodes).orderBy(desc(schema.inviteCodes.createdAt));
  const now = Date.now();
  return people.map((p) => {
    const latestInvite = codes.find((c) => c.craftspersonId === p.id);
    const inviteLive = Boolean(latestInvite && !latestInvite.usedAt && latestInvite.expiresAt.getTime() > now);
    return { ...p, latestInvite, inviteLive };
  });
}

const EditCraftsperson = z.object({
  id: z.string().uuid(),
  displayName: z.string().trim().min(1, "名前を入れてください").max(40),
  shopName: z.string().trim().max(60).optional(),
  trade: z.enum(TRADES),
  area: z.string().trim().min(1, "市区町村を入れてください").max(40),
  intro: z.string().trim().max(400).optional(),
  proxyRegistrant: z.string().trim().max(60).optional(),
  firstPerson: z.string().trim().max(20).optional(),
  endings: z.string().trim().max(60).optional(),
  dialect: z.string().trim().max(60).optional(),
  habits: z.string().trim().max(120).optional(),
  emoji: z.enum(["", "yes", "no"]).optional(),
  memo: z.string().trim().max(300).optional(),
  phone: z.string().trim().max(30).optional(),
  hours: z.string().trim().max(60).optional(),
  website: z.string().trim().max(200).optional(),
  instagram: z.string().trim().max(60).optional(),
});

/** 職人の登録内容と話し方メモを直す。 */
export async function updateCraftsperson(_prev: FormState, form: FormData): Promise<FormState> {
  await assertAdmin();
  const parsed = EditCraftsperson.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "入力を確かめてください" };
  const v = parsed.data;
  const opt = (s?: string) => (s ? s : undefined);
  await db()
    .update(schema.craftspeople)
    .set({
      displayName: v.displayName,
      shopName: v.shopName || null,
      trade: v.trade,
      area: v.area,
      intro: v.intro || null,
      proxyRegistrant: v.proxyRegistrant || null,
      featured: form.get("featured") === "on",
      voiceNotes: {
        firstPerson: opt(v.firstPerson),
        endings: opt(v.endings),
        dialect: opt(v.dialect),
        habits: opt(v.habits),
        emoji: v.emoji === "yes" ? true : v.emoji === "no" ? false : undefined,
        memo: opt(v.memo),
      },
      cardInfo: { phone: opt(v.phone), hours: opt(v.hours), website: opt(v.website), instagram: opt(v.instagram) },
    })
    .where(eq(schema.craftspeople.id, v.id));
  revalidatePath("/deshiiri/admin/craftspeople");
  revalidatePath(`/deshiiri/admin/craftspeople/${v.id}`);
  return { ok: true, message: "保存しました" };
}
