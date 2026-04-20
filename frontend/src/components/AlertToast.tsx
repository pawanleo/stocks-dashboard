import React from 'react';
import { useMarketStore } from '../hooks/useMarketData';
import { Bell, X, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Toast overlay that displays triggered price alerts.
 * Auto-dismisses after 8 seconds.
 */
const AlertToast: React.FC = () => {
  const { triggeredAlerts, dismissTriggeredAlert } = useMarketStore();

  React.useEffect(() => {
    if (triggeredAlerts.length === 0) return;
    // Auto-dismiss each alert after 8 seconds
    const timers = triggeredAlerts.map(a =>
      setTimeout(() => dismissTriggeredAlert(a.id), 8000)
    );
    return () => timers.forEach(clearTimeout);
  }, [triggeredAlerts, dismissTriggeredAlert]);

  if (triggeredAlerts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col space-y-3 max-w-sm">
      {triggeredAlerts.map(alert => (
        <div
          key={alert.id}
          className="bg-surface border border-border rounded-2xl shadow-2xl p-4 flex items-start space-x-3 animate-in slide-in-from-right duration-300"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${alert.direction === 'above' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
            <Bell size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-text text-sm">
              Alert Triggered — {alert.symbol}
            </p>
            <div className="flex items-center space-x-1 mt-1 text-xs text-textMuted">
              {alert.direction === 'above' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>
                Price crossed {alert.direction} ${alert.targetPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <button
            onClick={() => dismissTriggeredAlert(alert.id)}
            className="text-textMuted hover:text-text transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AlertToast;
