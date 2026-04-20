import React from 'react';
import { useMarketStore } from '../hooks/useMarketData';
import LiveTickerBadge from './LiveTickerBadge';
import NewsPanel from './NewsPanel';
import Footer from './Footer';

const HomeGrid: React.FC = () => {
  const { tickers, searchQuery } = useMarketStore();
  const tickerList = Object.values(tickers);

  // Derive categories
  const sortedByGain = [...tickerList].sort((a, b) => b.changePercent - a.changePercent);
  const topGainers = sortedByGain.slice(0, 3);
  const topLosers = [...sortedByGain].reverse().slice(0, 3);
  const mostActive = [...tickerList].sort((a, b) => b.volume - a.volume).slice(0, 3);

  // Filter for search
  const searchResults = tickerList.filter(t => t.symbol.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Side: Market Grid (Takes up 2/3 of screen) */}
        <div className="xl:col-span-2 pb-8">
          {tickerList.length === 0 ? (
            <div className="text-textMuted text-center mt-20 py-20 border border-dashed border-border rounded-xl">
              Syncing live market data...
            </div>
          ) : searchQuery ? (
            <div className="space-y-4">
               <div className="mb-4 flex justify-between items-end">
                 <h2 className="text-xl font-bold border-b border-border pb-2 inline-block pr-8">
                   Search Results
                 </h2>
               </div>
               {searchResults.length === 0 ? (
                 <div className="text-textMuted text-center py-10 border border-dashed border-border rounded-xl">
                   No markets found matching "{searchQuery}"
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {searchResults.map(ticker => (
                      <LiveTickerBadge key={ticker.symbol} ticker={ticker} />
                   ))}
                 </div>
               )}
            </div>
          ) : (
            <div className="space-y-10">
               {/* Top Gainers Section */}
               <section>
                 <div className="mb-4 flex justify-between items-end">
                   <h2 className="text-xl font-bold border-b border-border pb-2 inline-block pr-8">
                     Top Gainers
                   </h2>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {topGainers.map(ticker => (
                      <LiveTickerBadge key={ticker.symbol} ticker={ticker} />
                   ))}
                 </div>
               </section>

               {/* Top Losers Section */}
               <section>
                 <div className="mb-4 flex justify-between items-end">
                   <h2 className="text-xl font-bold border-b border-border pb-2 inline-block pr-8">
                     Top Losers
                   </h2>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {topLosers.map(ticker => (
                      <LiveTickerBadge key={ticker.symbol} ticker={ticker} />
                   ))}
                 </div>
               </section>

               {/* High Volume / Active */}
               <section>
                 <div className="mb-4 flex justify-between items-end">
                   <h2 className="text-xl font-bold border-b border-border pb-2 inline-block pr-8">
                     Most Bought
                   </h2>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {mostActive.map(ticker => (
                      <LiveTickerBadge key={ticker.symbol} ticker={ticker} />
                   ))}
                 </div>
               </section>
            </div>
          )}
        </div>

        {/* Right Side: News & Analysis Panel (Takes up 1/3 of screen) */}
        <div className="xl:col-span-1 h-[600px] xl:h-[calc(100vh-10rem)] sticky top-0 pb-8">
          <NewsPanel />
        </div>

      </div>
      
      <Footer />
    </div>
  );
};

export default HomeGrid;
