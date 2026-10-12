import type { Metadata } from "next";
import { isDeshiiriLive } from "./content";

export const DESHIIRI_NAME = "デシイリ";

// Share images come from route handlers with fixed URLs: /deshiiri/og (shared) and
// /deshiiri/og/<slug> (each article). Page-level openGraph replaces file-based images, so
// every page names its image here.
const DEFAULT_IMAGE = { url: "/deshiiri/og", width: 1200, height: 630, alt: "デシイリ — 職人と家業の読みもの" };

type Input = {
  title: string;
  description: string;
  // Path from the site root, e.g. "/deshiiri/meikan"
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
  // Path of the page-specific share image, e.g. /deshiiri/og/<slug>
  image?: string;
};

// Each デシイリ page states its own canonical URL and share card; titles end in 「｜デシイリ」.
export function deshiiriMetadata({ title, description, path, type = "website", publishedTime, noindex, image }: Input): Metadata {
  const fullTitle = `${title}｜${DESHIIRI_NAME}`;
  const hidden = noindex || !isDeshiiriLive();
  const shareImage = image ? { ...DEFAULT_IMAGE, url: image, alt: title } : DEFAULT_IMAGE;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    robots: hidden ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      locale: "ja_JP",
      siteName: DESHIIRI_NAME,
      title: fullTitle,
      description,
      url: path,
      images: [shareImage],
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [shareImage.url],
    },
  };
}
