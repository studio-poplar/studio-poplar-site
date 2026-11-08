import type { ErrorEvent } from "@sentry/nextjs";

// Sentry に名前・メール・LINE の user ID・本文を出さない（指示書 5章）。
// 送るのはエラーの種類と場所だけにして、リクエストの中身・ユーザー情報・パンくずの本文は落とす。

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const LINE_USER_ID = /\bU[0-9a-f]{32}\b/g;

export function scrubText(text: string): string {
  return text.replace(EMAIL, "[email]").replace(LINE_USER_ID, "[line-user]");
}

export function scrubEvent(event: ErrorEvent): ErrorEvent {
  delete event.user;
  if (event.request) {
    delete event.request.data;
    delete event.request.cookies;
    delete event.request.headers;
    delete event.request.query_string;
  }
  delete event.extra;
  event.breadcrumbs = [];
  if (event.message) event.message = scrubText(event.message);
  for (const ex of event.exception?.values ?? []) {
    if (ex.value) ex.value = scrubText(ex.value);
  }
  return event;
}
