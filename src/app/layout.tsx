import type { Metadata } from "next";
import { Space_Grotesk, Unbounded } from "next/font/google";
import localFont from "next/font/local";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { isDeshiiriLive } from "@/lib/deshiiri/content";
import { siteUrl, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, SHARE_DESCRIPTION } from "@/lib/seo";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-en",
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  display: "swap",
});

// hero wordmark only
const unbounded = Unbounded({
  variable: "--font-wordmark",
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
});

// Self-hosted subset (scripts/build-fonts.mjs, `npm run fonts`): one file per weight instead of
// Google Fonts' ~100 slices, and no preload, so text shows in the system font first and the
// page is not held back by ~400 high-priority font requests.
const zenKakuGothicNew = localFont({
  variable: "--font-jp",
  src: [
    { path: "../fonts/zen-kaku-gothic-new-400.woff2", weight: "400" },
    { path: "../fonts/zen-kaku-gothic-new-500.woff2", weight: "500" },
    { path: "../fonts/zen-kaku-gothic-new-700.woff2", weight: "700" },
    { path: "../fonts/zen-kaku-gothic-new-900.woff2", weight: "900" },
  ],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_TITLE,
    template: `%s｜${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  // Each page sets its own canonical / og:url (see pageMetadata); only site-wide defaults live here.
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SHARE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SHARE_DESCRIPTION,
  },
  verification: process.env.GSC_VERIFICATION ? { google: process.env.GSC_VERIFICATION } : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${spaceGrotesk.variable} ${zenKakuGothicNew.variable} ${unbounded.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          本文へスキップ
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter showDeshiiri={isDeshiiriLive()} />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
