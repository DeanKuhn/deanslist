# dean's list — Claude Code Handoff

## Concept

Two-mode site. The homepage is a deliberate craigslist parody — Times New Roman, white
background, blue hyperlinks, table layout. Each project link opens a full-page dark
industrial treatment with architecture diagrams, highlights, and stack details.

The contrast is the whole point. Commit to both directions fully.

---

## Structure

```
deanslist/
├── .github/workflows/deploy.yml     # GitHub Pages CI — do not touch
├── public/
│   ├── favicon.svg
│   └── Dean_Kuhn_Resume.pdf         # ADD THIS FILE before deploying
├── src/
│   ├── layouts/
│   │   ├── Craigslist.astro         # Homepage layout — plain HTML, no fonts
│   │   └── Project.astro            # Project page layout — dark, Syne + IBM Plex Mono
│   ├── data/
│   │   └── projects.ts              # ALL content lives here
│   └── pages/
│       ├── index.astro              # Homepage — craigslist treatment
│       └── projects/
│           └── [slug].astro         # Dynamic project pages — dark treatment
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## Design tokens (Project layout only)

| Token        | Value      |
|---|---|
| `--bg`       | `#0e0f11`  |
| `--bg-card`  | `#15171a`  |
| `--accent`   | `#f06a00`  |
| `--text`     | `#e8e9ea`  |
| `--muted`    | `#7a7f87`  |
| `--border`   | `#2a2d32`  |
| Display font | Syne 800   |
| Mono font    | IBM Plex Mono |

Homepage uses no CSS variables — all inline styles, intentionally.

---

## Getting started

```bash
npm install
npm run dev       # http://localhost:4321
npm run build
npm run preview
```

---

## Tasks for Claude Code

### 1. Verify clean build
```bash
npm install && npm run build
```
Fix any TypeScript or Astro errors before proceeding.

### 2. Architecture diagrams — one per project page

Each project page has a `.diagram-frame` placeholder div. Replace each placeholder
with an actual SVG diagram. Use the design tokens. Dark bg, orange accent nodes,
muted connector lines. Boxes and arrows only — no icons needed.

**KitchenSync** (`slug: 'kitchensync'`):
```
[POS Simulator]
      ↓ POST /sale
[FastAPI Ingest API]
      ↓
[Neon Postgres — 12 store schemas]
      ↓ extract_to_snowflake.py
[Snowflake RAW]
      ↓ dbt Core
[Staging] → [Intermediate] → [Marts] → [Metrics]
      ↓
[LightGBM Model]
      ↓
[Streamlit Dashboard — 60s refresh]
```

**Music Growth Pipeline** (`slug: 'music-growth-pipeline'`):
```
[Last.fm API — chart.getTopArtists]
      ↓ seed_artists.py
[Neon Postgres]
  artists | weekly_charts | artist_snapshots | tags
      ↓ dbt-postgres
[Staging] → [Marts]
  artist_tiers | genre_stats | artist_similarity_network
      ↓ GitHub Actions (weekly cron)
[analysis.sql — cross-sectional + longitudinal]
```

**Market Cynic Pipeline** (`slug: 'market-cynic-pipeline'`):
```
[Yahoo Finance — Playwright scrape]    [Reddit — 4 subreddits]
              ↓                                  ↓
        [Bronze layer]                    [Bronze layer]
        raw_stocks.json                  Reddit posts + VADER
              ↓                                  ↓
        [Silver — Pydantic validation]
              ↓
        [Gold — inner join + divergence detection]
        sentiment_momentum > 0 AND price_momentum < 0
              ↓
        [market_history.parquet — append-only]
              ↓
        [Streamlit Dashboard]
```

**Package Router** (`slug: 'package-router'`):
```
[Random package generation]
      ↓
[Population initialization — capacity-aware seeding]
      ↓
[Fitness function]
  distance_score + deadline_penalty + capacity_violations
      ↓
[Selection → Crossover (sentinel-aware OX) → Mutation]
  swap | scramble | inversion + adaptive rate
      ↓ repeat until convergence or 500 stagnant generations
[Best chromosome → delivery routes per truck]
      ↓
[CLI — status lookup by ID or address]
```

SVG dimensions: 100% width, auto height. Keep them simple and readable.

### 3. Add resume file
Place `Dean_Kuhn_Resume.pdf` in `public/`. It's already linked on the homepage
(`/Dean_Kuhn_Resume.pdf`) — just needs the file present.

### 4. Confirm GitHub repo URLs
Update these in `src/data/projects.ts` with the actual repo names once confirmed:
- `https://github.com/DeanKuhn/kitchensync`
- `https://github.com/DeanKuhn/music-growth-pipeline`
- `https://github.com/DeanKuhn/market-cynic-pipeline`
- `https://github.com/DeanKuhn/wgu-dsaii-project`

### 5. Mobile — homepage
The craigslist table layout doesn't collapse well on mobile. Add a `<style>` block
inside `index.astro` with a media query that:
- Hides the left sidebar column on screens < 600px
- Shows a simplified header (name + links) at the top instead
Keep it in the craigslist aesthetic — no modern CSS grid or flexbox magic.

### 6. Deploy
When ready:
1. Create GitHub repo named `deanslist` (or `DeanKuhn.github.io`)
2. If project repo: uncomment `base: '/deanslist'` in `astro.config.mjs`
3. Settings → Pages → Source → GitHub Actions
4. Push to `main`
5. Custom domain: add `public/CNAME` with `deanslist.dev`, configure DNS A records
   to GitHub's IPs: 185.199.108.153 / .109 / .110 / .111

---

## What NOT to change

- The craigslist aesthetic on the homepage — lean into it, don't "clean it up"
- Design tokens in `Project.astro` — established intentionally
- The `projects.ts` data structure — both pages depend on the interface shape
- The deploy workflow

---

## Content updates after launch

All project content is in `src/data/projects.ts`. Edit there and push.
Status notes update automatically on both the homepage list and project pages.
