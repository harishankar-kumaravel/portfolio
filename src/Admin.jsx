import React, { useState } from 'react';
import portfolioRaw from './data/portfolio.js?raw';

export default function Admin() {
  const [code, setCode] = useState(portfolioRaw);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('admin_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const envUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'harish2026';

    if (username === envUsername && password === envPassword) {
      setIsLoggedIn(true);
      sessionStorage.setItem('admin_auth', 'true');
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
        {/* Glow circles from the main theme */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#06B6D4] opacity-[0.08] blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#8B5CF6] opacity-[0.08] blur-[80px] pointer-events-none" />

        <div className="w-full max-w-md liquid-glass p-8 rounded-[32px] border border-[#06B6D4]/20 shadow-glow relative z-10">
          <div className="text-center mb-8">
            <span className="inline-block text-[0.72rem] font-extrabold uppercase tracking-[0.25em] text-[#06B6D4] mb-2">
              Security Access
            </span>
            <h1 className="text-3xl font-black text-[#F8FAFC] tracking-tight">Admin Console</h1>
            <p className="mt-2 text-sm text-[#94A3B8]">Enter credentials to customize portfolio data.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#11151C]/60 border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#11151C]/60 border border-[#06B6D4]/20 rounded-xl px-4 py-3 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-3.5 bg-[#06B6D4] text-[#0B0E14] font-extrabold text-sm uppercase tracking-wider rounded-xl hover:bg-[#22d3ee] transition shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              Authenticate
            </button>
          </form>

          <div className="mt-8 text-center text-xs">
            <a href="/" className="text-[#06B6D4]/75 hover:text-[#06B6D4] hover:underline transition">
              ← Back to Portfolio
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#94A3B8] p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-[#06B6D4]/20 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#F8FAFC]">Portfolio Admin Console</h1>
            <p className="mt-2 text-sm">
              Because this is a blazing fast static site, changes are made by editing the data file directly. 
              Edit the content below and click "Download portfolio.js". Overwrite your local <code>src/data/portfolio.js</code> with the downloaded file.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                sessionStorage.removeItem('admin_auth');
                setIsLoggedIn(false);
              }}
              className="px-4 py-3 border border-[#06B6D4]/20 text-[#06B6D4] hover:border-[#06B6D4]/50 hover:bg-[#06B6D4]/5 font-bold rounded-lg transition"
            >
              Logout
            </button>
            <button 
              onClick={handleDownload}
              className="px-6 py-3 bg-[#06B6D4] text-[#0B0E14] font-bold rounded-lg hover:bg-[#22d3ee] transition shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              Download portfolio.js
            </button>
          </div>
        </div>

        <div className="w-full bg-[#11151C] rounded-xl border border-[#06B6D4]/30 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="bg-[#161B22] px-4 py-2 border-b border-[#06B6D4]/30 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-xs font-mono text-[#06B6D4]">src/data/portfolio.js</span>
          </div>
          <textarea 
            className="w-full h-[70vh] bg-transparent p-6 text-sm font-mono text-[#F8FAFC] focus:outline-none resize-none leading-relaxed"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
          />
        </div>
        
        <div className="mt-8 text-center text-xs">
          <a href="/" className="text-[#06B6D4] hover:underline">← Back to Portfolio</a>
        </div>
      </div>
    </div>
  );
}
