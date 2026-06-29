export type Period = '1mo' | '3mo' | '6mo' | '1y' | '2y';

export interface StockData {
  success: boolean;
  ticker: string;
  period: string;
  dates: string[];
  prices: number[];
  log_returns: number[];
  count: number;
  first_price?: number;
  last_price?: number;
  total_return_pct?: number;
}

export interface GroupStats {
  means: number[];
  variances: number[];
  std_devs: number[];
}

export interface LeveneResult {
  success: boolean;
  statistic_W: number;
  p_value: number;
  alpha: number;
  reject_h0: boolean;
  conclusion: string;
  n_groups: number;
  sample_sizes: number[];
  group_stats: GroupStats;
  center_method: string;
}

export interface ApiError {
  success: false;
  error: string;
}