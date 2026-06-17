import React from 'react';
import type { JournalEntry, ScenePollutionLevel } from '../../types';
import { StoryCard } from './StoryCard';

interface JournalFeedProps {
  entries: JournalEntry[];
  summary: {
    totalKg: number;
    decisionCount: number;
    winCount: number;
  };
  pollutionLevel: ScenePollutionLevel;
  onOpenLogSheet: () => void;
}

export const JournalFeed: React.FC<JournalFeedProps> = ({
  entries,
  summary,
  pollutionLevel,
  onOpenLogSheet,
}) => {
  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  const getPillStyles = () => {
    switch (pollutionLevel) {
      case 'clear':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'hazy':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'polluted':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getPillLabel = () => {
    switch (pollutionLevel) {
      case 'clear':
        return 'Clear Sky';
      case 'hazy':
        return 'Hazy';
      case 'polluted':
        return 'Polluted';
      case 'critical':
        return 'Critical';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Sticky Header Summary Card */}
      <div className="sticky top-0 bg-base/80 backdrop-blur-md py-3 px-1 border-b border-border/40 z-10">
        <div className="bg-surface/60 border border-border/50 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex flex-col gap-1 text-left">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">This Month</span>
            <div className="flex items-center gap-1.5 text-xs text-green-100 font-medium">
              <span><strong className="text-emerald-400 text-sm font-extrabold">{summary.decisionCount}</strong> decisions</span>
              <span className="text-gray-700">•</span>
              <span><strong className="text-emerald-400 text-sm font-extrabold">{summary.winCount}</strong> wins</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Your City's Sky</span>
            <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${getPillStyles()}`}>
              {getPillLabel()}
            </span>
          </div>
        </div>
      </div>

      {/* Main feed body */}
      <div className="flex-1 py-4">
        {sortedEntries.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-6 h-[50vh]">
            <div className="p-5 bg-emerald-950/20 rounded-full border border-emerald-500/10">
              <svg
                className="w-12 h-12 text-emerald-500/60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 0 9.5a7 7 0 0 1-8 8.5Z" />
                <path d="M19 2c-2.26 4.33-5.27 7.14-8 8.5" />
              </svg>
            </div>
            <div className="flex flex-col gap-1.5 max-w-sm">
              <h2 className="text-lg font-bold text-green-50">
                Your climate story starts here
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Every small choice leaves a trace on the real world. Log your first decision to build your narrative.
              </p>
            </div>
            <button
              onClick={onOpenLogSheet}
              className="py-3 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-md shadow-emerald-500/10 active:scale-[0.98] text-sm focus-visible:outline-none"
            >
              Log your first decision
            </button>
          </div>
        ) : (
          /* Feed Entries List */
          <div
            className="flex flex-col gap-4"
            aria-live="polite"
          >
            {sortedEntries.map((entry) => (
              <StoryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
