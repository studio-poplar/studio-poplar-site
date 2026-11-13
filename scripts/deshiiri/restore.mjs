// デシイリのバックアップ（deshiiri-backup_*.json.gz）を Neon に戻す。手順は docs/deshiiri-restore.md。
//
//   DATABASE_URL='（戻し先の接続文字列）' node scripts/deshiiri/restore.mjs ./deshiiri-backup_2026-11-13_0300.json.gz
//   （--dry-run を付けると、件数を数えるだけで書き込まない）
//
// 戻し先には、先に表を作っておく（管理画面の「表を作る・更新する」か drizzle のマイグレーション）。
// すでにある行（同じ主キー）は上書きせずに飛ばす。

import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { neon } from "@neondatabase/serverless";

const ORDER = ["craftspeople", "invite_codes", "works", "work_photos", "visit_requests", "push_log", "batch_jobs", "events"];

const file = process.argv.find((a) => a.endsWith(".json.gz"));
const dryRun = process.argv.includes("--dry-run");
if (!file) {
  console.error("使い方: DATABASE_URL=... node scripts/deshiiri/restore.mjs <バックアップ.json.gz> [--dry-run]");
  process.exit(1);
}

const data = JSON.parse(gunzipSync(readFileSync(file)).toString("utf8"));
if (data.format !== "deshiiri-backup" || data.version !== 1) {
  console.error("デシイリのバックアップではないか、形式が違います。");
  process.exit(1);
}
console.log(`バックアップの日時: ${data.createdAt}`);

const sql = dryRun ? null : neon(process.env.DATABASE_URL ?? (console.error("DATABASE_URL がありません"), process.exit(1)));

for (const table of ORDER) {
  const rows = data.tables[table] ?? [];
  if (dryRun || !rows.length) {
    console.log(`${table}: ${rows.length} 行${dryRun ? "（数えただけ）" : ""}`);
    continue;
  }
  // 列名は DB のまま書き出してあるので、json_populate_recordset で表の形に合わせて入れられる。
  const res = await sql.query(
    `insert into "${table}" select * from json_populate_recordset(null::"${table}", $1::json) on conflict do nothing`,
    [JSON.stringify(rows)],
    { fullResults: true },
  );
  console.log(`${table}: ${rows.length} 行のうち ${res.rowCount} 行を入れました`);
}
