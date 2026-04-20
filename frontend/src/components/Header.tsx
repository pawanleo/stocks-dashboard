import React from 'react';
import { useMarketStore } from '../hooks/useMarketData';
import { useAuthStore } from '../hooks/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Activity, User as UserIcon } from 'lucide-react';

const Header: React.FC = () => {
  const { isConnected, setSelectedSymbol, searchQuery, setSearchQuery } = useMarketStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-16 px-6 border-b border-border flex justify-between items-center bg-background transition-colors duration-300">
      <div 
        className="flex items-center cursor-pointer"
        onClick={() => setSelectedSymbol('')} // Clear selection to go home
      >
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-success to-primary">
          SleekTrader
        </span>
      </div>

      <div className="flex flex-1 max-w-md mx-8 relative">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for stocks & mutual funds" 
          className="w-full bg-surfaceHighlight border border-border rounded-full py-2 px-4 outline-none text-text focus:border-success transition-colors"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-textMuted hover:text-text cursor-pointer font-bold text-sm"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex items-center space-x-6">
        <div className={`flex items-center space-x-1.5 text-xs font-semibold ${isConnected ? 'text-success' : 'text-danger'}`}>
          <Activity size={16} className={isConnected ? "animate-pulse" : ""} />
          <span className="hidden sm:inline">{isConnected ? "LIVE" : "OFFLINE"}</span>
        </div>

        <div className="h-6 w-px bg-border"></div>

        {user ? (
          <div className="flex items-center space-x-3">
             <div className="flex items-center space-x-2 text-text font-medium cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                   <UserIcon size={16} />
                </div>
                <span className="hidden sm:inline text-sm">{user.name}</span>
             </div>
             <button onClick={logout} className="text-xs text-textMuted hover:text-danger ml-2 transition-colors">
               Log out
             </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
             <button onClick={() => navigate('/login')} className="text-sm font-semibold text-text hover:text-primary transition-colors">
               Login
             </button>
             <button onClick={() => navigate('/signup')} className="text-sm font-semibold bg-primary hover:bg-blue-500 text-white py-1.5 px-4 rounded-full transition-colors hidden sm:block">
               Signup
             </button>
          </div>
        )}

        <div className="h-6 w-px bg-border hidden sm:block"></div>

        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surfaceHighlight transition-colors text-textMuted hover:text-text">
          <span className="hidden dark:block"><Sun size={20} /></span>
          <span className="block dark:hidden"><Moon size={20} /></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
