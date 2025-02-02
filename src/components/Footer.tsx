import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { fetchMarketData } from '../utils/api';

interface TickerData {
  id: string;
  symbol: string;
  change: number;
  price: number;
}

const Footer: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [tickerData, setTickerData] = useState<TickerData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTickerData = async () => {
      try {
        const data = await fetchMarketData({
          vs_currency: 'usd',
          order: 'volume_desc',
          per_page: 15,
          sparkline: false,
        });

        if (Array.isArray(data)) {
          const formattedData = data.map((coin) => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            change: coin.price_change_percentage_24h ?? 0,
            price: coin.current_price ?? 0,
          }));
          setTickerData(formattedData);
          setError(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch ticker data';
        setError(errorMessage);
        console.error(errorMessage);
      }
    };

    fetchTickerData();
    const interval = setInterval(fetchTickerData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Date and Time */}
          <div className="flex items-center gap-3 min-w-[300px]">
            <Clock className="w-5 h-5 text-indigo-500" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
              <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                {formatDate(time)}
              </span>
              <span className="font-mono text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                {formatTime(time)}
              </span>
            </div>
          </div>

          {/* Live Ticker */}
          <div className="flex-1 overflow-hidden mx-4">
            {error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <div className="flex whitespace-nowrap animate-marquee">
                {tickerData.map((coin, index) => (
                  <React.Fragment key={coin.id}>
                    <span className="inline-flex items-center gap-2 px-3">
                      <span className="font-medium">{coin.symbol}</span>
                      <span className="font-mono">
                        ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className={`${coin.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%
                      </span>
                    </span>
                    {index < tickerData.length - 1 && (
                      <span className="text-gray-400 mx-2">|</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;