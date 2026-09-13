import React, { useEffect, useState } from 'react';

/**
 * 5-Second Cinematic Splash Screen
 * Exact sentence: "EVERYTHING IN THIS WORLD IS EITHER A POTATO OR A LOOKALIKE OF A POTATO"
 * 
 * 0 - 1.5s: Background fades in, sentence gradually appears
 * 1.5s - 4s: Subtle breathing, organic glow, gentle light movement
 * 4s - 5s: Text gently fades & subtle zoom away, smooth handoff to main app
 */
export default function CinematicIntro({ onComplete }) {
  // phase: 'in' (0-1.5s) -> 'hold' (1.5-4s) -> 'out' (4-5s) -> complete
  const [phase, setPhase] = useState('in');

  useEffect(() => {
    // Transition to hold phase at 1.5s
    const holdTimer = setTimeout(() => {
      setPhase('hold');
    }, 1500);

    // Transition to out phase at 4.0s
    const outTimer = setTimeout(() => {
      setPhase('out');
    }, 4000);

    // Complete intro at 5.0s
    const finishTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 5000);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(outTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05070d] text-slate-100 select-none overflow-hidden transition-opacity duration-1000 ${
        phase === 'out' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Cinematic Introduction"
    >
      {/* Subtle organic ambient light and potato silhouette in background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Subtle breathing glow */}
        <div
          className={`w-[450px] h-[320px] sm:w-[650px] sm:h-[450px] rounded-[48%_52%_55%_45%_/_48%_44%_56%_52%] bg-gradient-to-tr from-amber-900/15 via-amber-600/10 to-yellow-500/10 blur-[80px] transition-all duration-1000 ${
            phase === 'in'
              ? 'scale-90 opacity-0'
              : phase === 'hold'
              ? 'scale-105 opacity-100 animate-intro-breathe'
              : 'scale-125 opacity-0'
          }`}
        />
        {/* Abstract subtle organic silhouette outline */}
        <div
          className={`absolute w-[300px] h-[220px] sm:w-[480px] sm:h-[340px] rounded-[46%_54%_58%_42%_/_44%_48%_52%_56%] border border-amber-500/[0.04] transition-all duration-1000 ${
            phase === 'in'
              ? 'scale-95 opacity-0'
              : phase === 'hold'
              ? 'scale-100 opacity-60'
              : 'scale-110 opacity-0'
          }`}
        />
      </div>

      {/* Main Centered Typography */}
      <div className="relative z-10 max-w-4xl px-8 text-center">
        <h1
          className={`text-xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-slate-100 leading-snug sm:leading-relaxed md:leading-relaxed font-sans transition-all duration-1000 ${
            phase === 'in'
              ? 'opacity-0 translate-y-6 scale-[0.98]'
              : phase === 'hold'
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-4 scale-[1.03]'
          }`}
          style={{ letterSpacing: '0.04em' }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-400">
            EVERYTHING IN THIS WORLD IS EITHER A POTATO OR A LOOKALIKE OF A POTATO
          </span>
        </h1>
      </div>

      {/* Subtle progress indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-[1.5px] bg-slate-800/40 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-600/40 via-amber-400/60 to-yellow-300/40 transition-all ease-linear"
          style={{
            width: phase === 'in' ? '30%' : phase === 'hold' ? '80%' : '100%',
            transitionDuration: phase === 'in' ? '1500ms' : phase === 'hold' ? '2500ms' : '1000ms'
          }}
        />
      </div>
    </div>
  );
}
