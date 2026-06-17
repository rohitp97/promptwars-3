import React from 'react';
import type { ScenePollutionLevel } from '../../types';

interface SceneSkyProps {
  skyStart: string;
  skyEnd: string;
  sunOpacity: number;
  hazeOpacity: number;
  pollutionLevel: ScenePollutionLevel;
}

export const SceneSky: React.FC<SceneSkyProps> = ({
  skyStart,
  skyEnd,
  sunOpacity,
  hazeOpacity,
  pollutionLevel,
}) => {
  const isPolluted = pollutionLevel === 'polluted' || pollutionLevel === 'critical';

  return (
    <g>

      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={skyStart} />
          <stop offset="100%" stopColor={skyEnd} />
        </linearGradient>
      </defs>

      {/* Sky Background */}
      <rect x="0" y="0" width="400" height="280" fill="url(#skyGrad)" />

      {/* Sun */}
      <circle cx="320" cy="60" r="35" fill="#FDB813" opacity={sunOpacity} style={{ transition: 'opacity 1s ease' }} />

      {/* Haze Overlay */}
      <rect x="0" y="0" width="400" height="280" fill="rgba(180, 160, 120, 1)" opacity={hazeOpacity} style={{ transition: 'opacity 1s ease' }} />

      {/* Floating Haze Particles */}
      {isPolluted && (
        <g opacity="0.6">
          <circle className="haze-particle" cx="60" cy="120" r="4" fill="#8B7355" />
          <circle className="haze-particle" cx="120" cy="90" r="3" fill="#8B7355" />
          <circle className="haze-particle" cx="180" cy="140" r="5" fill="#8B7355" />
          <circle className="haze-particle" cx="240" cy="70" r="3.5" fill="#8B7355" />
          <circle className="haze-particle" cx="290" cy="110" r="6" fill="#8B7355" />
          <circle className="haze-particle" cx="90" cy="60" r="4" fill="#8B7355" />
          <circle className="haze-particle" cx="150" cy="110" r="3" fill="#8B7355" />
          <circle className="haze-particle" cx="350" cy="130" r="4.5" fill="#8B7355" />
        </g>
      )}
    </g>
  );
};
