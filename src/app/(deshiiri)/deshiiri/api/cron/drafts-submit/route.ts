import * as Sentry from "@sentry/nextjs";
import { cronAuthorized, unauthorized } from "@/lib/deshiiri/cron";
import { submitNightlyBatch } from "@/lib/deshiiri/drafts";

// 毎晩 22:00（日本時間）：届いた投稿をまとめて下書きに出す。
export const maxDuration = 300;

export async function GET(request: Request) {
  if (!cronAuthorized(request)) return unauthorized();
  try {
    return Response.json(await submitNightlyBatch());
  } catch (e) {
    Sentry.captureException(e, { tags: { area: "cron_drafts_submit" } });
    return Response.json({ error: "failed" }, { status: 500 });
  }
}
