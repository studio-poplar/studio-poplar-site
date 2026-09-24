// Article titles are written as "claim、elaboration" or "claim「quote」remainder".
// Left to the browser, a long headline can break mid-phrase (e.g. "使えるの" / "か"),
// since CJK text has no spaces to guide the default wrap. Splitting at the writer's
// own pause point gives a clean two-line headline instead of an arbitrary character break.
export function splitHeadline(title: string): { lead: string; rest: string | null } {
  const commaIndex = title.indexOf("、");
  if (commaIndex > 1 && commaIndex < title.length - 2) {
    return { lead: title.slice(0, commaIndex + 1), rest: title.slice(commaIndex + 1) };
  }
  const bracketIndex = title.indexOf("」");
  if (bracketIndex > 1 && bracketIndex < title.length - 3) {
    return { lead: title.slice(0, bracketIndex + 1), rest: title.slice(bracketIndex + 1) };
  }
  return { lead: title, rest: null };
}
