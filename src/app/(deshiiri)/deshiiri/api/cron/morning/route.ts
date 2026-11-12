import * as Sentry from "@sentry/nextjs";
import { cronAuthorized, unauthorized } from "@/lib/deshiiri/cron";
import { checkUsage } from "@/lib/deshiiri/usage";

// 毎日 09:00（日本時間）：LINE の通数・R2・Neon の容量を数え、決まりを超えていたら代表にメールする。
export const maxDuration = 60;

export async function GET(request: Request) {
  if (!cronAuthorized(request)) return unauthorized();
  try {
    const { usage, warnings } = await checkUsage();
    return Response.json({ usage, warnings: warnings.length });
  } catch (e) {
    Sentry.captureException(e, { tags: { area: "cron_morning" } });
    return Response.json({ error: "failed" }, { status: 500 });
  }
}
