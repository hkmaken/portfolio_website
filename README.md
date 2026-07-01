# Portfolio Website

A fast, statically-exported portfolio for a graphic designer. **New work appears by
dropping a folder into `content/projects/` — no code changes.**

Built with Next.js (App Router, static export), TypeScript, Tailwind CSS, shadcn/ui,
Framer Motion, and Formspree for the contact form.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

`npm run dev` and `npm run build` automatically run `scripts/sync-content.mjs`, which
copies project images from `content/projects/<slug>/` into `public/content/` so the
static export can serve them. You never edit `public/content/` by hand (it's
gitignored).

Dev runs through `scripts/dev.mjs`, a small launcher on a fixed port (3000) that
kills any dev server left over from a previous run before starting a new one. This
prevents orphaned Next.js processes from piling up on Windows when a terminal is
closed without a clean Ctrl+C. The first page load after starting takes ~10s
(Turbopack compiling the route); every load after that is ~1–2s.

### Build a static site

```bash
npm run build    # outputs a fully static site to ./out
```

Serve it locally to preview the production build:

```bash
npx serve out
```

### Run the tests

```bash
npm test         # checks the content loader + contact form validation
```

---

## Adding a project (the main workflow)

Create one folder under `content/projects/`. The folder name becomes the URL
(`content/projects/new-client/` → `/portfolio/new-client/`).

```
content/projects/new-client/
    project.json     ← metadata (see fields below)
    cover.jpg        ← thumbnail (any file named cover.*)
    01-hero.jpg      ← gallery images, shown sorted by filename
    02-detail.webp
```

Supported image types: `jpg`, `jpeg`, `png`, `webp`, `avif`. If there is no
`cover.*`, the first image is used as the cover.

Then rebuild (`npm run build`) or restart `npm run dev`. That's it — the project is
discovered, sorted, paginated into the grid, given its own page, gallery, and
related/prev-next links automatically.

### `project.json` fields

| Field | Required | Notes |
|---|---|---|
| `title` | ✅ | |
| `subtitle` | | short tagline |
| `category` | ✅ | one of: Branding, Illustration, Print, UI, UX, Web, Motion, Other |
| `client` | | |
| `year` | ✅ | number, e.g. `2025` |
| `services` | | array of strings |
| `description` | ✅ | short summary (cards + overview) |
| `problem` | | "The problem" section |
| `process` | | "Design process" section |
| `solution` | | "The solution" section |
| `tools` | | array of strings |
| `deliverables` | | array of strings |
| `tags` | | array of strings (used by search + related) |
| `featured` | | `true` shows it on the homepage |
| `order` | | lower numbers sort first |

If a `project.json` is missing a required field or has an invalid value, **the build
fails with a clear error naming the folder** — so a broken project never ships.

### Replacing images

Drop new files into the project's folder (and delete the old ones). Keep a `cover.*`
for the thumbnail; name gallery files so they sort the way you want (`01-`, `02-`…).

---

## Customizing the site

Almost everything lives in **`config/site.ts`** — edit it without touching components:

- **Profile:** `name`, `role`, `shortBio`, `longBio`, `email`, `phone`, `location`
- **About page:** `experience`, `education`, `skills`, `software`, `values`,
  `philosophy`
- **Contact:** `availability`, `responseTime`, `cvPath`
- **Navigation:** `nav` (label + href)
- **Social links:** `socials` (label + href; shown as text links)
- **SEO:** `url` (your canonical domain — set this before deploying)
- **Contact form:** `formspreeId` (see below)

### Contact form (Formspree)

1. Create a free form at [formspree.io](https://formspree.io).
2. Copy your form ID (the part after `/f/` in the endpoint).
3. Set `formspreeId` in `config/site.ts`.

The form includes client-side validation, a honeypot for spam, success/error
toasts, and a loading state. No backend required.

### Changing colors

Edit the CSS variables in `app/globals.css` under `:root` (light) and `.dark`
(dark). The one accent colour is `--brand` / `--brand-foreground`. Values are in
[oklch](https://oklch.com).

### Changing typography

Fonts are loaded in `app/layout.tsx` via `next/font/google` (Inter for body,
Fraunces for headings). Swap the imports and the `--font-sans` / `--font-serif`
variable names stay the same, so nothing else needs to change.

### Profile photo, OG image, CV

Replace these files in `public/`:
- `portrait.jpg` — the photo on the homepage and about page
- `og.png` — social share image (1200×630)
- `cv.pdf` — the "Download CV" file

### Google Map (optional)

The contact page shows a placeholder. To embed a real map, replace the placeholder
`<div>` in `app/contact/page.tsx` with a Google Maps embed `<iframe>` (Google Maps →
Share → Embed a map).

---

## Deployment

The site is a fully static export (`./out`), so it runs anywhere static files are
served.

| Host | Pros | Cons |
|---|---|---|
| **Vercel** (recommended) | Zero-config for Next.js, instant previews, custom domains, fast global CDN | Ties you to Vercel's dashboard |
| **Cloudflare Pages** | Generous free tier, great CDN | Slightly more setup |
| **GitHub Pages** | Free, lives next to your repo | Needs `basePath` for project sites; workflow included below |
| **Netlify** | Simple, good DX | Another account to manage |

**Recommended: Vercel.** Import the repo at [vercel.com](https://vercel.com) — it
detects Next.js and deploys. Set your domain, and update `url` in `config/site.ts` to
match.

### GitHub Pages

A workflow is included at `.github/workflows/deploy.yml`. If you deploy to a
**project** page (`username.github.io/repo`), set the base path so assets resolve —
add to `next.config.ts`:

```ts
basePath: "/your-repo-name",
```

Then enable Pages → Source: GitHub Actions in the repo settings. Pushing to `main`
builds and deploys automatically.

---

## Project structure

```
app/            routes (home, portfolio, project, about, contact, sitemap, robots)
components/     UI components (+ components/ui from shadcn)
config/site.ts  all owner-editable settings
content/        the owner's project folders (the only content you edit)
lib/            content loader, image blur, SEO helpers (+ tests)
public/         static assets (portrait, og, cv); public/content is generated
scripts/        sync-content.mjs (copies content images into public)
types/          TypeScript types
```

