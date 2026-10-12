import { deshiiriOgImage } from "@/lib/deshiiri/og";

// デシイリ全体の共有画像。A fixed URL (/deshiiri/og) so every non-article page can name it in its
// metadata; a page-level openGraph object would otherwise drop a file-based image.
export const dynamic = "force-static";

export async function GET() {
  return deshiiriOgImage({ title: "職人と家業の、まだ知られていない話。", kicker: "横浜・神奈川" });
}
