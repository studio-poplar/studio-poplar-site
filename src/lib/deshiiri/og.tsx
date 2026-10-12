import fs from "fs/promises";
import path from "path";
import { ImageResponse } from "next/og";
import { FanMark } from "@/components/deshiiri/FanMark";

// Share images for デシイリ (1200×630). Japanese needs a real font in next/og, so Shippori Mincho
// is fetched from Google Fonts, cut down to just the characters on the image.

export const OG_SIZE = { width: 1200, height: 630 };

const INK = "#1C1B19";
const BG = "#FAF8F4";
const KAKI = "#B0522A";
const MOEGI = "#3E5D3B";

async function loadMincho(text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@700&text=${encodeURIComponent(text)}`;
    // No browser user agent → Google Fonts answers with TrueType, which next/og can read.
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    return await (await fetch(src)).arrayBuffer();
  } catch {
    return null;
  }
}

async function photoDataUrl(src: string | null) {
  if (!src) return null;
  const file = path.join(process.cwd(), "public", src);
  try {
    const data = await fs.readFile(file);
    const type = /\.png$/i.test(src) ? "image/png" : "image/jpeg";
    return `data:${type};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

type Input = {
  title: string;
  // Small line above the title, e.g. 「大工｜横浜市戸塚区　No.24」
  kicker?: string;
  photo?: string | null;
};

export async function deshiiriOgImage({ title, kicker = "", photo = null }: Input) {
  const image = await photoDataUrl(photo);
  const brand = "デシイリ職人と家業のWEBマガジン";
  const font = await loadMincho(title + kicker + brand);
  const onPhoto = !!image;
  const fg = onPhoto ? "#FFFFFF" : INK;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: onPhoto ? INK : BG, fontFamily: "Mincho" }}>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        )}
        {image && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              display: "flex",
              background: "linear-gradient(180deg, rgba(20,19,17,0.3) 0%, rgba(20,19,17,0.55) 45%, rgba(20,19,17,0.9) 100%)",
            }}
          />
        )}
        {/* 定式幕の細線 */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, display: "flex" }}>
          <div style={{ flex: 1, background: INK }} />
          <div style={{ flex: 1, background: KAKI }} />
          <div style={{ flex: 1, background: MOEGI }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            bottom: 56,
            display: "flex",
            flexDirection: "column",
            color: fg,
          }}
        >
          {kicker && <div style={{ fontSize: 26, opacity: 0.85, marginBottom: 14, display: "flex" }}>{kicker}</div>}
          <div style={{ fontSize: title.length > 26 ? 48 : 58, lineHeight: 1.45, display: "flex" }}>{title}</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 30, fontSize: 26, gap: 14 }}>
            <FanMark size={48} color={fg} accent={KAKI} />
            <span>デシイリ</span>
            <span style={{ fontSize: 20, opacity: 0.75, marginLeft: 8 }}>職人と家業のWEBマガジン</span>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: font ? [{ name: "Mincho", data: font, weight: 700, style: "normal" }] : [],
    },
  );
}
