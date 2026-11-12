import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ unstable_cache: (f: unknown) => f }));
vi.mock("@/lib/deshiiri/db", async () => ({ db: vi.fn(), schema: await import("./db/schema") }));

import { beforeMigration } from "./public-queries";

describe("新しい環境の最初のビルド", () => {
  it("表・列がまだないときだけ空として扱う（Drizzle が包んだエラーも見る）", () => {
    expect(beforeMigration({ code: "42P01" })).toBe(true);
    expect(beforeMigration(Object.assign(new Error("wrapped"), { cause: { code: "42703" } }))).toBe(true);
  });
  it("つながらない・パスワード違いなどは隠さない", () => {
    expect(beforeMigration({ code: "28P01" })).toBe(false);
    expect(beforeMigration(new Error("fetch failed"))).toBe(false);
  });
});
