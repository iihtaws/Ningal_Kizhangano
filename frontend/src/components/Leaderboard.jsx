import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Crown,
  Flame,
  Search,
  ArrowUpDown,
  Filter,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Eye,
  Heart,
  Calendar,
  Layers,
  ChevronRight,
  X,
  Award,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Skull
} from 'lucide-react';
import axios from 'axios';
import { getImageUrl } from '../config';

export default function Leaderboard({ theme = 'dark', onInspectItem, onSwitchToScanner }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState('highest'); // 'highest' | 'lowest' | 'recent'
  const [filterType, setFilterType] = useState('all'); // 'all' | 'potato' | 'imposter'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInspectItem, setSelectedInspectItem] = useState(null);
  const [cheeringId, setCheeringId] = useState(null);

  const isDark = theme === 'dark';

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/leaderboard', {
        params: {
          sort: sortType,
          filter: filterType,
          search: searchTerm,
          limit: 100
        }
      });
      if (res.data && res.data.success) {
        setLeaderboard(res.data.leaderboard || []);
        setStats(res.data.stats || null);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLeaderboard();
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [sortType, filterType, searchTerm]);

  const handleCheer = async (e, id) => {
    e.stopPropagation();
    setCheeringId(id);
    try {
      const res = await axios.post(`/api/leaderboard/${id}/cheer`);
      if (res.data && res.data.success) {
        setLeaderboard((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, cheers: res.data.cheers } : item
          )
        );
      }
    } catch (err) {
      console.warn('Could not cheer:', err);
    } finally {
      setTimeout(() => setCheeringId(null), 600);
    }
  };

  // Top 3 for Podium (only when sort is highest and search is empty)
  const showPodium = sortType === 'highest' && filterType === 'all' && !searchTerm && leaderboard.length >= 3;
  const podiumTop3 = showPodium ? [leaderboard[1], leaderboard[0], leaderboard[2]] : []; // [Silver, Gold, Bronze]

  return (
    <div className="w-full space-y-8 animate-intro-fade-in pb-16">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto select-none pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border bg-amber-500/10 text-amber-400 border-amber-500/25 shadow-sm">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>Hall of Potato Greatness</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
          <span className={`bg-clip-text text-transparent ${
            isDark
              ? 'bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500'
              : 'bg-gradient-to-r from-slate-900 via-amber-700 to-amber-500'
          }`}>
            POTATO-NESS LEADERBOARD
          </span>
        </h1>

        <p className={`mt-2.5 text-xs sm:text-sm max-w-lg mx-auto ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Real neural CLIP rankings of checked people, objects, and snacks by their certified potato affinity.
        </p>
      </div>

      {/* Stats Quick Cards Banner */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className={`p-4 rounded-2xl border transition-all ${
            isDark ? 'glass-panel-dark' : 'glass-panel-light'
          }`}>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Total Checked
            </span>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {stats.totalAnalyzed}
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            isDark ? 'glass-panel-dark' : 'glass-panel-light'
          }`}>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Top Potato Score
            </span>
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-2xl font-black text-amber-400">
                {stats.highestScore}%
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            isDark ? 'glass-panel-dark' : 'glass-panel-light'
          }`}>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Average Starch
            </span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-400" />
              <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {stats.averageScore}%
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border transition-all ${
            isDark ? 'glass-panel-dark' : 'glass-panel-light'
          }`}>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Chief Imposter
            </span>
            <div className="flex items-center gap-2">
              <Skull className="w-4 h-4 text-slate-400" />
              <span className="text-2xl font-black text-slate-400">
                {stats.lowestScore}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Hall of Fame Podium */}
      {showPodium && (
        <div className="max-w-4xl mx-auto my-4 pt-2">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500/90">
              ⚡ TOP PODIUM STANDINGS ⚡
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-end">
            
            {/* 2nd Place: Silver (Left) */}
            {podiumTop3[0] && (
              <div
                onClick={() => setSelectedInspectItem(podiumTop3[0])}
                className={`order-2 sm:order-1 rounded-3xl p-5 border cursor-pointer group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                  isDark ? 'glass-panel-dark border-slate-400/30 hover:border-slate-300' : 'glass-panel-light border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-300/20 text-slate-300 font-black text-xs border border-slate-300/30">
                    <span>🥈 2nd Place</span>
                  </div>
                  <span className="text-xl font-black text-slate-300 font-mono">
                    {podiumTop3[0].score}%
                  </span>
                </div>

                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/40 mb-3 border border-slate-500/20">
                  <img
                    src={getImageUrl(podiumTop3[0].imageUrl)}
                    alt={podiumTop3[0].userName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 100 100"><text y=".9em" font-size="80">🥔</text></svg>';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-bold text-white truncate drop-shadow-md">
                      {podiumTop3[0].userName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 truncate">
                    {podiumTop3[0].badge || 'SPUD'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCheer(e, podiumTop3[0]._id)}
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300"
                  >
                    <span>🥔</span>
                    <span>{podiumTop3[0].cheers || 0}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 1st Place: Gold Spud Champion (Center - Elevated) */}
            {podiumTop3[1] && (
              <div
                onClick={() => setSelectedInspectItem(podiumTop3[1])}
                className={`order-1 sm:order-2 rounded-3xl p-6 border-2 cursor-pointer group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden ${
                  isDark
                    ? 'glass-panel-dark border-amber-500/60 shadow-[0_0_40px_-10px_rgba(245,158,11,0.35)]'
                    : 'glass-panel-light border-amber-400 shadow-[0_0_35px_-10px_rgba(245,158,11,0.25)]'
                }`}
              >
                {/* Gold Glow Top Strip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-24 bg-amber-500/30 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-md">
                    <Crown className="w-3.5 h-3.5 fill-current" />
                    <span>1st • POTATO KING</span>
                  </div>
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {podiumTop3[1].score}%
                  </span>
                </div>

                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/40 mb-3 border-2 border-amber-500/40 shadow-inner">
                  <img
                    src={getImageUrl(podiumTop3[1].imageUrl)}
                    alt={podiumTop3[1].userName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 100 100"><text y=".9em" font-size="80">🥔</text></svg>';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-3.5">
                    <span className="text-sm font-extrabold text-white truncate drop-shadow-md">
                      {podiumTop3[1].userName}
                    </span>
                    <span className="text-[11px] text-amber-300 font-medium">
                      {podiumTop3[1].ratingTitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                    {podiumTop3[1].badge || 'PURE SPUD'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCheer(e, podiumTop3[1]._id)}
                    className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 px-2 py-1 rounded-lg bg-amber-500/10"
                  >
                    <span className="animate-bounce">🥔</span>
                    <span>{podiumTop3[1].cheers || 0} Cheers</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3rd Place: Bronze (Right) */}
            {podiumTop3[2] && (
              <div
                onClick={() => setSelectedInspectItem(podiumTop3[2])}
                className={`order-3 sm:order-3 rounded-3xl p-5 border cursor-pointer group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                  isDark ? 'glass-panel-dark border-amber-700/40 hover:border-amber-600' : 'glass-panel-light border-amber-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-700/20 text-amber-300 font-black text-xs border border-amber-700/30">
                    <span>🥉 3rd Place</span>
                  </div>
                  <span className="text-xl font-black text-amber-500 font-mono">
                    {podiumTop3[2].score}%
                  </span>
                </div>

                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/40 mb-3 border border-amber-700/20">
                  <img
                    src={getImageUrl(podiumTop3[2].imageUrl)}
                    alt={podiumTop3[2].userName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 100 100"><text y=".9em" font-size="80">🥔</text></svg>';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-bold text-white truncate drop-shadow-md">
                      {podiumTop3[2].userName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 truncate">
                    {podiumTop3[2].badge || 'SPUD'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCheer(e, podiumTop3[2]._id)}
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300"
                  >
                    <span>🥔</span>
                    <span>{podiumTop3[2].cheers || 0}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Main Leaderboard Control Toolbar */}
      <div className={`rounded-3xl p-4 sm:p-5 border transition-all ${
        isDark ? 'glass-panel-dark' : 'glass-panel-light'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Sort Switcher Tabs */}
          <div className={`flex items-center gap-1 p-1 rounded-2xl border w-full md:w-auto ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => setSortType('highest')}
              className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                sortType === 'highest'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Top Spuds</span>
            </button>

            <button
              type="button"
              onClick={() => setSortType('lowest')}
              className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                sortType === 'lowest'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Skull className="w-3.5 h-3.5" />
              <span>Biggest Imposters</span>
            </button>

            <button
              type="button"
              onClick={() => setSortType('recent')}
              className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                sortType === 'recent'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Most Recent</span>
            </button>
          </div>

          {/* Search Box & Category Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs outline-none border transition-all ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800 text-white placeholder-slate-500 focus:border-amber-500/50'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500'
                }`}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className={`flex items-center gap-1 p-1 rounded-xl border ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              {[
                { id: 'all', label: 'All' },
                { id: 'potato', label: '🥔 ≥60%' },
                { id: 'imposter', label: '🚫 <60%' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterType(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    filterType === f.id
                      ? 'bg-amber-500 text-slate-950'
                      : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchLeaderboard}
              title="Refresh Leaderboard"
              className={`p-2 rounded-xl border transition-colors ${
                isDark ? 'border-slate-800 text-slate-400 hover:text-amber-400' : 'border-slate-200 text-slate-600 hover:text-amber-600'
              }`}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-500' : ''}`} />
            </button>
          </div>

        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className={`rounded-3xl border overflow-hidden transition-all ${
        isDark ? 'glass-panel-dark' : 'glass-panel-light'
      }`}>
        
        {/* Table Header */}
        <div className={`hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider border-b select-none ${
          isDark ? 'bg-slate-950/40 border-slate-800/80 text-slate-400' : 'bg-slate-100/70 border-slate-200 text-slate-600'
        }`}>
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-2">Image</div>
          <div className="col-span-4">Subject & Verdict</div>
          <div className="col-span-3">Potato Affinity</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Sparkles className="w-6 h-6 text-amber-500 animate-spin mb-3" />
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Tabulating potato-ness rankings...
            </span>
          </div>
        )}

        {/* Empty State */}
        {!loading && leaderboard.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <span className="text-4xl mb-3">🥔</span>
            <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              No potato records found
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mt-1 mb-4">
              Be the first to check an image and claim the #1 spot on the leaderboard!
            </p>
            {onSwitchToScanner && (
              <button
                type="button"
                onClick={onSwitchToScanner}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 shadow-md"
              >
                Scan Now
              </button>
            )}
          </div>
        )}

        {/* List of Entries */}
        {!loading && (
          <div className="divide-y divide-slate-800/40">
            {leaderboard.map((item, idx) => {
              const isSpud = item.score >= 60;
              const isTopRank = item.rank === 1;
              const isSecondRank = item.rank === 2;
              const isThirdRank = item.rank === 3;

              return (
                <div
                  key={item._id}
                  onClick={() => setSelectedInspectItem(item)}
                  className={`grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center px-4 sm:px-6 py-4 cursor-pointer transition-colors group ${
                    isDark ? 'hover:bg-slate-900/60' : 'hover:bg-slate-50'
                  }`}
                >
                  
                  {/* Rank Column */}
                  <div className="sm:col-span-1 flex items-center justify-between sm:justify-center">
                    <div className="flex items-center gap-2">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-sm ${
                        isTopRank
                          ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-amber-500/30'
                          : isSecondRank
                          ? 'bg-slate-300 text-slate-950'
                          : isThirdRank
                          ? 'bg-amber-700 text-amber-100'
                          : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isTopRank ? '👑' : `#${item.rank}`}
                      </span>
                      <span className="sm:hidden text-xs font-bold text-slate-400">
                        Rank #{item.rank}
                      </span>
                    </div>

                    {/* Mobile Score Display */}
                    <span className="sm:hidden font-mono font-black text-sm text-amber-400">
                      {item.score}%
                    </span>
                  </div>

                  {/* Uploaded Image Thumbnail Column */}
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <div className="relative w-16 h-16 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-black/50 border border-slate-700/60 flex-shrink-0 group-hover:border-amber-500/50 shadow-md">
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.userName || 'Subject'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 100 100"><text y=".9em" font-size="80">🥔</text></svg>';
                        }}
                      />
                    </div>
                    {/* Mobile title preview */}
                    <div className="sm:hidden flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {item.userName || 'Spud Subject'}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {item.ratingTitle}
                      </p>
                    </div>
                  </div>

                  {/* Subject Name & Rating Title */}
                  <div className="hidden sm:block sm:col-span-4 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                        isDark ? 'text-slate-100 group-hover:text-amber-400' : 'text-slate-900 group-hover:text-amber-700'
                      }`}>
                        {item.userName || 'Anonymous Spud'}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                        isSpud
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {item.badge || 'SPUD'}
                      </span>
                    </div>

                    <p className={`text-[11px] truncate mt-0.5 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {item.ratingTitle}
                    </p>
                  </div>

                  {/* Potato Affinity Percentage & Progress Bar */}
                  <div className="hidden sm:block sm:col-span-3">
                    <div className="flex items-center justify-between text-xs mb-1 font-mono font-bold">
                      <span className={isSpud ? 'text-amber-400' : 'text-slate-400'}>
                        {item.score}% Match
                      </span>
                      <span className="text-[10px] text-slate-500 font-sans">
                        {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div className={`w-full rounded-full h-2 overflow-hidden ${
                      isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}>
                      <div
                        className={`h-2 rounded-full transition-all duration-700 ${
                          item.score >= 80
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                            : item.score >= 50
                            ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                            : 'bg-gradient-to-r from-slate-600 to-slate-400'
                        }`}
                        style={{ width: `${Math.max(4, item.score)}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="sm:col-span-2 flex items-center justify-end gap-2">
                    {/* Cheer Button */}
                    <button
                      type="button"
                      onClick={(e) => handleCheer(e, item._id)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                        cheeringId === item._id
                          ? 'scale-110 bg-amber-500 text-slate-950 border-amber-400'
                          : isDark
                          ? 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-amber-500/40'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-amber-300'
                      }`}
                      title="Cheer for this spud!"
                    >
                      <span className={cheeringId === item._id ? 'animate-spin' : ''}>🥔</span>
                      <span>{item.cheers || 0}</span>
                    </button>

                    {/* Inspect Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInspectItem(item);
                      }}
                      className={`p-1.5 rounded-xl border transition-colors ${
                        isDark
                          ? 'border-slate-800 text-slate-400 hover:text-amber-400 hover:border-slate-700'
                          : 'border-slate-200 text-slate-500 hover:text-amber-600 hover:border-slate-300'
                      }`}
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Floating CTA to check a new item */}
      {onSwitchToScanner && (
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={onSwitchToScanner}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-transform"
          >
            <span>🥔 Check Another Potato Candidate</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Full Inspection Modal */}
      {selectedInspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-intro-fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 border shadow-2xl relative max-h-[90vh] overflow-y-auto ${
              isDark ? 'glass-panel-dark border-amber-500/30' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            {/* Modal Close */}
            <button
              type="button"
              onClick={() => setSelectedInspectItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-extrabold border border-amber-500/30">
                Rank #{selectedInspectItem.rank}
              </span>
              <h3 className={`text-base font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {selectedInspectItem.userName || 'Spud Subject'}
              </h3>
            </div>

            {/* Uploaded Image Preview */}
            <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-amber-500/20 max-h-[280px] flex items-center justify-center mb-4 shadow-xl">
              <img
                src={getImageUrl(selectedInspectItem.imageUrl)}
                alt={selectedInspectItem.userName}
                className="max-h-[280px] w-auto object-contain"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 100 100"><text y=".9em" font-size="80">🥔</text></svg>';
                }}
              />
              <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-400 font-mono font-black text-sm border border-amber-500/40">
                {selectedInspectItem.score}% Potato
              </span>
            </div>

            {/* Verdict */}
            <div className={`p-4 rounded-2xl border mb-4 ${
              isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-500">
                  {selectedInspectItem.ratingTitle}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold">
                  {selectedInspectItem.badge || 'SPUD'}
                </span>
              </div>
              {selectedInspectItem.description && (
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  {selectedInspectItem.description}
                </p>
              )}
            </div>

            {/* Neural Feature Breakdown */}
            {selectedInspectItem.breakdown && (
              <div className="space-y-2 mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  CLIP Feature Breakdown
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedInspectItem.breakdown.earthiness !== undefined && (
                    <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-400">Earthiness</span>
                        <span className="font-bold text-amber-500">{selectedInspectItem.breakdown.earthiness}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-600 h-full rounded-full" style={{ width: `${selectedInspectItem.breakdown.earthiness}%` }} />
                      </div>
                    </div>
                  )}

                  {selectedInspectItem.breakdown.texture_match !== undefined && (
                    <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-400">Texture</span>
                        <span className="font-bold text-amber-500">{selectedInspectItem.breakdown.texture_match}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${selectedInspectItem.breakdown.texture_match}%` }} />
                      </div>
                    </div>
                  )}

                  {selectedInspectItem.breakdown.starch_index !== undefined && (
                    <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-400">Starch Index</span>
                        <span className="font-bold text-yellow-500">{selectedInspectItem.breakdown.starch_index}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${selectedInspectItem.breakdown.starch_index}%` }} />
                      </div>
                    </div>
                  )}

                  {selectedInspectItem.breakdown.roundness_factor !== undefined && (
                    <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-400">Roundness</span>
                        <span className="font-bold text-amber-400">{selectedInspectItem.breakdown.roundness_factor}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${selectedInspectItem.breakdown.roundness_factor}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer Actions in modal */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-500">
                Engine: {selectedInspectItem.engine || 'CLIP ViT-B/32'}
              </span>
              <div className="flex items-center gap-2">
                {onInspectItem && (
                  <button
                    type="button"
                    onClick={() => {
                      onInspectItem(selectedInspectItem);
                      setSelectedInspectItem(null);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                      isDark
                        ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-400'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-500" />
                    <span>Open in Resemblance Meter</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => handleCheer(e, selectedInspectItem._id)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-transform shadow-md"
                >
                  <span>🥔 Cheer ({selectedInspectItem.cheers || 0})</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
