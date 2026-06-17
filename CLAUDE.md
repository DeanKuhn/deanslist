# CLAUDE.md

## What this project is

Two-mode portfolio site. The homepage is a deliberate craigslist parody — Times New Roman, white background, blue hyperlinks, table layout. Each project link opens a full-page dark industrial treatment. The contrast is intentional. Commit to both directions fully.

## Structure

- `src/data/projects.ts` — all content lives here. Both pages depend on the interface shape; don't change it without updating both pages. The `Project` interface has an optional `challenges` field that renders as a "what i learned the hard way" section on project pages.
- `src/layouts/Craigslist.astro` — homepage layout. Plain HTML, no fonts, inline styles. Keep it craigslist.
- `src/layouts/Project.astro` — project page layout. Dark, Space Grotesk + IBM Plex Mono. Uses `<style is:global>` so utility classes (`.container`, `.mono`, `.muted`, `.accent`) reach slot content.
- `src/pages/index.astro` — homepage. Craigslist table layout with a mobile fallback header at < 600px.
- `src/pages/projects/[slug].astro` — dynamic project pages with inline SVG architecture diagrams. Fetches live data for kitchensync and music-growth-pipeline at build time.

## Design tokens (project pages only)

| Token | Value |
|---|---|
| `--bg` | `#0e0f11` |
| `--bg-card` | `#15171a` |
| `--accent` | `#f06a00` |
| `--text` | `#e8e9ea` |
| `--muted` | `#9ca3af` |
| `--border` | `#2a2d32` |
| Display font | Space Grotesk 700 |
| Mono font | IBM Plex Mono |

Homepage uses no CSS variables — all inline styles, intentionally.

## Live data fetches

Both fetches happen at build time — data is baked into static HTML, not client-side.

- **KitchenSync** — fetches `https://raw.githubusercontent.com/DeanKuhn/kitchensync/master/data/ab_results.json` (note: `master`, not `main`). Renders cumulative A/B results panel + latest daily run. If fetch fails, the section silently omits.
- **Music Growth Pipeline** — fetches `https://raw.githubusercontent.com/DeanKuhn/music-growth-pipeline/main/data/pipeline_stats.json`. Renders tier growth cards + top artists list. If fetch fails, the section silently omits.

The nightly scheduled rebuild at 3:30 AM UTC keeps both panels current without a manual push.

## What NOT to change

- The craigslist aesthetic on the homepage — don't clean it up
- Design tokens in `Project.astro`
- The `projects.ts` data structure (add fields to the interface if needed, but don't remove or rename existing ones)
- The deploy workflow (`.github/workflows/deploy.yml`)
- The scheduled rebuild workflow (`.github/workflows/scheduled-rebuild.yml`) — runs at 3:30 AM UTC daily, 20-min buffer after EC2 pushes `ab_results.json` to kitchensync

## Deploy

Push to `main` — GitHub Actions builds and deploys automatically. Custom domain `deanslist.dev` via `public/CNAME`, DNS on Porkbun.

## Preferences

- No trailing summaries at the end of responses
- Keep changes minimal — don't refactor or add abstractions beyond what the task requires
- Commit often with clear messages
