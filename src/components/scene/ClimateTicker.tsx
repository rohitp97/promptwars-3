import React, { useState, useEffect } from 'react';

const FACTS = [
  "Delhi: 48.8°C recorded May 28, 2024 — hottest day in history",
  "AQI 400+ in Delhi for 3 weeks, November 2024",
  "Gangotri glacier has retreated 22 km since 1780",
  "1,800 Indians die daily from air pollution (Lancet 2019)",
  "Bengaluru lost 79% of its lakes in 44 years",
];

export const ClimateTicker: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % FACTS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/75 py-2 px-4 border-t border-border/30 overflow-hidden flex items-center justify-center h-9 select-none">
      <p
        key={index}
        className="ticker-fade text-xs font-medium text-emerald-400 text-center tracking-wide whitespace-nowrap overflow-hidden text-ellipsis w-full"
      >
        {FACTS[index]}
      </p>
    </div>
  );
};
