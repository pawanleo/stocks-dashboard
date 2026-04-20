import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { useMarketStore, createPriceAlert, deletePriceAlert } from '../hooks/useMarketData';
import { ArrowLeft, Sparkles, X, BrainCircuit, Bell, Trash2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const PriceChart: React.FC = () => {
  const [showAIModal, setShowAIModal] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [showAlertForm, setShowAlertForm] = React.useState(false);
  const [alertPrice, setAlertPrice] = React.useState('');
  const [alertDirection, setAlertDirection] = React.useState<'above' | 'below'>('above');

  const handleAIAnalysis = () => {
    setShowAIModal(true);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2500); // mock AI processing time
  };
  const { chartData, tickers, setSelectedSymbol, alerts } = useMarketStore();
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const ticker = symbol ? tickers[symbol] : null;

  // Alerts for current ticker
  const tickerAlerts = alerts.filter(a => a.symbol === symbol);

  // Sync URL param into Zustand so the WebSocket hook fetches chart history
  React.useEffect(() => {
    if (symbol) {
      setSelectedSymbol(symbol);
    }
    return () => setSelectedSymbol('');
  }, [symbol, setSelectedSymbol]);

  const handleCreateAlert = async () => {
    const price = parseFloat(alertPrice);
    if (!symbol || isNaN(price) || price <= 0) return;
    await createPriceAlert(symbol, price, alertDirection);
    setAlertPrice('');
    setShowAlertForm(false);
  };

  if (!ticker || chartData.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-textMuted">
        Loading chart data...
      </div>
    );
  }

  // Calculate min/max for better Y-Axis scaling
  const minPrice = Math.min(...chartData.map(d => d.price));
  const maxPrice = Math.max(...chartData.map(d => d.price));
  const padding = (maxPrice - minPrice) * 0.1;
  const safeMinPrice = Math.max(0, minPrice - padding);
  
  const isPositive = ticker.change >= 0;
  const strokeColor = isPositive ? 'var(--color-success, #00d09c)' : 'var(--color-danger, #ef4444)';

  const formatTime = (time: number) => {
    const date = new Date(time);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col p-8 bg-background transition-colors duration-300 overflow-y-auto">
      <div className="max-w-6xl w-full mx-auto">
        <button 
          onClick={() => navigate('/stocks')}
          className="flex items-center space-x-2 text-textMuted hover:text-text mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Markets</span>
        </button>

        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <div className="w-12 h-12 rounded-full bg-surfaceHighlight flex items-center justify-center font-bold text-xl">
                 {ticker.symbol[0]}
              </div>
              <h2 className="text-4xl font-bold tracking-tight">{ticker.symbol}</h2>
            </div>
            
            <div className="flex items-baseline space-x-4 mt-6">
              <span className="text-5xl font-bold text-text">
                ${ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-xl font-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>
                {isPositive ? '+' : ''}{ticker.change.toFixed(2)} ({ticker.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
             <div className="flex space-x-2 items-center">
                <button 
                  onClick={handleAIAnalysis}
                  className="mr-2 flex items-center space-x-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded font-bold hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all hover:-translate-y-0.5"
                >
                  <Sparkles size={16} />
                  <span>Analyze with AI</span>
                </button>
                <button
                  onClick={() => setShowAlertForm(!showAlertForm)}
                  className="flex items-center space-x-2 bg-surfaceHighlight hover:bg-border text-text px-4 py-2 rounded font-bold transition-all border border-border"
                >
                  <Bell size={16} />
                  <span>Set Alert</span>
                </button>
                <div className="h-6 w-px bg-border mx-2"></div>
                {['1D', '1W', '1M', '3M', '1Y'].map((tf, index) => (
                  <button key={tf} className={`px-4 py-2 text-sm rounded font-medium transition-colors ${index === 0 ? 'bg-surfaceHighlight text-text' : 'bg-transparent text-textMuted hover:bg-surface hover:text-text'}`}>
                    {tf}
                  </button>
                ))}
             </div>
             <div className="flex space-x-3 mt-4">
               <button className="flex-1 bg-success hover:bg-emerald-400 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-success/20">
                 BUY
               </button>
               <button className="flex-1 bg-surfaceHighlight hover:bg-border text-text font-bold py-3 px-8 rounded-xl transition-colors">
                 SELL
               </button>
             </div>
          </div>
        </div>

        {/* Alert Creation Form */}
        {showAlertForm && (
          <div className="mb-6 p-5 bg-surface border border-border rounded-2xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-text flex items-center space-x-2">
                <Bell size={16} className="text-primary" />
                <span>Create Price Alert for {symbol}</span>
              </h3>
              <button onClick={() => setShowAlertForm(false)} className="text-textMuted hover:text-text">
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-textMuted font-medium">Alert me when price goes</span>
              <select
                value={alertDirection}
                onChange={(e) => setAlertDirection(e.target.value as 'above' | 'below')}
                className="bg-surfaceHighlight border border-border rounded-lg py-2 px-3 text-text text-sm font-semibold outline-none focus:border-success transition-colors"
              >
                <option value="above">Above</option>
                <option value="below">Below</option>
              </select>
              <div className="relative">
                <span className="absolute left-3 top-2 text-textMuted">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  placeholder={ticker.price.toFixed(2)}
                  className="bg-surfaceHighlight border border-border rounded-lg py-2 pl-7 pr-3 text-text w-40 outline-none focus:border-success transition-colors text-sm font-semibold"
                />
              </div>
              <button
                onClick={handleCreateAlert}
                disabled={!alertPrice || parseFloat(alertPrice) <= 0}
                className="bg-primary hover:bg-blue-500 text-white font-bold py-2 px-5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              >
                Create Alert
              </button>
            </div>
          </div>
        )}

        {/* Active Alerts for this Ticker */}
        {tickerAlerts.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {tickerAlerts.map(alert => (
              <div 
                key={alert.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold border ${
                  alert.triggered 
                    ? 'bg-success/10 border-success/30 text-success' 
                    : 'bg-surfaceHighlight border-border text-textMuted'
                }`}
              >
                <Bell size={12} />
                <span>{alert.direction === 'above' ? '↑' : '↓'} ${alert.targetPrice.toFixed(2)}</span>
                {alert.triggered && <span className="text-success">✓ Fired</span>}
                <button 
                  onClick={() => deletePriceAlert(alert.id)} 
                  className="hover:text-danger transition-colors ml-1"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="w-full h-[500px] mb-8 relative group">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" opacity={0.5} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTime} 
                stroke="var(--border-subtle)" 
                tick={{ fill: 'var(--color-text-muted)' }}
                minTickGap={30}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={[safeMinPrice, maxPrice + padding]} 
                stroke="var(--border-subtle)" 
                tick={{ fill: 'var(--color-text-muted)' }}
                tickFormatter={(val) => val.toLocaleString()}
                orientation="right"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', borderRadius: '12px', color: 'var(--color-text-main)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: 'var(--color-text-main)', fontWeight: 'bold' }}
                labelFormatter={(label) => formatTime(label as number)}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                cursor={{ stroke: 'var(--color-text-muted)', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <ReferenceLine y={ticker.price - ticker.change} stroke="var(--border-subtle)" strokeDasharray="3 3" />
              {/* Render reference lines for active alerts */}
              {tickerAlerts.filter(a => !a.triggered).map(alert => (
                <ReferenceLine 
                  key={alert.id}
                  y={alert.targetPrice} 
                  stroke={alert.direction === 'above' ? '#22c55e' : '#ef4444'} 
                  strokeDasharray="6 4"
                  strokeWidth={2}
                  label={{ value: `Alert: $${alert.targetPrice}`, fill: alert.direction === 'above' ? '#22c55e' : '#ef4444', fontSize: 11, fontWeight: 'bold' }}
                />
              ))}
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={strokeColor} 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, fill: strokeColor, stroke: 'var(--bg-surface)', strokeWidth: 3 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Mock Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-border pt-8 pb-12">
          <div>
             <p className="text-textMuted text-sm mb-1">Volume</p>
             <p className="text-xl font-bold">{Math.floor(ticker.volume).toLocaleString()}</p>
          </div>
          <div>
             <p className="text-textMuted text-sm mb-1">Market Cap</p>
             <p className="text-xl font-bold">--</p>
          </div>
          <div>
             <p className="text-textMuted text-sm mb-1">Day High</p>
             <p className="text-xl font-bold">${(ticker.price * 1.02).toFixed(2)}</p>
          </div>
          <div>
             <p className="text-textMuted text-sm mb-1">Day Low</p>
             <p className="text-xl font-bold">${(ticker.price * 0.98).toFixed(2)}</p>
          </div>
        </div>

        {/* AI Analysis Modal Overlay */}
        {showAIModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-surface border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b border-border flex justify-between items-center bg-surfaceHighlight">
                <div className="flex items-center space-x-2">
                  <BrainCircuit className="text-purple-500" />
                  <h3 className="font-bold text-text">SleekTrader AI</h3>
                </div>
                <button onClick={() => setShowAIModal(false)} className="text-textMuted hover:text-text">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Sparkles className="animate-spin text-purple-500 mb-4" size={32} />
                    <p className="text-textMuted font-medium animate-pulse">Analyzing {ticker.symbol} chart patterns and order book...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border ${isPositive ? 'bg-success/5 border-success/20' : 'bg-danger/5 border-danger/20'}`}>
                      <h4 className="font-bold text-lg mb-2 flex items-center space-x-2">
                        <span>Verdict:</span>
                        <span className={isPositive ? 'text-success' : 'text-danger'}>{isPositive ? 'Strong Buy' : 'Hold / Sell'}</span>
                      </h4>
                      <p className="text-text leading-relaxed">
                        Based on the recent volume profile of {Math.floor(ticker.volume).toLocaleString()} and current momentum oscillators, 
                        the artificial intelligence engine detects a <strong>{isPositive ? 'bullish' : 'bearish'} continuation</strong> pattern. 
                        Critical support appears around ${(ticker.price * 0.95).toFixed(2)}.
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowAIModal(false)}
                      className="w-full py-3 rounded-xl bg-surfaceHighlight hover:bg-border text-text font-bold transition-colors mt-4"
                    >
                      Understood
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PriceChart;
