import "server-only";
import { Resend } from "resend";
import { requireEnv } from "@/lib/deshiiri/env";

// デシイリ SaaS のメール（Resend 無料枠）。送信元は MAIL_FROM（ドメイン認証済みのアドレス）。

let client: Resend | undefined;

export async function sendMail(input: { to: string | string[]; subject: string; text: string; replyTo?: string }) {
  client ??= new Resend(requireEnv("RESEND_API_KEY"));
  const { error } = await client.emails.send({
    from: requireEnv("MAIL_FROM"),
    to: input.to,
    subject: input.subject,
    text: input.text,
    replyTo: input.replyTo,
  });
  if (error) throw new Error(`メールを送れませんでした（${error.name}）`);
}

/** 編集部への知らせ（確認待ちが増えた、通数が多い、など）。 */
export async function notifyEditors(subject: string, text: string) {
  await sendMail({ to: requireEnv("EDITOR_NOTIFY_EMAIL").split(",").map((s) => s.trim()), subject, text });
}
