import React from 'react';

export default function Footer({ theme = 'dark' }) {
  const isDark = theme === 'dark';

  return (
    <footer className={`mt-16 py-8 border-t transition-colors ${
      isDark ? 'border-slate-800/80 text-slate-500' : 'border-slate-200 text-slate-500'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        
        {/* Left branding */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-500">Potato-O-Meter 🥔</span>
          <span>•</span>
          <span>OpenAI CLIP Zero-Shot Vision Architecture</span>
        </div>

        {/* Tech stack badges */}
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className={`px-2 py-0.5 rounded-md border ${
            isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            PyTorch CLIP ViT-B/32
          </span>
          <span className={`px-2 py-0.5 rounded-md border ${
            isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            FastAPI
          </span>
          <span className={`px-2 py-0.5 rounded-md border ${
            isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            Node.js
          </span>
          <span className={`px-2 py-0.5 rounded-md border ${
            isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            MongoDB
          </span>
          <span className={`px-2 py-0.5 rounded-md border ${
            isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            React + Tailwind
          </span>
        </div>

      </div>
    </footer>
  );
}

