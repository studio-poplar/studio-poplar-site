import type { Metadata } from "next";
import { Archivo, Noto_Sans_JP } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-en",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
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
  verification: process.env.GSC_VERIFICATION ? { google: process.env.GSC_VERIFICATION } : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${archivo.variable} ${notoSansJP.variable}`}>
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
