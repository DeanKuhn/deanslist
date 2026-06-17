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
  challenges?: string;
  githubUrl: string;
}

export const projects: Project[] = [
  {
    slug: 'kitchensync',
    title: 'KitchenSync Food Forecasting System',
    year: '2026',
    status: 'live',
    category: 'data engineering',
    tagline: 'End-to-end kitchen production simulation — FastAPI, Snowflake, dbt, LightGBM, AWS EC2, nightly A/B evaluation',
    problem:
      'Retail kitchens waste food when production outpaces demand and miss revenue when they run short. Forecasting the right quantity per item per store at 15-minute grain, refreshed continuously, requires a real pipeline — not a spreadsheet. But the harder question is honest evaluation: does ML actually earn its complexity cost, and if so, at what trade-off? Modeled after the Kitchen Production System at Kwik Trip.',
    what:
      'End-to-end simulation of a Kwik Trip-style Kitchen Production System running live on AWS EC2. An async FastAPI ingest API receives simulated POS events from 12 stores using Poisson arrivals, FIFO batch inventory, and slot-boundary production logic. A nightly cron at 2am UTC extracts events to Snowflake, runs a three-layer dbt pipeline, and generates 338,688 predictions at 15-minute slot grain. A Streamlit dashboard surfaces split Kitchen and Chicken production queues with 5-minute auto-refresh. A parallel A/B script pits ML against a naive hourly-average baseline under identical seeded demand — results write to ab_results.json, commit to GitHub, and trigger this portfolio site to rebuild nightly at 3:30am UTC.',
    techStack: [
      'Python',
      'FastAPI',
      'PostgreSQL (Neon)',
      'Snowflake',
      'dbt Core',
      'LightGBM',
      'Streamlit',
      'asyncio / httpx',
      'Docker',
      'AWS EC2',
      'systemd',
      'GitHub Actions',
      'uv',
    ],
    highlights: [
      'Discovered and fixed a conditional mean bias bug: the demand profile was computing E[X|X>0] by averaging only days with sales, inflating predictions 3–4x at low-traffic stores — fixed by dividing sum(quantity) by total days including zero-sale days',
      'Tracked down a silent training failure: a day_of_week convention mismatch (Snowflake EXTRACT returns Sunday=0; ISO weekday is Monday=0) caused 2.37M training rows to have slot_quantity=0 — the model learned a constant near zero until the join condition was corrected',
      'Honest A/B finding: ML cuts stockouts ~40% and lifts service level +1.6pp, but adds +3.3pp waste — 4× more production checks create 4× more minimum-batch cook opportunities; a production system would need a cost function to tune the trade-off',
      'Per-store schema isolation in Neon for transactional writes; single consolidated Snowflake table for cross-store analytics and model training — same data, two structures, two different jobs',
      '338,688 predictions: 12 stores × 42 items × 672 weekly slots at 15-minute grain; cold-start fallback for new items with fewer than 4 data points; simulator resumes from Snowflake watermark on restart',
      'Slot-boundary production logic: cook decisions fire once per 15-minute slot, look-ahead = hold_time × 4 slots; batch sizes scale with RUSH_CURVE to prevent over-production at 3am and under-production at noon',
      'API and simulator deployed as systemd services on EC2 with auto-restart; nightly cron chains extract → dbt → predict → A/B → git push; GitHub Actions rebuilds this site each morning',
    ],
    challenges:
      "The hardest bugs were silent ones. The model trained for weeks on 2.37M rows where slot_quantity was 0 for every row — a day_of_week convention mismatch between Snowflake's EXTRACT(DAYOFWEEK) (Sunday=0) and ISO weekday (Monday=0) meant the training join never matched. The model learned a constant near zero and I had no idea until I queried the training data directly. A separate bug inflated predictions 3–4x at low-traffic stores: the demand profile was computing a conditional mean E[X|X>0] by averaging only days with sales, rather than the true expected demand E[X] across all days. Both fixes required understanding the data at a level that unit tests would never catch.",
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
