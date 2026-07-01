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
  growth_by_tier: Array<{ tier: string; artist_count: number; median_pct_growth: number; p90_pct_growth: number }>;
  top_growing_artists: Array<{ artist_name: string; min_page: number; starting_count: number; ending_count: number; total_pct_growth: number }>;
  genre_growth: Array<{ genre: string; artist_count: number; median_total_pct_growth: number }>;
};

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
