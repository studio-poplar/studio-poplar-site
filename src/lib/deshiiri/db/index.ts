import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { requireEnv } from "@/lib/deshiiri/env";
import * as schema from "./schema";

export type Db = NeonHttpDatabase<typeof schema>;

let cached: Db | undefined;

/** Neon への接続。DATABASE_URL がない環境（既存ページのビルドなど）でも import だけなら落ちないよう、最初に使うときに作る。 */
export function db(): Db {
  cached ??= drizzle(neon(requireEnv("DATABASE_URL")), { schema, casing: "snake_case" });
  return cached;
}

export { schema };
