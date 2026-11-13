"use server";

import * as Sentry from "@sentry/nextjs";
import { after } from "next/server";
import { headers } from "next/headers";
import { visitSchema } from "@/lib/deshiiri/visits/rules";
import { createVisit } from "@/lib/deshiiri/visits/service";

export type VisitFormState =
  | { status: "idle" }
  | { status: "done"; under18: boolean }
  | { status: "error"; message: string; fields?: Record<string, string> };

// 同じところから続けて送られたら止める（1分に3回まで。サーバーごとの簡易な数え方）。
const LIMIT = 3;
const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();
function allow(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) return false;
  recent.push(now);
  hits.set(key, recent);
  return true;
}

export async function submitVisit(slug: string, _prev: VisitFormState, form: FormData): Promise<VisitFormState> {
  if (!/^[a-z0-9-]{1,60}$/.test(slug)) return { status: "error", message: "職人が見つかりません。" };
  const parsed = visitSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) fields[String(issue.path[0])] ??= issue.message;
    return { status: "error", message: "入力を確かめてください。", fields };
  }
  if (parsed.data.website) return { status: "done", under18: false }; // ロボット：受け付けたふりをする

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (!allow(ip)) return { status: "error", message: "続けて送られています。少し時間をおいてから送ってください。" };

  try {
    const result = await createVisit(slug, parsed.data, (task) => after(task));
    return result.ok ? { status: "done", under18: result.under18 } : { status: "error", message: result.error };
  } catch (e) {
    Sentry.captureException(e, { tags: { area: "deshiiri-visit", step: "create" } });
    return { status: "error", message: "送れませんでした。時間をおいて、もう一度お試しください。" };
  }
}
