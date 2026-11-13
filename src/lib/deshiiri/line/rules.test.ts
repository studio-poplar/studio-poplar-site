import { describe, expect, it } from "vitest";
import { awaitingAnswer, canTakePhoto, joinWords, needsQuestion, parseInviteCode } from "./rules";

const now = new Date("2026-11-08T10:00:00Z");
const ago = (min: number) => new Date(now.getTime() - min * 60_000);

describe("招待コード", () => {
  it("6けたの数字だけを受け付ける（全角・空白・ハイフンは許す）", () => {
    expect(parseInviteCode("123456")).toBe("123456");
    expect(parseInviteCode("１２３４５６")).toBe("123456");
    expect(parseInviteCode(" 123 456 ")).toBe("123456");
    expect(parseInviteCode("123-456")).toBe("123456");
    expect(parseInviteCode("12345")).toBeNull();
    expect(parseInviteCode("1234567")).toBeNull();
    expect(parseInviteCode("今日は壁を塗った")).toBeNull();
  });
});

describe("一言が短いときの質問", () => {
  it("10字未満でまだ聞いていなければ聞く", () => {
    expect(needsQuestion("塗った", null)).toBe(true);
    expect(needsQuestion("今日は土間の仕上げで、鏝を三回替えた", null)).toBe(false);
  });
  it("一度聞いたらもう聞かない", () => {
    expect(needsQuestion("塗った", ago(1))).toBe(false);
  });
  it("絵文字は1字として数える", () => {
    expect(needsQuestion("👍👍👍👍👍👍👍👍👍👍", null)).toBe(false);
  });
  it("30分以内で、質問のあとに一言が来ていなければ答え待ち", () => {
    expect(awaitingAnswer({ ownerQuestionAt: ago(5), updatedAt: ago(5) }, now)).toBe(true);
    expect(awaitingAnswer({ ownerQuestionAt: ago(31), updatedAt: ago(31) }, now)).toBe(false);
    expect(awaitingAnswer({ ownerQuestionAt: ago(5), updatedAt: ago(2) }, now)).toBe(false);
    expect(awaitingAnswer({ ownerQuestionAt: null, updatedAt: ago(1) }, now)).toBe(false);
  });
});

describe("写真と一言のまとめ", () => {
  it("一言は改行でつなぐ", () => {
    expect(joinWords("", "塗った")).toBe("塗った");
    expect(joinWords("塗った", "鏝を替えた")).toBe("塗った\n鏝を替えた");
    expect(joinWords("塗った", "  ")).toBe("塗った");
  });
  it("10分以内・4枚未満・同じ組なら同じ投稿にまとめる", () => {
    const base = { photoCount: 1, lineImageSetId: null, updatedAt: ago(3) };
    expect(canTakePhoto(base, null, now)).toBe(true);
    expect(canTakePhoto(base, "set-a", now)).toBe(true);
    expect(canTakePhoto({ ...base, updatedAt: ago(11) }, null, now)).toBe(false);
    expect(canTakePhoto({ ...base, photoCount: 4 }, null, now)).toBe(false);
    expect(canTakePhoto({ ...base, lineImageSetId: "set-b" }, "set-a", now)).toBe(false);
    expect(canTakePhoto({ ...base, lineImageSetId: "set-a" }, "set-a", now)).toBe(true);
  });
});
