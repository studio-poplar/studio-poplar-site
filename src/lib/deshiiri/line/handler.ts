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
import { parseInviteCode } from "./rules";

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
    const action = new URLSearchParams(event.postback.data).get("action");
    if (action === "howto_send") return send({ ...text(MSG.howToSend), quickReply: photoQuickReply });
    if (action === "toggle_visit") {
      const open = await toggleVisitOpen(person);
      return send(text(open ? MSG.visitOpened : MSG.visitClosed));
    }
    if (action === "help") return send(text(MSG.help));
    return;
  }

  if (event.type !== "message") return;
  const message = event.message;

  if (message.type === "image") {
    const set = message.imageSet;
    const slot = await addPhoto(person, set?.id ?? null);
    later(() => savePhoto(person, slot.work.id, slot.index, message.id));

    // まとめて送られた写真は、最後の1枚にだけ返信する（返信は何通でも無料だが、うるさくしない）。
    const isLastOfSet = !set || !set.total || set.index === set.total;
    if (!isLastOfSet) return;
    const messages: messagingApi.Message[] = [];
    if (slot.overflow) messages.push(text(MSG.photoOverflow));
    messages.push(
      text(slot.work.ownerWords.trim() ? MSG.photoReceived(slot.index) : MSG.photoNeedWords(slot.index)),
    );
    return send(...messages);
  }

  if (message.type === "text") {
    const result = await addWords(person, message.text);
    if (result.kind === "answer") return send(text(MSG.answerReceived));
    if (result.askQuestion) return send(text(MSG.question));
    return send(text(result.work.photoCount > 0 ? MSG.wordsReceived : MSG.wordsNeedPhoto));
  }

  if (message.type === "sticker") return;
  return send(text(MSG.unsupported));
}
