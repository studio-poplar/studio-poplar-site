import "server-only";
import { Readable } from "node:stream";
import { drive as googleDrive, type drive_v3 } from "@googleapis/drive";
import { getVercelOidcToken } from "@vercel/oidc";
import { ExternalAccountClient } from "google-auth-library";
import { requireEnv } from "@/lib/deshiiri/env";

// 写真の原本とバックアップの置き場（共有ドライブ「デシイリ原本」）。
// サービスアカウント deshiiri-drive を共有ドライブのコンテンツ管理者に入れて使う。
//
// 鍵（JSON）は使わない。studiopoplar.com の組織ポリシーで鍵の作成が禁止されているため、
// Vercel が実行ごとに発行する OIDC トークンを Google の Workload Identity 連携で
// 短時間のアクセストークンに引き換え、サービスアカウントとして動く。
// 必要な値（GCP_*）はどれも秘密ではない。Vercel 上でしか動かない（手元ではトークンが出ない）。

let client: drive_v3.Drive | undefined;

/** Workload Identity 連携の設定。テストから中身を確かめられるよう分けておく。 */
export function externalAccountConfig() {
  const projectNumber = requireEnv("GCP_PROJECT_NUMBER");
  const pool = requireEnv("GCP_WORKLOAD_IDENTITY_POOL_ID");
  const provider = requireEnv("GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID");
  const serviceAccount = requireEnv("GCP_SERVICE_ACCOUNT_EMAIL");
  return {
    type: "external_account" as const,
    audience: `//iam.googleapis.com/projects/${projectNumber}/locations/global/workloadIdentityPools/${pool}/providers/${provider}`,
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    token_url: "https://sts.googleapis.com/v1/token",
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccount}:generateAccessToken`,
    scopes: ["https://www.googleapis.com/auth/drive"],
  };
}

function drive() {
  if (!client) {
    const authClient = ExternalAccountClient.fromJSON({
      ...externalAccountConfig(),
      subject_token_supplier: { getSubjectToken: () => getVercelOidcToken() },
    });
    if (!authClient) throw new Error("ドライブの認証設定を作れませんでした");
    client = googleDrive({ version: "v3", auth: authClient });
  }
  return client;
}

const rootFolder = () => requireEnv("GOOGLE_DRIVE_FOLDER_ID");

/** フォルダの下にファイルを置き、ファイル ID を返す。parentId を省くと「デシイリ原本」の直下。 */
export async function uploadFile(name: string, body: Uint8Array, mimeType: string, parentId?: string): Promise<string> {
  const res = await drive().files.create({
    requestBody: { name, parents: [parentId ?? rootFolder()] },
    media: { mimeType, body: Readable.from(Buffer.from(body)) },
    fields: "id",
    supportsAllDrives: true,
  });
  if (!res.data.id) throw new Error("ドライブへの保存に失敗しました");
  return res.data.id;
}

export async function deleteFile(fileId: string) {
  await drive().files.delete({ fileId, supportsAllDrives: true });
}

/** 接続の確認用。フォルダの名前を返す。 */
export async function folderName(): Promise<string> {
  const res = await drive().files.get({ fileId: rootFolder(), fields: "name", supportsAllDrives: true });
  return res.data.name ?? "";
}
