# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A statically-exported Next.js portfolio for a graphic designer where new work appears by dropping a folder into `content/projects/` — no code changes.

**Architecture:** App Router, `output: 'export'`. A build-time loader (`lib/projects.ts`) scans `content/projects/*`, Zod-validates each `project.json`, attaches cover/gallery + blur placeholders, and feeds every page, the sitemap, related/prev-next nav from one typed source. Owner edits only `content/` and `config/site.ts`.

**Tech Stack:** Next.js (App Router) · TypeScript · TailwindCSS · shadcn/ui · Framer Motion · Lucide · Zod · sharp · next-themes · Formspree.

---

## File map

```
config/site.ts                  all owner-editable settings
types/index.ts                  Project, RawProject, SiteConfig, Category
lib/projects.ts                 scan + validate + sort + attach images
lib/projects.schema.ts          Zod schema for project.json
lib/images.ts                   blur placeholder generation (sharp)
lib/seo.ts                      metadata + JSON-LD helpers
lib/projects.test.ts            runnable check for the loader
content/projects/<slug>/        seed sample projects (project.json + images — owner's ONLY surface)
scripts/sync-content.mjs        prebuild: copies content images → public/content/<slug>/
app/layout.tsx                  theme, fonts, nav, footer, base metadata
app/page.tsx                    homepage
app/portfolio/page.tsx          grid + filter/sort/search (client island)
app/portfolio/[slug]/page.tsx   project detail
app/about/page.tsx
app/contact/page.tsx
app/sitemap.ts  app/robots.ts
components/Navbar.tsx Footer.tsx Hero.tsx ProjectCard.tsx PortfolioGrid.tsx
components/Gallery.tsx Lightbox.tsx Filters.tsx ContactForm.tsx ThemeToggle.tsx
components/Tag.tsx BackToTop.tsx Reveal.tsx (reduced-motion-aware wrapper)
components/ui/*                  shadcn primitives (button, input, textarea, etc.)
```

---

## Task 1: Scaffold project + static-export config

**Files:**
- Create: project via `create-next-app`
- Modify: `next.config.mjs`
- Create: `.gitignore` (from create-next-app)

- [ ] **Step 1: Scaffold** (run from `C:/Users/AliMaken/projects/portfolio_website_v2`)

```bash
npx create-next-app@latest . --ts --tailwind --app --eslint --src-dir=false --import-alias "@/*" --no-turbopack --use-npm
```
If prompted to proceed in a non-empty dir, accept (only `Prompt.md` + `docs/` exist).

- [ ] **Step 2: Init git**

```bash
git init && git add -A && git commit -m "chore: scaffold next.js app"
```

- [ ] **Step 3: Configure static export.** Replace `next.config.mjs` with:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true, // stable paths on GitHub Pages / static hosts
};
export default nextConfig;
```

- [ ] **Step 4: Install runtime deps**

```bash
npm install zod next-themes framer-motion lucide-react
npm install -D sharp tsx
```

- [ ] **Step 4b: Content-sync prebuild.** The owner drops everything into
  `content/projects/<slug>/` (json + images). Static export only serves `public/`,
  so a prebuild step mirrors images into `public/content/`. Create `scripts/sync-content.mjs`:

```js
import { cp, mkdir, rm, readdir } from 'node:fs/promises';
import path from 'node:path';
const SRC = path.join(process.cwd(), 'content', 'projects');
const DEST = path.join(process.cwd(), 'public', 'content');
const IMG = /\.(jpe?g|png|webp|avif)$/i;
await rm(DEST, { recursive: true, force: true });
let slugs = [];
try { slugs = (await readdir(SRC, { withFileTypes: true }))
  .filter((d) => d.isDirectory() && !d.name.startsWith('_')).map((d) => d.name); }
catch { slugs = []; }
for (const slug of slugs) {
  const from = path.join(SRC, slug), to = path.join(DEST, slug);
  await mkdir(to, { recursive: true });
  for (const f of await readdir(from)) {
    if (IMG.test(f)) await cp(path.join(from, f), path.join(to, f));
  }
}
console.log(`synced ${slugs.length} project folders`);
```

  Wire it into `package.json` scripts: `"prebuild": "node scripts/sync-content.mjs"`
  and add a `"predev": "node scripts/sync-content.mjs"` too. Add `/public/content/`
  to `.gitignore` (generated artifact).

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: build succeeds, produces `out/` directory.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: configure static export + core deps"
```

---

## Task 2: Types and Zod schema

**Files:**
- Create: `types/index.ts`
- Create: `lib/projects.schema.ts`

- [ ] **Step 1: Write `types/index.ts`**

