import type { NextConfig } from "next";

// Cases that are no longer published: send old links to the works index.
const removedWorkSlugs = ["bokuheki", "nagi-subscription-inn", "atelier-mokuha-photo", "shindan-app"];

const nextConfig: NextConfig = {
  async redirects() {
    return removedWorkSlugs.map((slug) => ({
      source: `/works/${slug}`,
      destination: "/works",
      permanent: true,
    }));
  },
};

export default nextConfig;
