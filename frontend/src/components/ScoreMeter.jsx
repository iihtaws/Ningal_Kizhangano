import React, { useEffect, useState } from 'react';
import { Award, Flame, Sparkles, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ScoreMeter({ analysis }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!analysis) {
      setDisplayScore(0);
      return;
    }

    const targetScore = analysis.score || 0;
    
    // Trigger confetti if high potato score (> 80%)!
    if (targetScore >= 80) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#fbbf24', '#fef3c7']
        });
      } catch (e) {}
    }

    let start = 0;
    const duration = 1200; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = targetScore / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetScore) {
        setDisplayScore(targetScore);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(start * 10) / 10);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [analysis]);

  if (!analysis) {
    return (
      <div className="glass-panel rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center min-h-[420px]">
        <div className="w-20 h-20 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center text-4xl mb-4 animate-float">
          🥔
        </div>
        <h3 className="text-xl font-bold text-slate-200">Awaiting Image Analysis</h3>
        <p className="text-sm text-slate-400 max-w-xs mt-2">
          Upload an image on the left or try one of the instant samples to compute its potato index!
        </p>
      </div>
    );
  }

  const score = analysis.score || 0;
  const breakdown = analysis.breakdown || { earthiness: 0, texture_match: 0, starch_index: 0, roundness_factor: 0 };
  
  // Radial SVG Math
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  const isHighSpud = score >= 65;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
      
      {/* Background glow circle */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${
        isHighSpud ? 'bg-amber-500' : 'bg-slate-700'
      }`}></div>

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Potato Similarity Meter</h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-amber-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            {analysis.engine || 'CLIP ViT-B/32'}
          </span>
        </div>

        {/* Circular Meter Gauge */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 220 220">
              {/* Background ring */}
              <circle
                cx="110"
                cy="110"
                r={radius}
                className="text-slate-800"
                strokeWidth="16"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress ring */}
              <circle
                cx="110"
                cy="110"
                r={radius}
                className={`transition-all duration-700 ease-out ${
                  score >= 70 ? 'text-amber-500' : score >= 40 ? 'text-yellow-400' : 'text-slate-500'
                }`}
                strokeWidth="16"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Inner Percentage Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-black tracking-tight text-amber-400 font-mono">
                {displayScore}%
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                Potato Score
              </span>
            </div>
          </div>

          {/* Rating Title & Badge */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-700/20 border border-amber-500/40 text-amber-300 font-bold text-sm mb-2 shadow-lg">
              {isHighSpud ? <Award className="w-4 h-4 text-amber-400" /> : <ShieldAlert className="w-4 h-4 text-slate-400" />}
              {analysis.ratingTitle}
            </div>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              {analysis.description}
            </p>
          </div>
        </div>

        {/* AI Breakdown Stats */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
            <span>Visual Feature Breakdown</span>
            <span className="text-amber-400 text-[10px] font-normal">CLIP Confidence</span>
          </h4>

          <div className="grid grid-cols-2 gap-4">
            
            {/* Earthiness */}
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Earthiness</span>
                <span className="text-amber-400 font-semibold">{breakdown.earthiness || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${breakdown.earthiness || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Texture Match */}
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Texture Match</span>
                <span className="text-amber-400 font-semibold">{breakdown.texture_match || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${breakdown.texture_match || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Starch Index */}
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Starch Index</span>
                <span className="text-amber-400 font-semibold">{breakdown.starch_index || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${breakdown.starch_index || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Roundness Factor */}
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Roundness Factor</span>
                <span className="text-amber-400 font-semibold">{breakdown.roundness_factor || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${breakdown.roundness_factor || 0}%` }}
                ></div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