```ts
export const CATEGORIES = [
  'Branding', 'Illustration', 'Print', 'UI', 'UX', 'Web', 'Motion', 'Other',
] as const;
export type Category = (typeof CATEGORIES)[number];

export interface GalleryImage {
  src: string;        // public-relative path, e.g. /content/<slug>/01-foo.jpg
  alt: string;
  width: number;
  height: number;
  blurDataURL: string;
}

/** Shape authored by the owner in project.json. */
export interface RawProject {
  title: string;
  subtitle?: string;
  category: Category;
  client?: string;
  year: number;
  services: string[];
  description: string;
  problem?: string;
  process?: string;
  solution?: string;
  tools: string[];
  deliverables: string[];
  tags: string[];
  featured: boolean;
  order: number;
}

/** Fully resolved project used by the app. */
export interface Project extends RawProject {
  slug: string;
  cover: GalleryImage;
  gallery: GalleryImage[];
}

export interface SocialLink { label: string; href: string; icon: string }
export interface Service { title: string; description: string; icon: string }

export interface SiteConfig {
  name: string;
  role: string;
  shortBio: string;
  longBio: string[];
  email: string;
  phone?: string;
  location: string;
  url: string;                 // canonical site URL, no trailing slash
  formspreeId: string;
  socials: SocialLink[];
  services: Service[];
  skills: string[];
  software: { name: string; level: number }[];
  experience: { role: string; org: string; period: string; detail: string }[];
  education: { title: string; org: string; period: string }[];
  values: string[];
  philosophy: string;
  responseTime: string;
  availability: string;
  cvPath: string;              // e.g. /cv.pdf
  nav: { label: string; href: string }[];
  analyticsId?: string;
}
```

- [ ] **Step 2: Write `lib/projects.schema.ts`**

```ts
import { z } from 'zod';
import { CATEGORIES } from '@/types';

export const rawProjectSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  category: z.enum(CATEGORIES),
  client: z.string().optional(),
  year: z.number().int(),
  services: z.array(z.string()).default([]),
  description: z.string().min(1),
  problem: z.string().optional(),
  process: z.string().optional(),
  solution: z.string().optional(),
  tools: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add types lib && git commit -m "feat: project types + zod schema"
```

---

## Task 3: Content loader (TDD)

**Files:**
- Create: `lib/images.ts`
- Create: `lib/projects.ts`
- Create: `lib/projects.test.ts`
- Create test fixtures under `content/projects/_fixture-*` (removed after; or use a tmp dir)

This is the one piece with non-trivial logic, so it gets a runnable check.

- [ ] **Step 1: Write `lib/images.ts`**

```ts
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import type { GalleryImage } from '@/types';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

/** Build a GalleryImage from a file living under /public. */
export async function buildImage(publicRelPath: string, alt: string): Promise<GalleryImage> {
  const abs = path.join(PUBLIC_DIR, publicRelPath.replace(/^\//, ''));
  const buf = await readFile(abs);
  const img = sharp(buf);
  const meta = await img.metadata();
  const blur = await img
    .resize(16, 16, { fit: 'inside' })
    .webp({ quality: 40 })
    .toBuffer();
  return {
    src: publicRelPath.startsWith('/') ? publicRelPath : `/${publicRelPath}`,
    alt,
    width: meta.width ?? 1200,
    height: meta.height ?? 800,
    blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
  };
}
```

> Note: project images live under `public/content/<slug>/` so static export serves
> them directly. The loader reads from there.

- [ ] **Step 2: Write the failing test `lib/projects.test.ts`**

```ts
import assert from 'node:assert';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { parseAndSort } from './projects';
import type { RawProject } from '@/types';

function raw(p: Partial<RawProject>): RawProject {
  return {
    title: 'T', category: 'Branding', year: 2024, services: [], description: 'd',
    tools: [], deliverables: [], tags: [], featured: false, order: 0, ...p,
  } as RawProject;
}

// sort: featured first, then order asc, then year desc, then title
const sorted = parseAndSort([
  { slug: 'b', raw: raw({ title: 'B', featured: false, order: 1, year: 2020 }) },
  { slug: 'a', raw: raw({ title: 'A', featured: true, order: 5, year: 2019 }) },
  { slug: 'c', raw: raw({ title: 'C', featured: false, order: 1, year: 2023 }) },
]);
assert.deepStrictEqual(sorted.map((p) => p.slug), ['a', 'c', 'b'],
  'featured first, then order, then year desc');

// invalid JSON should throw with the slug named (tested via validateRaw)
import { rawProjectSchema } from './projects.schema';
assert.throws(() => rawProjectSchema.parse({ title: '' }), 'empty title rejected');

console.log('projects.test OK');
```

- [ ] **Step 3: Run it, expect failure**

Run: `npx tsx lib/projects.test.ts`  (install once: `npm i -D tsx`)
Expected: FAIL — `parseAndSort` not exported.

- [ ] **Step 4: Write `lib/projects.ts`**

