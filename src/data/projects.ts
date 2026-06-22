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
    tagline: 'Live kitchen production system — ML cuts stockouts 40% and lifts service level +1.6pp, but adds +3.3pp waste — the pipeline quantifies the trade-off nightly',
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
    tagline: 'Tracked 7,751 artists over 7+ weeks — underground acts (pages 1000+) grow 3× faster than mainstream in listener percentage',
    problem:
      "The Last.fm API returns only cumulative all-time stats — there is no native time series. To study whether chart position correlates with listener growth over time, you have to build the longitudinal dataset yourself by snapshotting repeatedly.",
    what:
      'Weekly ingestion pipeline snapshots listener data for 7,751 artists from the Last.fm global chart into Postgres on Neon. Artists are split into tiers by chart page depth: mainstream (pages 1–50) vs indie (pages 51+). A dbt transformation layer (6 staging + 7 mart models) powers both cross-sectional and longitudinal analysis. After each weekly snapshot, dbt rebuilds the mart views, a stats script queries them and writes pipeline_stats.json to GitHub, and this portfolio page picks up the fresh data in its nightly rebuild.',
    techStack: [
      'Python',
      'PostgreSQL (Neon)',
      'dbt Core (dbt-postgres)',
      'Last.fm API',
      'GitHub Actions',
      'SQL',
    ],
    highlights: [
      '7,751 artists tracked across 7 weekly snapshots (April–June 2026): 250 mainstream (pages 1–50), 7,501 indie',
      'Core finding: underground artists (pages 1000+) show P90 growth of 9.16% over 7 weeks vs mainstream 2.75% — the gap widens at the tail, not the median',
      'dbt mart layer: listener_growth (LAG window function), artist_growth_summary, weekly_growth_by_tier, genre_growth — marts build on marts via ref()',
      'Cross-sectional finding: ~4× plays-per-listener gap (mainstream median 74.76 vs indie 17.69) consistent across full distribution — indie P90 listeners (782K) falls below mainstream P25 (2.3M)',
      'Genre signal: EDM shows highest median growth rate; classical and metal are slowest — genre appears secondary to chart depth as a growth predictor',
      'Standout cases: several underground artists (pages 1500+) grew 100–400% over 7 weeks — growth patterns split between viral spikes and steady week-over-week acceleration',
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
    tagline: 'VRP-TW solver where one GA co-evolves truck loading and delivery sequence simultaneously — no two-pass split',
    problem:
      'The VRP-TW has two interleaved sub-problems: which packages go on which truck (assignment) and in what order each truck delivers them (sequencing). Most implementations solve these in two separate passes. The WGU capstone that preceded this did worse — hard-coded package-to-truck assignments written directly into source, a fixed 40-package / 3-truck assumption, and no tolerance for variable constraints. Any change required a developer and a redeploy.',
    what:
      'A configurable GA that solves assignment and sequencing in a single chromosome, letting the two decisions co-evolve and inform each other across generations. Packages are procedurally generated per run with configurable deadline, delay, and refrigeration distributions. A bundle pre-processing step groups packages by address and validates constraint compatibility before the GA starts — reducing search space without losing solution quality. The fitness function scores five weighted objectives including a gradient deadline penalty. All major parameters are surfaced through a CLI; no source changes required to run different scenarios. Post-run, the CLI supports package status lookup by ID or address at any timestamp, reconstructed from simulation output.',
    techStack: ['Python', 'uv', 'CLI'],
    highlights: [
      'Sentinel chromosome: negative integers act as truck boundaries in a flat array — a single crossover or mutation can affect both which truck a package goes on and the delivery order within that truck',
      'Sentinel shift mutation moves a truck boundary left or right by one position — specifically prevents the initial capacity distribution from becoming permanent across generations',
      'Gradient deadline penalty (minutes_late × 10) creates a smooth fitness landscape so the GA distinguishes a 5-minute miss from a 5-hour miss; binary pass/fail flattens the landscape and stalls convergence',
      'Bundle pre-processing validates constraint compatibility before the GA runs: a package with a 9:30 AM availability window cannot be bundled with one that has a 9:00 AM deadline; 45-minute drive-time buffer applied',
      'Adaptive mutation: rate doubles after 50 stagnant generations to escape local optima, resets on meaningful improvement (>0.1% threshold prevents resetting on marginal gains in flat landscapes)',
      'Capacity-aware population seeding distributes bundles evenly across truck segments from generation zero — early populations are feasible rather than requiring the GA to spend generations on repair',
      'Early termination after 500 stagnant generations enables convergence mode: set generations to a large number and let the algorithm run until done',
    ],
    challenges:
      "Two bugs stalled performance for a while. First: Truck objects were maintaining state across fitness evaluations — departure time set in generation N carried into generation N+1, corrupting the simulation for every subsequent chromosome. The fix was reinitializing truck state at the start of each route evaluation in fitness(). Second: the original sentinel encoding used strings ('|1|', '|2|', ...), requiring isinstance(gene, str) on every gene in every fitness call across thousands of generations. Replacing sentinels with negative integers (checking gene < 0) is the fastest comparison available in Python — a meaningful gain in a tight hot loop.",
    githubUrl: 'https://github.com/DeanKuhn/ga-combined-routing-loading',
  },
];
