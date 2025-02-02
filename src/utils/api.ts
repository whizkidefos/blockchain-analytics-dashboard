import axios, { AxiosError } from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Create an axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Increased timeout
});

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Add retry logic with exponential backoff
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    // Add retry count to config if it doesn't exist
    config.retryCount = config.retryCount ?? 0;

    if (config.retryCount >= MAX_RETRIES) {
      return Promise.reject(error);
    }

    // Increment retry count
    config.retryCount += 1;

    // Calculate delay with exponential backoff
    const delay = INITIAL_RETRY_DELAY * Math.pow(2, config.retryCount - 1);
    
    // If rate limited, use the Retry-After header or default to our calculated delay
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const retryDelay = retryAfter ? parseInt(retryAfter) * 1000 : delay;
      await sleep(retryDelay);
      return api.request(config);
    }

    // For other errors (like network errors), use exponential backoff
    if (!error.response || error.response.status >= 500) {
      await sleep(delay);
      return api.request(config);
    }

    return Promise.reject(error);
  }
);

interface MarketDataParams {
  vs_currency?: string;
  order?: string;
  per_page?: number;
  page?: number;
  sparkline?: boolean;
}

export const fetchMarketData = async (params: MarketDataParams = {}) => {
  try {
    const defaultParams = {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 15,
      sparkline: false,
      ...params,
    };

    const response = await api.get('/coins/markets', { params: defaultParams });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch market data:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
};

export const fetchGlobalData = async () => {
  try {
    const response = await api.get('/global');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch global data:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
};

export const fetchCoinData = async (id: string) => {
  try {
    const response = await api.get(`/coins/${id}?localization=false&tickers=false&sparkline=true`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch coin data:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
};

export const fetchCoinMarketChart = async (id: string, days: string | number) => {
  try {
    const response = await api.get(`/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch market chart:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
};