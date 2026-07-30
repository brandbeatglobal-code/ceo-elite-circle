import crypto from "node:crypto";
import sharp, { type Sharp } from "sharp";
import decodeHeic from "heic-decode";

/**
 * Server-side image processing for photo uploads.
 *
 * Files are a bigger risk than text was, so nothing about the upload is
 * trusted: the format is decided by the file's actual magic bytes — never the
 * extension or the declared MIME type — and only a small explicit set is
 * accepted. Every accepted image is decoded and re-encoded through sharp
 * before it is stored, which normalises the bytes, applies the EXIF
 * orientation, and strips all metadata (including GPS coordinates, which a
 * phone photo would otherwise carry into a public repository).
 *
 * HEIC is accepted because the client will very plausibly upload straight
 * from an iPhone, and iPhones default to HEIC — which neither browsers nor
 * Next's image component render. It is converted to JPEG here, via a WASM
 * libheif decode (sharp's prebuilt binaries do not include HEIF support).
 *
 * The stored filename is generated here — slot slug plus a content hash —
 * never taken from the upload. An attacker-controlled filename is an
 * attacker-controlled path.
 */
export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
export const MAX_STORED_BYTES = 4 * 1024 * 1024;
/** Longest edge after processing. Matches how large any slot ever renders. */
const MAX_STORED_DIM = 2400;
/** Refuse to decode anything claiming to be larger than this. */
const MAX_INPUT_PIXELS = 80_000_000;

export type ProcessedImage = {
  ok: true;
  bytes: Buffer;
  /** File extension, which is also the stored format. */
  ext: "jpg" | "png" | "webp";
  width: number;
  height: number;
  /** What the upload actually was, for the confirmation message. */
  sourceFormat: string;
  /** 0–1: how bright the brightest region is. See `measureBrightness`. */
  brightness: number;
};
export type ProcessError = { ok: false; error: string };

type Sniffed = "jpeg" | "png" | "webp" | "heic" | null;

/** Decide the format from the bytes themselves. */
export function sniffFormat(buf: Buffer): Sniffed {
  if (buf.length < 16) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return "png";
  }
  if (
    buf.toString("latin1", 0, 4) === "RIFF" &&
    buf.toString("latin1", 8, 12) === "WEBP"
  ) {
    return "webp";
  }
  if (buf.toString("latin1", 4, 8) === "ftyp") {
    const brand = buf.toString("latin1", 8, 12);
    if (
      ["heic", "heix", "hevc", "hevx", "heim", "heis", "mif1", "msf1"].includes(
        brand,
      )
    ) {
      return "heic";
    }
  }
  return null;
}

const REJECT_UNRECOGNISED =
  "That file is not a photograph this site can use. Upload a JPEG, PNG, WebP, or an iPhone photo (HEIC).";

