import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Sparkles, CheckCircle, RefreshCw, Camera, X, RefreshCcw, Scan } from 'lucide-react';

const ANALYSIS_STAGES = [
  'Examining visual features...',
  'Comparing visual embeddings...',
  'Measuring potato resemblance...',
  'Calculating final score...'
];

export default function ImageUploader({
  onAnalyze,
  isAnalyzing,
  selectedFile,
  setSelectedFile,
  previewUrl,
  setPreviewUrl,
  theme = 'dark'
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [analysisStageIdx, setAnalysisStageIdx] = useState(0);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const isDark = theme === 'dark';

  // Cycle analysis stage messages smoothly during real analysis
  useEffect(() => {
    if (!isAnalyzing) {
      setAnalysisStageIdx(0);
      return;
    }

    const interval = setInterval(() => {
      setAnalysisStageIdx((prev) => (prev + 1) % ANALYSIS_STAGES.length);
    }, 1400);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // Camera Management
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Camera access denied or unavailable. Please verify browser permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
        handleFileSelect(file);
        stopCamera();
      }
    }, 'image/jpeg');
  };

  // Generate realistic high-res sample objects for true CLIP inference
  const loadSampleImage = (type) => {
    stopCamera();
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');

    if (type === 'potato') {
      // Background studio fill
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, 480, 480);
      
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.beginPath();
      ctx.ellipse(240, 360, 150, 25, 0, 0, 2 * Math.PI);
      ctx.fill();

      // Potato organic body gradient
      const grad = ctx.createRadialGradient(210, 210, 40, 240, 240, 180);
      grad.addColorStop(0, '#d97706');
      grad.addColorStop(0.5, '#a16207');
      grad.addColorStop(0.85, '#78350f');
      grad.addColorStop(1, '#451a03');
      ctx.fillStyle = grad;
      
      ctx.beginPath();
      ctx.ellipse(240, 240, 165, 115, 0.2, 0, 2 * Math.PI);
      ctx.fill();
      
      // Potato eyes and surface markings
      ctx.fillStyle = '#290f02';
      [
        [180, 190, 8, 4], [280, 180, 9, 5], [320, 260, 7, 4],
        [190, 290, 8, 5], [230, 230, 6, 3], [140, 240, 8, 4],
        [270, 290, 7, 4], [220, 160, 6, 3]
      ].forEach(([x, y, rx, ry]) => {
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0.3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = 'rgba(254, 243, 199, 0.15)';
        ctx.beginPath();
        ctx.arc(x - 2, y - 2, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#290f02';
      });
    } else if (type === 'tomato') {
      // Tomato sample
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, 480, 480);

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.ellipse(240, 380, 140, 22, 0, 0, 2 * Math.PI);
      ctx.fill();

      // Tomato body
      const grad = ctx.createRadialGradient(200, 200, 30, 240, 240, 160);
      grad.addColorStop(0, '#ef4444');
      grad.addColorStop(0.6, '#dc2626');
      grad.addColorStop(0.9, '#991b1b');
      grad.addColorStop(1, '#450a0a');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(240, 245, 135, 0, 2 * Math.PI);
      ctx.fill();

      // Gloss reflection
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.ellipse(190, 180, 32, 16, -Math.PI / 4, 0, 2 * Math.PI);
      ctx.fill();

      // Green calyx & stem
      ctx.fillStyle = '#15803d';
      ctx.fillRect(235, 80, 10, 35);
      [0, 1, 2, 3, 4].forEach((i) => {
        const angle = (i * 2 * Math.PI) / 5;
        ctx.beginPath();
        ctx.moveTo(240, 115);
        ctx.lineTo(240 + Math.cos(angle) * 45, 115 + Math.sin(angle) * 35);
        ctx.lineTo(240 + Math.cos(angle + 0.4) * 20, 115 + Math.sin(angle + 0.4) * 15);
        ctx.fill();
      });
    } else if (type === 'coconut') {
      // Coconut sample
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, 480, 480);

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.ellipse(240, 375, 130, 20, 0, 0, 2 * Math.PI);
      ctx.fill();

      // Coconut fibrous shell
      const grad = ctx.createRadialGradient(210, 210, 30, 240, 240, 160);
      grad.addColorStop(0, '#854d0e');
      grad.addColorStop(0.7, '#593208');
      grad.addColorStop(1, '#2c1503');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(240, 240, 130, 140, 0, 0, 2 * Math.PI);
      ctx.fill();

      // Fibrous hairs
      ctx.strokeStyle = 'rgba(202, 138, 4, 0.35)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 60; i++) {
        const a = Math.random() * 2 * Math.PI;
        const r = 40 + Math.random() * 80;
        ctx.beginPath();
        ctx.moveTo(240 + Math.cos(a) * r, 240 + Math.sin(a) * r);
        ctx.lineTo(240 + Math.cos(a) * (r + 14), 240 + Math.sin(a) * (r + 14));
        ctx.stroke();
      }

      // Three eye spots
      ctx.fillStyle = '#1a0d02';
      [[215, 175], [265, 175], [240, 210]].forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fill();
      });
    } else if (type === 'rock') {
      // Rock sample
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, 480, 480);

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.ellipse(240, 370, 150, 20, 0, 0, 2 * Math.PI);
      ctx.fill();

      // Angular rock polygon
      const grad = ctx.createLinearGradient(120, 120, 360, 360);
      grad.addColorStop(0, '#64748b');
      grad.addColorStop(0.5, '#475569');
      grad.addColorStop(1, '#1e293b');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(150, 310);
      ctx.lineTo(130, 230);
      ctx.lineTo(190, 140);
      ctx.lineTo(290, 130);
      ctx.lineTo(350, 200);
      ctx.lineTo(360, 310);
      ctx.lineTo(260, 350);
      ctx.closePath();
      ctx.fill();

      // Rock facet lines
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(190, 140);
      ctx.lineTo(260, 230);
      ctx.lineTo(350, 200);
      ctx.moveTo(260, 230);
      ctx.lineTo(260, 350);
      ctx.stroke();
    } else if (type === 'shoe') {
      // Sneaker Shoe sample
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, 480, 480);

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.ellipse(240, 360, 170, 18, 0, 0, 2 * Math.PI);
      ctx.fill();

      // Sneaker body
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(100, 320);
      ctx.lineTo(130, 240);
      ctx.lineTo(200, 210);
      ctx.lineTo(260, 210);
      ctx.lineTo(320, 250);
      ctx.lineTo(380, 290);
      ctx.lineTo(380, 320);
      ctx.closePath();
      ctx.fill();

      // White Sole
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(95, 320, 290, 24);

      // Accent stripe
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(160, 300);
      ctx.lineTo(260, 250);
      ctx.stroke();

      // Laces
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      [[210, 220, 240, 235], [225, 235, 255, 250], [240, 250, 270, 265]].forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `${type}_sample.jpg`, { type: 'image/jpeg' });
        handleFileSelect(file);
      }
    }, 'image/jpeg');
  };

  return (
    <div className={`w-full transition-all duration-300 rounded-3xl p-6 sm:p-8 ${
      isDark ? 'glass-panel-dark' : 'glass-panel-light'
    }`}>
      
      {/* Top Header Controls */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl transition-colors ${
            isDark 
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
              : 'bg-amber-100 text-amber-800 border border-amber-200'
          }`}>
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <h2 className={`text-base font-semibold tracking-tight ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              Image Source
            </h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Upload an image or snap a photo
            </p>
          </div>
        </div>

        {/* Live Camera Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => (isCameraActive ? stopCamera() : startCamera())}
            disabled={isAnalyzing}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isCameraActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isCameraActive ? 'Close Camera' : 'Webcam'}</span>
          </button>
        </div>
      </div>

      {/* Camera Alert */}
      {cameraError && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 text-xs flex items-center justify-between">
          <span>{cameraError}</span>
          <button onClick={() => setCameraError(null)} className="text-xs font-bold hover:underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Live Camera Viewfinder */}
      {isCameraActive ? (
        <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 bg-black flex flex-col items-center justify-center min-h-[300px]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-h-[340px] object-cover rounded-2xl"
          />
          <div className="absolute bottom-4 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-amber-500/30 shadow-lg">
            <button
              onClick={capturePhoto}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-transform"
            >
              <Camera className="w-4 h-4" />
              Capture Photo
            </button>
            <button
              onClick={stopCamera}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Drag & Drop Zone or Selected Preview */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !previewUrl && fileInputRef.current?.click()}
          className={`relative rounded-2xl transition-all duration-300 flex flex-col items-center justify-center p-6 text-center min-h-[320px] overflow-hidden ${
            !previewUrl ? 'cursor-pointer' : ''
          } ${
            isDragOver
              ? 'border-2 border-amber-500 bg-amber-500/10 scale-[1.01] shadow-lg shadow-amber-500/15'
              : previewUrl
              ? isDark
                ? 'border border-amber-500/25 bg-slate-900/40'
                : 'border border-amber-400/40 bg-amber-50/20'
              : isDark
              ? 'border-2 border-dashed border-slate-800 hover:border-amber-500/40 bg-slate-900/20 hover:bg-slate-900/40 hover:-translate-y-0.5 hover:shadow-lg'
              : 'border-2 border-dashed border-slate-300 hover:border-amber-500/50 bg-slate-50/60 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />

          {previewUrl ? (
            /* Selected Image Preview State */
            <div className="relative w-full flex flex-col items-center justify-center animate-intro-fade-in">
              <div className="relative max-h-[250px] rounded-xl overflow-hidden shadow-2xl border border-amber-500/30 group">
                <img
                  src={previewUrl}
                  alt="Selected preview"
                  className="max-h-[250px] w-auto object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
                />

                {/* Analysis Laser Scanning & Stage Text */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center overflow-hidden">
                    {/* Laser line */}
                    <div className="w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 animate-scan absolute left-0 glow-scanner" />
                    
                    {/* Stage badge */}
                    <div className="px-4 py-2 rounded-full glass-panel-dark text-amber-300 text-xs font-semibold flex items-center gap-2 border border-amber-500/40 shadow-xl">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                      <span>{ANALYSIS_STAGES[analysisStageIdx]}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Footer Controls */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <span className={`text-xs font-medium flex items-center gap-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="truncate max-w-[180px]">{selectedFile?.name || 'Sample Image Loaded'}</span>
                </span>

                {!isAnalyzing && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                        isDark 
                          ? 'text-slate-400 hover:text-amber-400 bg-slate-800/80 hover:bg-slate-800' 
                          : 'text-slate-600 hover:text-amber-700 bg-slate-200/80 hover:bg-slate-200'
                      }`}
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                        isDark 
                          ? 'text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950/70' 
                          : 'text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100'
                      }`}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Empty Dropzone State */
            <div className="flex flex-col items-center justify-center py-6 px-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 ${
                isDark 
                  ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' 
                  : 'bg-amber-50 border border-amber-200 text-amber-600'
              }`}>
                <ImageIcon className="w-7 h-7" />
              </div>
              <p className={`text-base font-semibold ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}>
                Drop an image here
              </p>
              <p className={`text-xs mt-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                or choose one from your device
              </p>
              <div className="mt-4 px-3 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Supports PNG, JPG, WEBP
              </div>
            </div>
          )}
        </div>
      )}

      {/* "Try a sample" Section (Section 5) */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <span>Try a sample:</span>
          </span>
          <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Real CLIP zero-shot evaluation
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {[
            { type: 'potato', emoji: '🥔', label: 'Potato' },
            { type: 'tomato', emoji: '🍅', label: 'Tomato' },
            { type: 'coconut', emoji: '🥥', label: 'Coconut' },
            { type: 'rock', emoji: '🪨', label: 'Rock' },
            { type: 'shoe', emoji: '👟', label: 'Shoe' },
          ].map((sample) => (
            <button
              key={sample.type}
              type="button"
              onClick={() => loadSampleImage(sample.type)}
              disabled={isAnalyzing}
              className={`py-2 px-1 rounded-xl text-xs font-medium transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1 border ${
                isDark
                  ? 'bg-slate-900/60 hover:bg-amber-950/30 text-slate-300 hover:text-amber-300 border-slate-800/80 hover:border-amber-500/40 shadow-sm'
                  : 'bg-white hover:bg-amber-50/60 text-slate-700 hover:text-amber-800 border-slate-200 hover:border-amber-300 shadow-sm'
              }`}
            >
              <span className="text-base">{sample.emoji}</span>
              <span className="text-[11px] font-medium truncate">{sample.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Action Button (Section 7: MEASURE POTATO-NESS) */}
      <button
        type="button"
        onClick={() => selectedFile && onAnalyze(selectedFile)}
        disabled={!selectedFile || isAnalyzing || isCameraActive}
        className={`w-full mt-6 py-4 px-6 rounded-2xl font-bold text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${
          !selectedFile || isAnalyzing || isCameraActive
            ? isDark
              ? 'bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed'
              : 'bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed'
            : 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-slate-950 shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
        }`}
      >
        {isAnalyzing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            <span>Analyzing Potato Affinity...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>MEASURE POTATO-NESS</span>
          </>
        )}
      </button>

    </div>
  );
}

