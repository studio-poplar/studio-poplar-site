import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/deshiiri/site", () => ({ siteOrigin: () => "https://example.test" }));

import { dueAction, hashToken, isTokenShape, newConsentToken, parseVisitDate, statusLabel, visitSchema } from "./rules";
import { acceptedReply, guardianMail, notArrangedMail, receivedMail, visitNotice, type VisitView } from "./texts";

const ok = {
  name: "さくら",
  email: "sakura@example.com",
  under18: "no",
  wish1: "12月の土曜",
  agree: "on",
};

describe("見学フォームの入力チェック", () => {
  it("18歳以上は保護者なしで通る", () => {
    expect(visitSchema.safeParse(ok).success).toBe(true);
  });
  it("18歳未満は保護者の名前とメールが要る", () => {
    const r = visitSchema.safeParse({ ...ok, under18: "yes" });
    expect(r.success).toBe(false);
    expect(r.error?.issues.map((i) => i.path[0])).toEqual(expect.arrayContaining(["guardianName", "guardianEmail"]));
  });
  it("保護者のメールが本人と同じなら通さない", () => {
    const r = visitSchema.safeParse({ ...ok, under18: "yes", guardianName: "母", guardianEmail: "SAKURA@example.com" });
    expect(r.success).toBe(false);
  });
  it("都合のよい時期は1つ以上", () => {
    expect(visitSchema.safeParse({ ...ok, wish1: "" }).success).toBe(false);
  });
  it("個人情報の同意がないと通さない", () => {
    expect(visitSchema.safeParse({ ...ok, agree: undefined }).success).toBe(false);
  });
});

describe("定時の仕事の判断（3日で1回だけ再通知、7日で不成立）", () => {
  const t0 = new Date("2026-11-01T00:00:00Z");
  const at = (days: number) => new Date(t0.getTime() + days * 86400000);
  const sent = { status: "sent" as const, createdAt: t0, notifiedAt: t0, remindedAt: null };

  it("届いて3日未満は何もしない", () => expect(dueAction(sent, at(2.9))).toBeNull());
  it("3日で再通知", () => expect(dueAction(sent, at(3))).toBe("remind"));
  it("再通知は1回だけ", () => expect(dueAction({ ...sent, remindedAt: at(3) }, at(5))).toBeNull());
  it("7日で不成立", () => expect(dueAction({ ...sent, remindedAt: at(3) }, at(7))).toBe("expire"));
  it("保護者の同意が7日ないと不成立", () =>
    expect(dueAction({ status: "waiting_guardian", createdAt: t0, notifiedAt: null, remindedAt: null }, at(7))).toBe("expire_guardian"));
  it("保護者待ちのあいだは職人に再通知しない", () =>
    expect(dueAction({ status: "waiting_guardian", createdAt: t0, notifiedAt: null, remindedAt: null }, at(4))).toBeNull());
  it("受けた・見送った申し込みには何もしない", () => {
    for (const status of ["accepted", "declined", "no_answer", "done"] as const) expect(dueAction({ ...sent, status }, at(30))).toBeNull();
  });
});

describe("保護者の同意リンク", () => {
  it("DB にはリンクそのものではなくハッシュを残す", () => {
    const { token, hash } = newConsentToken();
    expect(isTokenShape(token)).toBe(true);
    expect(hash).toBe(hashToken(token));
    expect(hash).not.toContain(token);
  });
  it("形の違うものは受け付けない", () => expect(isTokenShape("../../etc")).toBe(false));
});

describe("日付と状態の表示", () => {
  it("LINE の日付は日本時間の0時", () => expect(parseVisitDate("2026-12-13")?.toISOString()).toBe("2026-12-12T15:00:00.000Z"));
  it("おかしな日付は null", () => expect(parseVisitDate("12/13")).toBeNull());
  it("受けて日付があれば「日が決まった」", () => expect(statusLabel("accepted", true)).toBe("日が決まった"));
});

describe("文面：連絡先は「受ける」のときだけ", () => {
  const v: VisitView = {
    id: "00000000-0000-4000-8000-000000000001",
    name: "さくら",
    email: "sakura@example.com",
    under18: true,
    guardianName: "母",
    guardianEmail: "parent@example.com",
    schoolOrJob: "高校2年",
    wishes: ["12月の土曜", "冬休み"],
    message: "音を聞いてみたい",
  };
  const p = { displayName: "左官 太郎", shopName: null, trade: "sakan" as const, area: "横浜市" };
  const all = (ms: unknown[]) => JSON.stringify(ms);

  it("申し込みの知らせ（プッシュ）にメールアドレスを入れない", () => {
    const s = all(visitNotice(v));
    expect(s).not.toContain("sakura@example.com");
    expect(s).not.toContain("parent@example.com");
    expect(s).toContain("12月の土曜");
    expect(s).toContain("action=visit_accept");
  });
  it("「受ける」の返信には本人と保護者の連絡先が入る", () => {
    const s = all(acceptedReply(v));
    expect(s).toContain("sakura@example.com");
    expect(s).toContain("parent@example.com");
  });
  it("保護者へのメールに同意のリンクが入る", () => {
    const m = guardianMail(v, p, "https://example.test/deshiiri/visit/consent/abc");
    expect(m.to).toEqual(["parent@example.com"]);
    expect(m.text).toContain("https://example.test/deshiiri/visit/consent/abc");
  });
  it("受付メールは本人だけ、不成立のメールは保護者にも", () => {
    expect(receivedMail(v, p).to).toEqual(["sakura@example.com"]);
    expect(notArrangedMail(v, p).to).toEqual(["sakura@example.com", "parent@example.com"]);
  });
});
