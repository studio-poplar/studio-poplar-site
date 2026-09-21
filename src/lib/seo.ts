import type { Metadata } from "next";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SITE_NAME = "Studio Poplar";
export const SITE_TITLE = "Studio Poplar｜WEB・アプリ・写真動画制作スタジオ";
export const SITE_DESCRIPTION =
  "Studio Poplar（横浜）は、伝えたいことを伝わる形にする制作スタジオです。WEBサイト制作、アプリ制作、写真・動画撮影を通じて、事業の“顔”をつくります。";
// Page-level openGraph replaces the layout one, so the file-based share image has to be named again.
const SHARE_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: "Studio Poplar — WEB / APP / PHOTO & VIDEO DESIGN STUDIO" };

export const SHARE_DESCRIPTION = "伝えたいことを、伝わる形に。WEBサイト／アプリ／写真・動画で事業の“顔”をつくります。";

type PageMetadataInput = {
  title: string;
  description: string;
  // Path from the site root, e.g. "/service". Used for the canonical URL and og:url.
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
};

// Every page states its own canonical URL and share card, so nothing is
// inherited from the home page (a shared og:url would point every page at "/").
export function pageMetadata({ title, description, path, type = "website", publishedTime, tags }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "ja_JP",
      siteName: SITE_NAME,
      title: `${title}｜${SITE_NAME}`,
      description,
      url: path,
      images: [SHARE_IMAGE],
      ...(type === "article" ? { publishedTime, tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title}｜${SITE_NAME}`,
      description,
      images: [SHARE_IMAGE.url],
    },
  };
}
