import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isAdminEmail } from "@/lib/deshiiri/env";

// デシイリ編集部のログイン（指示書 3章・5章）。Google ログインのみ。
// ADMIN_EMAILS にあるメールだけを通す。二段階認証は Google Workspace 側で強制する。
// セッションは JWT（クッキー）で持ち、DB にアカウント表は作らない。

export const { handlers, auth, signIn, signOut } = NextAuth({
  basePath: "/deshiiri/api/auth",
  providers: [Google],
  session: { strategy: "jwt", maxAge: 12 * 60 * 60 },
  pages: { signIn: "/deshiiri/admin/login", error: "/deshiiri/admin/login" },
  callbacks: {
    signIn({ account, profile }) {
      if (account?.provider !== "google") return false;
      if (!profile?.email_verified) return false;
      return isAdminEmail(profile.email);
    },
  },
});
