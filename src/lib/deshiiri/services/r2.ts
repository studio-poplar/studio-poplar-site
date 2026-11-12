import "server-only";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { requireEnv } from "@/lib/deshiiri/env";

// サイトに出す写真の置き場（Cloudflare R2 無料枠、非公開バケット）。
// 配信は /deshiiri/img/[キー] から行い、r2.dev の公開 URL は使わない（指示書 3章）。

let client: S3Client | undefined;

function r2() {
  client ??= new S3Client({
    region: "auto",
    endpoint: `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
  return client;
}

const bucket = () => requireEnv("R2_BUCKET");

export async function putObject(key: string, body: Uint8Array, contentType: string) {
  await r2().send(
    new PutObjectCommand({ Bucket: bucket(), Key: key, Body: body, ContentType: contentType, CacheControl: "public, max-age=31536000, immutable" }),
  );
}

export async function getObject(key: string) {
  const res = await r2().send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
  if (!res.Body) return null;
  return { body: await res.Body.transformToByteArray(), contentType: res.ContentType ?? "application/octet-stream" };
}

export async function deleteObject(key: string) {
  await r2().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
}

/** バケット全体の容量（無料枠の見張り用）。写真が数万枚までなら一覧を足し上げる方法で足りる。 */
export async function bucketUsage(): Promise<{ bytes: number; objects: number }> {
  const { ListObjectsV2Command } = await import("@aws-sdk/client-s3");
  let bytes = 0;
  let objects = 0;
  let token: string | undefined;
  do {
    const res = await r2().send(new ListObjectsV2Command({ Bucket: bucket(), ContinuationToken: token }));
    for (const o of res.Contents ?? []) {
      bytes += o.Size ?? 0;
      objects++;
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return { bytes, objects };
}
