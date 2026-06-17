import React, { useMemo, useRef, useEffect } from 'react';
import type { DecisionCategory } from '../../types';
import { ACTIVITIES } from '../../lib/activities';
import { toRelatableUnit } from '../../lib/carbon-utils';

interface ActivityListProps {
  category: DecisionCategory | 'win';
  selectedActivityId: string | null;
  onSelectActivity: (activityId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  category,
  selectedActivityId,
  onSelectActivity,
  onBack,
  onNext,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  // Filter activities based on category or 'win'
  const filteredActivities = useMemo(() => {
    if (category === 'win') {
      return ACTIVITIES.filter((a) => a.isWin);
    }
    return ACTIVITIES.filter((a) => a.category === category);
  }, [category]);

  const activeIndex = useMemo(() => {
    return filteredActivities.findIndex((a) => a.id === selectedActivityId);
  }, [filteredActivities, selectedActivityId]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredActivities.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (activeIndex + 1) % filteredActivities.length;
      onSelectActivity(filteredActivities[nextIndex].id);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (activeIndex - 1 + filteredActivities.length) % filteredActivities.length;
      onSelectActivity(filteredActivities[prevIndex].id);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedActivityId) {
        onNext();
      }
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedActivityId && listRef.current) {
      const selectedEl = listRef.current.querySelector('[aria-selected="true"]');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedActivityId]);

  const getCategoryTitle = () => {
    if (category === 'win') return 'Climate Wins';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="flex flex-col h-[60vh]" onKeyDown={handleKeyDown}>
      {/* Header with back chevron */}
      <div className="flex items-center gap-4 border-b border-border py-3 px-1">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-green-50 p-2 -ml-2 rounded-lg hover:bg-surface/50 transition-colors focus-visible:outline-none"
          aria-label="Back to categories"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-green-50 capitalize">
          {getCategoryTitle()} Actions
        </h2>
      </div>

      {/* Scrollable listbox */}
      <div
        ref={listRef}
        role="listbox"
        aria-label={`List of ${getCategoryTitle()} activities`}
        tabIndex={0}
        className="flex-1 overflow-y-auto py-4 outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded-lg pr-1"
      >
        <div className="flex flex-col gap-2.5">
          {filteredActivities.map((act) => {
            const isSelected = selectedActivityId === act.id;
            return (
              <div
                key={act.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelectActivity(act.id)}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer select-none transition-all duration-150 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/20 border-l-[4px]'
                    : 'border-border bg-surface/30 hover:bg-surface/60 hover:border-gray-700 border-l-[4px] border-l-transparent'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                  <span className="text-2xl" role="img" aria-hidden="true">
                    {act.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-green-100 truncate">
                      {act.label}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {act.sublabel}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  {act.isWin ? (
                    <span className="px-2.5 py-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 rounded-full border border-emerald-500/25">
                      Win 🌿
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 italic">
                      {toRelatableUnit(act.kgCO2)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pt-4 border-t border-border mt-auto">
        <button
          onClick={onNext}
          disabled={!selectedActivityId}
          className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-200 text-sm tracking-wider uppercase focus-visible:outline-none ${
            selectedActivityId
              ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/10 active:scale-[0.98]'
              : 'bg-emerald-950/20 text-gray-500 border border-emerald-950/40 cursor-not-allowed'
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};
