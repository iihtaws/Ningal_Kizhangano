import React, { useEffect, useState } from 'react';
import { Sparkles, Database, Cpu, RefreshCw, Sun, Moon, Zap } from 'lucide-react';
import axios from 'axios';

export default function Navbar({ theme = 'dark', onToggleTheme }) {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/health');
      setHealth(res.data);
    } catch (err) {
      setHealth({ status: 'offline' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 20000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className={`rounded-2xl transition-all duration-300 px-4 sm:px-6 h-16 flex items-center justify-between ${
          isDark 
            ? 'glass-panel-dark border-amber-500/15' 
            : 'glass-panel-light border-slate-200'
        }`}>
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                🥔
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950"></div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Potato-O-Meter
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wider ${
                  isDark 
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  AI Vision
                </span>
              </div>
              <span className={`text-[11px] hidden sm:block ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Visual resemblance intelligence
              </span>
            </div>
          </div>

          {/* Center/Right Info & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* CLIP Engine Indicator */}
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-colors ${
              isDark 
                ? 'bg-slate-900/60 border border-slate-800/80 text-slate-300' 
                : 'bg-slate-100/80 border border-slate-200 text-slate-700'
            }`}>
              <Cpu className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-medium">CLIP ViT-B/32</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>

            {/* DB Indicator */}
            <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-colors ${
              isDark 
                ? 'bg-slate-900/60 border border-slate-800/80 text-slate-300' 
                : 'bg-slate-100/80 border border-slate-200 text-slate-700'
            }`}>
              <Database className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-medium">
                {health?.mongodb === 'connected' ? 'MongoDB' : 'Store Active'}
              </span>
            </div>

            {/* Refresh Status */}
            <button
              onClick={checkHealth}
              disabled={loading}
              title="Refresh connection status"
              className={`p-2 rounded-xl text-xs transition-all ${
                isDark 
                  ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-800/60' 
                  : 'text-slate-500 hover:text-amber-600 hover:bg-slate-100'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-500' : ''}`} />
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme mode"
              className={`p-2 rounded-xl transition-all border ${
                isDark 
                  ? 'bg-slate-900/80 border-slate-800 text-amber-400 hover:bg-slate-800' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
              }`}
            >
              {isDark ? (
                <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
