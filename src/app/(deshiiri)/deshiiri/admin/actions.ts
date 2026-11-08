"use server";

import { sql } from "drizzle-orm";
import { signOut } from "@/auth";
import { assertAdmin } from "@/lib/deshiiri/admin-auth";
import { db } from "@/lib/deshiiri/db";
import { MissingEnvError } from "@/lib/deshiiri/env";

export async function logout() {
  await assertAdmin();
  await signOut({ redirectTo: "/deshiiri/admin/login" });
}

export type CheckResult = { service: string; ok: boolean; detail: string };

function failure(service: string, e: unknown): CheckResult {
  // 中身（キーやメール）を画面に出さないよう、種類だけ返す。
  const detail = e instanceof MissingEnvError ? e.message : e instanceof Error ? e.name : "不明なエラー";
  return { service, ok: false, detail };
}

/** M0 の接続確認。書き込みを伴うものは、確認用のファイルを置いてすぐ消す。 */
export async function runChecks(): Promise<CheckResult[]> {
  const email = await assertAdmin();
  const results: CheckResult[] = [];

  try {
    const rows = await db().execute(
      sql`select count(*)::int as n from information_schema.tables where table_schema = 'public' and table_name in ('craftspeople','works','visit_requests')`,
    );
    const n = Number((rows.rows[0] as { n: number } | undefined)?.n ?? 0);
    results.push({ service: "Neon", ok: n === 3, detail: n === 3 ? "接続でき、テーブルがあります" : "接続できましたが、マイグレーションが未適用です" });
  } catch (e) {
    results.push(failure("Neon", e));
  }

  try {
    const { putObject, getObject, deleteObject } = await import("@/lib/deshiiri/services/r2");
    const key = `_check/${Date.now()}.txt`;
    await putObject(key, new TextEncoder().encode("ok"), "text/plain");
    const got = await getObject(key);
    await deleteObject(key);
    results.push({ service: "Cloudflare R2", ok: got !== null, detail: "書き込み・読み出し・削除ができました" });
  } catch (e) {
    results.push(failure("Cloudflare R2", e));
  }

  try {
    const { folderName } = await import("@/lib/deshiiri/services/drive");
    const name = await folderName();
    results.push({ service: "Google ドライブ", ok: true, detail: `フォルダ「${name}」が見えます` });
  } catch (e) {
    results.push(failure("Google ドライブ", e));
  }

  try {
    const { sendMail } = await import("@/lib/deshiiri/services/mail");
    await sendMail({ to: email, subject: "【デシイリ】接続の確認", text: "Resend からの送信を確認するためのメールです。返信は不要です。" });
    results.push({ service: "Resend", ok: true, detail: "ログイン中のアドレスに確認メールを送りました" });
  } catch (e) {
    results.push(failure("Resend", e));
  }

  results.push({
    service: "Sentry",
    ok: Boolean(process.env.SENTRY_DSN),
    detail: process.env.SENTRY_DSN ? "設定済み（サーバー側のエラーだけ送ります）" : "SENTRY_DSN が未設定です",
  });

  return results;
}
