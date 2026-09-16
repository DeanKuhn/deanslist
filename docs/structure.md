# Structure

## Stack

Plain HTML/CSS/JS. No framework, no build step.

- **Tailwind CSS** via CDN (`<script src="https://cdn.tailwindcss.com">`)
- **Chart.js** via CDN (loaded only on pages that need charts)
- **Google Fonts**: Space Grotesk 700, IBM Plex Mono

## File layout

```
index.html              — homepage (hero → project cards → about)
projects/
  kitchensync.html      — KitchenSync project page
  music-growth.html     — Music Growth Pipeline project page
  package-router.html   — VRP-TW / WGUPS project page
public/
  images/               — static assets
.github/workflows/
  deploy.yml            — GitHub Pages deploy on push to main
```

## Live data

Three projects fetch JSON client-side via `fetch()` and render with Chart.js or styled HTML. If a fetch fails, silently omit the section.

| Project | URL | Renders |
|---|---|---|
| KitchenSync | `DeanKuhn/kitchensync/master/data/ab_results_v2.json` | Dual-line chart: ML vs baseline (service level %, waste rate %) |
| VRP-TW | `DeanKuhn/ga-combined-routing-loading/main/data/ga_results.json` | Single-line chart: fitness score vs generation |
| Music Growth | `DeanKuhn/music-growth-pipeline/main/data/pipeline_stats.json` | Styled cards/tables (no chart) |

All URLs are `https://raw.githubusercontent.com/` prefixed.

## Projects

1. **KitchenSync** — ML demand forecasting. Status: live.
2. **Music Growth Pipeline** — Spotify listener growth tracking. Status: live.
3. **Package Router (VRP-TW)** — Genetic algorithm vehicle routing. Status: complete.
4. **Market Cynic** — Sentiment-driven market analysis. Status: paused (homepage "in development" card only).

## Deploy

Push to `main` → GitHub Actions builds and deploys to GitHub Pages. Custom domain `deanslist.dev` via `public/CNAME`, DNS on Porkbun.
