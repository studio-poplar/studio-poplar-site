import "server-only";
import type { messagingApi, webhook } from "@line/bot-sdk";
import { reply, text } from "./client";
import {
  addPhoto,
  addWords,
  findByLineUser,
  markEventSeen,
  redeemInvite,
  savePhoto,
  toggleVisitOpen,
} from "./intake";
import { MSG } from "./messages";
import {
  publishedOf,
  publishedReply,
  publishWork,
  refreshPublic,
  requestFix,
  takeFixNote,
  withdrawWork,
} from "@/lib/deshiiri/publish";
import { fmtDay, parseVisitDate } from "@/lib/deshiiri/visits/rules";
import { answerVisit, recordVisitDate } from "@/lib/deshiiri/visits/service";
import { acceptedReply } from "@/lib/deshiiri/visits/texts";
import { MAX_PHOTOS, parseInviteCode } from "./rules";

// LINE の1イベントを処理する。返信はその場で（無料・1分以内）、写真の保存は返信のあとで行う。
// later は「返信のあとにやる仕事」を受け取る関数（route で next/server の after に渡す）。

type Later = (task: () => Promise<void>) => void;

const photoQuickReply: messagingApi.QuickReply = {
  items: [
    { type: "action", action: { type: "cameraRoll", label: "写真を選ぶ" } },
    { type: "action", action: { type: "camera", label: "写真を撮る" } },
  ],
};

export async function handleEvent(event: webhook.Event, later: Later): Promise<void> {
  if (!(await markEventSeen(event.webhookEventId))) return; // 再送された同じイベント

  const userId = event.source?.type === "user" ? event.source.userId : undefined;
  if (!userId) return; // グループやトークルームは扱わない

  const replyToken = "replyToken" in event ? event.replyToken : undefined;
  const send = async (...messages: messagingApi.Message[]) => {
    if (replyToken) await reply(replyToken, messages);
  };

  const person = await findByLineUser(userId);

  if (event.type === "follow") {
    await send(text(person ? MSG.welcomeBack : MSG.welcome));
    return;
  }

  if (!person) {
    // 招待コードで登録するまでは、コード以外は受け付けない。
    if (event.type === "message" && event.message.type === "text") {
      const code = parseInviteCode(event.message.text);
      if (!code) return send(text(MSG.askInviteCode));
      const result = await redeemInvite(userId, code);
      if (result.ok) return send(text(MSG.registered(result.person.displayName)));
      const reasons = {
        invalid: MSG.inviteInvalid,
        expired: MSG.inviteExpired,
        used: MSG.inviteUsed,
        too_many: MSG.inviteTooMany,
      } as const;
      return send(text(reasons[result.reason]));
    }
    if (event.type === "message" || event.type === "postback") return send(text(MSG.askInviteCode));
    return;
  }

  if (event.type === "postback") {
    const params = new URLSearchParams(event.postback.data);
    const action = params.get("action");
    const workId = params.get("work") ?? "";
    if (action === "owner_ok") {
      // 本人の OK：すぐ公開し、お知らせと Instagram 用文章は返信で（数えない）。
      const result = await publishWork(workId, "owner");
      if (!result || result.work.craftspersonId !== person.id) return send(text(MSG.alreadyHandled));
      return send(...publishedReply(result.work, result.person));
    }
    if (action === "owner_fix") {
      return send(text((await requestFix(workId, person.id)) ? MSG.fixAsk : MSG.alreadyHandled));
    }
    if (action === "withdraw") {
      const work = await withdrawWork(workId, person.id);
      return send(text(work ? MSG.withdrawn(work.publicTitle ?? "") : MSG.alreadyHandled));
    }
    if (action === "howto_send") return send({ ...text(MSG.howToSend), quickReply: photoQuickReply });
    if (action === "toggle_visit") {
      const open = await toggleVisitOpen(person);
      refreshPublic(person); // 職人ページの「見学」の欄を作り直す
      return send(text(open ? MSG.visitOpened : MSG.visitClosed));
    }
    const visitId = params.get("visit") ?? "";
    if (action === "visit_accept" || action === "visit_decline") {
      // 「受ける」を押したときだけ、若者の連絡先を返信で渡す（数えない）。
      const v = await answerVisit(visitId, person.id, action === "visit_accept");
      if (!v) return send(text(MSG.visitAlreadyHandled));
      return action === "visit_accept" ? send(...acceptedReply(v)) : send(text(MSG.visitDeclined));
    }
    if (action === "visit_date") {
      const date = parseVisitDate(event.postback.params?.date);
      const v = date ? await recordVisitDate(visitId, person.id, date) : null;
      return send(text(v && date ? MSG.visitDateSaved(fmtDay(date)) : MSG.visitAlreadyHandled));
    }
    if (action === "help") return send(text(MSG.help));
    return;
  }

  if (event.type !== "message") return;
  const message = event.message;

  if (message.type === "image") {
    const set = message.imageSet;
    const slot = await addPhoto(person, set?.id ?? null);
    // まとめて送られた写真は同時に届くので、席を取った順ではなく送った順（imageSet.index）で並べる。
    const sort = set?.index && !slot.overflow ? set.index : slot.index;
    later(() => savePhoto(person, slot.work.id, sort, message.id));

    // まとめて送られた写真は、最後の1枚にだけ返信する（返信は何通でも無料だが、うるさくしない）。
    const isLastOfSet = !set || !set.total || set.index === set.total;
    if (!isLastOfSet) return;
    const messages: messagingApi.Message[] = [];
    if (slot.overflow) messages.push(text(MSG.photoOverflow));
    // 最後の1枚が先に処理されることもあるので、組の枚数（total）も見て数える。
    const received = set?.total && !slot.overflow ? Math.min(Math.max(slot.index, set.total), MAX_PHOTOS) : slot.index;
    messages.push(text(slot.work.ownerWords.trim() ? MSG.photoReceived(received) : MSG.photoNeedWords(received)));
    return send(...messages);
  }

  if (message.type === "text") {
    if (message.text.trim().replace(/[。！!]$/, "") === "取り下げ") {
      const published = await publishedOf(person.id, 3);
      if (!published.length) return send(text(MSG.nothingToWithdraw));
      return send({
        type: "template",
        altText: MSG.withdrawChoose,
        template: {
          type: "buttons",
          text: MSG.withdrawChoose,
          actions: published.map((w) => ({
            type: "postback" as const,
            label: (w.publicTitle ?? "記事").slice(0, 20),
            data: `action=withdraw&work=${w.id}`,
            displayText: "取り下げる",
          })),
        },
      });
    }
    // 「直したい」のあとに届いた文字は、新しい投稿ではなく直してほしい点として受け取る。
    if (await takeFixNote(person.id, message.text)) return send(text(MSG.fixReceived));
    const result = await addWords(person, message.text);
    if (result.kind === "answer") return send(text(MSG.answerReceived));
    if (result.askQuestion) return send(text(MSG.question));
    return send(text(result.work.photoCount > 0 ? MSG.wordsReceived : MSG.wordsNeedPhoto));
  }

  if (message.type === "sticker") return;
  return send(text(MSG.unsupported));
}
