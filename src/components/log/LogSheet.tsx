import React, { useState, useEffect, useRef } from 'react';
import type { DecisionCategory } from '../../types';
import { getActivityById } from '../../lib/activities';
import { toRelatableUnit } from '../../lib/carbon-utils';
import { CategoryGrid } from './CategoryGrid';
import { ActivityList } from './ActivityList';

interface LogSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onLog: (activityId: string) => void;
  onSimulateClick: () => void;
}

export const LogSheet: React.FC<LogSheetProps> = ({
  isOpen,
  onClose,
  onLog,
  onSimulateClick,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState<DecisionCategory | 'win' | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCategory(null);
      setSelectedActivityId(null);
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus trap setup
      const timer = setTimeout(() => {
        if (panelRef.current) {
          const focusables = panelRef.current.querySelectorAll(
            'button, [tabindex="0"], [role="listbox"]'
          );
          if (focusables.length > 0) {
            (focusables[0] as HTMLElement).focus();
          }
        }
      }, 50);

      return () => clearTimeout(timer);
    } else {
      // Restore focus on close
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap implementation
  const handleTabTrap = (e: React.KeyboardEvent) => {
    if (!panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [tabindex="0"], [role="listbox"]'
    );
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  };

  if (!isOpen) return null;

  const activity = selectedActivityId ? getActivityById(selectedActivityId) : null;
  const relatableUnit = activity ? toRelatableUnit(activity.kgCO2) : '';

  const handleSelectCategory = (cat: DecisionCategory | 'win') => {
    setCategory(cat);
    setStep(2);
  };

  const handleSelectActivity = (actId: string) => {
    setSelectedActivityId(actId);
  };

  const handleConfirmLog = () => {
    if (selectedActivityId) {
      onLog(selectedActivityId);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs select-none"
      onClick={onClose}
      onKeyDown={handleTabTrap}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="log-sheet-title"
        onClick={(e) => e.stopPropagation()}
        className="animate-slide-up w-full max-w-lg bg-surface border-t border-border rounded-t-[2.5rem] px-6 pb-8 pt-4 max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl"
      >
        {/* Handle Bar (decorative drag indicator) */}
        <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto mb-6 flex-shrink-0" />

        {/* Step 1: Category Grid */}
        {step === 1 && (
          <CategoryGrid
            selectedCategory={category}
            onSelectCategory={handleSelectCategory}
            onSimulateClick={() => {
              onSimulateClick();
              onClose();
            }}
          />
        )}

        {/* Step 2: Activity List */}
        {step === 2 && category && (
          <ActivityList
            category={category}
            selectedActivityId={selectedActivityId}
            onSelectActivity={handleSelectActivity}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {/* Step 3: Confirm Log */}
        {step === 3 && activity && (
          <div className="flex flex-col items-center text-center py-6 gap-6">
            <h2 id="log-sheet-title" className="text-xl font-bold text-green-50">
              Confirm Decision
            </h2>

            <div className="flex flex-col items-center gap-2">
              <span className="text-6xl mb-2" role="img" aria-hidden="true">
                {activity.icon}
              </span>
              <h3 className="text-lg font-bold text-green-100">{activity.label}</h3>
              <p className="text-sm text-gray-400">{activity.sublabel}</p>
            </div>

            <div className="w-full bg-base/50 border border-border p-6 rounded-2xl flex flex-col items-center gap-3">
              {activity.isWin ? (
                <>
                  <span className="text-emerald-400 text-3xl font-extrabold">Climate Win 🌿</span>
                  <p className="text-sm text-emerald-300 max-w-xs leading-relaxed mt-1">
                    Every small win adds up. This is one of them.
                  </p>
                </>
              ) : (
                <>
                  <span className="text-2xl font-bold text-red-400">{activity.kgCO2} kg CO₂</span>
                  <div className="text-emerald-400 font-medium text-lg leading-snug">
                    = {relatableUnit}
                  </div>
                  <p className="text-xs text-gray-500 max-w-xs mt-1 leading-relaxed">
                    This represents the approximate carbon consequence of this choice in India.
                  </p>
                </>
              )}
            </div>

            <div className="w-full flex gap-4 mt-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-4 px-6 border border-border rounded-xl font-semibold text-gray-300 hover:bg-surface/50 transition-colors focus-visible:outline-none"
              >
                Back
              </button>
              <button
                onClick={handleConfirmLog}
                className="flex-1 py-4 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/10 active:scale-[0.98] focus-visible:outline-none"
              >
                Log It
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
