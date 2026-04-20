import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import { TickerData, ChartDataPoint, PriceAlert } from '../types';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

interface MarketStore {
  socket: Socket | null;
  tickers: Record<string, TickerData>;
  selectedSymbol: string | null;
  searchQuery: string;
  chartData: ChartDataPoint[];
  isConnected: boolean;
  // Alert state
  alerts: PriceAlert[];
  triggeredAlerts: PriceAlert[];
  setTickers: (tickers: TickerData[]) => void;
  updateTickers: (updates: TickerData[]) => void;
  setSelectedSymbol: (symbol: string) => void;
  setChartData: (data: ChartDataPoint[]) => void;
  appendChartData: (dataPoint: ChartDataPoint) => void;
  setConnected: (status: boolean) => void;
  setSearchQuery: (query: string) => void;
  // Alert actions
  setAlerts: (alerts: PriceAlert[]) => void;
  addTriggeredAlert: (alert: PriceAlert) => void;
  dismissTriggeredAlert: (id: string) => void;
}

export const useMarketStore = create<MarketStore>((set) => ({
  socket: null,
  tickers: {},
  selectedSymbol: null,
  searchQuery: '',
  chartData: [],
  isConnected: false,
  alerts: [],
  triggeredAlerts: [],
  setTickers: (tickers) => {
    const tickerMap: Record<string, TickerData> = {};
    tickers.forEach(t => tickerMap[t.symbol] = t);
    set({ tickers: tickerMap });
  },
  updateTickers: (updates) => {
    set((state) => {
      const newTickers = { ...state.tickers };
      updates.forEach(update => {
        newTickers[update.symbol] = update;
        
        // If the update is for our selected ticker, append to chart
        if (state.selectedSymbol === update.symbol) {
          state.appendChartData({ timestamp: update.timestamp, price: update.price });
        }
      });
      return { tickers: newTickers };
    });
  },
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  setChartData: (data) => set({ chartData: data }),
  appendChartData: (dataPoint) => set((state) => {
     // Keep only the last 60 points for performance
     const newData = [...state.chartData, dataPoint];
     if (newData.length > 60) newData.shift();
     return { chartData: newData };
  }),
  setConnected: (status) => set({ isConnected: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setAlerts: (alerts) => set({ alerts }),
  addTriggeredAlert: (alert) => set((state) => ({
    triggeredAlerts: [...state.triggeredAlerts, alert]
  })),
  dismissTriggeredAlert: (id) => set((state) => ({
    triggeredAlerts: state.triggeredAlerts.filter(a => a.id !== id)
  }))
}));

/**
 * Fetch all alerts from the backend
 */
export const fetchAlerts = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/alerts`);
    if (res.data.success) {
      useMarketStore.getState().setAlerts(res.data.data);
    }
  } catch (err) {
    console.error('Failed to fetch alerts', err);
  }
};

/**
 * Create a new price alert
 */
export const createPriceAlert = async (symbol: string, targetPrice: number, direction: 'above' | 'below') => {
  try {
    const res = await axios.post(`${BACKEND_URL}/api/alerts`, { symbol, targetPrice, direction });
    if (res.data.success) {
      await fetchAlerts(); // refresh list
      return res.data.data as PriceAlert;
    }
  } catch (err) {
    console.error('Failed to create alert', err);
  }
  return null;
};

/**
 * Delete a price alert
 */
export const deletePriceAlert = async (id: string) => {
  try {
    await axios.delete(`${BACKEND_URL}/api/alerts/${id}`);
    await fetchAlerts();
  } catch (err) {
    console.error('Failed to delete alert', err);
  }
};

export const useMarketData = () => {
  const { 
    setTickers, 
    updateTickers, 
    setConnected, 
    selectedSymbol, 
    setChartData,
    addTriggeredAlert 
  } = useMarketStore();

  useEffect(() => {
    const socket = io(BACKEND_URL);

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('market_init', (data: TickerData[]) => {
      setTickers(data);
    });

    socket.on('market_update', (data: TickerData[]) => {
      updateTickers(data);
    });

    // Listen for price threshold alerts
    socket.on('price_alert', (alerts: PriceAlert[]) => {
      alerts.forEach(alert => {
        addTriggeredAlert(alert);
      });
      // Refresh alerts list to get updated triggered status
      fetchAlerts();
    });

    // Fetch initial alerts
    fetchAlerts();

    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch historical data when symbol changes
  useEffect(() => {
    if (selectedSymbol) {
      axios.get(`${BACKEND_URL}/api/tickers/${selectedSymbol}/history?points=60`)
        .then(res => {
          if (res.data.success) {
            setChartData(res.data.data);
          }
        })
        .catch(err => console.error("Could not fetch historical data", err));
    }
  }, [selectedSymbol]);
};

