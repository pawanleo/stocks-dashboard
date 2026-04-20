export interface TickerData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

export const INITIAL_TICKERS = ['AAPL', 'TSLA', 'BTC-USD', 'ETH-USD', 'NVDA', 'AMZN'];

// Store the latest state of each ticker
const marketState = new Map<string, TickerData>();

// Initialize states
INITIAL_TICKERS.forEach(symbol => {
  const basePrice = symbol.includes('BTC') ? 60000 : symbol.includes('ETH') ? 3000 : 150 + Math.random() * 500;
  marketState.set(symbol, {
    symbol,
    price: basePrice,
    change: 0,
    changePercent: 0,
    volume: 1000 + Math.random() * 5000,
    timestamp: Date.now()
  });
});

/**
 * Returns currently available tickers
 */
export const getAvailableTickers = () => {
  return Array.from(marketState.values());
};

/**
 * In-memory cache for historical data with TTL
 */
interface CacheEntry {
  data: { timestamp: number; price: number }[];
  expiry: number;
}

const CACHE_TTL_MS = 30_000; // 30 seconds
const historyCache = new Map<string, CacheEntry>();

/**
 * Clears expired entries from the cache (housekeeping)
 */
export const purgeExpiredCache = () => {
  const now = Date.now();
  for (const [key, entry] of historyCache.entries()) {
    if (now > entry.expiry) historyCache.delete(key);
  }
};

/**
 * Generates historical mock data (a sine/random walk combination).
 * Results are cached with a 30 s TTL so repeated fetches are instant.
 */
export const getHistoricalData = (symbol: string, dataPoints: number = 50) => {
  const current = marketState.get(symbol);
  if (!current) return [];

  // --- Cache lookup ---
  const cacheKey = `${symbol}:${dataPoints}`;
  const cached = historyCache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) {
    // Update the last data-point to the live price so the chart stays current
    const data = [...cached.data];
    data[data.length - 1] = { ...data[data.length - 1], price: current.price };
    return data;
  }

  // --- Generate fresh data ---
  const history = [];
  let simulatedPrice = current.price * 0.95; // start slightly lower

  for (let i = dataPoints; i >= 0; i--) {
     const volatility = current.price * 0.005; // 0.5% volatility
     const change = (Math.random() - 0.5) * volatility;
     simulatedPrice += change;
     
     history.push({
       timestamp: Date.now() - i * 60000, // 1 minute intervals
       price: Number(simulatedPrice.toFixed(2))
     });
  }

  // Set the latest price to exact current
  history[history.length - 1].price = current.price;

  // --- Store in cache ---
  historyCache.set(cacheKey, { data: history, expiry: Date.now() + CACHE_TTL_MS });

  // Housekeeping: purge stale entries periodically
  purgeExpiredCache();
  
  return history;
}

/**
 * Update tick logic: 
 * Returns updated tickers every interval.
 */
export const simulateMarketTick = (): TickerData[] => {
  const updated: TickerData[] = [];
  
  for (const [symbol, data] of marketState.entries()) {
    // 30% chance to update a specific ticker per tick to seem realistic
    if (Math.random() > 0.3) continue;

    const volatility = symbol.includes('USD') ? 0.002 : 0.001; // Crypto more volatile
    const changeFactor = (Math.random() - 0.5) * 2 * volatility;
    
    const newPrice = data.price * (1 + changeFactor);
    const oldPrice = data.price;
    const priceChange = newPrice - oldPrice;
    
    // Simple mock to keep track of a daily change (since start)
    const currentChange = data.change + priceChange;
    const currentPercent = (currentChange / (oldPrice - currentChange)) * 100;

    const newTick: TickerData = {
      ...data,
      price: Number(newPrice.toFixed(2)),
      change: Number(currentChange.toFixed(2)),
      changePercent: Number(currentPercent.toFixed(2)),
      timestamp: Date.now()
    };

    marketState.set(symbol, newTick);
    updated.push(newTick);
  }

  return updated;
};
