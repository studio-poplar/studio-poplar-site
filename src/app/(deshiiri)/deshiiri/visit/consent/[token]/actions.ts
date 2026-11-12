"use server";

import * as Sentry from "@sentry/nextjs";
import { isTokenShape } from "@/lib/deshiiri/visits/rules";
import { answerConsent } from "@/lib/deshiiri/visits/service";

export type ConsentState = { status: "idle" | "agreed" | "refused" | "gone" | "error" };

export async function consent(token: string, _prev: ConsentState, form: FormData): Promise<ConsentState> {
  if (!isTokenShape(token)) return { status: "gone" };
  try {
    return { status: await answerConsent(token, form.get("answer") === "agree") };
  } catch (e) {
    Sentry.captureException(e, { tags: { area: "deshiiri-visit", step: "consent" } });
    return { status: "error" };
  }
}