```ts
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { rawProjectSchema } from './projects.schema';
import { buildImage } from './images';
import type { Project, RawProject } from '@/types';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'projects');
const IMG_EXT = /\.(jpe?g|png|webp|avif)$/i;

interface Entry { slug: string; raw: RawProject }

/** Pure: validate-free sort used by both the loader and the test. */
export function parseAndSort(entries: Entry[]): Entry[] {
  return [...entries].sort((a, b) => {
    if (a.raw.featured !== b.raw.featured) return a.raw.featured ? -1 : 1;
    if (a.raw.order !== b.raw.order) return a.raw.order - b.raw.order;
    if (a.raw.year !== b.raw.year) return b.raw.year - a.raw.year;
    return a.raw.title.localeCompare(b.raw.title);
  });
}

async function readProjectFolder(slug: string): Promise<Entry> {
  const file = path.join(CONTENT_DIR, slug, 'project.json');
  let json: unknown;
  try {
    json = JSON.parse(await readFile(file, 'utf8'));
  } catch (e) {
    throw new Error(`Cannot read/parse ${slug}/project.json: ${(e as Error).message}`);
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
      buildImage(`/content/${entry.slug}/${f}`, `${entry.raw.title} image ${i + 1}`)),
  );
  return { ...entry.raw, slug: entry.slug, cover, gallery };
}

let _cache: Project[] | null = null;

export async function getAllProjects(): Promise<Project[]> {
  if (_cache) return _cache;
  let slugs: string[] = [];
  try {
    const dirents = await readdir(CONTENT_DIR, { withFileTypes: true });
    slugs = dirents.filter((d) => d.isDirectory() && !d.name.startsWith('_')).map((d) => d.name);
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

/** prev/previous wraps around; related = same category, then shared tags. */
export async function getProjectNav(slug: string) {
  const all = await getAllProjects();
  const i = all.findIndex((p) => p.slug === slug);
  const prev = all[(i - 1 + all.length) % all.length];
  const next = all[(i + 1) % all.length];
  const current = all[i];
  const related = all
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      p,
      score: (p.category === current.category ? 2 : 0) +
        p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.p);
  return { prev, next, related };
}
```

- [ ] **Step 5: Run the test, expect pass**

Run: `npx tsx lib/projects.test.ts`
Expected: `projects.test OK`

- [ ] **Step 6: Commit**

```bash
git add lib package.json package-lock.json && git commit -m "feat: content loader with zod validation + sort (tested)"
```

---

## Task 4: Seed content + site config

**Files:**
- Create: `config/site.ts`
- Create: 4× `content/projects/<slug>/project.json`
- Create: placeholder images under `content/projects/<slug>/` (synced to public by Task 1 Step 4b)
- Create: `public/cv.pdf` (placeholder), `public/og.png`, `public/portrait.jpg`

- [ ] **Step 1: Generate placeholder images** into the owner's content folders (the sync script copies them to `public/` at build). Run:

```bash
node -e "
const sharp=require('sharp');const fs=require('fs');
const slugs=['modern-coffee-branding','aurora-editorial','field-notes-app','studio-poster-series'];
const colors=['#1f2933','#7c3aed','#0f766e','#b45309'];
slugs.forEach((s,i)=>{
  const dir='content/projects/'+s;fs.mkdirSync(dir,{recursive:true});
  const mk=(name,w,h,c)=>sharp({create:{width:w,height:h,channels:3,background:c}}).jpeg().toFile(dir+'/'+name);
  mk('cover.jpg',1200,900,colors[i]);
  mk('01-detail.jpg',1600,1067,colors[i]);
  mk('02-detail.jpg',1067,1600,colors[(i+1)%4]);
  mk('03-detail.jpg',1600,1067,colors[(i+2)%4]);
});
console.log('seed images written');
"
```

Also create placeholder `public/og.png` (1200×630) and an empty `public/cv.pdf`:

```bash
node -e "require('sharp')({create:{width:1200,height:630,channels:3,background:'#1f2933'}}).png().toFile('public/og.png').then(()=>console.log('og ok'))"
node -e "require('sharp')({create:{width:1000,height:1250,channels:3,background:'#2b3440'}}).jpeg().toFile('public/portrait.jpg').then(()=>console.log('portrait ok'))"
printf '%%PDF-1.4\n%%placeholder\n' > public/cv.pdf
```

- [ ] **Step 2: Write 4 `project.json` files.** Example for `content/projects/modern-coffee-branding/project.json` (write the other three with varied categories `Editorial→Print`, `Field Notes→UI`, `Poster→Illustration`, varied years 2025/2024/2023, set 2 of them `featured: true`):

