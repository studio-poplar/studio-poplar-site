import "server-only";
import type { MetadataRoute } from "next";
import { listByTrade } from "@/lib/deshiiri/public-queries";
import { saasPagesIndexed } from "@/lib/deshiiri/saas-public";
import { TRADES } from "@/lib/deshiiri/trades";

// SaaS の公開ページ（職種一覧・職人ページ）のサイトマップ。正式に案内するまで（DESHIIRI_SAAS_PUBLIC=1 まで）は出さない。
// 職人ページは、職種一覧に出ている人（90日以内に仕事の一日を公開した人）だけを入れる。
export async function saasSitemap(siteUrl: string): Promise<MetadataRoute.Sitemap> {
  if (!saasPagesIndexed()) return [];
  const base = `${siteUrl}/deshiiri`;
  const lists = await Promise.all(TRADES.map(async (trade) => ({ trade, people: await listByTrade(trade) })));
  const people = lists.flatMap((l) => l.people);
  return [
    { url: `${base}/shokushu` },
    ...lists.filter((l) => l.people.length).map((l) => ({ url: `${base}/shokushu/${l.trade}`, lastModified: l.people[0]?.latestAt ?? undefined })),
    ...people.map((p) => ({ url: `${base}/p/${p.slug}`, lastModified: p.latestAt ?? undefined })),
  ];
}
