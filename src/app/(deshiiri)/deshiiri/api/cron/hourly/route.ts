import * as Sentry from "@sentry/nextjs";
import { cronAuthorized, unauthorized } from "@/lib/deshiiri/cron";
import { autoPublishDue } from "@/lib/deshiiri/publish";

// 1時間ごと：24時間返事のない本人確認を公開する（M4 で見学の再通知・不成立もここに足す）。
export const maxDuration = 120;

export async function GET(request: Request) {
  if (!cronAuthorized(request)) return unauthorized();
  try {
    return Response.json({ autoPublished: await autoPublishDue() });
  } catch (e) {
    Sentry.captureException(e, { tags: { area: "cron_hourly" } });
    return Response.json({ error: "failed" }, { status: 500 });
  }
}
