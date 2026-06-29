import axios from 'axios';
import type { StockData, LeveneResult, Period } from './types';

const API_URL = 'http://localhost:5000/api';

export const api = {
  async getStock(ticker: string, period: Period = '6mo'): Promise<StockData> {
    const res = await axios.get<StockData>(
      `${API_URL}/stock/${ticker}?period=${period}`
    );
    return res.data;
  },

  async testLevene(
    groups: number[][],
    center: 'mean' | 'median' | 'trimmed' = 'median',
    alpha: number = 0.05
  ): Promise<LeveneResult> {
    const res = await axios.post<LeveneResult>(`${API_URL}/levene`, {
      groups,
      center,
      alpha,
    });
    return res.data;
  },

  async checkHealth(): Promise<{ status: string }> {
    const res = await axios.get(`${API_URL}/health`);
    return res.data;
  },
};