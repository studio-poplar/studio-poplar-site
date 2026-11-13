import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const SECRET = "test-channel-secret";
const sign = (body: string, secret = SECRET) => createHmac("sha256", secret).update(body).digest("base64");

beforeEach(() => {
  process.env.LINE_CHANNEL_SECRET = SECRET;
});
afterEach(() => {
  delete process.env.LINE_CHANNEL_SECRET;
});

describe("LINE webhook の署名検証", () => {
  it("正しい署名なら通す", async () => {
    const { verifySignature } = await import("./client");
    const body = JSON.stringify({ destination: "x", events: [] });
    expect(verifySignature(body, sign(body))).toBe(true);
  });

  it("本文が1文字でも違えば通さない", async () => {
    const { verifySignature } = await import("./client");
    const body = JSON.stringify({ events: [] });
    expect(verifySignature(body + " ", sign(body))).toBe(false);
  });

  it("別のチャネルの署名・署名なしは通さない", async () => {
    const { verifySignature } = await import("./client");
    const body = JSON.stringify({ events: [] });
    expect(verifySignature(body, sign(body, "other-secret"))).toBe(false);
    expect(verifySignature(body, null)).toBe(false);
    expect(verifySignature(body, "")).toBe(false);
  });
});
