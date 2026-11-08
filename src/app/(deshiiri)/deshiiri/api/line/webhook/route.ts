import * as Sentry from "@sentry/nextjs";
import type { webhook } from "@line/bot-sdk";
import { after } from "next/server";
import { verifySignature } from "@/lib/deshiiri/line/client";
import { handleEvent } from "@/lib/deshiiri/line/handler";

// LINE の受付窓口（指示書 R-1）。署名を確かめ、イベントを1つずつ処理する。
// LINE は 200 以外を返すと再送してくるので、1件の失敗で全体を止めず、失敗は Sentry に送る。

export const maxDuration = 60;

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifySignature(raw, request.headers.get("x-line-signature"))) {
    return Response.json({ error: "invalid signature" }, { status: 401 });
  }

  let body: webhook.CallbackRequest;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "invalid body" }, { status: 400 });
  }

  const later = (task: () => Promise<void>) =>
    after(async () => {
      try {
        await task();
      } catch (e) {
        Sentry.captureException(e, { tags: { area: "line_after" } });
      }
    });

  for (const event of body.events ?? []) {
    try {
      await handleEvent(event, later);
    } catch (e) {
      Sentry.captureException(e, { tags: { area: "line_event", type: event.type } });
    }
  }
  return Response.json({ ok: true });
}
