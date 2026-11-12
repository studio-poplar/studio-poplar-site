"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/deshiiri/admin-auth";
import { runBackup } from "@/lib/deshiiri/backup";
import { scrubText } from "@/lib/deshiiri/sentry-scrub";
import { mb } from "@/lib/deshiiri/usage-rules";
import { checkUsage } from "@/lib/deshiiri/usage";

export type OpsResult = { ok: boolean; detail: string } | null;

const fail = (e: unknown): OpsResult => ({
  ok: false,
  detail: scrubText(e instanceof Error ? `${e.name}: ${e.message}` : "不明なエラー").slice(0, 300),
});

export async function backupNow(): Promise<OpsResult> {
  await assertAdmin();
  try {
    const r = await runBackup();
    revalidatePath("/deshiiri/admin/ops");
    const rows = Object.entries(r.rows)
      .map(([k, n]) => `${k} ${n}`)
      .join("・");
    return { ok: true, detail: `「${r.name}」を保存しました（${mb(r.bytes)}、${rows}）。残しているのは ${r.kept} 個、ゴミ箱へ移したのは ${r.trashed} 個です。` };
  } catch (e) {
    return fail(e);
  }
}

export async function testWarning(): Promise<OpsResult> {
  await assertAdmin();
  try {
    const { warnings } = await checkUsage(true);
    return { ok: true, detail: `試しの警告メールを送りました（いま超えているもの：${warnings.length} 件）。` };
  } catch (e) {
    return fail(e);
  }
}
