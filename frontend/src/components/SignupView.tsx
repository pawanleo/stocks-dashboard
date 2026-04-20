import React, { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../hooks/useAuthStore';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const SignupView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/signup`, { email, password });
      
      if (res.data.success) {
        setUser(res.data.data.user);
        navigate('/stocks');
      } else {
        setError(res.data.message || 'Signup failed');
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
          <h2 className="text-xl font-bold mt-6 mb-2 text-text">Create Account</h2>
          <p className="text-textMuted text-sm">Join to start building your portfolio.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
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
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-textMuted text-sm">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-success font-semibold hover:underline">
              Log in
            </button>
          </p>
        </div>
      </div>
      
      <button 
         onClick={() => navigate('/stocks')}
         className="mt-8 text-textMuted hover:text-text font-medium transition-colors"
      >
        ← Return to live markets
      </button>
    </div>
  );
};

export default SignupView;
