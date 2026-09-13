import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Sparkles, CheckCircle, RefreshCw, Zap, Camera, X, AlertCircle } from 'lucide-react';

export default function ImageUploader({ onAnalyze, isAnalyzing, selectedFile, setSelectedFile, previewUrl, setPreviewUrl }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Cleanup camera stream on unmount
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
      setCameraError('Camera access denied or device unavailable. Check browser permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
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
        const file = new File([blob], `spud_camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
        handleFileSelect(file);
        stopCamera();
      }
    }, 'image/jpeg');
  };

  // Sample Images Generator
  const loadSampleImage = (type) => {
    stopCamera();
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    if (type === 'potato') {
      const grad = ctx.createRadialGradient(200, 200, 30, 200, 200, 180);
      grad.addColorStop(0, '#d97706');
      grad.addColorStop(0.6, '#92400e');
      grad.addColorStop(1, '#451a03');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(200, 200, 160, 110, Math.PI / 8, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#290f02';
      [
        [140, 160, 6], [220, 150, 8], [270, 220, 5],
        [160, 240, 7], [180, 190, 5], [240, 180, 6]
      ].forEach(([x, y, r]) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
      });
    } else if (type === 'cat') {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(0, 0, 400, 400);
      ctx.fillStyle = '#f87171';
      ctx.beginPath();
      ctx.arc(200, 220, 110, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(110, 150); ctx.lineTo(150, 50); ctx.lineTo(190, 150);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(210, 150); ctx.lineTo(250, 50); ctx.lineTo(290, 150);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(160, 200, 14, 0, 2 * Math.PI); ctx.fill();
      ctx.beginPath(); ctx.arc(240, 200, 14, 0, 2 * Math.PI); ctx.fill();
    } else if (type === 'apple') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 400, 400);
      const grad = ctx.createRadialGradient(200, 200, 20, 200, 200, 160);
      grad.addColorStop(0, '#ef4444');
      grad.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(200, 210, 120, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(220, 75, 30, 12, Math.PI / 4, 0, 2 * Math.PI);
      ctx.fill();
    } else if (type === 'fries') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 400, 400);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(100, 200, 200, 180);
      ctx.fillStyle = '#fbbf24';
      [120, 150, 180, 210, 240, 260].forEach((x, i) => {
        ctx.fillRect(x, 60 + (i % 3) * 20, 22, 160);
      });
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `sample_${type}.jpg`, { type: 'image/jpeg' });
        handleFileSelect(file);
      }
    }, 'image/jpeg');
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Upload or Snap Photo</h2>
            <p className="text-xs text-slate-400">Use your camera or select an image</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Camera Button */}
          <button
            onClick={() => (isCameraActive ? stopCamera() : startCamera())}
            disabled={isAnalyzing}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
              isCameraActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            {isCameraActive ? 'Close Camera' : 'Use Live Camera'}
          </button>

          {previewUrl && !isCameraActive && (
            <button
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              disabled={isAnalyzing}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Camera Error Alert */}
      {cameraError && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{cameraError}</span>
          </div>
          <button onClick={() => setCameraError(null)} className="text-xs font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* Dropzone / Live Camera Viewfinder */}
      {isCameraActive ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/50 bg-slate-950 flex flex-col items-center justify-center min-h-[300px]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-h-[320px] object-cover rounded-2xl"
          />
          <div className="absolute bottom-4 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-amber-500/30">
            <button
              onClick={capturePhoto}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
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
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !previewUrl && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 text-center cursor-pointer min-h-[300px] overflow-hidden ${
            isDragOver
              ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
              : previewUrl
              ? 'border-amber-500/40 bg-slate-900/50'
              : 'border-slate-800 hover:border-amber-500/40 bg-slate-900/30 hover:bg-slate-900/60'
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
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              
              {/* Image Preview */}
              <div className="relative max-h-[260px] rounded-xl overflow-hidden shadow-2xl border border-amber-500/30 group">
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="max-h-[260px] object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
                />

                {/* Scanning laser sweep line when analyzing */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-slate-950/40 overflow-hidden">
                    <div className="w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 animate-scan absolute left-0 glow-scanner"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="px-4 py-2 rounded-full glass-panel text-amber-300 text-xs font-bold animate-pulse flex items-center gap-2 border border-amber-500/40">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                        CLIP Neural Network Scanning...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <p className="mt-3 text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                {selectedFile ? selectedFile.name : 'Sample Image Ready'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Drag & drop your photo here, or <span className="text-amber-400 underline">browse</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, WEBP (Up to 15MB)</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Sample Buttons */}
      <div className="mt-6">
        <p className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Or try 1-click test samples:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => loadSampleImage('potato')}
            disabled={isAnalyzing}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-amber-950/40 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 text-xs font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>🥔</span> Classic Spud
          </button>
          <button
            onClick={() => loadSampleImage('cat')}
            disabled={isAnalyzing}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 text-xs font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>🐱</span> Cute Kitten
          </button>
          <button
            onClick={() => loadSampleImage('apple')}
            disabled={isAnalyzing}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 text-xs font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>🍎</span> Red Apple
          </button>
          <button
            onClick={() => loadSampleImage('fries')}
            disabled={isAnalyzing}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 text-xs font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>🍟</span> French Fries
          </button>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => selectedFile && onAnalyze(selectedFile)}
        disabled={!selectedFile || isAnalyzing || isCameraActive}
        className={`w-full mt-6 py-4 px-6 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
          !selectedFile || isAnalyzing || isCameraActive
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            : 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-slate-950 shadow-amber-600/30 hover:scale-[1.02] active:scale-[0.98]'
        }`}
      >
        {isAnalyzing ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            Analyzing Spud Index...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Evaluate Potato Score
          </>
        )}
      </button>

    </div>
  );
}
