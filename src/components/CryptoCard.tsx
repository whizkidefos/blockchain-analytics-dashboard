import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CryptoData } from '../types';
import PriceChart from './PriceChart';

interface CryptoCardProps {
  crypto: CryptoData;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto }) => {
  const priceChange = crypto.price_change_percentage_24h;
  const isPositive = priceChange >= 0;

  return (
    <Link 
      to={`/asset/${crypto.id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg dark:hover:bg-gray-700 transition-all"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{crypto.name}</h3>
          <span className="text-gray-600 dark:text-gray-400 text-sm uppercase">{crypto.symbol}</span>
        </div>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="font-medium">{Math.abs(priceChange).toFixed(2)}%</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          ${crypto.current_price.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Market Cap: ${crypto.market_cap.toLocaleString()}
        </div>
      </div>

      <PriceChart 
        data={crypto.sparkline_in_7d.price.map(price => ({ price }))}
        color={isPositive ? '#10B981' : '#EF4444'}
      />
    </Link>
  );
};

export default CryptoCard;