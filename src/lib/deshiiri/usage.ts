import "server-only";
import { and, count, gte, inArray, isNull, lt, sql } from "drizzle-orm";
import { db, schema } from "@/lib/deshiiri/db";
import { notifyEditors } from "@/lib/deshiiri/services/mail";
import { bucketUsage } from "@/lib/deshiiri/services/r2";
import { ERASE_AFTER_MS, monthStartJst, usageWarnings, type Usage } from "./usage-rules";

// 毎日 09:00：通数・容量を数え、決まりを超えていたら代表（EDITOR_NOTIFY_EMAIL）にメールする。

export async function measureUsage(now = new Date()): Promise<Usage> {
  const [[pushes], r2, neon] = await Promise.all([
    db().select({ n: count() }).from(schema.pushLog).where(gte(schema.pushLog.sentAt, monthStartJst(now))),
    bucketUsage(),
    db().execute<{ bytes: string }>(sql`select pg_database_size(current_database()) as bytes`),
  ]);
  return { pushes: pushes.n, r2Bytes: r2.bytes, r2Objects: r2.objects, neonBytes: Number(neon.rows[0]?.bytes ?? 0) };
}

/** test = true は「試しに出す」：数字にかかわらず、警告のメールを1通送る。 */
export async function checkUsage(test = false) {
  const usage = await measureUsage();
  const warnings = usageWarnings(usage);
  if (warnings.length || test) {
    await notifyEditors(
      test ? "【デシイリ】（試し）無料枠の警告" : "【デシイリ】無料枠の警告",
      [
        test ? "これは試しの警告です。決まりを超えたときは、このような知らせが届きます。" : "無料枠の決まりを超えそうです。",
        "",
        ...(warnings.length ? warnings : ["（いまは超えているものはありません）"]),
        "",
        "管理画面：/deshiiri/admin",
      ].join("\n"),
    );
  }
  return { usage, warnings };
}

/** 毎日 03:00：見学の実施（または不成立）から1年たった若者の連絡先を消す。申し込みがあったことだけは数として残す。 */
export async function eraseOldContacts(now = new Date()) {
  const vr = schema.visitRequests;
  const cutoff = new Date(now.getTime() - ERASE_AFTER_MS);
  const erased = await db()
    .update(vr)
    .set({
      name: "（削除済み）",
      email: "",
      guardianName: null,
      guardianEmail: null,
      guardianToken: null,
      schoolOrJob: null,
      wishes: [],
      message: null,
      contactErasedAt: now,
    })
    .where(
      and(
        inArray(vr.status, ["accepted", "declined", "no_answer", "done"]),
        isNull(vr.contactErasedAt),
        lt(sql`coalesce(${vr.visitDate}, ${vr.decidedAt}, ${vr.createdAt})`, cutoff),
      ),
    )
    .returning({ id: vr.id });
  return erased.length;
}
