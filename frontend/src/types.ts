export type AppView = 'landing' | 'dashboard' | 'login' | 'signup';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface TickerData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

export interface ChartDataPoint {
  timestamp: number;
  price: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  direction: 'above' | 'below';
  createdAt: number;
  triggered: boolean;
}

