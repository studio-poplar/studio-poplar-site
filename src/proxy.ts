import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/deshiiri/env";

// 管理画面への入口で先に弾く（おおまかな確認）。本当の確認は各ページ・各処理の先頭で
// lib/deshiiri/admin-auth.ts が行う。公開ページにはかからない。

export default auth((request) => {
  const { pathname } = request.nextUrl;
  if (pathname === "/deshiiri/admin/login") return NextResponse.next();
  if (!isAdminEmail(request.auth?.user?.email)) {
    return NextResponse.redirect(new URL("/deshiiri/admin/login", request.nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/deshiiri/admin", "/deshiiri/admin/:path*"],
};
