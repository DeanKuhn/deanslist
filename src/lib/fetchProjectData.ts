export type FetchResult<T> =
  | { state: 'ok'; data: T }
  | { state: 'omitted' }
  | { state: 'pending' };

export type KitchenSyncData = {
  cumulative: {
    days_run: number;
    ml_avg_waste_pct: number;
    baseline_avg_waste_pct: number;
    ml_avg_service_level: number;
    base_avg_service_level: number;
  };
  daily: Array<{
    date: string;
    ml: { units_sold: number; stockouts: number; units_wasted: number; waste_cost: number; sales_revenue: number };
    baseline: { units_sold: number; stockouts: number; units_wasted: number; waste_cost: number; sales_revenue: number };
  }>;
};

export type MusicPipelineData = {
  generated_at: string;
  summary: { artist_count: number; weeks_tracked: number; latest_snapshot: string };
  growth_by_size_quintile: Array<{
    quintile: number;
    artist_count: number;
    band_min: number;
    band_max: number;
    avg_pct_growth: number;
    median_pct_growth: number;
    p90_pct_growth: number;
  }>;
  top_growing_artists: Array<{ artist_name: string; starting_count: number; ending_count: number; total_pct_growth: number }>;
  genre_growth: Array<{ genre: string; artist_count: number; median_total_pct_growth: number }>;
};

// Compact listener counts for axis-style labels: 69347 -> "69k", 1240000 -> "1.2M"
export function formatListeners(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) {
    const k = n / 1_000;
    return `${k < 10 ? k.toFixed(1).replace(/\.0$/, '') : Math.round(k)}k`;
  }
  return String(n);
}

// "under 69k" / "69k–137k" / "470k+" for a quintile's starting-listener band
export function listenerBandLabel(
  q: { quintile: number; band_min: number; band_max: number },
  total: number
): string {
  if (q.quintile === 1) return `under ${formatListeners(q.band_max)}`;
  if (q.quintile === total) return `${formatListeners(q.band_min)}+`;
  return `${formatListeners(q.band_min)}–${formatListeners(q.band_max)}`;
}

export async function fetchKitchenSync(): Promise<FetchResult<KitchenSyncData>> {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/DeanKuhn/kitchensync/master/data/ab_results.json'
    );
    if (res.ok) return { state: 'ok', data: await res.json() };
    return { state: 'omitted' };
  } catch {
    return { state: 'omitted' };
  }
}

export type WeatherBucket = {
  store_days: number;
  ml_service_level: number;
  baseline_service_level: number;
  service_level_gap_pp: number;
  ml_waste_pct: number;
  baseline_waste_pct: number;
};

export type WeatherImpactData = {
  extreme_heat: WeatherBucket;
  extreme_cold: WeatherBucket;
  precip: WeatherBucket;
  neutral: WeatherBucket;
};

export async function fetchWeatherImpact(): Promise<FetchResult<WeatherImpactData>> {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/DeanKuhn/kitchensync/master/data/weather_impact_results.json'
    );
    if (res.ok) return { state: 'ok', data: await res.json() };
    return { state: 'omitted' };
  } catch {
    return { state: 'omitted' };
  }
}

export async function fetchMusicPipeline(): Promise<FetchResult<MusicPipelineData>> {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/DeanKuhn/music-growth-pipeline/main/data/pipeline_stats.json'
    );
    if (res.ok) return { state: 'ok', data: await res.json() };
    return { state: 'omitted' };
  } catch {
    return { state: 'omitted' };
  }
}

export type WgupsData = {
  run_timestamp: string;
  parameters: {
    packages: number;
    trucks: number;
    capacity: number;
    refrig_trucks: number;
    deadline_pct: number;
    delay_pct: number;
    refrig_pct: number;
    pop_size: number;
    generations: number;
    mutation_rate: number;
    seed: number;
  };
  final_score: number;
  convergence: Array<{
    generation: number;
    score: number;
    distance_score: number;
    minutes_late: number;
    late_count: number;
  }>;
  routes: Array<{
    truck_id: number;
    stops: Array<{ package_ids: number[]; address: string; arrival_time: string; status: string }>;
  }>;
};

export async function fetchWgups(): Promise<FetchResult<WgupsData>> {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/DeanKuhn/ga-combined-routing-loading/main/data/ga_results.json'
    );
    if (res.ok) return { state: 'ok', data: await res.json() };
    return { state: 'omitted' };
  } catch {
    return { state: 'omitted' };
  }
}
