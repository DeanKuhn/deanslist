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

The custom domain (`deanslist.dev`) is configured via `public/CNAME`. DNS is managed on Porkbun.
