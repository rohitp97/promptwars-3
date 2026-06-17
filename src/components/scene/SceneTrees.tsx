import React from 'react';

interface SceneTreesProps {
  treeCount: number;
}

export const SceneTrees: React.FC<SceneTreesProps> = ({ treeCount }) => {
  const positions = [30, 75, 140, 250, 320, 375];

  return (
    <g>
      {positions.map((x, index) => {
        const isAlive = index < treeCount;
        return (
          <g
            key={index}
            style={{
              opacity: isAlive ? 1.0 : 0.1,
              transition: 'opacity 1s ease',
            }}
          >
            {/* Trunk */}
            <rect
              x={x - 2}
              y="228"
              width="4"
              height="14"
              fill="#5c4033"
            />
            {/* Canopy */}
            <polygon
              points={`${x},205 ${x - 10},228 ${x + 10},228`}
              fill="#2e7d32"
            />
          </g>
        );
      })}
    </g>
  );
};
