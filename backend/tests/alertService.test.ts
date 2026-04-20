import { createAlert, deleteAlert, listAlerts, checkAlerts, resetAlert } from '../src/services/alertService';

describe('Alert Service', () => {
  // Clear alerts between tests by deleting all
  beforeEach(() => {
    const all = listAlerts();
    all.forEach(a => deleteAlert(a.id));
  });

  it('should create a new alert', () => {
    const alert = createAlert('AAPL', 200, 'above');
    expect(alert).toHaveProperty('id');
    expect(alert.symbol).toBe('AAPL');
    expect(alert.targetPrice).toBe(200);
    expect(alert.direction).toBe('above');
    expect(alert.triggered).toBe(false);
  });

  it('should list all alerts', () => {
    createAlert('AAPL', 200, 'above');
    createAlert('TSLA', 100, 'below');
    
    const all = listAlerts();
    expect(all).toHaveLength(2);
  });

  it('should filter alerts by symbol', () => {
    createAlert('AAPL', 200, 'above');
    createAlert('TSLA', 100, 'below');
    createAlert('AAPL', 150, 'below');

    const aaplAlerts = listAlerts('AAPL');
    expect(aaplAlerts).toHaveLength(2);
    expect(aaplAlerts.every(a => a.symbol === 'AAPL')).toBe(true);
  });

  it('should delete an alert by id', () => {
    const alert = createAlert('AAPL', 200, 'above');
    expect(listAlerts()).toHaveLength(1);
    
    const deleted = deleteAlert(alert.id);
    expect(deleted).toBe(true);
    expect(listAlerts()).toHaveLength(0);
  });

  it('should return false when deleting non-existent alert', () => {
    const deleted = deleteAlert('non-existent-id');
    expect(deleted).toBe(false);
  });

  it('should trigger alert when price crosses above threshold', () => {
    createAlert('AAPL', 200, 'above');
    
    const prices = new Map<string, number>();
    prices.set('AAPL', 205); // Above 200

    const triggered = checkAlerts(prices);
    expect(triggered).toHaveLength(1);
    expect(triggered[0].symbol).toBe('AAPL');
    expect(triggered[0].triggered).toBe(true);
  });

  it('should trigger alert when price crosses below threshold', () => {
    createAlert('TSLA', 100, 'below');

    const prices = new Map<string, number>();
    prices.set('TSLA', 95); // Below 100

    const triggered = checkAlerts(prices);
    expect(triggered).toHaveLength(1);
    expect(triggered[0].direction).toBe('below');
  });

  it('should NOT trigger alert when price has not crossed threshold', () => {
    createAlert('AAPL', 200, 'above');

    const prices = new Map<string, number>();
    prices.set('AAPL', 195); // Still below 200

    const triggered = checkAlerts(prices);
    expect(triggered).toHaveLength(0);
  });

  it('should NOT re-trigger an already triggered alert', () => {
    createAlert('AAPL', 200, 'above');

    const prices = new Map<string, number>();
    prices.set('AAPL', 210);

    // First check triggers it
    checkAlerts(prices);
    // Second check should NOT trigger again
    const triggered = checkAlerts(prices);
    expect(triggered).toHaveLength(0);
  });

  it('should reset a triggered alert', () => {
    const alert = createAlert('AAPL', 200, 'above');
    const prices = new Map<string, number>();
    prices.set('AAPL', 210);
    checkAlerts(prices); // triggers it

    const reset = resetAlert(alert.id);
    expect(reset).toBe(true);

    // Should trigger again after reset
    const triggered = checkAlerts(prices);
    expect(triggered).toHaveLength(1);
  });

  it('should return false when resetting non-existent alert', () => {
    const reset = resetAlert('non-existent');
    expect(reset).toBe(false);
  });
});