```json
{
  "title": "Modern Coffee Branding",
  "subtitle": "A complete identity for a specialty roaster",
  "category": "Branding",
  "client": "Hearth & Bean",
  "year": 2025,
  "services": ["Logo Design", "Packaging", "Typography"],
  "description": "A warm, modern identity system for a specialty coffee roaster, from logo to packaging.",
  "problem": "Hearth & Bean had outgrown a logo that read as generic and inconsistent across packaging.",
  "process": "Audited competitors, defined a warm editorial voice, explored marks, then built a flexible system.",
  "solution": "A custom wordmark, a warm palette, and a packaging grid that scales across the product range.",
  "tools": ["Illustrator", "InDesign", "Photoshop"],
  "deliverables": ["Logo suite", "Packaging system", "Brand guidelines"],
  "tags": ["Branding", "Packaging", "Typography"],
  "featured": true,
  "order": 1
}
```

- [ ] **Step 3: Write `config/site.ts`** with realistic sample content matching the `SiteConfig` type (fill every field; `nav` = Home/Portfolio/About/Contact; include 3–4 services, ~8 skills, software with levels, 2 experience + 1 education entries, 4 values, a philosophy paragraph, real-looking placeholder socials, `formspreeId: 'your-form-id'`, `url: 'https://example.com'`).

```ts
import type { SiteConfig } from '@/types';

export const site: SiteConfig = {
  name: 'Alex Rivera',
  role: 'Graphic Designer & Art Director',
  shortBio: 'I craft brand identities and editorial systems that feel considered, warm, and built to last.',
  longBio: [
    'I am a multidisciplinary graphic designer with a decade of work across branding, print, and digital products.',
    'My approach is editorial and systems-driven: clear typography, generous space, and details that hold up at every scale.',
  ],
  email: 'hello@example.com',
  phone: '+1 (555) 010-1234',
  location: 'Lisbon, Portugal',
  url: 'https://example.com',
  formspreeId: 'your-form-id',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/', icon: 'instagram' },
    { label: 'Dribbble', href: 'https://dribbble.com/', icon: 'dribbble' },
    { label: 'LinkedIn', href: 'https://linkedin.com/', icon: 'linkedin' },
  ],
  services: [
    { title: 'Brand Identity', description: 'Logos, systems, and guidelines that scale.', icon: 'pen-tool' },
    { title: 'Editorial & Print', description: 'Books, magazines, and packaging.', icon: 'book-open' },
    { title: 'Digital & UI', description: 'Product and marketing interfaces.', icon: 'layout' },
    { title: 'Art Direction', description: 'Campaigns and visual language.', icon: 'sparkles' },
  ],
  skills: ['Brand Strategy', 'Typography', 'Layout', 'Packaging', 'Art Direction', 'Illustration', 'Prototyping', 'Design Systems'],
  software: [
    { name: 'Illustrator', level: 95 }, { name: 'Photoshop', level: 90 },
    { name: 'InDesign', level: 92 }, { name: 'Figma', level: 88 },
  ],
  experience: [
    { role: 'Senior Designer', org: 'Studio Atlas', period: '2020 — Present', detail: 'Led identity work for lifestyle and culture clients.' },
    { role: 'Designer', org: 'Northbound', period: '2016 — 2020', detail: 'Editorial and packaging across consumer brands.' },
  ],
  education: [
    { title: 'BA Graphic Design', org: 'Central School of Art', period: '2012 — 2016' },
  ],
  values: ['Clarity over decoration', 'Systems that scale', 'Craft in the details', 'Honest collaboration'],
  philosophy: 'Good design is mostly editing. I remove until only the essential remains, then make that essential beautiful.',
  responseTime: 'Usually within 1–2 business days',
  availability: 'Open to select projects for Q3 2026',
  cvPath: '/cv.pdf',
  nav: [
    { label: 'Home', href: '/' }, { label: 'Portfolio', href: '/portfolio' },
    { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' },
  ],
};
```

- [ ] **Step 4: Verify loader sees content**

Run: `npx tsx -e "import('./lib/projects').then(m=>m.getAllProjects()).then(p=>console.log(p.length, p.map(x=>x.slug)))"`
Expected: `4 [ ... 4 slugs ... ]`

- [ ] **Step 5: Commit**

```bash
git add config content public && git commit -m "feat: seed sample projects + site config"
```

---

## Task 5: Layout, theme, fonts, Navbar, Footer

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css`
- Create: `components/ThemeToggle.tsx`, `components/Navbar.tsx`, `components/Footer.tsx`, `components/Reveal.tsx`

- [ ] **Step 1: shadcn/ui init + base components**

```bash
npx shadcn@latest init -d
npx shadcn@latest add button input textarea label sonner
```

- [ ] **Step 2: `app/layout.tsx`** — editorial fonts (a grotesk for UI + a serif display), `next-themes` provider (class strategy, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`), base metadata from `lib/seo.ts`, Navbar + Footer + Sonner Toaster, `<BackToTop/>`. Use `next/font/google` (e.g. `Inter` + `Fraunhound`/`Fraunces`). Wrap children with theme provider; add `suppressHydrationWarning` on `<html>`.

