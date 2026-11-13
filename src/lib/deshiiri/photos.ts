import sharp from "sharp";

// 届いた写真を2つに作り分ける（指示書 5章）。
// - 原本（ドライブ）：長辺 2,000px の JPEG
// - 表示用（R2）：長辺 1,600px の WebP
// どちらも位置情報などのメタデータは残さない。sharp は withMetadata() を呼ばない限り EXIF・XMP・ICC を書き出さない。
// 向きだけは rotate() で画素に反映してから捨てる（スマホの縦写真が横倒しにならないように）。

export const ORIGINAL_LONG_SIDE = 2000;
export const DISPLAY_LONG_SIDE = 1600;

export type ProcessedPhoto = {
  original: Buffer;
  display: Buffer;
  width: number;
  height: number;
};

export async function processPhoto(input: Uint8Array): Promise<ProcessedPhoto> {
  const base = sharp(input, { failOn: "error" }).rotate();

  const original = await base
    .clone()
    .resize({ width: ORIGINAL_LONG_SIDE, height: ORIGINAL_LONG_SIDE, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();

  const { data: display, info } = await base
    .clone()
    .resize({ width: DISPLAY_LONG_SIDE, height: DISPLAY_LONG_SIDE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer({ resolveWithObject: true });

  return { original, display, width: info.width, height: info.height };
}
