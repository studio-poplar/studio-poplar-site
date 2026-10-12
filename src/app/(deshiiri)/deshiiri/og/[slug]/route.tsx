import { getAllArticles, getArticle } from "@/lib/deshiiri/content";
import { jobLabel } from "@/lib/deshiiri/codes";
import { choLabel } from "@/lib/deshiiri/format";
import { deshiiriOgImage } from "@/lib/deshiiri/og";

// 記事の共有画像: hero 写真に題と千社札を重ねる。Generated at build time for every published article.
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
    kicker: `${choLabel(article.no)} — ${article.area}`,
    fuda: jobLabel(article.job),
    photo: article.hero,
  });
}