```tsx
import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { baseMetadata } from '@/lib/seo';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const serif = Fraunces({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = baseMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-3">Skip to content</a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <BackToTop />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: `app/globals.css`** — keep shadcn's variables; add `--font-serif`/`--font-sans` to the `body`/utility layer; add an editorial type scale helper (`.display` class using the serif var). Add `@media (prefers-reduced-motion: reduce){ *{animation-duration:.01ms!important;transition-duration:.01ms!important} }` as a CSS safety net.

- [ ] **Step 4: `components/Reveal.tsx`** — Framer Motion fade/slide-up wrapper that respects reduced motion via `useReducedMotion()`; renders children with `initial`/`whileInView`/`viewport={{ once:true }}`, no animation when reduced.

```tsx
'use client';
import { motion, useReducedMotion } from 'framer-motion';
export default function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay }}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 5: `components/ThemeToggle.tsx`** — `'use client'`, `useTheme()` from next-themes, mounted guard to avoid hydration mismatch, cycles light/dark, Lucide `Sun`/`Moon`, accessible `aria-label`.

- [ ] **Step 6: `components/Navbar.tsx`** — sticky, blurred bg, owner `site.name` wordmark linking home, `site.nav` links (active state via `usePathname`), `ThemeToggle`, mobile menu (shadcn Sheet or simple disclosure). Keyboard accessible.

- [ ] **Step 7: `components/Footer.tsx`** — `site.name`, nav links, social links (Lucide icons mapped from `social.icon`), copy email button (`navigator.clipboard` + Sonner toast), © year.

- [ ] **Step 8: `components/BackToTop.tsx`** — `'use client'`, shows after scrollY>600, smooth-scrolls to top, `aria-label`, hidden under reduced-motion-friendly behavior (instant scroll if reduced).

- [ ] **Step 9: Build**

Run: `npm run build`
Expected: succeeds. (Stub `lib/seo.ts` minimally if needed — completed in Task 10.)

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "feat: layout, theme, nav, footer, motion primitives"
```

---

## Task 6: Homepage

**Files:**
- Modify: `app/page.tsx`
- Create: `components/Hero.tsx`, `components/ProjectCard.tsx`, `components/Tag.tsx`

- [ ] **Step 1: `components/Tag.tsx`** — small pill (`<span>` or link) for tags/category, variant prop, dark-mode aware.

- [ ] **Step 2: `components/ProjectCard.tsx`** — link to `/portfolio/[slug]`, `next/image` (cover, `placeholder="blur"`, `blurDataURL`, `unoptimized`, `sizes`), title, category `Tag`, short description, hover scale/overlay (Framer or CSS, reduced-motion safe), proper `alt`.

```tsx
import Link from 'next/link';
import Image from 'next/image';
import Tag from './Tag';
import type { Project } from '@/types';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/portfolio/${project.slug}/`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
        <Image src={project.cover.src} alt={project.cover.alt}
          width={project.cover.width} height={project.cover.height}
          placeholder="blur" blurDataURL={project.cover.blurDataURL} unoptimized
          sizes="(max-width:768px) 100vw, 33vw"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Tag>{project.category}</Tag><span className="text-sm text-muted-foreground">{project.year}</span>
      </div>
      <h3 className="mt-1 font-serif text-xl">{project.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
    </Link>
  );
}
```

- [ ] **Step 3: `components/Hero.tsx`** — large serif headline (`site.role`/intro), `site.shortBio`, portrait placeholder (`next/image` on a `public/portrait.jpg` — generate a placeholder via sharp like Task 4), primary CTA → `/portfolio`, secondary → `/contact`. Use `Reveal`.

- [ ] **Step 4: `app/page.tsx`** (server component) — fetch `getAllProjects()`, render: Hero, Featured projects (filter `featured`, grid of `ProjectCard`), Services overview (from `site.services`, Lucide icons), Testimonials placeholder (1–2 sample quotes), Client logos placeholder (grayscale row of generated logo boxes), Contact CTA band. Each section wrapped in `Reveal`.

- [ ] **Step 5: Build + eyeball**

