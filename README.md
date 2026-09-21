[![Live Site](https://img.shields.io/badge/live-deanslist.dev-f06a00?style=flat-square)](https://deanslist.dev)
[![GitHub Pages](https://img.shields.io/badge/hosted_on-GitHub_Pages-181717?style=flat-square&logo=github)](https://pages.github.com)
[![Tailwind CSS](https://img.shields.io/badge/styled_with-Tailwind_CSS-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

# dean's list

Portfolio site, featuring some data engineering, ml / forecasting, and optimization projects.

## Rebuilt from astro

Previously this portfolio site was mostly vibe-coded with astro (still exists on legacy branch). I decided to rebuilt from scratch with code I understood (html, tailwind, basic js).

Improvements:

| | Legacy (Astro) | Current (html, tailwind, js) |
| --- | ---| --- |
| Simplicity | Difficult to understand (templates, logic (.ts/.tsx)) | Easy to understand (plain html, inline script) |
| File Count | 22 (.astro, .ts, .tsx, .json, .md, .mjs) | 10 (.html, .css, .json, .md) |
| Line Count | 3,571 | 1,740 (51% reduction) |

## Stack

Plain HTML, CSS (Tailwind), and vanilla JS. Chart.js for data visualizations.

## Projects

- **PharmaWatch** — drug safety signal detection over FDA adverse event data
- **Music Growth Pipeline** — Spotify listener growth tracking
- **KitchenSync** — ML demand forecasting for restaurant inventory
- **Package Router (VRP-TW)** — genetic algorithm vehicle routing

## Local dev

```bash
npm install
npm run dev
```

Compiles Tailwind and opens a local server at `localhost:3000`.

## Deploy

Push to `main` → GitHub Actions → GitHub Pages → [deanslist.dev](https://deanslist.dev)
