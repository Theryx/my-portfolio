# Ndouken Theryx — Portfolio

Personal portfolio of Ndouken Theryx, Design Engineer & Tech Entrepreneur (Douala, Cameroon).

**Live site:** https://react-portfolio-pi-topaz.vercel.app

## Repository layout

| Path | Purpose |
|---|---|
| `react-portfolio/` | The site — Vite + React 19 + TypeScript SPA (this is what Vercel builds) |
| `api/` | Vercel serverless functions (Neon Postgres) — profiles, projects, blog, auth |
| `vercel.json` | Build config, SPA rewrites, security headers |

## Architecture

- **Frontend**: React SPA with route-level code splitting, framer-motion animations, light/dark themes.
- **Content**: Stored in Neon Postgres and managed through the built-in CMS at `/admin` (Studio). Static copies in `react-portfolio/src/data/` act as an offline fallback — any field the database leaves empty falls back to the bundled content.
- **Profiles**: The site supports multiple personas (default, fintech, design-engineer, digital-marketing). Share a persona with `?profile=<id>`.
- **Auth**: Single admin account; JWT in an httpOnly cookie, bcrypt-hashed password.

## Environment variables (set in the Vercel dashboard)

| Variable | Used by |
|---|---|
| `DATABASE_URL` | API functions (Neon connection string) |
| `JWT_SECRET` | API auth |
| `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET` | CMS image uploads |

See `react-portfolio/.env.local.example` for local development.

## Development

```bash
cd react-portfolio
npm install
npm run dev        # frontend only (API calls fall back to static content)
npm run test:run   # unit tests
npm run build      # production build
```

To run the API locally, use `vercel dev` from the repo root with a `.env.local` containing `DATABASE_URL` and `JWT_SECRET`.
