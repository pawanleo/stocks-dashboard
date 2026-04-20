import React from 'react';
import { ExternalLink, TrendingUp, AlertTriangle } from 'lucide-react';

interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timeAgo: string;
  type: 'neutral' | 'bullish' | 'bearish';
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    headline: 'Federal Reserve Signals Potential Rate Cuts Later This Year Amid Easing Inflation',
    source: 'Bloomberg',
    timeAgo: '12m ago',
    type: 'bullish'
  },
  {
    id: '2',
    headline: 'Major Tech Stocks Surge Following Breakthrough AI Announcements',
    source: 'Reuters',
    timeAgo: '45m ago',
    type: 'bullish'
  },
  {
    id: '3',
    headline: 'Global Supply Chain Disruptions Strike EV Manufacturing Sectors',
    source: 'Wall Street Journal',
    timeAgo: '2h ago',
    type: 'bearish'
  },
  {
    id: '4',
    headline: 'SEC Approves Three New Semiconductor Tracking ETFs',
    source: 'CNBC',
    timeAgo: '3h ago',
    type: 'neutral'
  },
  {
    id: '5',
    headline: 'Crypto Markets Face High Volatility Following Offshore Exchange Liquidations',
    source: 'CoinDesk',
    timeAgo: '4h ago',
    type: 'bearish'
  }
];

const NewsPanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-surfaceHighlight/50 rounded-3xl border border-border p-6 shadow-sm overflow-hidden transition-colors duration-300">
      <div className="mb-6 flex justify-between items-center pb-4 border-b border-border">
        <h3 className="text-xl font-bold text-text">Market News</h3>
        <span className="text-xs bg-primary/20 text-primary font-bold px-2 py-1 rounded-full uppercase tracking-widest">
          Live
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
        {mockNews.map((news) => (
          <div 
            key={news.id} 
            className="group cursor-pointer p-4 bg-surface rounded-2xl border border-border hover:border-text/20 hover:shadow-md transition-all block relative"
          >
            <div className="flex items-center space-x-2 mb-2">
              {news.type === 'bullish' && <TrendingUp size={14} className="text-success" />}
              {news.type === 'bearish' && <AlertTriangle size={14} className="text-danger" />}
              <span className="text-xs font-semibold text-textMuted">{news.source} • {news.timeAgo}</span>
            </div>
            <h4 className="text-sm font-bold text-text leading-snug group-hover:text-primary transition-colors pr-4">
              {news.headline}
            </h4>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink size={14} className="text-primary" />
            </div>
          </div>
        ))}

        <div className="mt-6 pt-4 text-center">
           <button className="text-sm font-semibold text-textMuted hover:text-text transition-colors">
             View all reports
           </button>
        </div>
      </div>
    </div>
  );
};

export default NewsPanel;
