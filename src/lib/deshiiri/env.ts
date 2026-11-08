// 秘密の値は環境変数だけに置く（指示書 5章・9章）。値そのものはログに出さない。

export class MissingEnvError extends Error {
  constructor(name: string) {
    super(`環境変数 ${name} が設定されていません`);
    this.name = "MissingEnvError";
  }
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new MissingEnvError(name);
  return value;
}

/** ADMIN_EMAILS（カンマ区切り）を小文字にして返す。空なら誰も入れない。 */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.trim().toLowerCase());
}

/** 9章の環境変数。管理画面の「接続の状態」で、値ではなく有無だけを見せる。 */
export const SAAS_ENV = {
  Neon: ["DATABASE_URL"],
  "Cloudflare R2": ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"],
  "Google ドライブ": ["GOOGLE_DRIVE_FOLDER_ID", "GOOGLE_SERVICE_ACCOUNT_JSON"],
  "Auth.js": ["AUTH_SECRET", "AUTH_GOOGLE_ID", "AUTH_GOOGLE_SECRET", "ADMIN_EMAILS"],
  LINE: ["LINE_CHANNEL_SECRET", "LINE_CHANNEL_ACCESS_TOKEN"],
  "Claude API": ["ANTHROPIC_API_KEY"],
  Resend: ["RESEND_API_KEY", "MAIL_FROM", "EDITOR_NOTIFY_EMAIL"],
  Sentry: ["SENTRY_DSN"],
  "定時の仕事": ["CRON_SECRET"],
} as const;

export function envStatus() {
  return Object.entries(SAAS_ENV).map(([service, names]) => ({
    service,
    vars: names.map((name) => ({ name, set: Boolean(process.env[name]) })),
  }));
}
