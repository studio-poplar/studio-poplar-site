import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/deshiiri/db", () => ({ db: () => ({}), schema: {} }));
import { readyForDraft } from "./drafts";

const now = new Date("2026-11-12T13:00:00Z");
const ago = (min: number) => new Date(now.getTime() - min * 60_000);
type W = Parameters<typeof readyForDraft>[0];
const work = (over: Partial<W> = {}) =>
  ({ status: "received", photoCount: 2, updatedAt: ago(30), ownerQuestionAt: null, ...over }) as W;

describe("下書きに回す投稿の選び方", () => {
  it("まとめの10分が過ぎ、写真が保存済みなら回す", () => {
    expect(readyForDraft(work(), 2, now)).toBe(true);
  });
  it("10分以内（まだ写真や一言が届くかもしれない）は待つ", () => {
    expect(readyForDraft(work({ updatedAt: ago(5) }), 2, now)).toBe(false);
  });
  it("質問の答え待ち（30分以内）は待つ", () => {
    expect(readyForDraft(work({ ownerQuestionAt: ago(20), updatedAt: ago(20) }), 2, now)).toBe(false);
  });
  it("写真の保存が終わっていなければ待つ。ただし1時間たったら保存できた分で進める", () => {
    expect(readyForDraft(work(), 1, now)).toBe(false);
    expect(readyForDraft(work({ updatedAt: ago(61) }), 1, now)).toBe(true);
  });
  it("写真がない投稿・受け取り以外の状態は回さない", () => {
    expect(readyForDraft(work({ photoCount: 0 }), 0, now)).toBe(false);
    expect(readyForDraft(work({ status: "drafting" }), 2, now)).toBe(false);
  });
});
