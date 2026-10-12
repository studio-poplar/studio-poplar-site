import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/deshiiri/Header";
import Footer from "@/components/deshiiri/Footer";
import AnnounceBar from "@/components/deshiiri/AnnounceBar";
import "./deshiiri.css";

// Mincho is for large headings, titles and craftspeople's names only. Zen Kaku Gothic New
// (body) and Space Grotesk (English labels) come from the root layout.
const shipporiMincho = localFont({
  variable: "--font-mincho",
  // Self-hosted subset, see scripts/build-fonts.mjs.
  src: [{ path: "../../../fonts/shippori-mincho-700.woff2", weight: "700" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: {
    // absolute: keep the root layout's "｜Studio Poplar" template off デシイリ pages.
    absolute: "デシイリ｜職人と家業の読みもの",
    template: "%s｜デシイリ",
  },
  description:
    "横浜・神奈川の大工、畳屋、味噌蔵、梨農家を訪ねて、仕事の中身を聞き書きしています。読んで気になった職人には、ここから連絡できます。",
};

export default function DeshiiriLayout({ children }: LayoutProps<"/deshiiri">) {
  return (
    <div className={`deshiiri ${shipporiMincho.variable}`}>
      <div className="d-maku" />
      <AnnounceBar />
      <Header />
      {children}
      <Footer />
      {/* Page views + the deshiiri_contact event. Enable Web Analytics on the Vercel project. */}
      <Analytics />
    </div>
  );
}
