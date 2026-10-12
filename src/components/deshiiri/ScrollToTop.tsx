"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// ページを移ったら、いちばん上から表示する（#付きならその場所へ）。
// Next.js は共通のヘッダーを残したまま「ページ本体の先頭」までしかスクロールしないため、
// 固定ヘッダーが本文の頭に重なる位置で止まることがある。
// 判定は少し待ってから行う（その時点で URL の # が確定しているため）。
export default function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (target) target.scrollIntoView({ block: "start", behavior: "instant" });
      else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);
  return null;
}
