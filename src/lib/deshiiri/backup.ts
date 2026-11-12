import "server-only";
import { gzipSync } from "node:zlib";
import { sql } from "drizzle-orm";
import { db } from "@/lib/deshiiri/db";
import { ensureFolder, listFiles, trashFile, uploadFile } from "@/lib/deshiiri/services/drive";

// 毎晩 03:00 のバックアップ（指示書 M5）。DB の中身を JSON にして gzip し、共有ドライブ「デシイリ原本/バックアップ」へ。
// 30 日分を残し、それより古いものはゴミ箱へ（ゴミ箱は 30 日で自動的に空になる）。
// 列名は DB のまま（snake_case）で書き出すので、そのまま json_populate_recordset で戻せる（docs/deshiiri-restore.md）。

/** 書き出す表。外部キーの順（親が先）に並べる。戻すときもこの順で入れる。 */
export const BACKUP_TABLES = [
  "craftspeople",
  "invite_codes",
  "works",
  "work_photos",
  "visit_requests",
  "push_log",
  "batch_jobs",
  "events",
] as const;
// line_events（LINE の二重処理よけの控え）は戻す必要がないので書き出さない。

export const KEEP_BACKUPS = 30;

/** 本番とプレビュー（テスト用のデータ）のバックアップを混ぜないよう、フォルダを分ける。 */
export const backupFolderName = (env = process.env.VERCEL_ENV) => (env === "production" ? "バックアップ" : "バックアップ（プレビュー）");

export type BackupFile = {
  format: "deshiiri-backup";
  version: 1;
  createdAt: string;
  tables: Record<string, unknown[]>;
};

export async function exportData(now = new Date()): Promise<BackupFile> {
  const tables: Record<string, unknown[]> = {};
  for (const t of BACKUP_TABLES) {
    const res = await db().execute(sql.raw(`select * from "${t}"`));
    tables[t] = res.rows;
  }
  return { format: "deshiiri-backup", version: 1, createdAt: now.toISOString(), tables };
}

export const backupName = (now: Date) => {
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 16).replace("T", "_").replace(":", "");
  return `deshiiri-backup_${jst}.json.gz`;
};

/** 残すものと捨てるもの（新しい順に並んだ一覧から）。 */
export function backupsToTrash<T>(newestFirst: T[], keep = KEEP_BACKUPS): T[] {
  return newestFirst.slice(keep);
}

export async function runBackup(now = new Date()) {
  const data = await exportData(now);
  const gz = gzipSync(Buffer.from(JSON.stringify(data)));
  const folder = await ensureFolder(backupFolderName());
  const name = backupName(now);
  await uploadFile(name, gz, "application/gzip", folder);
  const files = (await listFiles(folder)).filter((f) => f.name.startsWith("deshiiri-backup_"));
  const old = backupsToTrash(files);
  for (const f of old) await trashFile(f.id);
  const rows = Object.fromEntries(Object.entries(data.tables).map(([k, v]) => [k, v.length]));
  return { name, bytes: gz.byteLength, rows, kept: files.length - old.length, trashed: old.length };
}
