import { eq } from "drizzle-orm";
import QRCode from "qrcode";
import { adminOr401 } from "@/lib/deshiiri/admin-auth";
import { db, schema } from "@/lib/deshiiri/db";
import { personUrl } from "@/lib/deshiiri/site";

// 職人ページの QR コード（PNG）。名刺・チラシ・現場の看板に貼る用。編集部だけが出せる。
export async function GET(_req: Request, ctx: RouteContext<"/deshiiri/admin/craftspeople/[id]/qr">) {
  const auth = await adminOr401();
  if ("response" in auth) return auth.response;
  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response("not found", { status: 404 });
  const [p] = await db()
    .select({ slug: schema.craftspeople.slug })
    .from(schema.craftspeople)
    .where(eq(schema.craftspeople.id, id))
    .limit(1);
  if (!p) return new Response("not found", { status: 404 });
  const png = await QRCode.toBuffer(personUrl(p.slug), { type: "png", width: 1024, margin: 2, errorCorrectionLevel: "M" });
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="deshiiri-${p.slug}-qr.png"`,
      "Cache-Control": "private, no-store",
    },
  });
}
