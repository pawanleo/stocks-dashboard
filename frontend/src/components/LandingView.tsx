import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Zap, Shield } from 'lucide-react';
import Footer from './Footer';

const LandingView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col text-text transition-colors duration-300">
      {/* Minimal Navbar */}
      <nav className="border-b border-border bg-surfaceHighlight/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-gradient-to-br from-success to-primary rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-xl ring-2 ring-background border border-white/20">
                S
             </div>
             <span className="text-2xl font-black tracking-tight text-text hidden sm:block">SleekTrader</span>
          </div>
          <div>
            <button 
              onClick={() => navigate('/login')}
              className="text-text font-bold hover:text-primary transition-colors mr-6"
            >
              Log in
            </button>
            <button 
              onClick={() => navigate('/stocks')}
              className="bg-primary hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-full transition-all hover:scale-105 shadow-md"
            >
              Enter Markets
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-32 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-success/10 rounded-full blur-[120px] pointer-events-none"></div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight z-10 max-w-5xl">
          Invest in the <span className="bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">Future.</span>
        </h1>
        <p className="text-xl md:text-2xl text-textMuted max-w-3xl mb-12 z-10 leading-relaxed font-medium">
          Experience lightning-fast order execution and real-time algorithmic market analysis. Your portfolio, entirely transformed.
        </p>

        <button 
          onClick={() => navigate('/stocks')}
          className="group relative z-10 bg-text text-background font-bold text-xl py-5 px-12 rounded-full transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(0,208,156,0.3)] flex items-center space-x-3"
        >
          <span>Explore Live Markets</span>
          <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </button>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mt-32 z-10">
           <div className="bg-surface border border-border p-8 rounded-3xl text-left hover:border-success/50 transition-colors">
              <div className="w-14 h-14 bg-success/10 text-success rounded-2xl flex items-center justify-center mb-6">
                 <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Ultra Fast</h3>
              <p className="text-textMuted leading-relaxed">Direct WebSocket integration means live data flows into your charts with absolute zero latency.</p>
           </div>
           
           <div className="bg-surface border border-border p-8 rounded-3xl text-left hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                 <Activity size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Live Intelligence</h3>
              <p className="text-textMuted leading-relaxed">Built-in AI analytics constantly review order books and candlestick patterns in real-time.</p>
           </div>
           
           <div className="bg-surface border border-border p-8 rounded-3xl text-left hover:border-purple-500/50 transition-colors">
              <div className="w-14 h-14 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
                 <Shield size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Secure Core</h3>
              <p className="text-textMuted leading-relaxed">Containerized microservices ensure complete separation of duties running across secure zones.</p>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingView;
