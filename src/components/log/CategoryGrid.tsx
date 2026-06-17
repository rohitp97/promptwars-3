import React from 'react';
import type { DecisionCategory } from '../../types';

interface CategoryGridProps {
  selectedCategory: DecisionCategory | 'win' | null;
  onSelectCategory: (category: DecisionCategory | 'win') => void;
  onSimulateClick: () => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
  onSimulateClick,
}) => {
  const categories: { id: DecisionCategory; label: string; icon: string; bg: string }[] = [
    { id: 'travel', label: 'Travel', icon: '✈️', bg: 'hover:bg-cyan-950/20 hover:border-cyan-500/30' },
    { id: 'food', label: 'Food', icon: '🍔', bg: 'hover:bg-orange-950/20 hover:border-orange-500/30' },
    { id: 'energy', label: 'Energy', icon: '⚡', bg: 'hover:bg-purple-950/20 hover:border-purple-500/30' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️', bg: 'hover:bg-amber-950/20 hover:border-amber-500/30' },
  ];

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="text-center">
        <h2 id="log-sheet-title" className="text-xl font-bold text-green-50">
          What did you do?
        </h2>
        <p className="text-sm text-gray-400 mt-1">Select a category to log your activity</p>
      </div>

      {/* Grid of standard categories */}
      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-200 aspect-square text-center focus-visible:outline-none ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/30 text-emerald-400 font-semibold shadow-lg shadow-emerald-950/20'
                  : 'border-border bg-surface/50 text-gray-300 ' + cat.bg
              }`}
            >
              <span className="text-3xl mb-3" role="img" aria-hidden="true">
                {cat.icon}
              </span>
              <span className="text-sm tracking-wide">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Climate Win full width button */}
      <button
        onClick={() => onSelectCategory('win')}
        className={`w-full flex items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-200 focus-visible:outline-none ${
          selectedCategory === 'win'
            ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 font-semibold shadow-lg'
            : 'border-emerald-500/50 bg-surface/20 text-emerald-400 hover:bg-emerald-950/20 hover:border-emerald-400'
        }`}
      >
        <span className="text-2xl" role="img" aria-hidden="true">
          🏆
        </span>
        <span className="font-semibold text-sm tracking-wider uppercase">Log a Climate Win</span>
      </button>

      {/* Toggle to simulate */}
      <button
        onClick={onSimulateClick}
        className="mt-4 text-center text-xs text-gray-400 hover:text-emerald-400 transition-colors py-2 focus-visible:outline-none"
      >
        Before I Decide... <span className="text-emerald-400">→ Simulate instead</span>
      </button>
    </div>
  );
};
