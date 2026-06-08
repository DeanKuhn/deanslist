# CLAUDE.md

## What this project is

Two-mode portfolio site. The homepage is a deliberate craigslist parody — Times New Roman, white background, blue hyperlinks, table layout. Each project link opens a full-page dark industrial treatment. The contrast is intentional. Commit to both directions fully.

## Structure

- `src/data/projects.ts` — all content lives here. Both pages depend on the interface shape; don't change it without updating both pages.
- `src/layouts/Craigslist.astro` — homepage layout. Plain HTML, no fonts, inline styles. Keep it craigslist.
- `src/layouts/Project.astro` — project page layout. Dark, Syne + IBM Plex Mono. Uses `<style is:global>` so utility classes (`.container`, `.mono`, `.muted`, `.accent`) reach slot content.
- `src/pages/index.astro` — homepage. Craigslist table layout with a mobile fallback header at < 600px.
- `src/pages/projects/[slug].astro` — dynamic project pages with inline SVG architecture diagrams.

## Design tokens (project pages only)

| Token | Value |
|---|---|
| `--bg` | `#0e0f11` |
| `--bg-card` | `#15171a` |
| `--accent` | `#f06a00` |
| `--text` | `#e8e9ea` |
| `--muted` | `#7a7f87` |
| `--border` | `#2a2d32` |
| Display font | Syne 800 |
| Mono font | IBM Plex Mono |

Homepage uses no CSS variables — all inline styles, intentionally.

## What NOT to change

- The craigslist aesthetic on the homepage — don't clean it up
- Design tokens in `Project.astro`
- The `projects.ts` data structure
- The deploy workflow (`.github/workflows/deploy.yml`)

## Deploy

Push to `main` — GitHub Actions builds and deploys automatically. Custom domain `deanslist.dev` via `public/CNAME`, DNS on Porkbun.

## Preferences

- No trailing summaries at the end of responses
- Keep changes minimal — don't refactor or add abstractions beyond what the task requires
- Commit often with clear messages
