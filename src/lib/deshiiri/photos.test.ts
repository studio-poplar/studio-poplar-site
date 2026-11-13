import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { processPhoto } from "./photos";

async function photoWithGps(width: number, height: number) {
  return sharp({ create: { width, height, channels: 3, background: { r: 120, g: 90, b: 60 } } })
    .jpeg()
    .withExif({
      IFD0: { Make: "TestPhone", Model: "X", Orientation: "1" },
      IFD3: { GPSLatitudeRef: "N", GPSLatitude: "35/1 26/1 0/1", GPSLongitudeRef: "E", GPSLongitude: "139/1 38/1 0/1" },
    })
    .toBuffer();
}

describe("写真の縮小とメタデータ削除", () => {
  it("元の写真には位置情報が入っている（テストの前提）", async () => {
    const meta = await sharp(await photoWithGps(400, 300)).metadata();
    expect(meta.exif).toBeDefined();
  });

  it("原本は長辺2000px、表示用は長辺1600pxのWebPになり、どちらにもEXIFが残らない", async () => {
    const out = await processPhoto(await photoWithGps(4000, 3000));
    const original = await sharp(out.original).metadata();
    const display = await sharp(out.display).metadata();

    expect(original.format).toBe("jpeg");
    expect(Math.max(original.width!, original.height!)).toBe(2000);
    expect(display.format).toBe("webp");
    expect(Math.max(display.width!, display.height!)).toBe(1600);
    expect(out.width).toBe(1600);
    expect(out.height).toBe(1200);

    expect(original.exif).toBeUndefined();
    expect(display.exif).toBeUndefined();
    expect(original.xmp).toBeUndefined();
    expect(display.xmp).toBeUndefined();
  });

  it("小さい写真は拡大しない", async () => {
    const out = await processPhoto(await photoWithGps(800, 600));
    expect(out.width).toBe(800);
    expect(out.height).toBe(600);
  });

  it("縦向き（Orientation 6）の写真は画素を回してから向き情報を捨てる", async () => {
    const rotated = await sharp({ create: { width: 400, height: 300, channels: 3, background: "#888" } })
      .jpeg()
      .withMetadata({ orientation: 6 })
      .toBuffer();
    expect((await sharp(rotated).metadata()).orientation).toBe(6);
    const out = await processPhoto(rotated);
    expect(out.width).toBe(300);
    expect(out.height).toBe(400);
    const meta = await sharp(out.display).metadata();
    expect(meta.orientation).toBeUndefined();
  });
});
