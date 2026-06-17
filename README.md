# dean's list

Portfolio site at [deanslist.dev](https://deanslist.dev).

Two-mode design: the homepage is a deliberate craigslist parody (Times New Roman, white background, blue links, table layout). Each project link opens a full-page dark industrial treatment. The contrast is the point.

## Local dev

```bash
npm install
npm run dev       # http://localhost:4321
```

## Adding or editing projects

All content lives in `src/data/projects.ts`. Edit there and push — both the homepage list and individual project pages update automatically.

## Deploying

Push to `main`. GitHub Actions builds and deploys to GitHub Pages automatically.

A second workflow (`.github/workflows/scheduled-rebuild.yml`) runs at 3:30 AM UTC every night to pick up fresh data from both live projects.

The custom domain (`deanslist.dev`) is configured via `public/CNAME`. DNS is managed on Porkbun.

## Live data

Two project pages fetch live data at build time. If either fetch fails, that section silently omits — no fallback mock.

- **KitchenSync** — `raw.githubusercontent.com/DeanKuhn/kitchensync/master/data/ab_results.json` (note: `master` branch). Renders cumulative A/B results and latest daily run scores.
- **Music Growth Pipeline** — `raw.githubusercontent.com/DeanKuhn/music-growth-pipeline/main/data/pipeline_stats.json`. Renders tier growth cards and top fastest-growing artists.
