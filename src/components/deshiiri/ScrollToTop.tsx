"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// ページを移ったら、いちばん上から表示する。
// Next.js は共通のヘッダーを残したまま「ページ本体の先頭」までしかスクロールしないため、
// 固定ヘッダーが本文の頭に重なる位置で止まることがある。#付きのリンク（#renraku など）はそのまま。
export default function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
