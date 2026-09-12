import React, { useEffect, useState } from 'react';
import { Sparkles, Database, Cpu, Activity, RefreshCw } from 'lucide-react';
import axios from 'axios';

export default function Navbar() {
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
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-amber-500/20 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-700 via-amber-500 to-yellow-300 flex items-center justify-center text-2xl shadow-lg shadow-amber-600/30 group-hover:scale-105 transition-transform duration-300">
                🥔
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
                  Potato-O-Meter
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  AI v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">CLIP-Powered Visual Spud Evaluator</p>
            </div>
          </div>

          {/* System Status Indicators */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* ML Engine Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">ML Engine:</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                CLIP ViT-B/32
              </span>
            </div>

            {/* DB Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">DB:</span>
              <span className="font-semibold text-amber-300">
                {health?.mongodb === 'connected' ? 'MongoDB Active' : 'Resilient Memory Store'}
              </span>
            </div>

            {/* Health check refresh */}
            <button
              onClick={checkHealth}
              disabled={loading}
              title="Refresh status"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>

          {/* Hackathon Badge */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-700/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              Hackathon Edition
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
