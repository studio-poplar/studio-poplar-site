"use server";

import { sql } from "drizzle-orm";
import { signOut } from "@/auth";
import { assertAdmin } from "@/lib/deshiiri/admin-auth";
import { db } from "@/lib/deshiiri/db";
import { MissingEnvError } from "@/lib/deshiiri/env";
import { scrubText } from "@/lib/deshiiri/sentry-scrub";

export async function logout() {
  await assertAdmin();
  await signOut({ redirectTo: "/deshiiri/admin/login" });
}

export type CheckResult = { service: string; ok: boolean; detail: string };

function failure(service: string, e: unknown): CheckResult {
  // 外部サービスの説明文は編集部だけが見る画面に出す（原因の切り分けのため）。
  // メールアドレスなどは伏せ、長さも切る。
  if (e instanceof MissingEnvError) return { service, ok: false, detail: e.message };
  const message = e instanceof Error ? `${e.name}: ${e.message}` : "不明なエラー";
  return { service, ok: false, detail: scrubText(message).slice(0, 300) };
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
    const { uploadFile, deleteFile } = await import("@/lib/deshiiri/services/drive");
    const id = await uploadFile(`_check-${Date.now()}.txt`, new TextEncoder().encode("ok"), "text/plain");
    await deleteFile(id);
    results.push({ service: "Google ドライブ", ok: true, detail: "共有ドライブに書き込み・削除ができました" });
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

export type MigrateResult = { ok: boolean; detail: string };

/**
 * drizzle/ のマイグレーションのうち、まだ当てていないものを当てる。
 * 接続文字列を手元に置かずに済むよう、Vercel 上で編集部が押して動かす。
 * Neon の HTTP 接続はトランザクションが使えないので、途中で失敗したら内容を見て手で直す。
 */
export async function applyMigrations(): Promise<MigrateResult> {
  await assertAdmin();
  try {
    const path = await import("node:path");
    const { migrate } = await import("drizzle-orm/neon-http/migrator");
    await migrate(db(), { migrationsFolder: path.join(process.cwd(), "drizzle") });
    const rows = await db().execute(sql`select count(*)::int as n from drizzle.__drizzle_migrations`);
    const n = Number((rows.rows[0] as { n: number } | undefined)?.n ?? 0);
    return { ok: true, detail: `表は最新です（当て済みのマイグレーション ${n} 件）` };
  } catch (e) {
    return { ok: false, detail: e instanceof MissingEnvError ? e.message : `失敗しました（${e instanceof Error ? e.name : "不明なエラー"}）` };
  }
}
