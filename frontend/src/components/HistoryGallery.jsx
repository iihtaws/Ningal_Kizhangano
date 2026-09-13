import React, { useState } from 'react';
import { History, Trash2, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { getImageUrl } from '../config';

export default function HistoryGallery({ history = [], onHistoryDeleted, onSelectHistoryItem, onViewLeaderboard, theme = 'dark' }) {
  const [filter, setFilter] = useState('all');
  const [isExpanded, setIsExpanded] = useState(true);

  const isDark = theme === 'dark';

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this analysis record?')) return;
    try {
      await axios.delete(`/api/history/${id}`);
      if (onHistoryDeleted) onHistoryDeleted();
    } catch (err) {
      alert('Could not delete record.');
    }
  };

  const filteredHistory = history.filter((item) => {
    if (filter === 'potato') return item.score >= 60;
    if (filter === 'imposter') return item.score < 60;
    return true;
  });

  if (!history || history.length === 0) {
    return null; // Keep interface clean if no history yet
  }

  return (
    <section className={`w-full rounded-3xl p-6 sm:p-7 mt-8 transition-all duration-300 border ${
      isDark ? 'glass-panel-dark' : 'glass-panel-light'
    }`}>
      {/* Header & Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                Recent Analyses
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
              }`}>
                {history.length}
              </span>
            </div>
            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Stored in MongoDB database
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick View Leaderboard Button */}
          {onViewLeaderboard && (
            <button
              type="button"
              onClick={onViewLeaderboard}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm"
              title="View Hall of Fame Leaderboard"
            >
              <span>🏆 Leaderboard</span>
            </button>
          )}

          {/* Filter Pills */}
          <div className={`hidden sm:flex items-center gap-1 p-1 rounded-xl border ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {[
              { id: 'all', label: 'All' },
              { id: 'potato', label: '🥔 Potato' },
              { id: 'imposter', label: 'Non-Potato' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  filter === f.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Toggle Expand */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Toggle history visibility"
            className={`p-1.5 rounded-xl border transition-colors ${
              isDark ? 'border-slate-800 text-slate-400 hover:text-slate-200' : 'border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Grid of History Cards */}
      {isExpanded && (
        <div className="mt-5 pt-4 border-t border-slate-800/50">
          {filteredHistory.length === 0 ? (
            <p className="text-xs text-center py-4 text-slate-500">No items match this filter.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredHistory.map((item) => {
                const isSpud = item.score >= 60;
                return (
                  <div
                    key={item._id}
                    onClick={() => onSelectHistoryItem(item)}
                    className={`rounded-2xl overflow-hidden cursor-pointer group border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                      isDark 
                        ? 'bg-slate-900/50 hover:bg-slate-900 border-slate-800/80 hover:border-amber-500/40' 
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-28 w-full bg-black/40 overflow-hidden flex items-center justify-center">
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.ratingTitle || 'History item'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 100 100"><text y=".9em" font-size="80">🥔</text></svg>';
                        }}
                      />

                      {/* Score Badge */}
                      <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm backdrop-blur-md ${
                        isSpud
                          ? 'bg-amber-500/90 text-slate-950'
                          : isDark ? 'bg-slate-900/90 text-slate-300 border border-slate-700' : 'bg-slate-100/90 text-slate-700 border border-slate-300'
                      }`}>
                        {item.score}%
                      </span>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, item._id)}
                        className="absolute top-2 left-2 p-1 rounded-md bg-black/60 hover:bg-red-600 text-slate-300 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Meta */}
                    <div className="p-2.5">
                      <p className={`text-xs font-semibold truncate ${
                        isDark ? 'text-slate-200 group-hover:text-amber-400' : 'text-slate-800 group-hover:text-amber-700'
                      }`}>
                        {item.filename?.replace(/^potato-/, '') || 'Image'}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" />
                          {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-amber-500 font-medium">Inspect</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

