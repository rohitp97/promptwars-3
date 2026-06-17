import React from 'react';
import type { JournalEntry } from '../../types';

interface StoryCardProps {
  entry: JournalEntry;
}

const getRelativeTime = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const secs = Math.floor(diff / 1000);
  const mins = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  }
  if (hours > 0) {
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  }
  if (mins > 0) {
    if (mins === 1) return '1 minute ago';
    return `${mins} minutes ago`;
  }
  return 'Just now';
};

const getBorderColor = (category: string): string => {
  switch (category) {
    case 'travel':
      return 'border-l-cyan-500';
    case 'food':
      return 'border-l-orange-500';
    case 'energy':
      return 'border-l-purple-500';
    case 'shopping':
      return 'border-l-amber-500';
    default:
      return 'border-l-emerald-500';
  }
};

export const StoryCard: React.FC<StoryCardProps> = ({ entry }) => {
  const hasStory = entry.story !== null;

  return (
    <div
      className={`animate-card-fade-in w-full bg-surface border border-border/70 rounded-2xl p-5 border-l-[4px] ${getBorderColor(
        entry.category
      )} transition-all duration-200 shadow-md shadow-black/20 flex flex-col gap-3.5`}
    >

      {/* Header Row */}
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">
            {entry.icon}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-green-50 truncate leading-snug">
              {entry.activityLabel}
            </h3>
            <span className="text-[10px] text-gray-500 block mt-0.5">
              {getRelativeTime(entry.timestamp)}
            </span>
          </div>
        </div>

        {entry.isWin && (
          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950/40 rounded-full border border-emerald-500/20 flex-shrink-0">
            Climate Win 🌿
          </span>
        )}
      </div>

      {/* Relatable Impact Row */}
      {!entry.isWin && (
        <div className="text-xs font-semibold text-emerald-400/90 leading-tight">
          = {entry.relatableUnit}
        </div>
      )}

      {/* Story Section */}
      <div className="border-t border-border/40 pt-3 mt-0.5">
        {!hasStory ? (
          /* Skeleton Loader */
          <div
            className="space-y-2 py-1"
            role="alert"
            aria-busy="true"
            aria-label="Generating your climate story"
          >
            <div className="h-3 bg-gray-700/40 rounded-full w-full animate-pulse" />
            <div className="h-3 bg-gray-700/40 rounded-full w-[95%] animate-pulse" />
            <div className="h-3 bg-gray-700/40 rounded-full w-[80%] animate-pulse" />
          </div>
        ) : (
          /* Real Story */
          <p
            className="text-green-100 text-sm leading-relaxed text-left font-normal"
            aria-live="polite"
          >
            {entry.story}
          </p>
        )}
      </div>
    </div>
  );
};
