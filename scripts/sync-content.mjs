// Mirrors project images from the owner's content folders into /public so the
// static export can serve them. Runs automatically on predev/prebuild.
// The owner only ever touches content/projects/<slug>/.
import { cp, mkdir, rm, readdir } from "node:fs/promises";
import path from "node:path";

const SRC = path.join(process.cwd(), "content", "projects");
const DEST = path.join(process.cwd(), "public", "content");
const IMG = /\.(jpe?g|png|webp|avif)$/i;

await rm(DEST, { recursive: true, force: true });

let slugs = [];
try {
  slugs = (await readdir(SRC, { withFileTypes: true }))
    .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
    .map((d) => d.name);
} catch {
  slugs = [];
}

for (const slug of slugs) {
  const from = path.join(SRC, slug);
  const to = path.join(DEST, slug);
  await mkdir(to, { recursive: true });
  for (const f of await readdir(from)) {
    if (IMG.test(f)) await cp(path.join(from, f), path.join(to, f));
  }
}

console.log(`synced ${slugs.length} project folders`);
