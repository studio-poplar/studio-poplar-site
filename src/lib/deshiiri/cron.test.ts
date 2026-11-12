import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
import { cronAuthorized } from "./cron";

afterEach(() => delete process.env.CRON_SECRET);
const req = (auth?: string) => new Request("https://x/y", { headers: auth ? { authorization: auth } : {} });

describe("定時の仕事の入口", () => {
  it("CRON_SECRET が合っていれば通す", () => {
    process.env.CRON_SECRET = "s3cret-value";
    expect(cronAuthorized(req("Bearer s3cret-value"))).toBe(true);
  });
  it("違う・ない・CRON_SECRET 未設定は通さない", () => {
    process.env.CRON_SECRET = "s3cret-value";
    expect(cronAuthorized(req("Bearer wrong"))).toBe(false);
    expect(cronAuthorized(req())).toBe(false);
    delete process.env.CRON_SECRET;
    expect(cronAuthorized(req("Bearer "))).toBe(false);
  });
});
