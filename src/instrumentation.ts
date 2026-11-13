import * as Sentry from "@sentry/nextjs";

// 不具合の通知（Sentry 無料プラン）。サーバー側だけで動かし、公開ページに JS を足さない。
// SENTRY_DSN がない環境（手元・既存の本番）では何もしない。

export async function register() {
  if (!process.env.SENTRY_DSN) return;
  const { scrubEvent } = await import("@/lib/deshiiri/sentry-scrub");
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.VERCEL_ENV ?? "development",
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
      genAI: { inputs: false, outputs: false },
      databaseQueryData: false,
      stackFrameVariables: false,
    },
    tracesSampleRate: 0,
    beforeSend: scrubEvent,
    beforeBreadcrumb: () => null,
  });
}

export const onRequestError = Sentry.captureRequestError;
