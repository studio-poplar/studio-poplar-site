import type { NextConfig } from "next";

// Cases that are no longer published: send old links to the works index.
const removedWorkSlugs = ["bokuheki", "nagi-subscription-inn", "atelier-mokuha-photo", "shindan-app"];
// Blog articles that were replaced when the blog was rewritten.
const removedBlogSlugs = ["why-structure-first", "3d-web-when-it-works", "three-web-flows-for-solo-launch"];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...removedWorkSlugs.map((slug) => ({ source: `/works/${slug}`, destination: "/works", permanent: true })),
      ...removedBlogSlugs.map((slug) => ({ source: `/blog/${slug}`, destination: "/blog", permanent: true })),
    ];
  },
};

export default nextConfig;
