'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import type { StockData, LeveneResult, Period } from '@/lib/types';
import StockSelector from './components/StockSelector';
import StockChart from './components/StockChart';
import LeveneResultComponent from './components/LeveneResult';

export default function Home() {
  const [tickers, setTickers] = useState<string[]>(['AAPL', 'GOOGL', 'TSLA']);
  const [period, setPeriod] = useState<Period>('6mo');
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [leveneResult, setLeveneResult] = useState<LeveneResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const runAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const results = await Promise.all(
        tickers.map((t) => api.getStock(t, period))
      );
      setStockData(results);

      const groups = results.map((r) => r.log_returns);
      const levene = await api.testLevene(groups);
      setLeveneResult(levene);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      setError(error.response?.data?.error || error.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Test de Levene — Analyse Boursière
          </h1>
          <p className="text-gray-600">
            Comparez la volatilité de plusieurs actions avec un test statistique rigoureux
          </p>
        </header>

        <StockSelector
          tickers={tickers}
          setTickers={setTickers}
          period={period}
          setPeriod={setPeriod}
          onRun={runAnalysis}
          loading={loading}
        />

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded mb-6">
            <strong>Erreur :</strong> {error}
          </div>
        )}

        {stockData.length > 0 && (
          <StockChart stockData={stockData} tickers={tickers} />
        )}

        {leveneResult && (
          <LeveneResultComponent result={leveneResult} tickers={tickers} />
        )}
      </div>
    </div>
  );
}