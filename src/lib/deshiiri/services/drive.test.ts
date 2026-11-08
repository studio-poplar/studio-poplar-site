import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const KEYS = ["GCP_PROJECT_NUMBER", "GCP_WORKLOAD_IDENTITY_POOL_ID", "GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID", "GCP_SERVICE_ACCOUNT_EMAIL"];
afterEach(() => KEYS.forEach((k) => delete process.env[k]));

describe("ドライブの鍵なし接続の設定", () => {
  it("Workload Identity 連携の宛先とサービスアカウントを組み立てる", async () => {
    process.env.GCP_PROJECT_NUMBER = "123";
    process.env.GCP_WORKLOAD_IDENTITY_POOL_ID = "vercel";
    process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID = "vercel";
    process.env.GCP_SERVICE_ACCOUNT_EMAIL = "sa@example.iam.gserviceaccount.com";
    const { externalAccountConfig } = await import("./drive");
    const c = externalAccountConfig();
    expect(c.audience).toBe("//iam.googleapis.com/projects/123/locations/global/workloadIdentityPools/vercel/providers/vercel");
    expect(c.service_account_impersonation_url).toBe(
      "https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/sa@example.iam.gserviceaccount.com:generateAccessToken",
    );
    expect(c.scopes).toEqual(["https://www.googleapis.com/auth/drive"]);
  });

  it("値が足りないときは名前つきで止まる", async () => {
    const { externalAccountConfig } = await import("./drive");
    expect(() => externalAccountConfig()).toThrow(/GCP_PROJECT_NUMBER/);
  });
});
