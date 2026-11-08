import { eq } from "drizzle-orm";
import { currentAdmin } from "@/lib/deshiiri/admin-auth";
import { db, schema } from "@/lib/deshiiri/db";

// 写真の配信（指示書 2章 /deshiiri/img/[キー]）。R2 は非公開バケットなので、ここを通して出す。
// 公開済みの仕事の一日の写真はだれでも見られる（CDN に長く置く）。それ以外は編集部だけ。

export async function GET(_request: Request, ctx: RouteContext<"/deshiiri/img/[...key]">) {
  const { key: parts } = await ctx.params;
  const key = parts.map(decodeURIComponent).join("/");
  if (!/^works\/[0-9a-f-]{36}\/[\w-]+\.webp$/.test(key)) return new Response("Not found", { status: 404 });

  const [row] = await db()
    .select({ status: schema.works.status })
    .from(schema.workPhotos)
    .innerJoin(schema.works, eq(schema.works.id, schema.workPhotos.workId))
    .where(eq(schema.workPhotos.r2Key, key))
    .limit(1);
  if (!row) return new Response("Not found", { status: 404 });

  const isPublic = row.status === "published";
  if (!isPublic && !(await currentAdmin())) return new Response("Not found", { status: 404 });

  const { getObject } = await import("@/lib/deshiiri/services/r2");
  const object = await getObject(key);
  if (!object) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(object.body), {
    headers: {
      "content-type": object.contentType,
      "cache-control": isPublic ? "public, max-age=86400, s-maxage=31536000" : "private, no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
