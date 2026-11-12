import * as Sentry from "@sentry/nextjs";
import { cronAuthorized, unauthorized } from "@/lib/deshiiri/cron";
import { collectBatches } from "@/lib/deshiiri/drafts";

// 30分ごと：終わった下書きのバッチを取り込み、編集部に知らせる。
export const maxDuration = 300;

export async function GET(request: Request) {
  if (!cronAuthorized(request)) return unauthorized();
  try {
    return Response.json(await collectBatches());
  } catch (e) {
    Sentry.captureException(e, { tags: { area: "cron_drafts_collect" } });
    return Response.json({ error: "failed" }, { status: 500 });
  }
}