Run: `npm run build` then `npx serve out` (or `npm run dev`)
Expected: homepage renders with hero, featured cards, services.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: homepage with hero, featured, services"
```

---

## Task 7: Portfolio page — grid, filter, sort, search

**Files:**
- Modify: `app/portfolio/page.tsx`
- Create: `components/PortfolioGrid.tsx` (client), `components/Filters.tsx` (client)

- [ ] **Step 1: `app/portfolio/page.tsx`** (server) — `getAllProjects()`, pass plain serializable array to `<PortfolioGrid projects={...} />`. Add page heading + intro.

- [ ] **Step 2: `components/PortfolioGrid.tsx`** (`'use client'`) — holds state: `category` (all + 8 categories), `sort` (Newest/Oldest/Alphabetical), `query` (matches title + tags, case-insensitive). Derive filtered+sorted list with `useMemo`. Render `<Filters/>` + responsive grid of `ProjectCard`. Empty state when no matches. Categories derived from `CATEGORIES` but only show those present.

```tsx
'use client';
import { useMemo, useState } from 'react';
import type { Project, Category } from '@/types';
import ProjectCard from './ProjectCard';
import Filters from './Filters';

type Sort = 'newest' | 'oldest' | 'az';
export default function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [sort, setSort] = useState<Sort>('newest');
  const [query, setQuery] = useState('');
  const cats = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))), [projects]);
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter((p) => category === 'all' || p.category === category)
      .filter((p) => !q || p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)))
      .sort((a, b) =>
        sort === 'az' ? a.title.localeCompare(b.title)
        : sort === 'oldest' ? a.year - b.year : b.year - a.year);
  }, [projects, category, sort, query]);
  return (
    <>
      <Filters {...{ cats, category, setCategory, sort, setSort, query, setQuery }} />
      {list.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">No projects match your filters.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 3: `components/Filters.tsx`** (`'use client'`) — category buttons (active state), sort `<select>` (native — a11y + zero JS weight), search `<Input>` with Lucide `Search` icon and `aria-label`. Props typed to match the spread above.

- [ ] **Step 4: Build + eyeball filtering/search**

Run: `npm run dev`, visit `/portfolio`, test category/sort/search.
Expected: list updates correctly; empty state shows for nonsense query.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: portfolio grid with filter, sort, search"
```

---

## Task 8: Project detail page — gallery, lightbox, nav, related

**Files:**
- Modify: `app/portfolio/[slug]/page.tsx`
- Create: `components/Gallery.tsx` (client), `components/Lightbox.tsx` (client)

- [ ] **Step 1: `app/portfolio/[slug]/page.tsx`** — `generateStaticParams` from `getAllProjects()`; `generateMetadata` per project (Task 10 helper); body: hero cover image, overview (`description`), Problem/Process/Solution sections (render only if present), Tools + Deliverables + Services lists, `<Gallery images={project.gallery}/>`, Related projects grid, Prev/Next nav. Use `getProject` + `getProjectNav`.

```tsx
import { notFound } from 'next/navigation';
import { getAllProjects, getProject, getProjectNav } from '@/lib/projects';

export async function generateStaticParams() {
  return (await getAllProjects()).map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  const { prev, next, related } = await getProjectNav(slug);
  // ...render sections (conditionally for problem/process/solution), Gallery, related, prev/next
}
```

- [ ] **Step 2: `components/Lightbox.tsx`** (`'use client'`) — fullscreen dialog (shadcn Dialog or custom), shows current image, prev/next + arrow-key + Escape handling, focus trap, `aria-modal`, click backdrop to close. Accepts `images`, `index`, `onClose`, `onIndexChange`.

- [ ] **Step 3: `components/Gallery.tsx`** (`'use client'`) — responsive grid of gallery images (`next/image`, blur, unoptimized, lazy); clicking opens `Lightbox` at that index; keyboard-activatable (`button` wrappers).

- [ ] **Step 4: Build + verify**

Run: `npm run build`
Expected: one static page per project under `out/portfolio/<slug>/`. Open one, test lightbox keyboard nav + prev/next.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: project detail page, gallery, lightbox, related/nav"
```

---

## Task 9: About page

**Files:**
- Modify: `app/about/page.tsx`

- [ ] **Step 1: `app/about/page.tsx`** (server) — pull from `site`: portrait placeholder, `longBio`, Experience timeline, Skills (tag list), Software proficiency (name + level bar, `role="meter"` with aria values), Education, Values, design Philosophy quote, Download CV button (`<a href={site.cvPath} download>`). Wrap sections in `Reveal`.

- [ ] **Step 2: Build + eyeball**

Run: `npm run dev`, visit `/about`.
Expected: all sections render from config.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: about page"
```

---

## Task 10: Contact page + form (Formspree) + validation

**Files:**
- Modify: `app/contact/page.tsx`
- Create: `components/ContactForm.tsx` (client), `lib/contact.schema.ts`

- [ ] **Step 1: `lib/contact.schema.ts`**

```ts
import { z } from 'zod';
export const contactSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  // honeypot: must stay empty
  company: z.string().max(0).optional(),
});
export type ContactValues = z.infer<typeof contactSchema>;
```

- [ ] **Step 2: Add a runnable check at the bottom of `lib/contact.schema.ts` is overkill — instead add `lib/contact.schema.test.ts`:**

```ts
import assert from 'node:assert';
import { contactSchema } from './contact.schema';
assert.ok(!contactSchema.safeParse({ name: '', email: 'x', message: 'short' }).success);
assert.ok(contactSchema.safeParse({ name: 'A', email: 'a@b.co', message: 'a valid message here' }).success);
assert.ok(!contactSchema.safeParse({ name: 'A', email: 'a@b.co', message: 'a valid message here', company: 'bot' }).success, 'honeypot rejects');
console.log('contact.schema.test OK');
```

Run: `npx tsx lib/contact.schema.test.ts` → expect `contact.schema.test OK`.

- [ ] **Step 3: `components/ContactForm.tsx`** (`'use client'`) — controlled fields name/email/message + hidden honeypot `company` field (visually hidden, `tabIndex=-1`, `autoComplete=off`). On submit: `contactSchema.safeParse`, show field errors; if valid POST JSON to `https://formspree.io/f/${site.formspreeId}` with `Accept: application/json`; loading state; success → Sonner toast + reset + success message; network/Formspree error → error toast. Disable submit while sending. All inputs labeled, errors `aria-describedby`.

