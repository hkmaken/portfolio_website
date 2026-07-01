import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { rawProjectSchema } from "./projects.schema";
import { buildImage } from "./images";
import type { Project, RawProject } from "@/types";

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");
const IMG_EXT = /\.(jpe?g|png|webp|avif)$/i;

interface Entry {
  slug: string;
  raw: RawProject;
}

/** Pure sort used by both the loader and the test. */
export function parseAndSort(entries: Entry[]): Entry[] {
  return [...entries].sort((a, b) => {
    if (a.raw.featured !== b.raw.featured) return a.raw.featured ? -1 : 1;
    if (a.raw.order !== b.raw.order) return a.raw.order - b.raw.order;
    if (a.raw.year !== b.raw.year) return b.raw.year - a.raw.year;
    return a.raw.title.localeCompare(b.raw.title);
  });
}

async function readProjectFolder(slug: string): Promise<Entry> {
  const file = path.join(CONTENT_DIR, slug, "project.json");
  let json: unknown;
  try {
    json = JSON.parse(await readFile(file, "utf8"));
  } catch (e) {
    throw new Error(
      `Cannot read/parse ${slug}/project.json: ${(e as Error).message}`,
    );
  }
  const parsed = rawProjectSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(`Invalid ${slug}/project.json:\n${parsed.error.toString()}`);
  }
  return { slug, raw: parsed.data as RawProject };
}

async function attachImages(entry: Entry): Promise<Project> {
  const dir = path.join(CONTENT_DIR, entry.slug);
  const files = (await readdir(dir)).filter((f) => IMG_EXT.test(f)).sort();
  const coverName = files.find((f) => /^cover\./i.test(f));
  const galleryNames = files.filter((f) => f !== coverName);
  const coverSrc = `/content/${entry.slug}/${coverName ?? galleryNames[0]}`;
  const cover = await buildImage(coverSrc, `${entry.raw.title} cover`);
  const gallery = await Promise.all(
    galleryNames.map((f, i) =>
      buildImage(
        `/content/${entry.slug}/${f}`,
        `${entry.raw.title} image ${i + 1}`,
      ),
    ),
  );
  return { ...entry.raw, slug: entry.slug, cover, gallery };
}

let _cache: Project[] | null = null;

export async function getAllProjects(): Promise<Project[]> {
  if (_cache) return _cache;
  let slugs: string[] = [];
  try {
    const dirents = await readdir(CONTENT_DIR, { withFileTypes: true });
    slugs = dirents
      .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
      .map((d) => d.name);
  } catch {
    return (_cache = []);
  }
  const entries = await Promise.all(slugs.map(readProjectFolder));
  const sorted = parseAndSort(entries);
  _cache = await Promise.all(sorted.map(attachImages));
  return _cache;
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return (await getAllProjects()).find((p) => p.slug === slug);
}

/** prev/next wraps around; related = same category, then shared tags. */
export async function getProjectNav(slug: string) {
  const all = await getAllProjects();
  const i = all.findIndex((p) => p.slug === slug);
  const current = all[i];
  const prev = all[(i - 1 + all.length) % all.length];
  const next = all[(i + 1) % all.length];
  const related = all
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      p,
      score:
        (p.category === current.category ? 2 : 0) +
        p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.p);
  return { prev, next, related };
}
