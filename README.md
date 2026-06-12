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

A second workflow (`.github/workflows/scheduled-rebuild.yml`) runs at 3:30 AM UTC every night. It fetches the latest `data/ab_results.json` from the kitchensync repo at build time, so the live A/B results panel on the kitchensync project page stays current without a manual push.

The custom domain (`deanslist.dev`) is configured via `public/CNAME`. DNS is managed on Porkbun.

## Live data

The kitchensync project page fetches `ab_results.json` from `raw.githubusercontent.com/DeanKuhn/kitchensync/main/data/ab_results.json` at build time. If the fetch fails (404 or network error), it falls back to `src/data/ab_mock.json` so the panel always renders in dev. Remove the mock import once the live file is consistently available.
