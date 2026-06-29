# Portfolio Website — Design Spec

**Date:** 2026-06-29
**Status:** Approved (pending user spec review)

## Goal

A modern, lightweight, statically-exported portfolio site for a graphic designer.
Owner adds/updates work by dropping a folder into `content/projects/` — no code
changes. Production quality: fast, SEO-complete, accessible, responsive, themeable.

## Decisions (locked)

- **Scope:** Lean core first, iterate. (See In / Deferred below.)
- **Aesthetic:** Editorial / minimal — generous whitespace, large type, gallery-first,
  monochrome + one accent.
- **Stack:** Next.js (App Router, latest stable) · TypeScript · TailwindCSS ·
  shadcn/ui · Framer Motion · Lucide. `output: 'export'` (static).
- **Content model:** Option A — folder-per-project with `project.json` + images.
- **Contact form:** Formspree.
- **Deploy:** Vercel primary; static export keeps GitHub Pages / Cloudflare Pages viable.
- **Seed content:** 3–4 realistic sample projects + full sample bio/about/services +
  generated placeholder images, so the site looks complete on first run.

## Content model — Option A (folder drop)

```
content/projects/<slug>/
    project.json
    cover.jpg            # thumbnail, auto-detected by name "cover.*"
    01-*.jpg             # gallery images, sorted by filename
    02-*.webp
```

Drop a new folder → `/portfolio/<slug>` is generated on next build. No registration.

**Why Option A over MDX (B):** non-technical owner edits labeled key/value fields,
never Markdown syntax; can't break layout; images live beside their metadata. MDX's
only advantage (long-form prose) is covered by structured text fields.

### `project.json` schema (validated with Zod at build)

| Field | Type | Notes |
|---|---|---|
| `title` | string | required |
| `subtitle` | string? | |
| `category` | enum | Branding · Illustration · Print · UI · UX · Web · Motion · Other |
| `client` | string? | |
| `year` | number | required |
| `services` | string[] | |
| `description` | string | short summary (cards + overview) |
| `problem` | string? | project page "Problem statement" |
| `process` | string? | project page "Design process" |
| `solution` | string? | project page "Solution" |
| `tools` | string[] | |
| `deliverables` | string[] | |
| `tags` | string[] | |
| `featured` | boolean | default false |
| `order` | number | default 0, sort key |

Invalid/missing required fields **fail the build loudly** (no broken pages shipped).
Slug = folder name. Cover = `cover.*`; gallery = remaining images sorted by filename.

## Folder structure

```
app/
  layout.tsx              theme provider, nav, footer, fonts, base metadata
  page.tsx                homepage
  portfolio/page.tsx      grid + filter/sort/search
  portfolio/[slug]/page.tsx
  about/page.tsx
  contact/page.tsx
  sitemap.ts  robots.ts
components/                Navbar Footer Hero ProjectCard PortfolioGrid Gallery
                          Lightbox Filter Search ThemeToggle ContactForm Tag Badge
                          BackToTop + shadcn/ui primitives
content/projects/<slug>/  owner drop-in folders (primary owner surface)
config/site.ts            ALL owner settings: name, bio, email, phone, location,
                          socials, services, skills, navigation, footer, SEO, analytics
lib/                      projects.ts (scan/parse/validate/sort)
                          images.ts (blur placeholders via sharp)
                          seo.ts (metadata + JSON-LD helpers)
types/                    Project, SiteConfig
public/                   favicon, og image, robots assets, CV.pdf
```

Reasoning: `content/` and `config/` are the only files the owner touches; all code
lives elsewhere. `lib/` isolates filesystem/parse so routes stay declarative.

## Data flow

1. `lib/projects.ts` reads `content/projects/*`, parses + Zod-validates each
   `project.json`, attaches cover/gallery + blur placeholders, returns typed
   `Project[]`.
2. Sort order: `featured` → `order` → `year` (desc) → title.
3. `generateStaticParams` builds every `/portfolio/[slug]`. Homepage featured grid,
   portfolio grid, related projects, prev/next nav, and `sitemap.ts` all derive from
   this single source.

## Images (static export)

`next/image` server optimization does not run under `output: 'export'`. Approach:
owner-supplied source images, rendered via `next/image` with `unoptimized`, **blur
placeholders generated at build** with `sharp`, native lazy loading, lightbox for
full view. Supported inputs: jpg/jpeg/png/webp/avif.

> Ponytail ceiling: not per-request resized. Fine for curated portfolio imagery.
> Upgrade path: drop `unoptimized` + host non-statically on Vercel for on-the-fly
> optimization.

## Contact form — Formspree

Free tier, no backend, built-in spam filtering; add honeypot + client-side Zod
validation + success/error states. Rejected alternatives: Netlify Forms (host
lock-in), EmailJS (client-exposed keys), Basin/Getform (paid sooner). Endpoint ID
lives in `config/site.ts`.

## SEO

Per-page metadata, OpenGraph + Twitter cards, JSON-LD (Person for site,
CreativeWork per project), `sitemap.ts`, `robots.ts`, canonical URLs, semantic HTML,
accessible heading order.

## Accessibility

WCAG AA: keyboard nav (incl. lightbox + filters), visible focus indicators,
sufficient contrast in both themes, alt text from project data, screen-reader
labels, `prefers-reduced-motion` respected on all Framer Motion.

## Theme

Light / dark / system via `next-themes` (or class strategy), persisted, no flash.

## Scope

**In (lean core):** all 4 page types, auto-discovery, filter/sort/search, lightbox,
theme switching, full SEO, a11y, reduced-motion, responsive, realistic seed content,
documentation (README covering install/dev/build/deploy/adding projects/editing
config/images/colors/typography/nav/socials/SEO).

**Deferred:** masonry layout, social sharing, PWA, scroll-progress bar, print CV
stylesheet, image preloading, animated route transitions, pagination.

## Testing

`lib/projects.ts` (scan + Zod validation + sort) gets a runnable check — the one
piece with non-trivial logic. Form validation covered by its schema. No heavy test
framework for the lean core.

## Deployment

`next build` → static `out/`. Vercel (zero-config) primary; same output deploys to
GitHub Pages / Cloudflare Pages. Documented for all three.
