import "server-only";
import { messagingApi, validateSignature } from "@line/bot-sdk";
import { requireEnv } from "@/lib/deshiiri/env";

// LINE Messaging API（指示書 6章）。こちらから送るのは原則「返信」（無料・数えない）。
// プッシュは月200通の無料枠を数えるので、M3 以降で push_log に記録して使う。

let client: messagingApi.MessagingApiClient | undefined;
let blob: messagingApi.MessagingApiBlobClient | undefined;

export function lineClient() {
  client ??= new messagingApi.MessagingApiClient({ channelAccessToken: requireEnv("LINE_CHANNEL_ACCESS_TOKEN") });
  return client;
}

export function lineBlob() {
  blob ??= new messagingApi.MessagingApiBlobClient({ channelAccessToken: requireEnv("LINE_CHANNEL_ACCESS_TOKEN") });
  return blob;
}

/** webhook の署名（x-line-signature）を確かめる。本文は受け取ったままの文字列で比べる。 */
export function verifySignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  return validateSignature(rawBody, requireEnv("LINE_CHANNEL_SECRET"), signature);
}

export async function reply(replyToken: string, messages: messagingApi.Message[]) {
  await lineClient().replyMessage({ replyToken, messages: messages.slice(0, 5) });
}

/** ユーザーが送った写真の中身を受け取る。 */
export async function downloadContent(messageId: string): Promise<Buffer> {
  const stream = await lineBlob().getMessageContent(messageId);
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export const text = (t: string): messagingApi.TextMessage => ({ type: "text", text: t });
