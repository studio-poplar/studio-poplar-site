import { afterEach, describe, expect, it } from "vitest";
import { adminEmails, isAdminEmail, requireEnv, MissingEnvError } from "./env";

const original = process.env.ADMIN_EMAILS;
afterEach(() => {
  process.env.ADMIN_EMAILS = original;
});

describe("編集部の許可リスト", () => {
  it("リストにあるメールだけ通す（大文字・空白は無視）", () => {
    process.env.ADMIN_EMAILS = " Info@StudioPoplar.com , editor@example.com";
    expect(adminEmails()).toEqual(["info@studiopoplar.com", "editor@example.com"]);
    expect(isAdminEmail("info@studiopoplar.com")).toBe(true);
    expect(isAdminEmail("INFO@studiopoplar.com ")).toBe(true);
    expect(isAdminEmail("someone@gmail.com")).toBe(false);
  });

  it("リストが空なら誰も入れない", () => {
    process.env.ADMIN_EMAILS = "";
    expect(isAdminEmail("info@studiopoplar.com")).toBe(false);
    delete process.env.ADMIN_EMAILS;
    expect(isAdminEmail("info@studiopoplar.com")).toBe(false);
  });

  it("メールがないときは通さない", () => {
    process.env.ADMIN_EMAILS = "info@studiopoplar.com";
    expect(isAdminEmail(undefined)).toBe(false);
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail("")).toBe(false);
  });

  it("前方一致では通さない", () => {
    process.env.ADMIN_EMAILS = "info@studiopoplar.com";
    expect(isAdminEmail("info@studiopoplar.com.evil.example")).toBe(false);
  });
});

describe("requireEnv", () => {
  it("ないときは名前だけを含むエラー", () => {
    delete process.env.__DESHIIRI_TEST__;
    expect(() => requireEnv("__DESHIIRI_TEST__")).toThrow(MissingEnvError);
  });
});
