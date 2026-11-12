import * as Sentry from "@sentry/nextjs";
import { cronAuthorized, unauthorized } from "@/lib/deshiiri/cron";
import { autoPublishDue } from "@/lib/deshiiri/publish";
import { visitsDue } from "@/lib/deshiiri/visits/service";

// 1時間ごと：24時間返事のない本人確認を公開する／見学の3日再通知・7日不成立。
export const maxDuration = 120;

export async function GET(request: Request) {
  if (!cronAuthorized(request)) return unauthorized();
  // 片方が失敗しても、もう片方は進める。
  const [published, visits] = await Promise.allSettled([autoPublishDue(), visitsDue()]);
  for (const r of [published, visits]) if (r.status === "rejected") Sentry.captureException(r.reason, { tags: { area: "cron_hourly" } });
  const ok = published.status === "fulfilled" && visits.status === "fulfilled";
  return Response.json(
    {
      autoPublished: published.status === "fulfilled" ? published.value : "failed",
      visits: visits.status === "fulfilled" ? visits.value : "failed",
    },
    { status: ok ? 200 : 500 },
  );
}
