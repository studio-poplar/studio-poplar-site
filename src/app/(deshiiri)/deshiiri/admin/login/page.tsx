import { redirect } from "next/navigation";
import SectionHead from "@/components/deshiiri/SectionHead";
import { signIn } from "@/auth";
import { currentAdmin } from "@/lib/deshiiri/admin-auth";
import styles from "../admin.module.css";

export default async function AdminLoginPage({ searchParams }: PageProps<"/deshiiri/admin/login">) {
  if (await currentAdmin()) redirect("/deshiiri/admin");
  const { error } = await searchParams;

  async function login() {
    "use server";
    await signIn("google", { redirectTo: "/deshiiri/admin" });
  }

  return (
    <div className={`d-wrap ${styles.page}`}>
      <SectionHead as="h1" eyebrow="EDITORS" title="編集部のログイン" />
      {error ? (
        <p className={styles.error} role="alert">
          {error === "AccessDenied"
            ? "このアカウントでは入れません。編集部に登録された Google アカウントでログインしてください。"
            : error === "Configuration"
              ? "ログインの設定がまだ整っていません（AUTH_SECRET・AUTH_GOOGLE_ID・AUTH_GOOGLE_SECRET を Vercel に入れて、もう一度デプロイしてください）。"
              : "ログインできませんでした。もう一度お試しください。"}
        </p>
      ) : null}
      <p className={styles.note}>デシイリ編集部の Google アカウントでログインします。</p>
      <form action={login}>
        <button type="submit" className={styles.button}>
          Google でログイン
        </button>
      </form>
    </div>
  );
}
