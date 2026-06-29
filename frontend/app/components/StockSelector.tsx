'use client';

import type { Period } from '@/lib/types';

interface Props {
  tickers: string[];
  setTickers: (tickers: string[]) => void;
  period: Period;
  setPeriod: (period: Period) => void;
  onRun: () => void;
  loading: boolean;
}

export default function StockSelector({
  tickers,
  setTickers,
  period,
  setPeriod,
  onRun,
  loading,
}: Props) {
  const updateTicker = (index: number, value: string) => {
    const newTickers = [...tickers];
    newTickers[index] = value.toUpperCase();
    setTickers(newTickers);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Configuration de l&apos;analyse
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {tickers.map((ticker, i) => (
          <div key={i}>
            <label className="block text-sm text-gray-600 mb-1">
              Action {i + 1}
            </label>
            <input
              type="text"
              value={ticker}
              onChange={(e) => updateTicker(i, e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="ex: AAPL"
            />
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Période</label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="1mo">1 mois</option>
          <option value="3mo">3 mois</option>
          <option value="6mo">6 mois</option>
          <option value="1y">1 an</option>
          <option value="2y">2 ans</option>
        </select>
      </div>

      <button
        onClick={onRun}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {loading ? 'Analyse en cours...' : "Lancer l'analyse"}
      </button>
    </div>
  );
}