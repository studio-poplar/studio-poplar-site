import { getAllArticles, getArticle } from "@/lib/deshiiri/content";
import { jobLabel } from "@/lib/deshiiri/codes";
import { noLabel } from "@/lib/deshiiri/format";
import { deshiiriOgImage } from "@/lib/deshiiri/og";

// 記事の共有画像: hero 写真に題と、仕事・町を重ねる。Generated at build time for every published article.
export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function GET(_request: Request, { params }: RouteContext<"/deshiiri/og/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return new Response("Not found", { status: 404 });
  return deshiiriOgImage({
    title: article.title,
    kicker: `${jobLabel(article.job)}｜${article.area}　${noLabel(article.no)}`,
    photo: article.hero,
  });
}
