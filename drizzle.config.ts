import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// マイグレーションはファイルで管理する（drizzle/ に SQL を書き出し、git に入れる）。
// 手元では .env.local の DATABASE_URL（テスト用の Neon ブランチ）を使う。
config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/deshiiri/db/schema.ts",
  out: "./drizzle",
  casing: "snake_case",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
  strict: true,
});
