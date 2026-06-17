import React from 'react';

interface ComparisonCardProps {
  label: string;
  icon: string;
  story: string;
  isLowerImpact: boolean;
  impactText: string;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  label,
  icon,
  story,
  isLowerImpact,
  impactText,
}) => {
  return (
    <div
      className={`flex flex-col gap-3.5 p-5 rounded-2xl border transition-all duration-300 w-full ${
        isLowerImpact
          ? 'border-emerald-500 bg-emerald-950/15 shadow-md shadow-emerald-500/5'
          : 'border-border bg-surface/80'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-3xl" role="img" aria-hidden="true">
          {icon}
        </span>
        <div className="text-left">
          <h4 className="text-sm font-bold text-green-50">{label}</h4>
          <span className="text-[10px] font-semibold text-emerald-400">
            = {impactText}
          </span>
        </div>
      </div>

      <p className="text-green-100 text-xs leading-relaxed text-left border-t border-border/40 pt-3">
        {story}
      </p>

      {isLowerImpact && (
        <div className="mt-1.5 self-start text-[9px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950/50 py-0.5 px-2 rounded-full border border-emerald-500/25">
          Better Choice 🌱
        </div>
      )}
    </div>
  );
};
