import type { messagingApi } from "@line/bot-sdk";
import { MSG } from "@/lib/deshiiri/line/messages";
import { tradeLabel, type Trade } from "@/lib/deshiiri/trades";
import { siteOrigin } from "@/lib/deshiiri/site";
import { fmtDay, todayJst } from "./rules";

// 見学の申し込みで送る LINE とメールの文面。DB に触らない（テストしやすいように）。

export type VisitView = {
  id: string;
  name: string;
  email: string;
  under18: boolean;
  guardianName: string | null;
  guardianEmail: string | null;
  schoolOrJob: string | null;
  wishes: string[];
  message: string | null;
  visitDate?: Date | null;
};
export type PersonView = { displayName: string; shopName: string | null; trade: Trade; area: string };

const sign = () => ["", "デシイリ編集部", `${siteOrigin()}/deshiiri`, "（このメールに返信すると、編集部に届きます）"];
const who = (p: PersonView) => `${p.displayName}さん（${p.area}の${tradeLabel(p.trade)}）`;
const wishLines = (v: VisitView) => v.wishes.map((w) => `・${w}`).join("\n");

// ---- 職人の LINE ----

/** 申し込みが届いた知らせ。連絡先（メール）はまだ見せない（「受ける」を押したときだけ）。 */
export function visitNotice(v: VisitView, reminder = false): messagingApi.Message[] {
  const lines = [
    reminder ? MSG.visitRemind : "見学の申し込みが届きました。",
    "",
    `お名前：${v.name}${v.schoolOrJob ? `（${v.schoolOrJob}）` : ""}`,
    "都合のよい時期：",
    wishLines(v),
  ];
  if (v.message) lines.push("", `ひとこと：「${v.message}」`);
  if (v.under18) lines.push("", "18歳未満の方です。保護者の方の同意をいただいています。");
  lines.push("", "「受ける」を押すと、この方の連絡先をお知らせします。");
  return [
    { type: "text", text: lines.join("\n") },
    {
      type: "template",
      altText: MSG.visitConfirm,
      template: {
        type: "confirm",
        text: MSG.visitConfirm,
        actions: [
          { type: "postback", label: "受ける", data: `action=visit_accept&visit=${v.id}`, displayText: "受ける" },
          { type: "postback", label: "今回は見送る", data: `action=visit_decline&visit=${v.id}`, displayText: "今回は見送る" },
        ],
      },
    },
  ];
}

/** 「受ける」への返信：連絡先と希望の時期、「日が決まった」ボタン。 */
export function acceptedReply(v: VisitView, now = new Date()): messagingApi.Message[] {
  const lines = ["受けました。連絡先をお知らせします。", "", `お名前：${v.name}`, `メール：${v.email}`];
  if (v.under18 && v.guardianEmail) {
    lines.push(`保護者：${v.guardianName ?? ""}さん ${v.guardianEmail}`, "（18歳未満の方なので、保護者の方にも同じ連絡を送ってください）");
  }
  lines.push("", "都合のよい時期：", wishLines(v));
  return [
    { type: "text", text: lines.join("\n") },
    {
      type: "template",
      altText: "日にちが決まったら「日が決まった」で教えてください",
      template: {
        type: "buttons",
        text: MSG.visitAcceptedHowTo,
        actions: [
          { type: "datetimepicker", label: "日が決まった", data: `action=visit_date&visit=${v.id}`, mode: "date", min: todayJst(now) },
        ],
      },
    },
  ];
}

// ---- メール ----

export type Mail = { to: string[]; subject: string; text: string };

const toYouth = (v: VisitView) => (v.under18 && v.guardianEmail ? [v.email, v.guardianEmail] : [v.email]);

export function receivedMail(v: VisitView, p: PersonView): Mail {
  const body = [
    `${v.name} さん`,
    "",
    `${who(p)}への見学の申し込みを受け付けました。`,
    v.under18
      ? "18歳未満の方なので、まず保護者の方に同意のお願いをメールで送りました。保護者の方が同意すると、職人さんに届きます。"
      : "職人さんにお届けしました。",
    "",
    "職人さんが「受ける」と返事をしたら、職人さんからこのメールアドレスに日にちの相談が届きます。",
    "あなたのメールアドレスは、職人さんが「受ける」と返事をしたときだけ職人さんに伝えます。",
    "",
    "都合のよい時期：",
    wishLines(v),
    ...sign(),
  ];
  return { to: [v.email], subject: "【デシイリ】見学の申し込みを受け付けました", text: body.join("\n") };
}

export function guardianMail(v: VisitView, p: PersonView, consentUrl: string): Mail {
  const body = [
    `${v.guardianName ?? ""} 様`,
    "",
    `${v.name} さんから、デシイリを通じて${who(p)}の仕事場の見学の申し込みがありました。`,
    `${v.name} さんが18歳未満のため、保護者の方の同意をいただいてから職人さんにお届けします。`,
    "",
    "下のページで申し込みの中身をご確認のうえ、「同意する」を押してください。",
    consentUrl,
    "",
    "同意すると、申し込みが職人さんに届きます。職人さんが受けた場合は、職人さんから本人と保護者の方のメールに日にちの相談が届きます。",
    "7日以内に同意がない場合、この申し込みは取り消しになります。",
    "お心当たりのない場合は、このメールは破棄してください。",
    ...sign(),
  ];
  return { to: [v.guardianEmail ?? ""], subject: "【デシイリ】見学への参加の同意のお願い", text: body.join("\n") };
}

export function consentedMail(v: VisitView, p: PersonView): Mail {
  const body = [
    `${v.name} さん`,
    "",
    `保護者の方の同意をいただいたので、${who(p)}に見学の申し込みをお届けしました。`,
    "職人さんが「受ける」と返事をしたら、職人さんからこのメールアドレスに日にちの相談が届きます。",
    ...sign(),
  ];
  return { to: toYouth(v), subject: "【デシイリ】見学の申し込みを職人さんに届けました", text: body.join("\n") };
}

export function acceptedMail(v: VisitView, p: PersonView): Mail {
  const body = [
    `${v.name} さん`,
    "",
    `${who(p)}が、見学を受けてくれました。`,
    "職人さんから、このメールアドレスに日にちの相談が届きます。数日たっても届かないときは、このメールに返信してください。",
    "",
    "見学のときは、職人さんの言うことをよく聞いて、けがのないようにしてください。",
    ...sign(),
  ];
  return { to: toYouth(v), subject: "【デシイリ】職人さんが見学を受けてくれました", text: body.join("\n") };
}

/** 見送り・返事なし・保護者の同意なし。どれも同じやわらかい言い方にする（理由は伝えない）。 */
export function notArrangedMail(v: VisitView, p: PersonView): Mail {
  const body = [
    `${v.name} さん`,
    "",
    `${who(p)}への見学は、今回は調整がつきませんでした。`,
    "職人さんの仕事の都合によるもので、申し込みの中身のせいではありません。",
    "デシイリには、ほかにも見学を受け付けている職人さんがいます。よかったら、また読んでみてください。",
    `${siteOrigin()}/deshiiri/shokushu`,
    ...sign(),
  ];
  return { to: toYouth(v), subject: "【デシイリ】見学の調整がつきませんでした", text: body.join("\n") };
}

export const visitDayLabel = (d: Date | null | undefined) => (d ? fmtDay(d) : "");
