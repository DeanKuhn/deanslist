# CLAUDE.md

## What this project is

Dark portfolio site for Dean Kuhn. One coherent dark industrial theme across the entire site — homepage and project pages share the same design tokens, fonts, and visual language.

## Structure

- `src/data/projects.ts` — all content lives here. Both pages depend on the interface shape; don't change it without updating both pages. The `Project` interface has an optional `challenges` field that renders as a "what i learned the hard way" section on project pages.
- `src/layouts/Craigslist.astro` — old craigslist layout, no longer used by the homepage. Keep for reference.
- `src/layouts/Project.astro` — shared layout for all pages. Dark, Space Grotesk + IBM Plex Mono. Uses `<style is:global>` so utility classes (`.container`, `.mono`, `.muted`, `.accent`) reach slot content.
- `src/lib/fetchProjectData.ts` — shared build-time fetch utility. Both the homepage and project pages import from here. Returns a `FetchResult<T>` discriminated union: `{ state: 'ok', data }` | `{ state: 'omitted' }` (fetch failed) | `{ state: 'pending' }` (no live source yet, e.g. Market Cynic). Project pages use `ok`/`omitted` only; the homepage also uses `pending` to render an "in development" card state.
- `src/pages/index.astro` — homepage. Dark theme. Hero → stat cards grid → about section.
- `src/pages/projects/[slug].astro` — dynamic project pages with inline SVG architecture diagrams. Fetches live data via `src/lib/fetchProjectData.ts`.

## Design tokens (site-wide)

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

## Live data fetches

Both fetches happen at build time — data is baked into static HTML, not client-side. Implemented in `src/lib/fetchProjectData.ts`.

- **KitchenSync** — fetches `https://raw.githubusercontent.com/DeanKuhn/kitchensync/master/data/ab_results.json` (note: `master`, not `main`). Renders cumulative A/B results panel + latest daily run on project page; headline metric card on homepage.
- **Music Growth Pipeline** — fetches `https://raw.githubusercontent.com/DeanKuhn/music-growth-pipeline/main/data/pipeline_stats.json`. Renders tier growth cards + top artists list on project page; headline metric card on homepage.

The nightly scheduled rebuild at 3:30 AM UTC keeps both panels current without a manual push.

## Scope notes

- **Pass 1 (current)**: homepage redesigned to dark theme. Project pages are mostly unchanged.
- **Pass 2 (future)**: signature visuals per project page — each page gets a distinct visual treatment.
- **WGUPS stat card**: stub with placeholder animation on homepage. Will be replaced with a data-driven animated SVG once the GA route/generation JSON export exists.
- **Market Cynic**: renders as a `pending` card on the homepage (no metric, "in development" label). Will go live once v2 is built.

## What NOT to change

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
