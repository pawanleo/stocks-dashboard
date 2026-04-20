/**
 * Price Threshold Alert Service
 * 
 * Manages user-defined price alerts. When a ticker crosses
 * a threshold (above or below), the alert fires.
 */

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  direction: 'above' | 'below';
  createdAt: number;
  triggered: boolean;
}

// In-memory store (production would use a DB)
const alerts: PriceAlert[] = [];

let idCounter = 1;

/**
 * Create a new price alert
 */
export const createAlert = (symbol: string, targetPrice: number, direction: 'above' | 'below'): PriceAlert => {
  const alert: PriceAlert = {
    id: `alert-${idCounter++}`,
    symbol: symbol.toUpperCase(),
    targetPrice,
    direction,
    createdAt: Date.now(),
    triggered: false
  };
  alerts.push(alert);
  return alert;
};

/**
 * Delete an alert by ID
 */
export const deleteAlert = (id: string): boolean => {
  const idx = alerts.findIndex(a => a.id === id);
  if (idx === -1) return false;
  alerts.splice(idx, 1);
  return true;
};

/**
 * List all alerts, optionally filtered by symbol
 */
export const listAlerts = (symbol?: string): PriceAlert[] => {
  if (symbol) {
    return alerts.filter(a => a.symbol === symbol.toUpperCase());
  }
  return [...alerts];
};

/**
 * Check current prices against all active (untriggered) alerts.
 * Returns an array of newly triggered alerts.
 */
export const checkAlerts = (currentPrices: Map<string, number>): PriceAlert[] => {
  const triggered: PriceAlert[] = [];

  for (const alert of alerts) {
    if (alert.triggered) continue;

    const currentPrice = currentPrices.get(alert.symbol);
    if (currentPrice === undefined) continue;

    const shouldTrigger =
      (alert.direction === 'above' && currentPrice >= alert.targetPrice) ||
      (alert.direction === 'below' && currentPrice <= alert.targetPrice);

    if (shouldTrigger) {
      alert.triggered = true;
      triggered.push({ ...alert });
    }
  }

  return triggered;
};

/**
 * Reset a triggered alert (allows re-use)
 */
export const resetAlert = (id: string): boolean => {
  const alert = alerts.find(a => a.id === id);
  if (!alert) return false;
  alert.triggered = false;
  return true;
};
