import { describe, it, expect, beforeEach } from 'vitest';
import { useMarketStore } from '../hooks/useMarketData';

describe('useMarketStore (Zustand)', () => {
  beforeEach(() => {
    // Reset store to initial state between tests
    useMarketStore.setState({
      tickers: {},
      selectedSymbol: null,
      searchQuery: '',
      chartData: [],
      isConnected: false,
      alerts: [],
      triggeredAlerts: [],
    });
  });

  it('should initialize with empty state', () => {
    const state = useMarketStore.getState();
    expect(Object.keys(state.tickers)).toHaveLength(0);
    expect(state.selectedSymbol).toBeNull();
    expect(state.isConnected).toBe(false);
    expect(state.chartData).toHaveLength(0);
    expect(state.alerts).toHaveLength(0);
    expect(state.triggeredAlerts).toHaveLength(0);
  });

  it('should set tickers as a map keyed by symbol', () => {
    const mockTickers = [
      { symbol: 'AAPL', price: 150, change: 2, changePercent: 1.3, volume: 1000, timestamp: Date.now() },
      { symbol: 'TSLA', price: 250, change: -5, changePercent: -2.0, volume: 2000, timestamp: Date.now() },
    ];

    useMarketStore.getState().setTickers(mockTickers);

    const { tickers } = useMarketStore.getState();
    expect(Object.keys(tickers)).toHaveLength(2);
    expect(tickers['AAPL'].price).toBe(150);
    expect(tickers['TSLA'].price).toBe(250);
  });

  it('should update existing tickers on market update', () => {
    // Seed initial data
    useMarketStore.getState().setTickers([
      { symbol: 'AAPL', price: 150, change: 0, changePercent: 0, volume: 1000, timestamp: Date.now() },
    ]);

    // Simulate update
    useMarketStore.getState().updateTickers([
      { symbol: 'AAPL', price: 155, change: 5, changePercent: 3.3, volume: 1200, timestamp: Date.now() },
    ]);

    const { tickers } = useMarketStore.getState();
    expect(tickers['AAPL'].price).toBe(155);
    expect(tickers['AAPL'].change).toBe(5);
  });

  it('should set and clear the selected symbol', () => {
    useMarketStore.getState().setSelectedSymbol('BTC-USD');
    expect(useMarketStore.getState().selectedSymbol).toBe('BTC-USD');

    useMarketStore.getState().setSelectedSymbol('');
    expect(useMarketStore.getState().selectedSymbol).toBe('');
  });

  it('should track connection status', () => {
    useMarketStore.getState().setConnected(true);
    expect(useMarketStore.getState().isConnected).toBe(true);

    useMarketStore.getState().setConnected(false);
    expect(useMarketStore.getState().isConnected).toBe(false);
  });

  it('should append chart data and cap at 60 points', () => {
    const store = useMarketStore.getState();
    
    // Add 65 data points
    for (let i = 0; i < 65; i++) {
      store.appendChartData({ timestamp: Date.now() + i * 1000, price: 100 + i });
    }

    const { chartData } = useMarketStore.getState();
    expect(chartData.length).toBeLessThanOrEqual(60);
    // Latest point should be the last one added
    expect(chartData[chartData.length - 1].price).toBe(164);
  });

  it('should manage search query', () => {
    useMarketStore.getState().setSearchQuery('BTC');
    expect(useMarketStore.getState().searchQuery).toBe('BTC');

    useMarketStore.getState().setSearchQuery('');
    expect(useMarketStore.getState().searchQuery).toBe('');
  });

  it('should set alerts', () => {
    const mockAlerts = [
      { id: 'alert-1', symbol: 'AAPL', targetPrice: 200, direction: 'above' as const, createdAt: Date.now(), triggered: false },
    ];

    useMarketStore.getState().setAlerts(mockAlerts);
    expect(useMarketStore.getState().alerts).toHaveLength(1);
    expect(useMarketStore.getState().alerts[0].symbol).toBe('AAPL');
  });

  it('should add and dismiss triggered alerts', () => {
    const alert = { id: 'alert-1', symbol: 'AAPL', targetPrice: 200, direction: 'above' as const, createdAt: Date.now(), triggered: true };

    useMarketStore.getState().addTriggeredAlert(alert);
    expect(useMarketStore.getState().triggeredAlerts).toHaveLength(1);

    useMarketStore.getState().dismissTriggeredAlert('alert-1');
    expect(useMarketStore.getState().triggeredAlerts).toHaveLength(0);
  });
});
