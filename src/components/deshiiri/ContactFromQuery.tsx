"use client";

import { useSearchParams } from "next/navigation";
import ContactForm, { type ContactPerson } from "./ContactForm";
import EditorialForm from "./EditorialForm";
import type { EditorialTopic } from "@/lib/deshiiri/codes";

// /deshiiri/contact?to=<職人id>&from=<記事slug>: preselect the craftsperson and remember the article.
export default function ContactFromQuery({ people }: { people: ContactPerson[] }) {
  const params = useSearchParams();
  const to = params.get("to") ?? "";
  const from = params.get("from") ?? "";
  // key: remount when the query changes so the preselection follows it.
  return <ContactForm key={`${to}|${from}`} people={people} initialTo={to} from={from} />;
}

// /deshiiri/contact?topic=sponsor: preselect the editorial inquiry type.
export function EditorialFromQuery() {
  const topic = (useSearchParams().get("topic") ?? "shuzai") as EditorialTopic;
  return <EditorialForm key={topic} initialTopic={topic} />;
}
