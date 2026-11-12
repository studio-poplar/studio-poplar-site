import type { webhook } from "@line/bot-sdk";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const intake = vi.hoisted(() => ({
  markEventSeen: vi.fn(),
  findByLineUser: vi.fn(),
  redeemInvite: vi.fn(),
  addPhoto: vi.fn(),
  addWords: vi.fn(),
  savePhoto: vi.fn(),
  toggleVisitOpen: vi.fn(),
}));
const client = vi.hoisted(() => ({ reply: vi.fn(), text: (t: string) => ({ type: "text", text: t }) }));
vi.mock("./intake", () => intake);
vi.mock("./client", () => client);

import { handleEvent } from "./handler";
import { MSG } from "./messages";

const person = { id: "p1", displayName: "左官 太郎", slug: "taro" };
const base = {
  webhookEventId: "ev1",
  timestamp: 0,
  mode: "active",
  deliveryContext: { isRedelivery: false },
  source: { type: "user", userId: "Uxxxxxxxx" },
  replyToken: "rt",
};
const textEvent = (t: string) => ({ ...base, type: "message", message: { type: "text", id: "m1", text: t } }) as unknown as webhook.Event;
const imageEvent = (imageSet?: { id: string; index: number; total: number }) =>
  ({ ...base, type: "message", message: { type: "image", id: "img1", imageSet } }) as unknown as webhook.Event;
const replied = () => client.reply.mock.calls.at(-1)?.[1].map((m: { text: string }) => m.text);
const later = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  intake.markEventSeen.mockResolvedValue(true);
});

describe("同じイベントは2回処理しない", () => {
  it("見たことのある webhookEventId なら何もしない", async () => {
    intake.markEventSeen.mockResolvedValue(false);
    await handleEvent(textEvent("123456"), later);
    expect(intake.findByLineUser).not.toHaveBeenCalled();
    expect(client.reply).not.toHaveBeenCalled();
  });
});

describe("招待コードで登録する前", () => {
  beforeEach(() => intake.findByLineUser.mockResolvedValue(undefined));

  it("6けたなら登録を試み、通れば名前つきで返す", async () => {
    intake.redeemInvite.mockResolvedValue({ ok: true, person });
    await handleEvent(textEvent("１２３４５６"), later);
    expect(intake.redeemInvite).toHaveBeenCalledWith("Uxxxxxxxx", "123456");
    expect(replied()).toEqual([MSG.registered("左官 太郎")]);
  });

  it("期限切れ・使用済みはそれぞれの案内を返す", async () => {
    intake.redeemInvite.mockResolvedValue({ ok: false, reason: "expired" });
    await handleEvent(textEvent("123456"), later);
    expect(replied()).toEqual([MSG.inviteExpired]);
  });

  it("コード以外の文字や写真には、コードを送るよう返す（投稿は作らない）", async () => {
    await handleEvent(textEvent("こんにちは"), later);
    expect(replied()).toEqual([MSG.askInviteCode]);
    await handleEvent(imageEvent(), later);
    expect(intake.addPhoto).not.toHaveBeenCalled();
    expect(later).not.toHaveBeenCalled();
  });
});

describe("登録済みの職人", () => {
  beforeEach(() => intake.findByLineUser.mockResolvedValue(person));

  it("写真は席を取ってから、保存を返信のあとに回す", async () => {
    intake.addPhoto.mockResolvedValue({ work: { id: "w1", ownerWords: "" }, index: 1, overflow: false });
    await handleEvent(imageEvent(), later);
    expect(intake.addPhoto).toHaveBeenCalledWith(person, null);
    expect(later).toHaveBeenCalledTimes(1);
    expect(intake.savePhoto).not.toHaveBeenCalled(); // まだ保存しない
    later.mock.calls[0][0]();
    expect(intake.savePhoto).toHaveBeenCalledWith(person, "w1", 1, "img1");
    expect(replied()).toEqual([MSG.photoNeedWords(1)]);
  });

  it("まとめて送られた写真は、送った順（imageSet.index）で並べ、枚数は組の数で返す", async () => {
    // 最後の1枚（2枚目）が先に処理されて、席は1番目を取った場合
    intake.addPhoto.mockResolvedValue({ work: { id: "w1", ownerWords: "" }, index: 1, overflow: false });
    await handleEvent(imageEvent({ id: "s2", index: 2, total: 2 }), later);
    later.mock.calls[0][0]();
    expect(intake.savePhoto).toHaveBeenCalledWith(person, "w1", 2, "img1");
    expect(replied()).toEqual([MSG.photoNeedWords(2)]);
  });

  it("まとめて送られた写真は最後の1枚にだけ返信する", async () => {
    intake.addPhoto.mockResolvedValue({ work: { id: "w1", ownerWords: "塗った" }, index: 2, overflow: false });
    await handleEvent(imageEvent({ id: "s1", index: 1, total: 3 }), later);
    expect(client.reply).not.toHaveBeenCalled();
    intake.addPhoto.mockResolvedValue({ work: { id: "w1", ownerWords: "塗った" }, index: 3, overflow: false });
    await handleEvent(imageEvent({ id: "s1", index: 3, total: 3 }), later);
    expect(replied()).toEqual([MSG.photoReceived(3)]);
  });

  it("5枚目からは次の投稿になったことを知らせる", async () => {
    intake.addPhoto.mockResolvedValue({ work: { id: "w2", ownerWords: "" }, index: 1, overflow: true });
    await handleEvent(imageEvent(), later);
    expect(replied()).toEqual([MSG.photoOverflow, MSG.photoNeedWords(1)]);
  });

  it("一言が短いときは質問を1つだけ返す", async () => {
    intake.addWords.mockResolvedValue({ kind: "words", work: { photoCount: 2 }, askQuestion: true });
    await handleEvent(textEvent("塗った"), later);
    expect(replied()).toEqual([MSG.question]);
  });

  it("質問への答えは受け取りのお礼を返す", async () => {
    intake.addWords.mockResolvedValue({ kind: "answer", work: {} });
    await handleEvent(textEvent("鏝の角度"), later);
    expect(replied()).toEqual([MSG.answerReceived]);
  });

  it("一言だけで写真がまだなら、写真を頼む", async () => {
    intake.addWords.mockResolvedValue({ kind: "words", work: { photoCount: 0 }, askQuestion: false });
    await handleEvent(textEvent("今日は土間の仕上げをした"), later);
    expect(replied()).toEqual([MSG.wordsNeedPhoto]);
  });

  it("メニューの「見学の受付」は止める・再開を切り替える", async () => {
    intake.toggleVisitOpen.mockResolvedValue(false);
    const ev = { ...base, type: "postback", postback: { data: "action=toggle_visit" } } as unknown as webhook.Event;
    await handleEvent(ev, later);
    expect(replied()).toEqual([MSG.visitClosed]);
  });
});
