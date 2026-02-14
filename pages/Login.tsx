
import React, { useState, useEffect } from 'react';
import { Lock, User, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'ifi@1987') {
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg-base transition-colors duration-300 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-lime/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-lime/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 animate-slide-up">
        <Link to="/" className="inline-flex items-center gap-2 text-theme-base/60 hover:text-brand-text transition-colors text-[10px] font-bold uppercase tracking-widest mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="glass-panel p-10 rounded-[3rem] space-y-8 border-theme-base/10 shadow-2xl">
          <div className="text-center space-y-3">
            <div className="inline-flex w-20 h-20 rounded-[2rem] bg-brand-lime items-center justify-center text-black mb-2 shadow-xl shadow-brand-lime/20">
              <Lock className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-theme-base tracking-tighter uppercase leading-none">ADMIN PORTAL</h1>
            <p className="text-brand-text uppercase tracking-[0.3em] text-[9px] font-bold">Secure Verification Required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-theme-base/70 ml-1">Identity</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-input-bg border border-theme-base/10 rounded-2xl px-12 py-4 text-theme-base placeholder:text-theme-base/30 focus:outline-none focus:border-brand-lime transition-all text-sm autofill:bg-input-bg autofill:text-theme-base"
                  placeholder="Enter Username"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-base/50" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-theme-base/70 ml-1">Access Key</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-input-bg border border-theme-base/10 rounded-2xl px-12 py-4 text-theme-base placeholder:text-theme-base/30 focus:outline-none focus:border-brand-lime transition-all text-sm autofill:bg-input-bg autofill:text-theme-base"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-base/50" />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 py-3 rounded-xl">
                <p className="text-red-500 text-[10px] text-center font-black tracking-widest uppercase">{error}</p>
              </div>
            )}

            <button className="w-full py-5 bg-brand-lime text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand-lime/10 text-xs mt-4">
              Authorize Access
            </button>
          </form>

          <p className="text-center text-theme-base/10 text-[8px] uppercase font-black tracking-[0.4em] pt-4">
            Ittefaq Fasteners Industries &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div >
  );
};

export default Login;
