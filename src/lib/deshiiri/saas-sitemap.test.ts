import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const queries = vi.hoisted(() => ({ listByTrade: vi.fn() }));
vi.mock("@/lib/deshiiri/public-queries", () => queries);

import { saasSitemap } from "./saas-sitemap";

afterEach(() => vi.unstubAllEnvs());

describe("SaaS のサイトマップ", () => {
  it("正式に案内するまでは何も出さない", async () => {
    vi.stubEnv("DESHIIRI_SAAS_PUBLIC", "");
    expect(await saasSitemap("https://example.test")).toEqual([]);
    expect(queries.listByTrade).not.toHaveBeenCalled();
  });

  it("出すときは、職種一覧と、一覧に出ている職人のページを入れる（人がいない職種は入れない）", async () => {
    vi.stubEnv("DESHIIRI_SAAS_PUBLIC", "1");
    queries.listByTrade.mockImplementation(async (t: string) =>
      t === "sakan" ? [{ slug: "sakan-taro", latestAt: "2026-11-13T00:00:00.000Z" }] : [],
    );
    const urls = (await saasSitemap("https://example.test")).map((e) => e.url);
    expect(urls).toEqual([
      "https://example.test/deshiiri/shokushu",
      "https://example.test/deshiiri/shokushu/sakan",
      "https://example.test/deshiiri/p/sakan-taro",
    ]);
  });
});
