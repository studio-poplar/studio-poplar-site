"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { BlogPostMeta, BlogSeries } from "@/lib/blog-types";
import { BLOG_SERIES_FILTER_LABEL } from "@/lib/blog-types";
import BlogCard from "./BlogCard";
import { trackEvent } from "@/lib/gtag";
import styles from "./BlogIndex.module.css";

type Filter = "all" | BlogSeries;

function subscribeToUrl(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

export default function BlogIndex({ posts }: { posts: BlogPostMeta[] }) {
  // the tab the visitor clicked; until then the URL decides (see below)
  const [picked, setPicked] = useState<Filter | null>(null);
  const search = useSyncExternalStore(subscribeToUrl, () => window.location.search, () => "");

  // Only series with at least one post get a tab, so a future pillar (e.g. AI) appears
  // on its own once the first post for it exists — no code change needed here.
  const series = useMemo(
    () => (Object.keys(BLOG_SERIES_FILTER_LABEL) as BlogSeries[]).filter((s) => posts.some((p) => p.series === s)),
    [posts]
  );

  // /blog?series=marketing-notes opens with that tab selected. The server snapshot is
  // empty, so the statically generated page always starts on ALL and the requested tab
  // is applied as soon as the page is hydrated.
  const requested = new URLSearchParams(search).get("series");
  const fromUrl: Filter = series.find((s) => s === requested) ?? "all";
  const filter: Filter = picked ?? fromUrl;

  const countOf = (f: Filter) => (f === "all" ? posts.length : posts.filter((p) => p.series === f).length);
  const visible = posts.filter((p) => filter === "all" || p.series === filter);

  function select(next: Filter) {
    setPicked(next);
    const path = window.location.pathname;
    window.history.replaceState(null, "", next === "all" ? path : `${path}?series=${next}`);
    trackEvent("blog_filter", { series: next });
  }

  return (
    <>
      <div className={styles.filters} role="group" aria-label="カテゴリで絞り込み">
        {(["all", ...series] as Filter[]).map((f) => (
          <button key={f} type="button" className={`en ${styles.chip}`} aria-pressed={f === filter} onClick={() => select(f)}>
            {f === "all" ? "一覧" : BLOG_SERIES_FILTER_LABEL[f]}
            <small>{countOf(f)}</small>
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        visible.map((post) => <BlogCard key={post.slug} post={post} />)
      ) : (
        <p>該当する記事はまだありません。</p>
      )}
    </>
  );
}
