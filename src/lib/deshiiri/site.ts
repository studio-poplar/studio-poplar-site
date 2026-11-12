// 公開ページの URL の頭。プレビューではプレビューのドメインを使う（LINE で送る URL が本番を指さないように）。
export function siteOrigin(): string {
  if (process.env.VERCEL_ENV === "preview") return "https://deshiiri-preview.studiopoplar.com";
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.studiopoplar.com";
}

export const personPath = (slug: string) => `/deshiiri/p/${slug}`;
export const personUrl = (slug: string) => `${siteOrigin()}${personPath(slug)}`;