```tsx
'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { site } from '@/config/site';
import { contactSchema } from '@/lib/contact.schema';
// inputs from components/ui

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      setErrors(Object.fromEntries(
        parsed.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    setSending(true);
    try {
      const res = await fetch(`https://formspree.io/f/${site.formspreeId}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error('send failed');
      toast.success('Thanks — your message has been sent.');
      e.currentTarget.reset();
    } catch {
      toast.error('Something went wrong. Please email me directly.');
    } finally { setSending(false); }
  }
  // ...render labeled fields, honeypot, error text, submit (disabled when sending)
}
```

- [ ] **Step 4: `app/contact/page.tsx`** — contact info (email copy button, phone, location), social links, availability + response time (from `site`), `<ContactForm/>`, Google Maps placeholder (static styled box with location label — no API key; document how to embed an iframe later).

- [ ] **Step 5: Build + eyeball**

Run: `npm run dev`, visit `/contact`. Submit empty → errors; fill valid → (with a real Formspree id) sends. Verify honeypot field hidden.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: contact page + validated formspree form (tested)"
```

---

## Task 11: SEO — metadata, JSON-LD, sitemap, robots

**Files:**
- Create: `lib/seo.ts`
- Create: `app/sitemap.ts`, `app/robots.ts`
- Modify: project + page files to add `generateMetadata`/`metadata`

- [ ] **Step 1: `lib/seo.ts`** — `baseMetadata()` (title template, description, OG, Twitter card, `metadataBase: new URL(site.url)`, icons), `projectMetadata(project)` (title/desc/OG image = cover), `personJsonLd()` (schema.org Person from `site`), `projectJsonLd(project)` (CreativeWork). Return `<script type="application/ld+json">` strings to embed.

```ts
import type { Metadata } from 'next';
import { site } from '@/config/site';
import type { Project } from '@/types';

export function baseMetadata(): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} — ${site.role}`, template: `%s — ${site.name}` },
    description: site.shortBio,
    openGraph: { type: 'website', url: site.url, title: site.name, description: site.shortBio, images: ['/og.png'] },
    twitter: { card: 'summary_large_image', title: site.name, description: site.shortBio, images: ['/og.png'] },
    alternates: { canonical: '/' },
  };
}
export function projectMetadata(p: Project): Metadata {
  return {
    title: p.title, description: p.description,
    openGraph: { title: p.title, description: p.description, images: [p.cover.src] },
    twitter: { card: 'summary_large_image', images: [p.cover.src] },
    alternates: { canonical: `/portfolio/${p.slug}/` },
  };
}
export function personJsonLd() {
  return JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Person',
    name: site.name, jobTitle: site.role, email: `mailto:${site.email}`,
    url: site.url, address: site.location,
    sameAs: site.socials.map((s) => s.href),
  });
}
export function projectJsonLd(p: Project) {
  return JSON.stringify({
    '@context': 'https://schema.org', '@type': 'CreativeWork',
    name: p.title, description: p.description, creator: { '@type': 'Person', name: site.name },
    dateCreated: String(p.year), keywords: p.tags.join(', '),
  });
}
```

- [ ] **Step 2: Embed JSON-LD** — in `app/layout.tsx` add `<script type="application/ld+json" dangerouslySetInnerHTML={{__html: personJsonLd()}}/>`; in project page add `projectJsonLd(project)`.

- [ ] **Step 3: `app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { getAllProjects } from '@/lib/projects';
export const dynamic = 'force-static';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects();
  const routes = ['', '/portfolio', '/about', '/contact'].map((r) => ({
    url: `${site.url}${r}`, lastModified: new Date(),
  }));
  return [...routes, ...projects.map((p) => ({ url: `${site.url}/portfolio/${p.slug}`, lastModified: new Date() }))];
}
```

- [ ] **Step 4: `app/robots.ts`**

```ts
import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${site.url}/sitemap.xml` };
}
```

