import type { NextConfig } from "next";

// Cases that are no longer published: send old links to the works index.
const removedWorkSlugs = ["bokuheki", "nagi-subscription-inn", "atelier-mokuha-photo", "shindan-app"];
// Blog articles that were replaced when the blog was rewritten.
const removedBlogSlugs = ["why-structure-first", "3d-web-when-it-works", "three-web-flows-for-solo-launch"];

// URLs from the previous Wix site that Google still has on record. They 404 now, so
// send them to the closest current page and keep whatever standing they had.
const legacyWixRedirects = [
  { source: "/サービス", destination: "/service" },
  { source: "/お問い合わせ", destination: "/contact" },
  { source: "/制作事例", destination: "/works" },
  { source: "/プライバシーポリシー", destination: "/privacy" },
  { source: "/cookie-クッキー-ポリシー", destination: "/privacy" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Requests arrive percent-encoded, so the Japanese sources have to be encoded to match.
      ...legacyWixRedirects.map((redirect) => ({ ...redirect, source: encodeURI(redirect.source), permanent: true })),
      ...removedWorkSlugs.map((slug) => ({ source: `/works/${slug}`, destination: "/works", permanent: true })),
      ...removedBlogSlugs.map((slug) => ({ source: `/blog/${slug}`, destination: "/blog", permanent: true })),
    ];
  },
};

export default nextConfig;
