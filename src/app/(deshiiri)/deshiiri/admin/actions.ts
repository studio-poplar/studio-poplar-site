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
    const { uploadFile, trashFile } = await import("@/lib/deshiiri/services/drive");
    const id = await uploadFile(`_check-${Date.now()}.txt`, new TextEncoder().encode("ok"), "text/plain");
    await trashFile(id);
    results.push({ service: "Google ドライブ", ok: true, detail: "共有ドライブに書き込み、ゴミ箱へ移せました" });
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

  try {
    const Sentry = await import("@sentry/nextjs");
    if (!Sentry.getClient()) throw new MissingEnvError("SENTRY_DSN");
    Sentry.captureMessage("【デシイリ】接続の確認（テスト送信）", "info");
    const sent = await Sentry.flush(5000);
    results.push({
      service: "Sentry",
      ok: sent,
      detail: sent ? "テスト送信しました（Sentry の deshiiri プロジェクトに info で届きます）" : "送信が時間内に終わりませんでした",
    });
  } catch (e) {
    results.push(failure("Sentry", e));
  }

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

/**
 * LINE のリッチメニュー（指示書 6章：写真を送る／見学の受付を止める・再開／使い方／デシイリに連絡）を作り、
 * 全員の既定にする。テスト用と本番用の LINE それぞれで1回押す。押し直すと新しいメニューに入れ替わる。
 */
export async function setupRichMenu(): Promise<MigrateResult> {
  await assertAdmin();
  try {
    const { readFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const { lineClient, lineBlob } = await import("@/lib/deshiiri/line/client");
    const W = 2500;
    const H = 843;
    const cw = W / 4;
    const area = (i: number) => ({ x: Math.round(i * cw), y: 0, width: Math.round(cw), height: H });
    const { richMenuId } = await lineClient().createRichMenu({
      size: { width: W, height: H },
      selected: true,
      name: "deshiiri-main",
      chatBarText: "メニュー",
      areas: [
        { bounds: area(0), action: { type: "postback", data: "action=howto_send", displayText: "写真を送る" } },
        { bounds: area(1), action: { type: "postback", data: "action=toggle_visit", displayText: "見学の受付を切り替える" } },
        { bounds: area(2), action: { type: "postback", data: "action=help", displayText: "使い方" } },
        { bounds: area(3), action: { type: "uri", uri: "https://www.studiopoplar.com/deshiiri/contact" } },
      ],
    });
    const image = await readFile(path.join(process.cwd(), "src/lib/deshiiri/line/richmenu.png"));
    await lineBlob().setRichMenuImage(richMenuId, new Blob([new Uint8Array(image)], { type: "image/png" }));
    await lineClient().setDefaultRichMenu(richMenuId);
    return { ok: true, detail: "リッチメニューを設定しました（LINE のトークを開き直すと出ます）" };
  } catch (e) {
    return { ok: false, detail: e instanceof MissingEnvError ? e.message : `失敗しました（${e instanceof Error ? e.message.slice(0, 200) : "不明なエラー"}）` };
  }
}