- [ ] **Step 5: Add `generateMetadata` to project page + `metadata` exports to about/contact/portfolio** (titles "Portfolio"/"About"/"Contact").

- [ ] **Step 6: Build + verify**

Run: `npm run build`
Expected: `out/sitemap.xml`, `out/robots.txt` exist; project pages contain JSON-LD + OG tags (grep `out/portfolio/<slug>/index.html`).

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: SEO metadata, JSON-LD, sitemap, robots"
```

---

## Task 12: Accessibility + polish pass

**Files:** various components

- [ ] **Step 1: Audit** — headings in order per page (one `h1`), all images have meaningful `alt`, all interactive elements keyboard-reachable with visible focus ring, color contrast AA in both themes, lightbox focus trap + Escape works, forms labeled with error association, `prefers-reduced-motion` honored (Reveal + CSS net + BackToTop).

- [ ] **Step 2: Fix issues found.** (No code given — depends on audit; common: add `aria-label` to icon buttons, `focus-visible` ring utilities, fix heading levels.)

- [ ] **Step 3: Build + Lighthouse** — run Lighthouse (or `npx @lhci/cli autorun` against `out/` served) on home + a project page. Target 95+ across the board; fix regressions.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "fix: accessibility + performance polish"
```

---

## Task 13: Documentation + deployment config

**Files:**
- Create: `README.md`
- Create: `.github/workflows/deploy.yml` (GitHub Pages option)

- [ ] **Step 1: `README.md`** covering: Installation (`npm install`), Development (`npm run dev`), Building (`npm run build` → `out/`), Deployment (Vercel / GitHub Pages / Cloudflare — pros/cons + steps), **Adding a project** (create `content/projects/<slug>/project.json` + images in `public/content/<slug>/`, list of fields), Replacing images, Updating profile (`config/site.ts`), Changing colors (Tailwind/shadcn CSS vars in `globals.css`), Changing typography (`next/font` in `layout.tsx`), Changing navigation (`site.nav`), Adding social links (`site.socials` + icon names), Updating SEO (`config/site.ts` + `public/og.png`), Setting up Formspree (`site.formspreeId`).

> Doc the single workflow: owner puts `project.json` **and** images together in
> `content/projects/<slug>/` — that's the only directory they touch. The `prebuild`
> sync script (Task 1 Step 4b) mirrors images into `public/content/` automatically;
> `public/content/` is gitignored and never edited by hand.

- [ ] **Step 2: GitHub Pages workflow** (optional path) — actions/checkout, setup-node, `npm ci`, `npm run build`, upload `out/` artifact, deploy-pages. Note `basePath` needed if not a user/root page.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "docs: README + deployment workflow"
```

---

## Task 14: Final verification

- [ ] **Step 1:** `npx tsc --noEmit` → no errors.
- [ ] **Step 2:** `npx tsx lib/projects.test.ts && npx tsx lib/contact.schema.test.ts` → both OK.
- [ ] **Step 3:** `npm run build` → succeeds, `out/` has home, /portfolio, 4 project pages, /about, /contact, sitemap.xml, robots.txt.
- [ ] **Step 4:** Drop a 5th folder into `content/projects/<new-slug>/` (project.json + an image), run `npm run build`, confirm `/portfolio/<new-slug>/` appears with **zero code changes** — the core requirement.
- [ ] **Step 5:** `git add -A && git commit -m "test: final verification"`.

---

## Self-review notes

- **Spec coverage:** homepage sections ✓, portfolio filter/sort/search ✓, project page sections + lightbox + related + prev/next ✓, about ✓, contact + form ✓, image blur/lazy ✓, SEO suite ✓, a11y ✓, theme ✓, responsive (Tailwind) ✓, config single-source ✓, docs ✓, deploy ✓, drop-in discovery ✓ (Task 14 Step 4). Deferred items (masonry, PWA, social share, scroll progress, print CV, route transitions, preloading, pagination) intentionally out of lean core per spec.
- **Images path (resolved):** owner touches only `content/projects/<slug>/`; `prebuild`/`predev` sync script (Task 1 Step 4b) mirrors images to `public/content/` (gitignored). `buildImage` reads from `public/`, so the loader must run after sync — guaranteed because `prebuild`/`predev` run before `next build`/`next dev`. Loader image src stays `/content/<slug>/...`.
- **Types consistent:** `getAllProjects`/`getProject`/`getProjectNav`/`parseAndSort`, `buildImage`, `Project`/`RawProject`/`SiteConfig`/`GalleryImage` used consistently across tasks.
```
