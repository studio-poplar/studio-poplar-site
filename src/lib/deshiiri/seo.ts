import type { Metadata } from "next";

export const DESHIIRI_NAME = "デシイリ";

type Input = {
  title: string;
  description: string;
  // Path from the site root, e.g. "/deshiiri/meikan"
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  // Set when the page has its own share image (stage 7: articles get a generated one).
  image?: string;
  noindex?: boolean;
};

// Each デシイリ page states its own canonical URL and share card; titles end in 「｜デシイリ」.
export function deshiiriMetadata({ title, description, path, type = "website", publishedTime, image, noindex }: Input): Metadata {
  const fullTitle = `${title}｜${DESHIIRI_NAME}`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      locale: "ja_JP",
      siteName: DESHIIRI_NAME,
      title: fullTitle,
      description,
      url: path,
      ...(image ? { images: [image] } : {}),
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
