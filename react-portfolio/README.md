# react-portfolio

The frontend of [ndouken Theryx's portfolio](https://react-portfolio-pi-topaz.vercel.app) — a Vite + React 19 + TypeScript SPA.

## Highlights

- **Multi-profile personas** — the same site renders as a Product Designer, Fintech specialist, Design Engineer, or Digital Marketing portfolio via `?profile=<id>`.
- **Built-in CMS (Studio)** at `/admin` — edit profiles (hero, philosophy, badges, social links), projects (full case studies in Markdown), and blog posts. Includes search, profile filters, reordering, draft/publish, Cloudinary image uploads, and a one-click "sync content to database" migration tool.
- **Resilient data layer** — content lives in Neon Postgres (via `/api`); bundled static content in `src/data/` fills any empty fields and serves as a full offline fallback.
- **SEO** — sitemap, robots.txt, OG image, JSON-LD, per-article meta tags.

## Structure

```
src/
  pages/          Route components (Home, About, Projects, Blog, detail pages)
  pages/admin/    Studio CMS (forms, fields, styles)
  components/     Layout, modals, markdown editor, transitions
  context/        ProfileContext — resolves the active persona and its content
  lib/api.ts      Data layer: API client + static-content merge + sync
  data/           Static fallback content (projects, blog posts)
  hooks/          usePageTitle, usePageMeta (dynamic OG tags)
public/           robots.txt, sitemap.xml, og-image.png, favicon
scripts/          One-off DB maintenance scripts (need DATABASE_URL)
```

## Commands

```bash
npm run dev       # dev server
npm run build     # typecheck + production build
npm run test:run  # vitest
npm run lint      # eslint
```

Copy `.env.local.example` to `.env.local` for Cloudinary uploads in the CMS. Database and JWT secrets are only needed by the serverless functions (repo root `api/`), configured in Vercel.
