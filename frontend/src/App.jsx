import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ImageUploader from './components/ImageUploader';
import ScoreMeter from './components/ScoreMeter';
import HistoryGallery from './components/HistoryGallery';
import Footer from './components/Footer';
import CinematicIntro from './components/CinematicIntro';
import { AlertCircle, RotateCcw, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function App() {
  // 5-second cinematic intro shown only on initial load
  const [showIntro, setShowIntro] = useState(() => {
    // Check if previously viewed in current session to prevent re-trigger on refresh if desired,
    // but allow first-time presentation.
    return !sessionStorage.getItem('potato_intro_shown');
  });

  // Dark / Light Theme
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('potato_theme');
    if (saved) return saved;
    return 'dark';
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [lastFailedFile, setLastFailedFile] = useState(null);

  // Sync theme with <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('potato_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleIntroComplete = () => {
    sessionStorage.setItem('potato_intro_shown', 'true');
    setShowIntro(false);
  };

  // Fetch History from backend MongoDB / Memory Gateway
  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/history');
      if (res.data && res.data.history) {
        setHistory(res.data.history);
      }
    } catch (err) {
      console.warn('Could not load history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Real ML API analysis request
  const handleAnalyze = async (fileToAnalyze) => {
    if (!fileToAnalyze) return;
    setIsAnalyzing(true);
    setErrorMsg(null);
    setLastFailedFile(fileToAnalyze);

    const formData = new FormData();
    formData.append('image', fileToAnalyze);

    try {
      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && response.data.analysis) {
        setCurrentAnalysis(response.data.analysis);
        fetchHistory(); // Refresh history
      } else {
        throw new Error('Invalid response structure from backend gateway.');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      const isMlDown = err.response?.status === 503 || err.code === 'ECONNREFUSED';
      if (isMlDown) {
        setErrorMsg('Potato analysis is temporarily unavailable.');
      } else {
        setErrorMsg('Something went wrong.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset to upload state without page reload or re-running intro
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCurrentAnalysis(null);
    setErrorMsg(null);
  };

  const isDark = theme === 'dark';

  // Determine dynamic ambient background based on state
  const isHighPotatoScore = currentAnalysis && currentAnalysis.score >= 80;
  const ambientClass = isAnalyzing
    ? isDark ? 'ambient-analyzing-dark' : 'ambient-analyzing-light'
    : isHighPotatoScore
    ? isDark ? 'ambient-high-dark' : 'ambient-high-light'
    : isDark ? 'ambient-idle-dark' : 'ambient-idle-light';

  return (
    <div className={`min-h-screen relative flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 ${
      isDark ? 'bg-[#090d16] text-slate-100' : 'bg-[#fafaf9] text-slate-900'
    }`}>
      
      {/* 5-Second Cinematic Splash Screen on first load */}
      {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}

      {/* Dynamic Ambient Background responding to state */}
      <div className={`ambient-bg ${ambientClass}`} />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation Bar */}
        <Navbar theme={theme} onToggleTheme={toggleTheme} />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
          
          {/* Main Hero Header (Section 3) */}
          <div className="text-center max-w-2xl mx-auto mb-10 select-none">
            {/* Subtle organic icon */}
            <div className="inline-flex items-center justify-center mb-3">
              <span className="text-3xl sm:text-4xl animate-float">🥔</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className={`bg-clip-text text-transparent ${
                isDark 
                  ? 'bg-gradient-to-r from-white via-amber-200 to-amber-500' 
                  : 'bg-gradient-to-r from-slate-900 via-amber-800 to-amber-600'
              }`}>
                HOW POTATO IS IT?
              </span>
            </h1>

            <p className={`mt-3 text-sm sm:text-base font-normal max-w-md mx-auto leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Show us anything. We'll measure its potato resemblance.
            </p>
          </div>

          {/* User-friendly Error Alert (Section 20) */}
          {errorMsg && (
            <div className="max-w-xl mx-auto mb-6 p-4 rounded-2xl bg-red-950/70 border border-red-500/30 text-red-200 text-xs flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="font-medium">{errorMsg}</span>
              </div>
              <div className="flex items-center gap-3">
                {lastFailedFile && (
                  <button
                    onClick={() => handleAnalyze(lastFailedFile)}
                    className="font-bold text-amber-400 hover:text-amber-300 underline"
                  >
                    Retry
                  </button>
                )}
                <button
                  onClick={() => setErrorMsg(null)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Workstation Centerpiece Area */}
          {!currentAnalysis ? (
            /* Upload View */
            <div className="max-w-2xl mx-auto">
              <ImageUploader
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                theme={theme}
              />
            </div>
          ) : (
            /* Result View (Section 9: RESULT SCREEN) */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch animate-intro-fade-in">
              
              {/* Left Column: Image Display Card */}
              <div className={`md:col-span-5 rounded-3xl p-6 flex flex-col items-center justify-between border ${
                isDark ? 'glass-panel-dark' : 'glass-panel-light'
              }`}>
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Analyzed Subject
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-medium">
                      Source Image
                    </span>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-amber-500/20 max-h-[300px] flex items-center justify-center group shadow-xl">
                    <img
                      src={currentAnalysis.imageUrl || previewUrl}
                      alt="Analyzed object"
                      className="max-h-[300px] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        if (previewUrl && e.target.src !== previewUrl) {
                          e.target.src = previewUrl;
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="w-full mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className={`truncate max-w-[180px] font-medium ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {currentAnalysis.filename?.replace(/^potato-/, '') || selectedFile?.name || 'Image'}
                  </span>
                  <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Validated via CLIP
                  </span>
                </div>
              </div>

              {/* Right Column: Centerpiece Radial Score Meter */}
              <div className="md:col-span-7 flex">
                <ScoreMeter
                  analysis={currentAnalysis}
                  previewUrl={currentAnalysis.imageUrl || previewUrl}
                  onReset={handleReset}
                  theme={theme}
                />
              </div>

            </div>
          )}

          {/* Recent Analysis History Gallery (Section 14) */}
          <HistoryGallery
            history={history}
            onHistoryDeleted={fetchHistory}
            onSelectHistoryItem={(item) => {
              setCurrentAnalysis(item);
              setPreviewUrl(item.imageUrl);
              window.scrollTo({ top: 100, behavior: 'smooth' });
            }}
            theme={theme}
          />

        </main>

        {/* Footer */}
        <Footer theme={theme} />

      </div>

    </div>
  );
}

