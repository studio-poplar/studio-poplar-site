// LINE のリッチメニュー画像（2500×843、4つのボタン）を作る。
// Vercel のサーバーには日本語フォントがないので、手元の Mac で作って画像をリポジトリに置く。
// 使い方: node scripts/line/make-richmenu.mjs
import sharp from "sharp";

const W = 2500;
const H = 843;
const cols = 4;
const cw = W / cols;
const items = [
  { label: ["写真を", "送る"], fill: "#b0522a", ink: "#ffffff" },
  { label: ["見学の受付", "止める・再開"], fill: "#faf8f4", ink: "#1c1b19" },
  { label: ["使い方"], fill: "#faf8f4", ink: "#1c1b19" },
  { label: ["デシイリに", "連絡"], fill: "#faf8f4", ink: "#1c1b19" },
];

const cells = items
  .map((item, i) => {
    const x = i * cw;
    const lines = item.label;
    const size = 96;
    const gap = 128;
    const startY = H / 2 - ((lines.length - 1) * gap) / 2 + size * 0.35;
    const texts = lines
      .map(
        (line, j) =>
          `<text x="${x + cw / 2}" y="${startY + j * gap}" text-anchor="middle" font-family="Hiragino Sans" font-weight="600" font-size="${size}" fill="${item.ink}">${line}</text>`,
      )
      .join("");
    const divider = i > 0 ? `<rect x="${x}" y="120" width="3" height="${H - 240}" fill="#e3ded4"/>` : "";
    return `<rect x="${x}" y="0" width="${cw}" height="${H}" fill="${item.fill}"/>${divider}${texts}`;
  })
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${cells}<rect x="0" y="0" width="${W}" height="6" fill="#1c1b19"/></svg>`;
const out = new URL("../../src/lib/deshiiri/line/richmenu.png", import.meta.url);
const info = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out.pathname);
console.log("richmenu.png", info.width, info.height, `${Math.round(info.size / 1024)}KB`);
