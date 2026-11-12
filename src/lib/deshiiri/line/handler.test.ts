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
const publish = vi.hoisted(() => ({
  publishWork: vi.fn(),
  publishedReply: vi.fn(() => [{ type: "text", text: "公開しました" }]),
  requestFix: vi.fn(),
  takeFixNote: vi.fn(async () => false),
  withdrawWork: vi.fn(),
  publishedOf: vi.fn(async (): Promise<{ id: string; publicTitle: string }[]> => []),
  refreshPublic: vi.fn(),
}));
const visits = vi.hoisted(() => ({ answerVisit: vi.fn(), recordVisitDate: vi.fn() }));
vi.mock("@/lib/deshiiri/visits/service", () => visits);
vi.mock("@/lib/deshiiri/site", () => ({ siteOrigin: () => "https://example.test" }));
vi.mock("./intake", () => intake);
vi.mock("@/lib/deshiiri/publish", () => publish);
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
  publish.takeFixNote.mockResolvedValue(false);
  publish.publishedOf.mockResolvedValue([]);
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

const postback = (data: string) => ({ ...base, type: "postback", postback: { data } }) as unknown as webhook.Event;

describe("本人確認（M3）", () => {
  beforeEach(() => intake.findByLineUser.mockResolvedValue(person));

  it("OK を押したら公開し、お知らせを返信で返す（プッシュしない）", async () => {
    publish.publishWork.mockResolvedValue({ work: { id: "w1", craftspersonId: "p1" }, person });
    await handleEvent(postback("action=owner_ok&work=w1"), later);
    expect(publish.publishWork).toHaveBeenCalledWith("w1", "owner");
    expect(replied()).toEqual(["公開しました"]);
  });

  it("他人の投稿の OK・済んだ確認は「済んでいます」と返す", async () => {
    publish.publishWork.mockResolvedValue(null);
    await handleEvent(postback("action=owner_ok&work=w9"), later);
    expect(replied()).toEqual([MSG.alreadyHandled]);
  });

  it("直したいを押したら、直す点を書いてもらうよう返す", async () => {
    publish.requestFix.mockResolvedValue(true);
    await handleEvent(postback("action=owner_fix&work=w1"), later);
    expect(publish.requestFix).toHaveBeenCalledWith("w1", "p1");
    expect(replied()).toEqual([MSG.fixAsk]);
  });

  it("直したいのあとの文字は、新しい投稿にしない", async () => {
    publish.takeFixNote.mockResolvedValue(true);
    await handleEvent(textEvent("見出しの字を直してほしい"), later);
    expect(intake.addWords).not.toHaveBeenCalled();
    expect(replied()).toEqual([MSG.fixReceived]);
  });

  it("「取り下げ」と送ると、公開中の記事を選ばせる。なければそう返す", async () => {
    await handleEvent(textEvent("取り下げ"), later);
    expect(replied()).toEqual([MSG.nothingToWithdraw]);
    publish.publishedOf.mockResolvedValue([{ id: "w1", publicTitle: "梁を削る" }]);
    await handleEvent(textEvent("取り下げ。"), later);
    const msg = client.reply.mock.calls.at(-1)?.[1][0];
    expect(msg.template.actions[0].data).toBe("action=withdraw&work=w1");
  });

  it("取り下げるボタンは、自分の記事だけを取り下げる", async () => {
    publish.withdrawWork.mockResolvedValue({ publicTitle: "梁を削る" });
    await handleEvent(postback("action=withdraw&work=w1"), later);
    expect(publish.withdrawWork).toHaveBeenCalledWith("w1", "p1");
    expect(replied()).toEqual([MSG.withdrawn("梁を削る")]);
  });
});

describe("見学の申し込みへの返事", () => {
  const visit = {
    id: "00000000-0000-4000-8000-000000000001",
    name: "さくら",
    email: "sakura@example.com",
    under18: true,
    guardianName: "保護者",
    guardianEmail: "parent@example.com",
    schoolOrJob: "高校2年",
    wishes: ["12月の土曜"],
    message: null,
  };
  const pb = (data: string, params?: Record<string, string>) =>
    ({ ...base, type: "postback", postback: { data, params } }) as unknown as webhook.Event;
  beforeEach(() => intake.findByLineUser.mockResolvedValue(person));

  it("「受ける」で、その職人の申し込みだけを動かし、連絡先を返信で渡す", async () => {
    visits.answerVisit.mockResolvedValue(visit);
    await handleEvent(pb(`action=visit_accept&visit=${visit.id}`), later);
    expect(visits.answerVisit).toHaveBeenCalledWith(visit.id, "p1", true);
    const sent = client.reply.mock.calls.at(-1)?.[1];
    expect(sent[0].text).toContain("sakura@example.com");
    expect(sent[0].text).toContain("parent@example.com");
    expect(sent[1].template.actions[0]).toMatchObject({ type: "datetimepicker", mode: "date" });
  });

  it("「今回は見送る」では連絡先を渡さない", async () => {
    visits.answerVisit.mockResolvedValue(visit);
    await handleEvent(pb(`action=visit_decline&visit=${visit.id}`), later);
    expect(visits.answerVisit).toHaveBeenCalledWith(visit.id, "p1", false);
    expect(replied()).toEqual([MSG.visitDeclined]);
  });

  it("返事済み・ほかの職人の申し込みには「すでに済んでいます」", async () => {
    visits.answerVisit.mockResolvedValue(null);
    await handleEvent(pb(`action=visit_accept&visit=${visit.id}`), later);
    expect(replied()).toEqual([MSG.visitAlreadyHandled]);
  });

  it("「日が決まった」で選んだ日を日本時間で記録する", async () => {
    visits.recordVisitDate.mockResolvedValue({ id: visit.id });
    await handleEvent(pb(`action=visit_date&visit=${visit.id}`, { date: "2026-12-13" }), later);
    expect(visits.recordVisitDate).toHaveBeenCalledWith(visit.id, "p1", new Date("2026-12-13T00:00:00+09:00"));
    expect(replied()?.[0]).toContain("12月13日");
  });

  it("受付の休止・再開では職人ページを作り直す", async () => {
    intake.toggleVisitOpen.mockResolvedValue(false);
    await handleEvent(pb("action=toggle_visit"), later);
    expect(publish.refreshPublic).toHaveBeenCalledWith(person);
  });
});
