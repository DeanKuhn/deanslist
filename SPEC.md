# Portfolio Site — Claude Code Handoff

## What this is

A personal portfolio site for Dean Kuhn, junior data engineer, Milwaukee WI.
Built with Astro (static output), styled with plain CSS (no Tailwind, no component library).
Target deploy: GitHub Pages. Custom domain: `deankuhn.dev` (or similar).

---

## Project Structure

```
portfolio/
├── .github/workflows/deploy.yml     # GitHub Pages deploy — do not touch
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Base.astro               # HTML shell, meta tags, font imports
│   ├── components/
│   │   ├── Nav.astro                # Fixed top nav
│   │   ├── Hero.astro               # Full-height landing section
│   │   ├── ProjectCard.astro        # Single project card (anchor + standard variants)
│   │   ├── Skills.astro             # Skills grid section
│   │   ├── About.astro              # About + contact + aside
│   │   └── Footer.astro
│   ├── data/
│   │   └── projects.ts              # ALL project content lives here
│   ├── pages/
│   │   └── index.astro              # Assembles everything
│   └── styles/
│       └── global.css               # Design tokens + reset + utilities
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## Design System

**Theme:** Dark industrial. Near-black background, orange accent, mono + display type.

| Token | Value |
|---|---|
| `--bg` | `#0e0f11` |
| `--bg-card` | `#15171a` |
| `--accent` | `#f06a00` |
| `--text` | `#e8e9ea` |
| `--muted` | `#7a7f87` |
| `--border` | `#2a2d32` |
| Display font | Syne (800 weight for headings) |
| Mono font | IBM Plex Mono |

All tokens are in `global.css`. Use them. Don't hardcode hex values.

---

## Getting Started

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to ./dist
npm run preview   # preview the build locally
```

---

## Tasks for Claude Code

### 1. Verify everything builds cleanly
```bash
npm install && npm run build
```
Fix any TypeScript or Astro errors before proceeding.

### 2. Mobile navigation
`Nav.astro` currently hides links on mobile (<640px) with `display: none`.
Implement a hamburger toggle:
- Button visible only on mobile
- Clicking opens a full-width dropdown menu (dark bg, full links)
- Closes on link click or outside click
- Use vanilla JS `<script>` inside the component (no external deps)

### 3. Scroll-triggered fade-in animations
Add subtle entrance animations using the Intersection Observer API.
- Section headings and cards fade up on scroll (opacity 0→1, translateY 20px→0)
- Stagger delay on project cards (0ms, 100ms, 200ms, 300ms)
- CSS handles the animation; JS only toggles a `.visible` class
- Must work without JS (no layout shift)
- Add this to a `<script>` in `index.astro` or a separate `src/scripts/animations.ts`

### 4. KitchenSync architecture diagram
The anchor project (KitchenSync) should display an architecture diagram.
Two options — pick the simpler one:
  a) SVG inline diagram built from the ASCII diagram in the README (preferred)
  b) Placeholder `<div>` styled as a diagram frame with a note "diagram coming soon"

The ASCII diagram from the README:
```
[POS Simulator] → [FastAPI Ingest API] → [Neon Postgres (12 schemas)]
                                               ↓
                                    [extract_to_snowflake.py]
                                               ↓
                              [Snowflake RAW] → [dbt Core]
                              staging → intermediate → marts → metrics
                                               ↓
                              [LightGBM Model] → [Streamlit Dashboard]
```

If building the SVG: use the design tokens. Dark background, orange accent nodes,
muted connector lines. Keep it simple — boxes and arrows, no icons needed.
Add it to `ProjectCard.astro` only when `project.slug === 'kitchensync'` and `project.anchor === true`.

### 5. Resume download link
Add a resume download link to the About section and/or the Nav.
File: place `Dean_Kuhn_Resume.pdf` in `public/` and link to `/Dean_Kuhn_Resume.pdf`.
In Nav: add after the "get in touch" button — `resume ↓` styled like `btn-ghost`.
In About: add below the contact links.

### 6. GitHub repo links — verify URLs
The GitHub URLs in `src/data/projects.ts` use placeholder paths. Update to the
actual repo URLs once confirmed:
- `https://github.com/DeanKuhn/kitchensync`
- `https://github.com/DeanKuhn/music-growth-pipeline`
- `https://github.com/DeanKuhn/market-cynic-pipeline`
- `https://github.com/DeanKuhn/wgu-dsaii-project`

### 7. Deploy to GitHub Pages
When ready to deploy:
1. Create a new GitHub repo: `DeanKuhn/portfolio` (or `DeanKuhn.github.io`)
2. If using a project repo (not `username.github.io`), set `base` in `astro.config.mjs`:
   ```js
   base: '/portfolio',
   ```
3. In the GitHub repo settings: Settings → Pages → Source → "GitHub Actions"
4. Push to `main` — the workflow in `.github/workflows/deploy.yml` handles the rest
5. For a custom domain (`deankuhn.dev`): add a `CNAME` file to `public/` containing just the domain name, then configure DNS at your registrar

---

## Content Updates (after initial deploy)

All project content is in `src/data/projects.ts`. To add or update a project:
1. Edit the `projects` array in that file
2. `npm run build` and push

To update About/Skills content, edit the relevant component directly.

---

## What NOT to change

- The design tokens in `global.css` — established intentionally
- The font choices (Syne + IBM Plex Mono) — part of the aesthetic direction
- The `projects.ts` data structure — components depend on the interface shape
- The deploy workflow — it's correct for GitHub Pages

---

## Known gaps / future work

- No `<meta og:image>` — add a static OG image to `public/` and reference in `Base.astro`
- No sitemap — add `@astrojs/sitemap` integration if SEO matters later
- Market Cynic Pipeline: update `statusNote` in `projects.ts` when v2 is built
- Longitudinal analysis results: add a "findings" field to the Music Growth Pipeline entry once data accumulates
