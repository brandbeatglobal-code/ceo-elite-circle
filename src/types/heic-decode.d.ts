declare module "heic-decode" {
  /** Decode the primary image of a HEIC/HEIF file to raw RGBA pixels. */
  export default function decode(options: {
    buffer: ArrayBuffer | Uint8Array;
  }): Promise<{ width: number; height: number; data: Uint8ClampedArray }>;
}
