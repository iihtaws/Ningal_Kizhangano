import React, { useState } from 'react';
import { History, Trash2, ExternalLink, Calendar, Award, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import axios from 'axios';

export default function HistoryGallery({ history, onHistoryDeleted, onSelectHistoryItem }) {
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this analysis record?')) return;
    try {
      await axios.delete(`/api/history/${id}`);
      if (onHistoryDeleted) onHistoryDeleted();
      if (selectedItem && selectedItem._id === id) setSelectedItem(null);
    } catch (err) {
      alert('Could not delete record.');
    }
  };

  const filteredHistory = history.filter((item) => {
    if (filter === 'potato') return item.score >= 60;
    if (filter === 'imposter') return item.score < 60;
    return true;
  });

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 mt-10 shadow-2xl">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Analysis History Gallery</h2>
            <p className="text-xs text-slate-400">Stored in MongoDB database instance</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({history.length})
          </button>
          <button
            onClick={() => setFilter('potato')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'potato'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🥔 High Spud
          </button>
          <button
            onClick={() => setFilter('imposter')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'imposter'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🚫 Imposters
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredHistory.length === 0 ? (
        <div className="py-12 text-center text-slate-500">
          <p className="text-sm">No analysis history found in this category.</p>
          <p className="text-xs mt-1 text-slate-600">Upload your first image to populate the MongoDB database!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredHistory.map((item) => {
            const isHigh = item.score >= 60;
            return (
              <div
                key={item._id}
                onClick={() => onSelectHistoryItem(item)}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between group border border-slate-800 hover:border-amber-500/40 relative"
              >
                {/* Image Preview Container */}
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                  <img
                    src={item.imageUrl}
                    alt={item.ratingTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback placeholder if relative image is purged
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><text y=".9em" font-size="90">🥔</text></svg>';
                    }}
                  />

                  {/* Score Pill Badge */}
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full font-extrabold text-xs shadow-lg backdrop-blur-md border ${
                    isHigh
                      ? 'bg-amber-500/90 text-slate-950 border-amber-300'
                      : 'bg-slate-900/90 text-slate-300 border-slate-700'
                  }`}>
                    {item.score}% Potato
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDelete(e, item._id)}
                    className="absolute top-3 left-3 p-1.5 rounded-lg bg-slate-900/80 hover:bg-red-500/90 text-slate-400 hover:text-white transition-colors border border-slate-700 hover:border-red-400"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Info Footer */}
                <div className="p-4 bg-slate-900/40 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {item.ratingTitle || 'Potato Analysis'}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                      {item.description || 'CLIP Neural Network prediction.'}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-amber-400/80 font-semibold group-hover:underline flex items-center gap-0.5">
                      Inspect <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