export async function processUpload(input: Buffer): Promise<ProcessedImage | ProcessError> {
  if (input.length === 0) return { ok: false, error: "The file arrived empty." };
  if (input.length > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      error: `That file is too large — the limit is ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB.`,
    };
  }

  const format = sniffFormat(input);
  if (format === null) return { ok: false, error: REJECT_UNRECOGNISED };

  try {
    let pipeline: Sharp;
    if (format === "heic") {
      // WASM libheif applies the container's rotation/mirror on decode, so
      // the raw pixels arrive already oriented.
      const { width, height, data } = await decodeHeic({
        buffer: new Uint8Array(input),
      });
      if (width * height > MAX_INPUT_PIXELS) {
        return { ok: false, error: "That photograph's dimensions are too large." };
      }
      pipeline = sharp(Buffer.from(data.buffer, data.byteOffset, data.byteLength), {
        raw: { width, height, channels: 4 },
      });
    } else {
      pipeline = sharp(input, { limitInputPixels: MAX_INPUT_PIXELS });
      const meta = await pipeline.metadata();
      // The sniff and the decoder must agree about what this file is.
      if (meta.format !== format) return { ok: false, error: REJECT_UNRECOGNISED };
    }

    // `rotate()` with no argument applies the EXIF orientation, so a phone
    // photo is stored the way it was taken; the re-encode then strips the
    // EXIF block itself.
    pipeline = pipeline
      .rotate()
      .resize({
        width: MAX_STORED_DIM,
        height: MAX_STORED_DIM,
        fit: "inside",
        withoutEnlargement: true,
      });

    const ext: ProcessedImage["ext"] =
      format === "png" ? "png" : format === "webp" ? "webp" : "jpg";
    if (ext === "png") pipeline = pipeline.png({ compressionLevel: 9 });
    else if (ext === "webp") pipeline = pipeline.webp({ quality: 82 });
    else pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });

    const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

    if (data.length > MAX_STORED_BYTES) {
      return {
        ok: false,
        error: "That photograph is still too large after processing. Try a smaller export.",
      };
    }
    if (info.width < 16 || info.height < 16) {
      return { ok: false, error: "That image is too small to be a photograph for the site." };
    }

    return {
      ok: true,
      bytes: data,
      ext,
      width: info.width,
      height: info.height,
      sourceFormat: format,
      // Measured on the stored bytes, so it describes what the site will
      // actually serve rather than what was uploaded.
      brightness: await measureBrightness(data),
    };
  } catch {
    // Magic bytes said image, but it would not decode — truncated, corrupt,
    // or dressed up. Nothing gets stored on a failed decode.
    return { ok: false, error: REJECT_UNRECOGNISED };
  }
}

/** Rows and columns the brightness probe reduces an image to. */
const PROBE_W = 32;
const PROBE_H = 20;

function toLinear(channel: number): number {
  const s = channel / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

/**
 * How bright the photograph is, as the relative luminance of its brightest
 * *region* — 0 for black, 1 for white.
 *
 * Not the mean. A mean is exactly wrong for the case that matters: a dark
 * photograph with a blown-out window in it averages dark, and the headline
 * lands on the window. Not the single brightest pixel either, which is a
 * specular highlight in almost every photograph and would report 1.0 for all
 * of them.
 *
 * Instead the image is reduced to a coarse grid — each cell is a few per cent
 * of the frame, about the area a line of type covers — and the brightest cell
 * decides. Averaging happens inside a cell, which is the scale at which text
 * legibility is actually decided.
 */
export async function measureBrightness(image: Buffer): Promise<number> {
  const { data } = await sharp(image)
    .resize(PROBE_W, PROBE_H, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let max = 0;
  for (let i = 0; i < data.length; i += 3) {
    const l =
      0.2126 * toLinear(data[i]) +
      0.7152 * toLinear(data[i + 1]) +
      0.0722 * toLinear(data[i + 2]);
    if (l > max) max = l;
  }
  // Rounded: this is stored in a content file that a human reads.
  return Math.min(1, Math.round(max * 1000) / 1000);
}

/**
 * The stored path, generated entirely server-side: the slot's identity plus a
 * hash of the processed bytes. The hash makes replacing a photo produce a new
 * URL, so nothing ever serves a stale cached image.
 */
export function uploadPath(
  file: string,
  fieldPath: string[],
  processed: ProcessedImage,
): string {
  const slug = [file, ...fieldPath]
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-photo$/, "");
  const hash = crypto
    .createHash("sha256")
    .update(processed.bytes)
    .digest("hex")
    .slice(0, 10);
  return `/uploads/${slug}-${hash}.${processed.ext}`;
}

/** True only for paths this system itself generated — the only files a
 *  replacement is allowed to delete. */
export function isOwnUpload(src: string | null): src is string {
  return (
    typeof src === "string" &&
    /^\/uploads\/[a-z0-9][a-z0-9-]*\.(jpg|png|webp)$/.test(src)
  );
}
