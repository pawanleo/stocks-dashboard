import { getAvailableTickers, simulateMarketTick, getHistoricalData } from '../src/services/marketData';

describe('Market Data Service', () => {
  it('should initialize with available tickers', () => {
    const tickers = getAvailableTickers();
    expect(tickers.length).toBeGreaterThan(0);
    expect(tickers[0].symbol).toBe('AAPL');
  });

  it('should return historical data for valid ticker', () => {
    const history = getHistoricalData('AAPL', 10);
    expect(history).toHaveLength(11); // 10 points + 1 latest
    expect(history[0]).toHaveProperty('price');
    expect(history[0]).toHaveProperty('timestamp');
  });

  it('should return empty list for invalid ticker historical data', () => {
     const history = getHistoricalData('INVALID', 10);
     expect(history).toHaveLength(0);
  });

  it('should simulate ticks', () => {
    const ticks = simulateMarketTick();
    // Because of random factor (30% chance to update), ticks length could be 0 to N.
    expect(Array.isArray(ticks)).toBe(true);
    if (ticks.length > 0) {
      expect(ticks[0]).toHaveProperty('symbol');
      expect(ticks[0]).toHaveProperty('price');
    }
  });
});
