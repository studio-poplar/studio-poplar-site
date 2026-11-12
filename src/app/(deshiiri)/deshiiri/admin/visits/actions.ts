"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/deshiiri/admin-auth";
import { parseVisitDate } from "@/lib/deshiiri/visits/rules";
import { markVisitDone, recordVisitDate } from "@/lib/deshiiri/visits/service";

// S-6 見学の進行：編集部が手で動かすところ（日にちの記録・実施済み）。

export async function setVisitDate(form: FormData) {
  await assertAdmin();
  const id = String(form.get("id") ?? "");
  const date = parseVisitDate(String(form.get("date") ?? ""));
  if (date) await recordVisitDate(id, null, date);
  revalidatePath("/deshiiri/admin/visits");
}

export async function setVisitDone(form: FormData) {
  await assertAdmin();
  const id = String(form.get("id") ?? "");
  if (/^[0-9a-f-]{36}$/.test(id)) await markVisitDone(id);
  revalidatePath("/deshiiri/admin/visits");
}
