import React, { useState, useEffect, useRef } from 'react';
import type { Activity, DecisionCategory } from '../../types';
import { useGemini } from '../../hooks/useGemini';
import { getActivityById } from '../../lib/activities';
import { toRelatableUnit } from '../../lib/carbon-utils';
import { CategoryGrid } from '../log/CategoryGrid';
import { ActivityList } from '../log/ActivityList';
import { ComparisonCard } from './ComparisonCard';

interface SimulateViewProps {
  onLogSimulated: (activityId: string, story: string) => void;
  showToast: (message: string) => void;
  city: string;
}

export const SimulateView: React.FC<SimulateViewProps> = ({
  onLogSimulated,
  showToast,
  city,
}) => {
  const [choiceA, setChoiceA] = useState<Activity | null>(null);
  const [choiceB, setChoiceB] = useState<Activity | null>(null);

  // Picker modal states
  const [activePicker, setActivePicker] = useState<'A' | 'B' | null>(null);
  const [pickerStep, setPickerStep] = useState<1 | 2>(1);
  const [pickerCategory, setPickerCategory] = useState<DecisionCategory | 'win' | null>(null);
  const [pickerSelectedId, setPickerSelectedId] = useState<string | null>(null);

  const pickerPanelRef = useRef<HTMLDivElement>(null);

  const {
    isLoading,
    error,
    result,
    runSimulation,
  } = useGemini();

  // Escape listener for picker
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePicker) {
        setActivePicker(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePicker]);

  // Focus trap for picker panel
  const handlePickerTabTrap = (e: React.KeyboardEvent) => {
    if (!pickerPanelRef.current || e.key !== 'Tab') return;
    const focusables = pickerPanelRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [tabindex="0"], [role="listbox"]'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
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
  };

  // Move focus into picker panel when it opens
  useEffect(() => {
    if (activePicker) {
      const timer = setTimeout(() => {
        if (pickerPanelRef.current) {
          const focusables = pickerPanelRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [tabindex="0"], [role="listbox"]'
          );
          if (focusables.length > 0) focusables[0].focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activePicker]);

  const openPicker = (slot: 'A' | 'B') => {
    setActivePicker(slot);
    setPickerStep(1);
    setPickerCategory(null);
    setPickerSelectedId(null);
  };

  const handleSelectCategory = (cat: DecisionCategory | 'win') => {
    setPickerCategory(cat);
    setPickerStep(2);
  };

  const handleSelectActivity = (actId: string) => {
    setPickerSelectedId(actId);
  };

  const handleConfirmActivitySelection = () => {
    if (pickerSelectedId) {
      const act = getActivityById(pickerSelectedId);
      if (act) {
        if (activePicker === 'A') {
          setChoiceA(act);
        } else {
          setChoiceB(act);
        }
      }
      setActivePicker(null);
    }
  };

  const handleCompare = async () => {
    if (choiceA && choiceB) {
      await runSimulation(choiceA, choiceB, city);
    }
  };

  const handleLog = (slot: 'A' | 'B') => {
    if (!result) return;
    const choice = slot === 'A' ? choiceA : choiceB;
    const story = slot === 'A' ? result.storyA : result.storyB;

    if (choice && story) {
      onLogSimulated(choice.id, story);
      showToast(`Logged choice: ${choice.label}`);
    }
  };

  // Determine which choice is lower impact
  const isALowerImpact = choiceA && choiceB ? choiceA.kgCO2 < choiceB.kgCO2 : false;
  const isBLowerImpact = choiceA && choiceB ? choiceB.kgCO2 < choiceA.kgCO2 : false;
  const areImpactsEqual = choiceA && choiceB ? choiceA.kgCO2 === choiceB.kgCO2 : false;

  return (
    <div className="flex flex-col gap-6 w-full select-none">
      <div className="text-left">
        <h2 className="text-xl font-bold text-green-50">Before I Decide...</h2>
        <p className="text-sm text-gray-400 mt-1">Compare two choices before you commit</p>
      </div>

      {/* Two Wells */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Choice A */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider text-left pl-1">
            Choice A
          </span>
          {choiceA ? (
            <div className="relative border border-border bg-surface/50 rounded-2xl p-5 flex items-center justify-between min-h-[96px]">
              <div className="flex items-center gap-3 pr-8 min-w-0">
                <span className="text-3xl flex-shrink-0" role="img" aria-hidden="true">
                  {choiceA.icon}
                </span>
                <div className="min-w-0 text-left">
                  <p className="text-sm font-bold text-green-50 truncate">
                    {choiceA.label}
                  </p>
                  <p className="text-xs text-emerald-400 font-semibold truncate mt-0.5">
                    = {toRelatableUnit(choiceA.kgCO2)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => openPicker('A')}
                className="absolute top-3 right-4 text-xs font-semibold text-emerald-500 hover:text-emerald-400 py-1 px-2 rounded-lg hover:bg-surface transition-colors focus-visible:outline-none"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              onClick={() => openPicker('A')}
              className="border border-dashed border-gray-700 bg-surface/10 hover:border-emerald-500/50 hover:bg-emerald-950/5 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[96px] focus-visible:outline-none"
            >
              <span className="text-lg text-gray-500 font-bold">+ Pick an option</span>
            </button>
          )}
        </div>

        {/* Choice B */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider text-left pl-1">
            Choice B
          </span>
          {choiceB ? (
            <div className="relative border border-border bg-surface/50 rounded-2xl p-5 flex items-center justify-between min-h-[96px]">
              <div className="flex items-center gap-3 pr-8 min-w-0">
                <span className="text-3xl flex-shrink-0" role="img" aria-hidden="true">
                  {choiceB.icon}
                </span>
                <div className="min-w-0 text-left">
                  <p className="text-sm font-bold text-green-50 truncate">
                    {choiceB.label}
                  </p>
                  <p className="text-xs text-emerald-400 font-semibold truncate mt-0.5">
                    = {toRelatableUnit(choiceB.kgCO2)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => openPicker('B')}
                className="absolute top-3 right-4 text-xs font-semibold text-emerald-500 hover:text-emerald-400 py-1 px-2 rounded-lg hover:bg-surface transition-colors focus-visible:outline-none"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              onClick={() => openPicker('B')}
              className="border border-dashed border-gray-700 bg-surface/10 hover:border-emerald-500/50 hover:bg-emerald-950/5 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[96px] focus-visible:outline-none"
            >
              <span className="text-lg text-gray-500 font-bold">+ Pick an option</span>
            </button>
          )}
        </div>
      </div>

      {/* Compare Button / Loader */}
      <div className="pt-2">
        <button
          onClick={handleCompare}
          disabled={!choiceA || !choiceB || isLoading}
          className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-200 text-sm tracking-wider uppercase focus-visible:outline-none flex items-center justify-center ${
            choiceA && choiceB && !isLoading
              ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/10 active:scale-[0.98]'
              : 'bg-emerald-950/20 text-gray-500 border border-emerald-950/40 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-1.5 py-0.5">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          ) : (
            'Compare Options'
          )}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-5 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-red-400">
            Couldn't compare right now. Check your connection and try again.
          </p>
          <button
            onClick={handleCompare}
            className="py-2 px-4 bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-500/20 rounded-lg text-xs font-bold transition-colors focus-visible:outline-none"
          >
            Retry
          </button>
        </div>
      )}

      {/* Results Section */}
      {result && choiceA && choiceB && (
        <div className="flex flex-col gap-5 border-t border-border/40 pt-6 mt-2">
          {/* Verdict Banner */}
          <div className="bg-emerald-500 text-black rounded-xl p-4 font-bold text-sm text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <span className="leading-snug flex-1">{result.verdict}</span>
            {result.savingKg > 0 && (
              <span className="bg-black text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-500/20 whitespace-nowrap">
                saves {result.savingKg} kg CO₂
              </span>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ComparisonCard
              label={choiceA.label}
              icon={choiceA.icon}
              story={result.storyA}
              isLowerImpact={isALowerImpact || areImpactsEqual}
              impactText={toRelatableUnit(choiceA.kgCO2)}
            />
            <ComparisonCard
              label={choiceB.label}
              icon={choiceB.icon}
              story={result.storyB}
              isLowerImpact={isBLowerImpact || areImpactsEqual}
              impactText={toRelatableUnit(choiceB.kgCO2)}
            />
          </div>

          {/* Log Actions */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={() => handleLog('A')}
              className={`flex-1 py-3.5 px-4 rounded-xl font-bold transition-all text-xs tracking-wider uppercase focus-visible:outline-none border ${
                isALowerImpact || areImpactsEqual
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black border-transparent shadow-lg shadow-emerald-500/10 active:scale-[0.98]'
                  : 'bg-transparent border-border text-gray-300 hover:bg-surface/50'
              }`}
            >
              Log Choice A
            </button>
            <button
              onClick={() => handleLog('B')}
              className={`flex-1 py-3.5 px-4 rounded-xl font-bold transition-all text-xs tracking-wider uppercase focus-visible:outline-none border ${
                isBLowerImpact
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black border-transparent shadow-lg shadow-emerald-500/10 active:scale-[0.98]'
                  : 'bg-transparent border-border text-gray-300 hover:bg-surface/50'
              }`}
            >
              Log Choice B
            </button>
          </div>
        </div>
      )}

      {/* Picker Bottom Sheet Modal */}
      {activePicker && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs"
          onClick={() => setActivePicker(null)}
          onKeyDown={handlePickerTabTrap}
        >
          <div
            ref={pickerPanelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Select an activity for Choice ${activePicker}`}
            onClick={(e) => e.stopPropagation()}
            className="animate-slide-up w-full max-w-lg bg-surface border-t border-border rounded-t-[2.5rem] px-6 pb-8 pt-4 max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl"
          >
            {/* Handle bar */}
            <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto mb-6 flex-shrink-0" aria-hidden="true" />

            <div className="text-center mb-2">
              <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
                Select Option for Choice {activePicker}
              </span>
            </div>

            {pickerStep === 1 && (
              <CategoryGrid
                selectedCategory={pickerCategory}
                onSelectCategory={handleSelectCategory}
                onSimulateClick={() => {}} // Not needed here
              />
            )}

            {pickerStep === 2 && pickerCategory && (
              <ActivityList
                category={pickerCategory}
                selectedActivityId={pickerSelectedId}
                onSelectActivity={handleSelectActivity}
                onBack={() => setPickerStep(1)}
                onNext={handleConfirmActivitySelection}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
