import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // 編集部の画面と API は検索に出さない。
    rules: { userAgent: "*", allow: "/", disallow: ["/deshiiri/admin", "/deshiiri/api/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
