import type { MetadataRoute } from "next";
import { getAllArticles, getAllShokunin, isDeshiiriLive } from "./content";
import { SERIES } from "./codes";

// デシイリ part of the main sitemap. Drafts are left out even on preview builds, and craft/town/series
// pages only appear once they have something on them (they are noindex until then).
export function deshiiriSitemap(siteUrl: string): MetadataRoute.Sitemap {
  if (!isDeshiiriLive()) return [];
  const base = `${siteUrl}/deshiiri`;
  const articles = getAllArticles().filter((a) => !a.draft);
  const people = getAllShokunin().filter((p) => !p.draft);
  const unique = (list: string[]) => [...new Set(list)];
  const latest = articles[0]?.publishedAt;

  return [
    { url: base, lastModified: latest },
    { url: `${base}/articles`, lastModified: latest },
    ...articles.map((a) => ({ url: `${base}/articles/${a.slug}`, lastModified: a.publishedAt })),
    { url: `${base}/meikan` },
    ...people.map((p) => ({ url: `${base}/meikan/${p.id}` })),
    ...unique(people.map((p) => p.job)).map((job) => ({ url: `${base}/shigoto/${job}` })),
    ...unique(people.map((p) => p.city)).map((city) => ({ url: `${base}/machi/${city}` })),
    ...Object.keys(SERIES)
      .filter((s) => articles.some((a) => a.series === s))
      .map((s) => ({ url: `${base}/rensai/${s}` })),
    { url: `${base}/about` },
    { url: `${base}/for-shokunin` },
    { url: `${base}/contact` },
    { url: `${base}/sponsor` },
    { url: `${base}/privacy` },
  ];
}
