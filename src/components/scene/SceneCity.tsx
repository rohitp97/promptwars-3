import React from 'react';

interface SceneCityProps {
  smokeActive: boolean;
}

export const SceneCity: React.FC<SceneCityProps> = ({ smokeActive }) => {
  return (
    <g>

      {/* Buildings Group (silhouette) */}
      <g fill="#1a1a2e">
        {/* Building 1 */}
        <rect x="0" y="180" width="35" height="60" />
        {/* Building 2 */}
        <rect x="35" y="170" width="40" height="70" />
        {/* Building 3 */}
        <rect x="75" y="195" width="30" height="45" />

        {/* Building 4 (Smokestack Building) */}
        <rect x="105" y="150" width="45" height="90" />
        <rect x="122" y="140" width="11" height="10" />

        {/* Building 5 (Smokestack Building) */}
        <rect x="150" y="160" width="50" height="80" />
        <rect x="170" y="150" width="10" height="10" />

        {/* Building 6 */}
        <rect x="200" y="180" width="35" height="60" />
        {/* Building 7 */}
        <rect x="235" y="165" width="40" height="75" />
        {/* Building 8 */}
        <rect x="275" y="190" width="30" height="50" />
        {/* Building 9 */}
        <rect x="305" y="175" width="45" height="65" />
        {/* Building 10 */}
        <rect x="350" y="185" width="50" height="55" />
      </g>

      {/* Smoke Puffs (Active in high footprint) */}
      {smokeActive && (
        <g fill="#708090" opacity="0.8">
          {/* Smoke from stack 1 (cx=127.5, cy=140) */}
          <ellipse className="smoke-puff smoke-puff-1" cx="127.5" cy="135" rx="8" ry="5" />
          <ellipse className="smoke-puff smoke-puff-2" cx="127.5" cy="135" rx="10" ry="6" />
          
          {/* Smoke from stack 2 (cx=175, cy=150) */}
          <ellipse className="smoke-puff smoke-puff-2" cx="175" cy="145" rx="7" ry="4" />
          <ellipse className="smoke-puff smoke-puff-3" cx="175" cy="145" rx="9" ry="5" />
        </g>
      )}
    </g>
  );
};
