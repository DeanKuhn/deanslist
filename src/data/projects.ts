// src/data/projects.ts

export interface Project {
  slug: string;
  title: string;
  year: string;
  status: 'live' | 'paused' | 'complete';
  statusNote?: string;
  category: string;       // shows on homepage list like craigslist category
  tagline: string;        // one-line description for homepage
  problem: string;
  what: string;
  techStack: string[];
  highlights: string[];
  githubUrl: string;
}

export const projects: Project[] = [
  {
    slug: 'kitchensync',
    title: 'KitchenSync Food Forecasting System',
    year: '2026',
    status: 'live',
    category: 'data engineering',
    tagline: 'End-to-end retail kitchen forecasting — FastAPI, Postgres, Snowflake, dbt, LightGBM',
    problem:
      'Retail kitchens waste food when production outpaces demand and miss revenue when they run short. Forecasting the right quantity per item per store, refreshed continuously, requires a real pipeline — not a spreadsheet. Modeled after the Kitchen Production System at Kwik Trip.',
    what:
      'Async FastAPI ingest layer receives simulated POS events for 12 stores, each isolated in its own Neon Postgres schema. A Python extract script syncs all stores into Snowflake, where a three-layer dbt Core pipeline (staging → intermediate → marts) builds rolling feature tables. A LightGBM model trained on 2.7M synthetic events predicts units to produce per item per store over the next hour. A Streamlit dashboard refreshes every 60 seconds showing production queues and urgency flags.',
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
      'PyArrow',
    ],
    highlights: [
      '12 store schemas with per-store isolation; 2.7M historical events across 90 days',
      'Three-layer dbt pipeline: 6 mart models covering production targets, item velocity, waste %, cold-start profiles, stockout summaries, store-level aggregates',
      'Async POS simulator using Poisson arrivals and a time-of-day rush curve; StoreState class tracks FIFO batch inventory and expiration',
      'LightGBM vs. scikit-learn RandomForest baseline — 190,773 predictions generated on held-out test data',
      'Cold-start fallback to category-level mart averages for items with fewer than 4 data points',
      'Single run_pipeline.py orchestrates the full extract → dbt → train → predict cycle',
      'Urgency flag fires when sell-through exceeds 2x historical average (configurable threshold)',
    ],
    githubUrl: 'https://github.com/DeanKuhn/kitchensync',
  },
  {
    slug: 'music-growth-pipeline',
    title: 'Music Growth Pipeline',
    year: '2026',
    status: 'live',
    category: 'data engineering',
    tagline: 'Weekly Last.fm pipeline tracking 7,755 artists — Postgres, dbt, GitHub Actions',
    problem:
      "The Last.fm API returns only cumulative all-time stats — there is no native time series. To study whether chart position correlates with listener growth over time, you have to build the longitudinal dataset yourself by snapshotting repeatedly.",
    what:
      'Weekly ingestion pipeline snapshots listener and playcount data for 7,755 artists from the Last.fm global chart into a cloud Postgres database on Neon. Artists split into mainstream tier (pages 1–50) and indie tier (pages 500–2000). A dbt transformation layer (staging + mart models) powers cross-sectional and longitudinal analysis. GitHub Actions runs the snapshot job every Sunday at 9AM UTC with zero manual intervention.',
    techStack: [
      'Python',
      'PostgreSQL (Neon)',
      'dbt Core (dbt-postgres)',
      'Last.fm API',
      'GitHub Actions',
      'SQL',
    ],
    highlights: [
      '7,755 artists tracked: 250 mainstream (pages 1–50), 7,505 indie (pages 500–2000)',
      'dbt mart models: artist_tiers, genre_stats, artist_similarity_network',
      'Cross-sectional finding: ~4x plays-per-listener gap (mainstream median 74.76 vs indie 17.69) consistent across full distribution — not driven by outliers',
      'Indie P90 listeners (782K) falls below mainstream P25 (2.3M) — distributions do not overlap',
      'Genre associations: 15 genres × 500 artists; similarity networks: ~2,000 artists, 20 similar artists each',
      'Longitudinal analysis accumulating — weekly snapshots running since April 2026',
    ],
    githubUrl: 'https://github.com/DeanKuhn/music-growth-pipeline',
  },
  {
    slug: 'market-cynic-pipeline',
    title: 'Market Cynic Pipeline',
    year: '2026',
    status: 'paused',
    statusNote:
      'Automated runs paused — Reddit shut down the public .json endpoints used for ingestion and blocked GitHub Actions IPs. v2 planned with proper OAuth, Airflow orchestration, and Spark processing.',
    category: 'data engineering',
    tagline: 'Bronze→Silver→Gold pipeline correlating Reddit sentiment with Yahoo Finance prices',
    problem:
      'When a stock is heavily discussed with positive retail sentiment but its price is simultaneously falling, that divergence is a signal worth watching. Detecting it requires correlating two noisy, differently-structured data streams in near real time.',
    what:
      'Bronze → Silver → Gold medallion pipeline. Yahoo Finance price data scraped via Playwright headless browser. Reddit sentiment pulled from four subreddits (r/stocks, r/wallstreetbets, r/investing, r/stockmarket). A two-layer "Cynic Heuristic" weights posts by controversy score (log-scaled by comment count) and by per-subreddit trust multipliers. Gold layer detects divergence events — positive sentiment momentum with negative price momentum — and surfaces them in a Streamlit dashboard with dual-axis charts.',
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
      'Subreddit trust weighting: r/investing 1.5×, r/stocks 1.2×, r/stockmarket 1.0×, r/wallstreetbets 0.7×',
      'Controversy signal weight: 1.0 + (controversy_factor × log1p(comments) × 0.2) — viral controversial posts weighted heavier',
      'Rolling divergence detection over 6-run window (~2 days at 3 runs/day)',
      'Git as a database: market_history.parquet append-only, committed by MarketCynicBot on each scheduled run',
      'Gatekeeper pattern: main.py exits with code 1 on any stage failure rather than propagating bad data downstream',
    ],
    githubUrl: 'https://github.com/DeanKuhn/market-cynic-pipeline',
  },
  {
    slug: 'package-router',
    title: 'Package Delivery Routing System',
    year: '2026',
    status: 'complete',
    category: 'algorithms',
    tagline: 'Genetic Algorithm solving truck loading + delivery order in a single fitness function',
    problem:
      'The WGU capstone used a static nearest-neighbor algorithm with hard-coded truck loading for exactly 40 packages and 3 trucks. It could not handle real-world randomness, variable package counts, or custom constraints like refrigeration requirements.',
    what:
      'Custom Genetic Algorithm that simultaneously solves the truck loading and delivery order problem in a single fitness function. Packages and trucks are generated randomly per run. Sentinel-based chromosome encoding separates truck routes within a flat array. Delivered as a configurable CLI tool with per-package status lookup post-run.',
    techStack: ['Python', 'Genetic Algorithm', 'CLI'],
    highlights: [
      'Single fitness function handles both truck assignment and delivery sequence simultaneously',
      'Adaptive mutation: rate doubles after 50 stagnant generations, resets on improvement to escape local optima',
      'Scramble + inversion mutation operators for search space exploration',
      'Sentinel-aware ordered crossover preserves truck boundary constraints during recombination',
      'Early termination after 500 stagnant generations',
      'Capacity-aware population seeding gives the GA a rational baseline from generation zero',
      'Per-package status lookup by ID or address via CLI post-run',
    ],
    githubUrl: 'https://github.com/DeanKuhn/wgu-dsaii-project',
  },
];
