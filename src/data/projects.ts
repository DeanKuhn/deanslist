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
  highlightsLabel?: string; // defaults to 'highlights'; e.g. 'challenges'
  challenges?: string;
  screenshotUrl?: string;    // e.g. '/images/kitchensync-dashboard.png' (place file in deanslist/public/images/)
  githubUrl: string;
}

export const projects: Project[] = [
  {
    slug: 'kitchensync',
    title: 'KitchenSync Food Forecasting System',
    year: '2026',
    status: 'live',
    category: 'data engineering',
    tagline: 'Live kitchen production system. ML pulls furthest ahead of a naive baseline exactly when weather diverges from the seasonal norm — and reports honestly the one condition where it doesn\'t.',
    problem:
      'Retail kitchens waste food when production outpaces demand and miss revenue when they run short. Forecasting the right quantity per item per store at a 15-minute grain, refreshed continuously, needs a real pipeline, not a spreadsheet — and the harder question is honest evaluation: does ML actually earn its complexity cost, and where does it not? Modeled after the Kitchen Production System (KPS) at Kwik Trip.',
    what:
      'End-to-end simulation of a Kwik Trip-style Kitchen Production System running live on AWS EC2. The POS simulator generates events for 12 stores via Poisson arrivals, FIFO batch inventory, and slot-boundary production logic, buffering sales/waste/stockout in memory and flushing straight to Neon Postgres every 5 minutes — no ingest API in front of it. A nightly cron rebuilds the demand baseline and runs an A/B comparison entirely against Neon: LightGBM (fed real per-date, per-region weather as a "perfect forecast") against a naive hourly-average baseline that structurally can\'t use a weather axis, over 12 stores × 45 items × 672 weekly slots. A Streamlit dashboard surfaces split Kitchen and Chicken production queues with 5-minute auto-refresh, reading live from Neon. Results write to ab_results_v2.json, commit to GitHub, and trigger this portfolio site to rebuild. Retraining is manual and Neon-native end to end — no Snowflake step; a dbt project remains in the repo as a portfolio-only artifact, not run against live data.',
    techStack: [
      'Python',
      'PostgreSQL (Neon)',
      'LightGBM',
      'Streamlit',
      'asyncio / psycopg2',
      'dbt Core (portfolio-only)',
      'Docker',
      'AWS EC2',
      'systemd',
      'uv',
    ],
    highlightsLabel: 'challenges',
    highlights: [
      'Weather signal too weak to show up: the baseline\'s own historical average already bakes in an *average* weather effect, so a synthetic signal has to be deliberately stronger than reality to produce a visible A/B gap at all — narrowed the neutral band, raised precip probability, and halved unrelated day-to-day noise, growing the extreme-temperature service-level gap from +0.31pp to +2.0pp',
      'Diagnosed a silent cost leak: an always-open ingest-API connection pool kept Neon\'s compute endpoint permanently awake, burning a week\'s free-tier compute-hours regardless of actual traffic — deleted the API entirely and rewrote the simulator to buffer events in memory and flush via short-lived batched connections every 5 minutes',
      'Traced a 1.89x overproduction at a low-traffic store to a fleet-wide cold-start average masking per-store scale — fixed with a data-driven per-store traffic ratio and a three-tier warm/zero/cold fallback, flattening predicted-vs-actual to a 1.02–1.03x band across stores',
      'Caught a conditional-mean trap: a demand profile averaging only sale-days instead of all days inflated low-traffic predictions 3–4x — a generalizable lesson now called out for any future profile-building script, not just a one-off fix',
    ],
    screenshotUrl: '', // e.g. '/images/kitchensync-dashboard.png' — drop the file in deanslist/public/images/ and set the path here
    githubUrl: 'https://github.com/DeanKuhn/kitchensync',
  },
  {
    slug: 'music-growth-pipeline',
    title: 'Music Growth Pipeline',
    year: '2026',
    status: 'live',
    category: 'data engineering',
    tagline: 'Longitudinal listener tracking across weekly Last.fm snapshots. Median growth falls monotonically as artists get larger.',
    problem:
      "The Last.fm API returns only cumulative all-time stats — there is no native time series. To study whether an artist's audience size correlates with listener growth over time, you have to build the longitudinal dataset yourself by snapshotting repeatedly.",
    what:
      'Weekly ingestion pipeline snapshots listener data for artists from the Last.fm global chart into Postgres on Neon. Artists are bucketed into size quintiles by their listener count at the start of the measurement window, so growth is compared across audience size rather than chart position. A dbt transformation layer (6 staging + 7 mart models) powers both cross-sectional and longitudinal analysis. After each weekly snapshot, dbt rebuilds the mart views, a stats script queries them and writes pipeline_stats.json to GitHub, and this portfolio page picks up the fresh data in its nightly rebuild.',
    techStack: [
      'Python',
      'PostgreSQL (Neon)',
      'dbt Core (dbt-postgres)',
      'Last.fm API',
      'GitHub Actions',
      'SQL',
    ],
    highlights: [
      'Artists tracked across weekly snapshots and split into five equal-sized bands by listener count at the start of the window (live counts on the project page)',
      'Core finding: median listener growth declines monotonically with artist size — the smallest band grows roughly 1.5× the median rate of the largest',
      'dbt mart layer: listener_growth (LAG window function), artist_growth_summary, weekly_growth_by_tier, genre_growth — marts build on marts via ref()',
      'Averages sit well above medians in every band — a thin tail of viral breakouts skews the mean, so the median carries the finding',
      'Genre signal: EDM shows highest median growth rate; classical and metal are slowest — genre appears secondary to artist size as a growth predictor',
      'Standout cases: several small artists grew 100–400% over the window — growth patterns split between viral spikes and steady week-over-week acceleration',
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
    tagline: 'Bronze→Silver→Gold Delta Lake pipeline detecting S&P 500 breakout signals from price and volume data',
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
    tagline: 'VRP-TW solver where one GA co-evolves truck loading and delivery sequence simultaneously — no two-pass split.',
    problem:
      'The VRP-TW shares two interwoven problems: which packages go on which truck (assignment) and in what order each truck delivers them (sequencing). Most implementations solve these in two separate passes. The WGU capstone that preceded this did worse — it hard-coded package-to-truck assignments written directly into source, a fixed 40-package / 3-truck assumption, and no tolerance for variable constraints. Any change required a developer and a redeploy.',
    what:
      'A configurable GA that solves assignment and sequencing in a single chromosome, letting the two decisions co-evolve and inform each other across generations. Packages are procedurally generated per run with configurable deadline, delay, and refrigeration distributions. A bundle pre-processing step groups packages by address and validates constraint compatibility before the GA starts, reducing search space without losing solution quality. The fitness function scores five weighted objectives including a gradient deadline penalty. All major parameters are surfaced through a CLI; no source changes required to run different scenarios. Post-run, the CLI supports package status lookup by ID or address at any timestamp, reconstructed from simulation output.',
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
      "Two bugs stalled performance for a while. First: Truck objects were maintaining state across fitness evaluations. Departure time set in generation N carried into generation N+1, corrupting the simulation for every subsequent chromosome. The fix was reinitializing truck state at the start of each route evaluation in fitness(). Second: the original sentinel encoding used strings ('|1|', '|2|', ...), requiring isinstance(gene, str) on every gene in every fitness call across thousands of generations. Replacing sentinels with negative integers (checking gene < 0) is the fastest comparison available in Python, allowing for a meaningful gain of efficiency in a tight hot loop.",
    githubUrl: 'https://github.com/DeanKuhn/ga-combined-routing-loading',
  },
];
