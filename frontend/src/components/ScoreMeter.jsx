import React, { useEffect, useState } from 'react';
import { Award, Sparkles, Cpu, RotateCcw, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

// Dynamic Score Interpretation based on the exact user specification
export function getScoreInterpretation(score) {
  const s = Number(score) || 0;
  if (s < 20) return 'Not very potato';
  if (s < 40) return 'Potato-ish';
  if (s < 60) return 'Suspiciously potato';
  if (s < 80) return 'Definitely potato-like';
  if (s < 95) return 'Very potato';
  return 'Extremely potato';
}

export default function ScoreMeter({ analysis, previewUrl, onReset, theme = 'dark' }) {
  const [displayScore, setDisplayScore] = useState(0);

  const isDark = theme === 'dark';
  const targetScore = analysis ? Number(analysis.score) || 0 : 0;

  useEffect(() => {
    if (!analysis) {
      setDisplayScore(0);
      return;
    }

    // Dynamic celebration effect only if score is 95%+ (tasteful and restrained)
    if (targetScore >= 95) {
      try {
        confetti({
          particleCount: 45,
          spread: 55,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#fbbf24', '#fef3c7']
        });
      } catch (e) {}
    }

    let start = 0;
    const duration = 1200; // 1.2s smooth count-up
    const stepTime = 16;
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
  }, [analysis, targetScore]);

  if (!analysis) {
    return (
      <div className={`w-full rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-[380px] transition-all duration-300 ${
        isDark ? 'glass-panel-dark' : 'glass-panel-light'
      }`}>
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl mb-4 animate-float">
          🥔
        </div>
        <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          Awaiting Visual Analysis
        </h3>
        <p className={`text-xs max-w-xs mt-1.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Upload an image on the left or select an instant sample to calculate its visual potato resemblance index.
        </p>
      </div>
    );
  }

  const interpretation = getScoreInterpretation(targetScore);
  const breakdown = analysis.breakdown || {};
  const topMatches = analysis.topMatches || [];

  // Radial SVG calculation
  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  // Dynamic visual styling classes based on score
  const isHighPotato = targetScore >= 80;
  const isMediumPotato = targetScore >= 40 && targetScore < 80;
  const isLowPotato = targetScore < 40;

  const strokeColorClass = isHighPotato 
    ? 'text-amber-500' 
    : isMediumPotato 
    ? 'text-yellow-400' 
    : isDark ? 'text-slate-600' : 'text-slate-400';

  const glowClass = isHighPotato 
    ? 'shadow-[0_0_50px_-10px_rgba(245,158,11,0.35)]' 
    : isMediumPotato 
    ? 'shadow-[0_0_35px_-12px_rgba(245,158,11,0.2)]' 
    : '';

  return (
    <div className={`w-full rounded-3xl p-6 sm:p-8 transition-all duration-500 relative overflow-hidden flex flex-col justify-between ${glowClass} ${
      isDark ? 'glass-panel-dark' : 'glass-panel-light'
    }`}>
      
      {/* Dynamic ambient glow blob inside card */}
      <div
        className={`absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isHighPotato
            ? 'bg-amber-500/20'
            : isMediumPotato
            ? 'bg-yellow-500/10'
            : 'bg-transparent'
        }`}
      />

      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Resemblance Verdict
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                OpenAI CLIP Zero-Shot Neural Measurement
              </p>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border flex items-center gap-1.5 ${
            isDark ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            <Cpu className="w-3 h-3 text-amber-500" />
            <span>{analysis.engine || 'CLIP ViT-B/32'}</span>
          </span>
        </div>

        {/* Centerpiece Radial Meter */}
        <div className="flex flex-col items-center justify-center my-6">
          
          <div className="relative w-52 h-52 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 210 210">
              {/* Background circular track */}
              <circle
                cx="105"
                cy="105"
                r={radius}
                className={isDark ? 'text-slate-800/80' : 'text-slate-200'}
                strokeWidth="14"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated progress ring */}
              <circle
                cx="105"
                cy="105"
                r={radius}
                className={`${strokeColorClass} transition-all duration-700 ease-out`}
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Centered Large Percentage & Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className={`text-5xl sm:text-6xl font-black tracking-tight font-mono transition-colors ${
                isHighPotato 
                  ? 'text-amber-400' 
                  : isMediumPotato 
                  ? 'text-yellow-400' 
                  : isDark ? 'text-slate-200' : 'text-slate-800'
              }`}>
                {displayScore}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                POTATO SIMILARITY
              </span>
            </div>
          </div>

          {/* Dynamic Score Interpretation (Section 10) */}
          <div className="mt-5 text-center flex flex-col items-center">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border transition-all ${
              isHighPotato
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10'
                : isMediumPotato
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                : isDark
                ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}>
              <Award className="w-4 h-4 text-amber-500" />
              <span>{interpretation}</span>
            </div>

            {analysis.description && (
              <p className={`text-xs max-w-sm mt-2 leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {analysis.description}
              </p>
            )}
          </div>
        </div>

        {/* Existing API Breakdown Metrics (Section 12) */}
        {(breakdown.earthiness !== undefined || breakdown.texture_match !== undefined || breakdown.starch_index !== undefined || breakdown.roundness_factor !== undefined) && (
          <div className={`mt-6 pt-5 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Visual Feature Breakdown
              </span>
              <span className="text-[10px] text-amber-500 font-medium">Neural Confidence</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {breakdown.earthiness !== undefined && (
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Earthiness</span>
                    <span className="font-semibold text-amber-500">{breakdown.earthiness}%</span>
                  </div>
                  <div className={`w-full rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div className="bg-amber-600 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${breakdown.earthiness}%` }} />
                  </div>
                </div>
              )}

              {breakdown.texture_match !== undefined && (
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Texture Match</span>
                    <span className="font-semibold text-amber-500">{breakdown.texture_match}%</span>
                  </div>
                  <div className={`w-full rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${breakdown.texture_match}%` }} />
                  </div>
                </div>
              )}

              {breakdown.starch_index !== undefined && (
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Starch Index</span>
                    <span className="font-semibold text-amber-500">{breakdown.starch_index}%</span>
                  </div>
                  <div className={`w-full rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div className="bg-yellow-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${breakdown.starch_index}%` }} />
                  </div>
                </div>
              )}

              {breakdown.roundness_factor !== undefined && (
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Roundness Factor</span>
                    <span className="font-semibold text-amber-500">{breakdown.roundness_factor}%</span>
                  </div>
                  <div className={`w-full rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div className="bg-amber-400 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${breakdown.roundness_factor}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Top Matches if provided by CLIP API */}
        {topMatches && topMatches.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {topMatches.map((m, i) => (
              <span
                key={i}
                className={`text-[11px] px-2.5 py-1 rounded-lg border ${
                  isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {m.label}: <strong className="text-amber-500">{m.confidence}%</strong>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Section 13: ANALYZE ANOTHER Action Button */}
      <button
        type="button"
        onClick={onReset}
        className={`w-full mt-6 py-3.5 px-6 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 border ${
          isDark
            ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-amber-500/40 shadow-md'
            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 hover:border-amber-400 shadow-sm'
        } hover:scale-[1.01] active:scale-[0.99] cursor-pointer`}
      >
        <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
        <span>ANALYZE ANOTHER</span>
      </button>

    </div>
  );
}

