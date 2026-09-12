import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ImageUploader from './components/ImageUploader';
import ScoreMeter from './components/ScoreMeter';
import HistoryGallery from './components/HistoryGallery';
import Footer from './components/Footer';
import { Sparkles, Zap, Info, Flame, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch History from API Gateway
  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/history');
      if (res.data && res.data.history) {
        setHistory(res.data.history);
      }
    } catch (err) {
      console.warn('Could not load analysis history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Handle Analysis Request
  const handleAnalyze = async (fileToAnalyze) => {
    if (!fileToAnalyze) return;
    setIsAnalyzing(true);
    setErrorMsg(null);

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
        fetchHistory(); // Refresh gallery
      } else {
        throw new Error('Invalid response structure from backend gateway.');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMsg(err.response?.data?.error || err.message || 'Failed to complete spud analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      
      <div>
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30 text-amber-300 text-xs font-bold mb-4">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              Powered by Pretrained OpenAI CLIP Zero-Shot Vision Architecture
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-100">
              Is it a <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-600">Potato?</span> 🥔
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-400 font-medium leading-relaxed">
              Upload any image and our CLIP AI neural engine will calculate its visual embedding similarity to a spud with 0-100% precision.
            </p>
          </div>

          {/* Error Alert Banner */}
          {errorMsg && (
            <div className="max-w-4xl mx-auto mb-6 p-4 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={() => setErrorMsg(null)}
                className="text-red-400 font-bold hover:underline ml-4"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Main 2-Column Workstation Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Left: File Upload & Drag-Drop */}
            <ImageUploader
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
            />

            {/* Right: Interactive Potato Meter Gauge & AI Breakdown */}
            <ScoreMeter analysis={currentAnalysis} />

          </div>

          {/* MongoDB History Section */}
          <HistoryGallery
            history={history}
            onHistoryDeleted={fetchHistory}
            onSelectHistoryItem={(item) => {
              setCurrentAnalysis(item);
              setPreviewUrl(item.imageUrl);
              window.scrollTo({ top: 120, behavior: 'smooth' });
            }}
          />

        </main>
      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}
