import "server-only";
import { Readable } from "node:stream";
import { auth as googleAuth, drive as googleDrive, type drive_v3 } from "@googleapis/drive";
import { requireEnv } from "@/lib/deshiiri/env";

// 写真の原本とバックアップの置き場（共有ドライブ「デシイリ原本」）。
// サービスアカウントを共有ドライブのメンバー（コンテンツ管理者）に入れて使う。

let client: drive_v3.Drive | undefined;

function drive() {
  if (!client) {
    const credentials = JSON.parse(requireEnv("GOOGLE_SERVICE_ACCOUNT_JSON"));
    const authClient = new googleAuth.GoogleAuth({ credentials, scopes: ["https://www.googleapis.com/auth/drive"] });
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
