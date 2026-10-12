// After `next build`: list characters in content/ that the self-hosted fonts don't cover.
// Those characters still show, in the reader's system font. Warns only; fix with `npm run fonts`.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const charset = new Set(fs.readFileSync(path.join(root, "src/fonts/charset.txt"), "utf8"));

const missing = new Map(); // char -> first file
const walk = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(mdx?|ya?ml|json)$/.test(entry.name)) {
      for (const ch of fs.readFileSync(full, "utf8")) {
        if (ch.codePointAt(0) < 0x20 || charset.has(ch) || missing.has(ch)) continue;
        missing.set(ch, path.relative(root, full).replace(/\\/g, "/"));
      }
    }
  }
};
walk(path.join(root, "content"));

if (missing.size === 0) {
  console.log("[fonts] 本文の文字はすべてフォントに入っています");
} else {
  for (const [ch, file] of missing) console.warn(`⚠ [fonts] 「${ch}」(U+${ch.codePointAt(0).toString(16).toUpperCase()}) がフォントにありません: ${file}`);
  console.warn("⚠ [fonts] npm run fonts でフォントを作り直してください");
}
