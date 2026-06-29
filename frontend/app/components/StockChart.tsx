'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { StockData } from '@/lib/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B'];

interface Props {
  stockData: StockData[];
  tickers: string[];
}

export default function StockChart({ stockData, tickers }: Props) {
  const data = {
    labels: stockData[0]?.dates || [],
    datasets: stockData.map((stock, i) => ({
      label: tickers[i],
      data: stock.prices,
      borderColor: COLORS[i % COLORS.length],
      backgroundColor: COLORS[i % COLORS.length] + '20',
      tension: 0.1,
      pointRadius: 0,
      borderWidth: 2,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Évolution des prix de clôture',
        font: { size: 16 },
      },
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        ticks: { maxTicksLimit: 10 },
      },
      y: {
        title: { display: true, text: 'Prix (USD)' },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
      <div style={{ height: '400px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}