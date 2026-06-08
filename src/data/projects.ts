// src/data/projects.ts
// Single source of truth for all project content.
// Edit here to update the site.

export interface Project {
  slug: string;
  title: string;
  year: string;
  status: 'live' | 'paused' | 'complete';
  statusNote?: string;
  anchor: boolean; // true = displayed prominently as lead project
  problem: string;
  what: string;
  techStack: string[];
  highlights: string[];
  githubUrl: string;
  diagramAlt?: string; // alt text if a diagram image is added later
}

export const projects: Project[] = [
  {
    slug: 'kitchensync',
    title: 'KitchenSync Food Forecasting System',
    year: '2026',
    status: 'live',
    anchor: true,
    problem:
      'Retail kitchens waste food when production outpaces demand and miss revenue when they run out. Forecasting the right quantity per item per store, refreshed continuously, requires a real pipeline — not a spreadsheet.',
    what:
      'End-to-end forecasting system modeled after Kwik Trip\'s Kitchen Production System. An async FastAPI ingest layer receives simulated POS events for 12 stores, each isolated in its own Neon Postgres schema. A Python extract script syncs all stores into Snowflake, where a three-layer dbt Core pipeline (staging → intermediate → marts) builds rolling feature tables. A LightGBM model trained on 2.7M synthetic events predicts units to produce per item per store over the next hour. A Streamlit dashboard refreshes every 60 seconds showing production queues and urgency flags.',
    techStack: [
      'Python',
      'FastAPI',
      'PostgreSQL (Neon)',
      'Snowflake',
      'dbt Core',
      'LightGBM',
      'scikit-learn',
      'Streamlit',
      'asyncio / httpx',
    ],
    highlights: [
      '12 store schemas with per-store isolation; 2.7M historical events across 90 days',
      'Three-layer dbt pipeline: 6 mart models covering production targets, item velocity, waste %, cold-start profiles, stockout summaries',
      'Async POS simulator using Poisson arrivals and a time-of-day rush curve; StoreState class tracks FIFO batch inventory and expiration',
      'Cold-start fallback to category-level mart averages for items with fewer than 4 data points',
      'Single run_pipeline.py orchestrates the full extract → dbt → train → predict cycle',
      '190,773 LightGBM predictions generated against held-out test data',
    ],
    githubUrl: 'https://github.com/DeanKuhn/kitchensync',
  },
  {
    slug: 'music-growth-pipeline',
    title: 'Music Growth Pipeline',
    year: '2026',
    status: 'live',
    anchor: false,
    problem:
      'The Last.fm API returns only cumulative all-time stats — there is no native time series. To study whether chart position correlates with listener growth, you have to build the longitudinal dataset yourself.',
    what:
      'Weekly ingestion pipeline that snapshots listener and playcount data for 7,755 artists from the Last.fm global chart into a cloud Postgres database. Artists are split into a mainstream tier (pages 1–50) and an indie tier (pages 500–2000). A dbt transformation layer on top of the raw tables powers cross-sectional and longitudinal analysis. Weekly automation runs via GitHub Actions every Sunday at 9AM UTC.',
    techStack: [
      'Python',
      'PostgreSQL (Neon)',
      'dbt Core (dbt-postgres)',
      'Last.fm API',
      'GitHub Actions',
      'SQL',
    ],
    highlights: [
      '7,755 artists tracked: 250 mainstream, 7,505 indie',
      'dbt mart models: artist_tiers, genre_stats, artist_similarity_network',
      'Cross-sectional finding: ~4x plays-per-listener gap (mainstream median 74.76 vs indie 17.69) consistent across full distribution',
      'Genre associations (15 genres × 500 artists) and similarity networks (~2,000 artists, 20 similar each)',
      'Fully automated — zero manual intervention after initial seed',
    ],
    githubUrl: 'https://github.com/DeanKuhn/music-growth-pipeline',
  },
  {
    slug: 'market-cynic-pipeline',
    title: 'Market Cynic Pipeline',
    year: '2026',
    status: 'paused',
    statusNote:
      'Automated runs paused — Reddit shut down the public .json endpoints used for ingestion. v2 planned with proper OAuth and Airflow orchestration.',
    anchor: false,
    problem:
      'When a stock is heavily discussed with positive retail sentiment but its price is simultaneously falling, that divergence is a signal worth watching. Detecting it requires correlating two noisy data streams in near real time.',
    what:
      'Bronze → Silver → Gold medallion pipeline that pulls Yahoo Finance price data via Playwright headless scraping and Reddit sentiment from four subreddits. A two-layer "Cynic Heuristic" weights posts by controversy score (log-scaled by comment count) and by per-subreddit trust multipliers. The Gold layer detects divergence events — positive sentiment momentum with negative price momentum — and surfaces them in a Streamlit dashboard with dual-axis charts.',
    techStack: [
      'Python',
      'Playwright',
      'VADER / NLTK',
      'Pydantic v2',
      'pandas',
      'PyArrow / Parquet',
      'Streamlit',
      'GitHub Actions',
    ],
    highlights: [
      'Medallion architecture: Bronze (raw JSON/posts) → Silver (Pydantic validation) → Gold (merged divergence signals)',
      'Subreddit trust weighting: r/investing 1.5x, r/stocks 1.2x, r/stockmarket 1.0x, r/wallstreetbets 0.7x',
      'Rolling divergence detection over a 6-run window (~2 days at 3 runs/day)',
      'Git as a database: market_history.parquet append-only, committed by MarketCynicBot on each run',
      'Gatekeeper pattern in main.py: sys.exit(1) on any stage failure rather than silently propagating bad data',
    ],
    githubUrl: 'https://github.com/DeanKuhn/market-cynic-pipeline',
  },
  {
    slug: 'package-router',
    title: 'Package Delivery Routing System',
    year: '2026',
    status: 'complete',
    anchor: false,
    problem:
      'The original WGU capstone used a static nearest-neighbor algorithm with hard-coded truck loading for exactly 40 packages and 3 trucks. It could not handle real-world randomness, variable package counts, or custom constraints.',
    what:
      'Custom Genetic Algorithm that simultaneously solves the truck loading and delivery order problem in a single fitness function. Packages and trucks are generated randomly per run. Sentinel-based chromosome encoding separates truck routes. Delivered as a configurable CLI tool.',
    techStack: ['Python', 'Genetic Algorithm', 'CLI'],
    highlights: [
      'Single fitness function handles both truck assignment and delivery sequence',
      'Adaptive mutation: rate doubles after 50 stagnant generations, resets on improvement',
      'Scramble + inversion mutation operators to escape local optima',
      'Sentinel-aware ordered crossover preserves constraint validity',
      'Early termination after 500 stagnant generations',
      'Per-package status lookup by ID or address via CLI post-run',
    ],
    githubUrl: 'https://github.com/DeanKuhn/wgu-dsaii-project',
  },
];
