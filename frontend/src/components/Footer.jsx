import React from 'react';
import { Heart, Code, Cpu, Database, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-900 bg-slate-950/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Potato-O-Meter 🥔 AI Hackathon Edition</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-500">
            Crafted with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for AI Spud Enthusiasts
          </span>
        </div>

        {/* Right Stack Badges */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
            PyTorch CLIP
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
            FastAPI
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
            Node.js & Express
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
            MongoDB
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
            React + Tailwind
          </span>
        </div>

      </div>
    </footer>
  );
}
