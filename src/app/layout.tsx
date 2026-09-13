import type { Metadata } from "next";
import { Space_Grotesk, Zen_Kaku_Gothic_New } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-en",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Studio Poplar｜WEB・アプリ・写真動画制作スタジオ",
    template: "%s｜Studio Poplar",
  },
  description:
    "Studio Poplar（横浜）は、伝えたいことを伝わる形にする制作スタジオです。WEBサイト制作、アプリ制作、写真・動画撮影を通じて、事業の“顔”をつくります。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Studio Poplar",
    title: "Studio Poplar｜WEB・アプリ・写真動画制作スタジオ",
    description: "伝えたいことを、伝わる形に。WEBサイト／アプリ／写真・動画で事業の“顔”をつくります。",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Poplar｜WEB・アプリ・写真動画制作スタジオ",
    description: "伝えたいことを、伝わる形に。WEBサイト／アプリ／写真・動画で事業の“顔”をつくります。",
  },
  verification: process.env.GSC_VERIFICATION ? { google: process.env.GSC_VERIFICATION } : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${spaceGrotesk.variable} ${zenKakuGothicNew.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          本文へスキップ
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
