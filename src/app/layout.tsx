import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New, Space_Grotesk, IBM_Plex_Sans_JP, IBM_Plex_Mono } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-logo",
  subsets: ["latin"],
  display: "swap",
});

const plexSansJP = IBM_Plex_Sans_JP({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Studio Poplar｜WEB・3Dモデリング活用WEB・アプリ制作スタジオ",
    template: "%s｜Studio Poplar",
  },
  description:
    "Studio Poplar（横浜）は、新規事業・個人開業の“顔”となるWEB制作、3Dモデリングを活用したWEB制作、アプリ制作を行う制作スタジオです。事業の構造を見立て、ブランドの骨格から設計します。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Studio Poplar",
    title: "Studio Poplar｜WEB・3Dモデリング活用WEB・アプリ制作スタジオ",
    description:
      "新規事業・個人開業の“顔”となるWEBサイト／3Dモデリング活用WEBサイト／アプリを設計・制作します。",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Poplar｜WEB・3Dモデリング活用WEB・アプリ制作スタジオ",
    description:
      "新規事業・個人開業の“顔”となるWEBサイト／3Dモデリング活用WEBサイト／アプリを設計・制作します。",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${zenKaku.variable} ${spaceGrotesk.variable} ${plexSansJP.variable} ${plexMono.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          本文へスキップ
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
