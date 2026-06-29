'use client';

import type { LeveneResult as LeveneResultType } from '@/lib/types';

interface Props {
  result: LeveneResultType;
  tickers: string[];
}

export default function LeveneResult({ result, tickers }: Props) {
  const { statistic_W, p_value, reject_h0, conclusion, group_stats } = result;

  const decisionColor = reject_h0
    ? 'bg-red-50 border-red-300 text-red-800'
    : 'bg-green-50 border-green-300 text-green-800';

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Résultats du Test de Levene
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <div className="text-xs text-gray-500 uppercase">Statistique W</div>
          <div className="text-2xl font-bold text-gray-800">
            {statistic_W.toFixed(4)}
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <div className="text-xs text-gray-500 uppercase">p-value</div>
          <div className="text-2xl font-bold text-gray-800">
            {p_value < 0.0001 ? '< 0.0001' : p_value.toFixed(4)}
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <div className="text-xs text-gray-500 uppercase">Seuil α</div>
          <div className="text-2xl font-bold text-gray-800">0.05</div>
        </div>
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <div className="text-xs text-gray-500 uppercase">Décision</div>
          <div className="text-lg font-bold mt-1">
            {reject_h0 ? 'H₀ rejetée' : 'H₀ acceptée'}
          </div>
        </div>
      </div>

      <div className={`border-l-4 p-4 rounded mb-6 ${decisionColor}`}>
        <strong>Conclusion :</strong> {conclusion}
      </div>

      <h3 className="font-semibold mb-2 text-gray-800">
        Statistiques par action
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Action</th>
              <th className="p-2 text-right">Moyenne (rendement)</th>
              <th className="p-2 text-right">Variance</th>
              <th className="p-2 text-right">Écart-type (volatilité)</th>
            </tr>
          </thead>
          <tbody>
            {tickers.map((t, i) => (
              <tr key={t} className="border-b">
                <td className="p-2 font-medium">{t}</td>
                <td className="p-2 text-right">
                  {(group_stats.means[i] * 100).toFixed(4)}%
                </td>
                <td className="p-2 text-right">
                  {group_stats.variances[i].toExponential(3)}
                </td>
                <td className="p-2 text-right">
                  {(group_stats.std_devs[i] * 100).toFixed(4)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}