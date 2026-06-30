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
