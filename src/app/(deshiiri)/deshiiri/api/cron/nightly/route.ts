import * as Sentry from "@sentry/nextjs";
import { runBackup } from "@/lib/deshiiri/backup";
import { cronAuthorized, unauthorized } from "@/lib/deshiiri/cron";
import { eraseOldContacts } from "@/lib/deshiiri/usage";

// 毎日 03:00（日本時間）：バックアップ → 1年過ぎた若者の連絡先を消す。片方が失敗しても、もう片方は進める。
export const maxDuration = 300;

export async function GET(request: Request) {
  if (!cronAuthorized(request)) return unauthorized();
  const [backup, erased] = await Promise.allSettled([runBackup(), eraseOldContacts()]);
  for (const r of [backup, erased]) if (r.status === "rejected") Sentry.captureException(r.reason, { tags: { area: "cron_nightly" } });
  const ok = backup.status === "fulfilled" && erased.status === "fulfilled";
  return Response.json(
    {
      backup: backup.status === "fulfilled" ? backup.value : "failed",
      erasedContacts: erased.status === "fulfilled" ? erased.value : "failed",
    },
    { status: ok ? 200 : 500 },
  );
}
