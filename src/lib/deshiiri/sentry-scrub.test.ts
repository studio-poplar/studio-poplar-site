import type { ErrorEvent } from "@sentry/nextjs";
import { describe, expect, it } from "vitest";
import { scrubEvent, scrubText } from "./sentry-scrub";

describe("Sentry に個人情報を送らない", () => {
  it("メールと LINE の user ID を伏せる", () => {
    expect(scrubText("to taro@example.com from U0123456789abcdef0123456789abcdef")).toBe("to [email] from [line-user]");
  });

  it("ユーザー情報・リクエストの中身・パンくずを落とす", () => {
    const event = {
      type: undefined,
      user: { email: "a@example.com" },
      request: { url: "/deshiiri/api/line/webhook", data: { text: "本文" }, headers: { cookie: "x" }, cookies: { a: "b" } },
      extra: { body: "本文" },
      breadcrumbs: [{ message: "a@example.com" }],
      exception: { values: [{ type: "Error", value: "failed for a@example.com" }] },
    } as ErrorEvent;
    const out = scrubEvent(event);
    expect(out.user).toBeUndefined();
    expect(out.request?.data).toBeUndefined();
    expect(out.request?.headers).toBeUndefined();
    expect(out.request?.url).toBe("/deshiiri/api/line/webhook");
    expect(out.extra).toBeUndefined();
    expect(out.breadcrumbs).toEqual([]);
    expect(out.exception?.values?.[0].value).toBe("failed for [email]");
  });
});
