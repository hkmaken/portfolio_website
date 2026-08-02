import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { asset } from "./base-path";
import type { GalleryImage } from "@/types";

const PUBLIC_DIR = path.join(process.cwd(), "public");

/** Build a GalleryImage from a file living under /public. */
export async function buildImage(
  publicRelPath: string,
  alt: string,
): Promise<GalleryImage> {
  const abs = path.join(PUBLIC_DIR, publicRelPath.replace(/^\//, ""));
  const buf = await readFile(abs);
  const img = sharp(buf);
  const meta = await img.metadata();
  const blur = await img
    .resize(16, 16, { fit: "inside" })
    .webp({ quality: 40 })
    .toBuffer();
  return {
    src: asset(
      publicRelPath.startsWith("/") ? publicRelPath : `/${publicRelPath}`,
    ),
    alt,
    width: meta.width ?? 1200,
    height: meta.height ?? 800,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  };
}
