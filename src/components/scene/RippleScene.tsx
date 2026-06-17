import React from 'react';
import type { SceneState } from '../../types';
import { SceneSky } from './SceneSky';
import { SceneCity } from './SceneCity';
import { SceneTrees } from './SceneTrees';
import { ClimateTicker } from './ClimateTicker';

interface RippleSceneProps {
  sceneState: SceneState;
}

export const RippleScene: React.FC<RippleSceneProps> = ({ sceneState }) => {
  const getBadgeStyles = () => {
    switch (sceneState.pollutionLevel) {
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

  const getBadgeLabel = () => {
    switch (sceneState.pollutionLevel) {
      case 'clear':
        return 'Clear Sky';
      case 'hazy':
        return 'Hazy';
      case 'polluted':
        return 'Polluted';
      case 'critical':
        return 'AQI Critical';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="relative w-full aspect-[400/280] rounded-2xl border border-border overflow-hidden bg-base">
      <svg
        viewBox="0 0 400 280"
        className="w-full h-full select-none"
        role="img"
        aria-label={sceneState.ariaLabel}
      >
        {/* Sky */}
        <SceneSky
          skyStart={sceneState.skyStart}
          skyEnd={sceneState.skyEnd}
          sunOpacity={sceneState.sunOpacity}
          hazeOpacity={sceneState.hazeOpacity}
          pollutionLevel={sceneState.pollutionLevel}
        />

        {/* City Skyline */}
        <SceneCity smokeActive={sceneState.smokeActive} />

        {/* Wavy Ground/River */}
        <path
          d="M0 238 Q 100 230, 200 238 T 400 238 L 400 280 L 0 280 Z"
          fill={sceneState.riverColor}
          style={{
            transition: 'fill 2s ease',
          }}
        />

        {/* Trees */}
        <SceneTrees treeCount={sceneState.treeCount} />
      </svg>

      {/* Pollution Level Badge */}
      <div className={`absolute bottom-12 left-4 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border ${getBadgeStyles()} shadow-lg backdrop-blur-sm z-10`}>
        {getBadgeLabel()}
      </div>

      {/* Climate Ticker */}
      <ClimateTicker />
    </div>
  );
};
