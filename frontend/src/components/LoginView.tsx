import React, { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../hooks/useAuthStore';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const LoginView: React.FC = () => {
  const [email, setEmail] = useState('demo@groww.in');
  const [password, setPassword] = useState('groww123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, { email, password });
      
      if (res.data.success) {
        setUser(res.data.data.user);
        navigate('/stocks');
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Server error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background min-h-screen px-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-surface p-8 sm:p-10 rounded-3xl border border-border shadow-2xl relative overflow-hidden transition-colors duration-300">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-success to-primary inline-block">
            SleekTrader
          </h1>
          <h2 className="text-xl font-bold mt-6 mb-2 text-text">Welcome Back</h2>
          <p className="text-textMuted text-sm">Enter your credentials to access your live dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-text mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surfaceHighlight border border-border rounded-xl py-3 px-4 outline-none text-text focus:border-success transition-colors"
              placeholder="you@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-2">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surfaceHighlight border border-border rounded-xl py-3 px-4 outline-none text-text focus:border-success transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-success hover:bg-emerald-400 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-success/20 mt-6 flex justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-textMuted text-sm">
            Don't have an account?{' '}
            <button onClick={() => navigate('/signup')} className="text-primary font-semibold hover:underline">
              Sign up
            </button>
          </p>
        </div>
      </div>
      
      {/* Back button to just view the dashboard logged out */}
      <button 
         onClick={() => navigate('/stocks')}
         className="mt-8 text-textMuted hover:text-text font-medium transition-colors"
      >
        ← Return to live markets
      </button>
    </div>
  );
};

export default LoginView;
