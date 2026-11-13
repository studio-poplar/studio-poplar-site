import type { Metadata } from "next";

// 編集部の管理画面。検索に出さない。ログインの確認は各ページの先頭で行う（layout では行わない）。
export const metadata: Metadata = {
  title: { absolute: "編集部｜デシイリ" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/deshiiri/admin">) {
  return children;
}
