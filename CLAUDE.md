# CLAUDE.md

## What this project is

Dark portfolio site for Dean Kuhn. One coherent dark industrial theme across the entire site — homepage and project pages share the same design tokens, fonts, and visual language.

## Structure

- `src/data/projects.ts` — all content lives here. Both pages depend on the interface shape; don't change it without updating both pages. The `Project` interface has an optional `challenges` field that renders as a "what i learned the hard way" section on project pages.
- `src/layouts/Craigslist.astro` — old craigslist layout, no longer used by the homepage. Keep for reference.
- `src/layouts/Project.astro` — shared layout for all pages. Dark, Space Grotesk + IBM Plex Mono. Uses `<style is:global>` so utility classes (`.container`, `.mono`, `.muted`, `.accent`) reach slot content.
- `src/lib/fetchProjectData.ts` — shared build-time fetch utility. Both the homepage and project pages import from here. Returns a `FetchResult<T>` discriminated union: `{ state: 'ok', data }` | `{ state: 'omitted' }` (fetch failed) | `{ state: 'pending' }` (no live source yet, e.g. Market Cynic). Project pages use `ok`/`omitted` only; the homepage also uses `pending` to render an "in development" card state.
- `src/lib/wgupsRoute.ts` — build-time layout helper for the WGUPS route visual. Takes `WgupsData` and lays stops evenly around a circle (hub at center), since the source is a distance matrix with no real coordinates. Returns SVG path strings per truck for the homepage card.
- `src/pages/index.astro` — homepage. Dark theme. Hero → stat cards grid → about section.
- `src/components/charts/KitchenSyncChart.tsx` — Preact island (Chart.js) for the KitchenSync A/B chart. Receives pre-computed arrays as props from the slug page at build time; hydrates `client:visible`. 58 kB gzip, loaded on kitchensync page only.
- `src/pages/projects/[slug].astro` — dynamic project pages. Fetches live data via `src/lib/fetchProjectData.ts`. See "Project page pattern" below for the established signature visual structure.

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

All fetches happen at build time — data is baked into static HTML, not client-side. Implemented in `src/lib/fetchProjectData.ts`.

- **KitchenSync** — fetches `https://raw.githubusercontent.com/DeanKuhn/kitchensync/master/data/ab_results.json` (note: `master`, not `main`). Renders cumulative A/B results panel + latest daily run on project page; headline metric card on homepage.
- **Music Growth Pipeline** — fetches `https://raw.githubusercontent.com/DeanKuhn/music-growth-pipeline/main/data/pipeline_stats.json`. Renders tier growth cards + top artists list on project page; headline metric card on homepage.
- **WGUPS (Package Delivery Routing)** — fetches `https://raw.githubusercontent.com/DeanKuhn/ga-combined-routing-loading/main/data/ga_results.json`. Homepage-only for now (the project page itself hasn't had its signature-visual pass yet). Renders final fitness score, run parameters (packages/trucks/refrigerated), and a build-time SVG route visual on the homepage card — see "Homepage-only visuals" below. Card falls back to `omitted` state, same as the others, if the fetch fails or no successful scheduled run exists yet.

The nightly scheduled rebuild at 3:30 AM UTC keeps all three panels current without a manual push.

## Homepage-only visuals (process/graph-style data)

For visuals that are structural/graph-like rather than a numeric time series (WGUPS's route diagram), the default is **static SVG generated at build time in the `.astro` frontmatter, animated with native SMIL (`animateMotion`) — no client framework, no JS bundle**. This matches the existing architecture-diagram pattern on project pages. Reserve Chart.js/Preact islands (`client:visible`) for numeric time-series charts like KitchenSync's dual-line chart, where a real charting library earns its bundle cost.

## Project page pattern (established in Pass 2, KitchenSync pilot)

Each project page follows this three-part structure:

1. **"Live results"** — a bespoke data visualization built from the project's own live data. For KitchenSync this is a dual-line Chart.js chart (service level % and waste rate %, ML vs baseline, over time). Data is computed in the Astro frontmatter and passed as serialized props to a `client:visible` Preact island. If the fetch fails (`omitted` state), this section silently omits — no broken chart, no fallback mock.

2. **"How it's built"** — the existing SVG architecture diagram. Keep the label "how it's built."

3. **"Explore further"** — outbound link buttons to fuller external tools (Streamlit, Power BI, etc.). Only render a button if a real URL exists. Use a visible pending state for URLs that exist but haven't been confirmed yet. Omit entirely if no external tool applies.

**Next up**: Music Growth Pipeline and WGUPS project pages should follow this same shape. Music Growth's visualization will be a tier-growth chart from `pipeline_stats.json`. WGUPS's will reuse the route-visual approach already shipped on the homepage (see `src/lib/wgupsRoute.ts`).

## Scope notes

- **Pass 1**: homepage redesigned to dark theme.
- **Pass 2**: KitchenSync gets the signature visual pattern (pilot). Music Growth and WGUPS project pages are next.
- **WGUPS homepage card**: now live — data-driven route visual from `ga_results.json` (see above). The WGUPS *project page* itself is still the Pass-1 layout and hasn't had its signature-visual pass.
- **Market Cynic**: `pending` card on homepage. Will go live once v2 is built.
- **Streamlit URL** (`STREAMLIT_URL` in `[slug].astro`): currently `null` — fill in once confirmed.
- **Power BI button**: intentionally omitted until a real URL exists.

## Interactive islands

The site uses `@astrojs/preact` for interactive components. This is intentional and scoped — don't add Preact islands to other pages without a reason. The integration is in `astro.config.mjs`. Chart.js is registered once at module level inside each component to avoid duplicate registration warnings if multiple instances mount.

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
