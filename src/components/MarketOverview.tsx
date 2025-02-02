import React from 'react';
import { BarChart2, DollarSign, TrendingUp } from 'lucide-react';
import { MarketStats } from '../types';

interface MarketOverviewProps {
  stats: MarketStats;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <BarChart2 className="text-indigo-500" />
          <h3 className="text-gray-400">Total Market Cap</h3>
        </div>
        <p className="text-xl font-bold">${(stats.total_market_cap / 1e9).toFixed(2)}B</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="text-indigo-500" />
          <h3 className="text-gray-400">24h Volume</h3>
        </div>
        <p className="text-xl font-bold">${(stats.total_volume / 1e9).toFixed(2)}B</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="text-indigo-500" />
          <h3 className="text-gray-400">Market Cap Change 24h</h3>
        </div>
        <p className={`text-xl font-bold ${stats.market_cap_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {stats.market_cap_change_percentage_24h.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default MarketOverview;