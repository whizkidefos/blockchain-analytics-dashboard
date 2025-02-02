import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { CryptoData } from '../types';
import Preloader from '../components/Preloader';
import ErrorDisplay from '../components/ErrorDisplay';
import { fetchCoinData, fetchCoinMarketChart } from '../utils/api';

interface DetailedCryptoData extends CryptoData {
  description: { en: string };
  market_data: {
    ath: { usd: number };
    atl: { usd: number };
    circulating_supply: number;
    total_supply: number;
    current_price: { usd: number };
    market_cap: { usd: number };
    price_change_percentage_24h: number;
  };
}

const AssetPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<DetailedCryptoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | '1y'>('7d');
  const [priceData, setPriceData] = useState<{ time: number; price: number }[]>([]);

  const fetchAssetData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [assetData, marketData] = await Promise.all([
        fetchCoinData(id),
        fetchCoinMarketChart(id, timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 365)
      ]);

      if (!assetData || !marketData) {
        throw new Error('Failed to fetch asset data');
      }

      setAsset(assetData);
      setPriceData(marketData.prices.map(([timestamp, price]: [number, number]) => ({
        time: timestamp,
        price
      })));
    } catch (err) {
      setError('Unable to load asset data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetData();
  }, [id, timeframe]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
        <Preloader />
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
        <ErrorDisplay message={error || 'Asset not found'} retry={fetchAssetData} />
      </div>
    );
  }

  const timeframeButtons = [
    { label: '24H', value: '24h' },
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '1Y', value: '1y' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 pb-20">
      <Link to="/" className="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-600 mb-6">
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </Link>

      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold">{asset.name}</h1>
            <span className="text-xl text-gray-600 dark:text-gray-400 uppercase">{asset.symbol}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-gray-600 dark:text-gray-400 mb-1">Current Price</h3>
              <p className="text-2xl font-bold">${asset.market_data.current_price.usd.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-gray-600 dark:text-gray-400 mb-1">Market Cap</h3>
              <p className="text-2xl font-bold">${asset.market_data.market_cap.usd.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-gray-600 dark:text-gray-400 mb-1">24h Change</h3>
              <p className={`text-2xl font-bold ${
                asset.market_data.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {asset.market_data.price_change_percentage_24h.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="mb-4 flex gap-2">
            {timeframeButtons.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setTimeframe(value as typeof timeframe)}
                className={`px-4 py-2 rounded-lg ${
                  timeframe === value
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="h-[400px] bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time"
                  tickFormatter={(timestamp) => {
                    const date = new Date(timestamp);
                    return timeframe === '24h' 
                      ? date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
                      : date.toLocaleDateString();
                  }}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                  labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About {asset.name}</h2>
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: asset.description.en }}
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Supply Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Circulating Supply</p>
                <p className="text-lg font-semibold">
                  {asset.market_data.circulating_supply.toLocaleString()} {asset.symbol.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total Supply</p>
                <p className="text-lg font-semibold">
                  {asset.market_data.total_supply?.toLocaleString() || 'Unlimited'} {asset.symbol.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Price Statistics</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400">All Time High</p>
                <p className="text-lg font-semibold">${asset.market_data.ath.usd.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">All Time Low</p>
                <p className="text-lg font-semibold">${asset.market_data.atl.usd.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AssetPage;