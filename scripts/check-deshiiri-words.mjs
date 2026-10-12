// After `next build`: look for デシイリ's banned words in every generated /deshiiri page.
// Warns only (exit code stays 0), so a hit never blocks a deploy. Run by the "postbuild" script.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const { words } = JSON.parse(fs.readFileSync(path.join(root, "content/deshiiri/banned-words.json"), "utf8"));
const appDir = path.join(root, ".next/server/app");

function htmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith(".html") ? [full] : [];
  });
}

const pages = [path.join(appDir, "deshiiri.html"), ...htmlFiles(path.join(appDir, "deshiiri"))].filter((f) => fs.existsSync(f));

let hits = 0;
for (const file of pages) {
  // Visible text only: drop scripts, styles and tags.
  const text = fs
    .readFileSync(file, "utf8")
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ");
  for (const word of words) {
    if (text.includes(word)) {
      hits++;
      const page = "/" + path.relative(appDir, file).replace(/\\/g, "/").replace(/\.html$/, "");
      console.warn(`⚠ [deshiiri] ${page}: 使わない言葉「${word}」が表示されています`);
    }
  }
}

console.log(`[deshiiri] 使わない言葉の検査: ${pages.length}ページ、${hits === 0 ? "問題なし" : `${hits}件`}`);
