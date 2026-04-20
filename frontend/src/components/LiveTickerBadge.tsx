import React, { useRef, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { TickerData } from '../types';

const LiveTickerBadge: React.FC<{ ticker: TickerData }> = ({ ticker }) => {
  const isPositive = ticker.change >= 0;
  const navigate = useNavigate();
  
  // Flash animation effect
  const prevPriceRef = useRef(ticker.price);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prevPriceRef.current !== ticker.price && flashRef.current) {
      flashRef.current.classList.remove('bg-success/10', 'bg-danger/10');
      
      const flashClass = ticker.price > prevPriceRef.current ? 'bg-success/10' : 'bg-danger/10';
      flashRef.current.classList.add(flashClass);
      
      setTimeout(() => {
        if (flashRef.current) flashRef.current.classList.remove('bg-success/10', 'bg-danger/10');
      }, 600);
      
      prevPriceRef.current = ticker.price;
    }
  }, [ticker.price]);

  return (
    <div 
      ref={flashRef}
      onClick={() => navigate(`/stocks/${ticker.symbol}`)}
      className="p-4 rounded-xl cursor-pointer transition-all duration-300 border border-border bg-surface hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.03)] hover:-translate-y-0.5 group relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
           <div className="w-8 h-8 rounded-full bg-surfaceHighlight flex items-center justify-center font-semibold text-sm">
             {ticker.symbol[0]}
           </div>
           <span className="font-semibold text-base text-text tracking-wide">{ticker.symbol}</span>
        </div>
      </div>
      
      <div className="flex flex-col mt-auto">
        <span className="text-xl font-bold transition-colors duration-300 text-text">
          ${ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <div className={clsx("flex items-center space-x-1 mt-1 text-xs font-semibold", isPositive ? "text-success" : "text-danger")}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{ticker.change > 0 ? '+' : ''}{ticker.change.toFixed(2)}</span>
          <span>({ticker.changePercent.toFixed(2)}%)</span>
        </div>
      </div>
    </div>
  );
}

export default LiveTickerBadge;
