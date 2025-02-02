import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Activity } from 'lucide-react';
import { CryptoData, MarketStats } from './types';
import CryptoCard from './components/CryptoCard';
import MarketOverview from './components/MarketOverview';
import ThemeToggle from './components/ThemeToggle';
import Footer from './components/Footer';
import AssetPage from './pages/AssetPage';
import { ThemeProvider } from './context/ThemeContext';
import Preloader from './components/Preloader';
import ErrorDisplay from './components/ErrorDisplay';

function Dashboard() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [marketStats, setMarketStats] = useState<MarketStats>({
    total_market_cap: 0,
    total_volume: 0,
    market_cap_change_percentage_24h: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [marketResponse, globalResponse] = await Promise.all([
        axios.get(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 12,
              page: 1,
              sparkline: true
            }
          }
        ),
        axios.get('https://api.coingecko.com/api/v3/global')
      ]);

      setCryptoData(marketResponse.data);
      setMarketStats({
        total_market_cap: globalResponse.data.data.total_market_cap.usd,
        total_volume: globalResponse.data.data.total_volume.usd,
        market_cap_change_percentage_24h: globalResponse.data.data.market_cap_change_percentage_24h_usd
      });
    } catch (err) {
      setError('Unable to load cryptocurrency data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 pb-20">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-500" />
            <h1 className="text-2xl font-bold">Blockchain Analytics</h1>
          </div>
          <ThemeToggle />
        </div>
        <p className="text-gray-600 dark:text-gray-400">Real-time cryptocurrency market analysis</p>
      </header>

      {loading ? (
        <Preloader />
      ) : error ? (
        <ErrorDisplay message={error} retry={fetchData} />
      ) : (
        <>
          <MarketOverview stats={marketStats} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cryptoData.map((crypto) => (
              <CryptoCard key={crypto.id} crypto={crypto} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/asset/:id" element={<AssetPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;