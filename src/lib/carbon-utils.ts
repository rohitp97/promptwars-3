import type { SceneState } from '../types';

export function toRelatableUnit(kgCO2: number): string {
  if (kgCO2 <= 0) return 'net-zero impact';
  if (kgCO2 < 1) return `${Math.round(kgCO2 * 60)} minutes of Indian coal grid power`;
  if (kgCO2 < 5) return `${Math.round(kgCO2 / 0.192)} km in a petrol car`;
  if (kgCO2 < 50) return `${Math.ceil(kgCO2 / 1.75)} days for a tree to absorb`;
  if (kgCO2 < 200) return `${Math.round(kgCO2 / 0.82)} kWh of Delhi grid electricity`;
  return `${(kgCO2 / 255).toFixed(1)} Delhi–Mumbai flights equivalent`;
}

export function deriveSceneState(totalKgThisMonth: number): SceneState {
  if (totalKgThisMonth < 50) {
    return {
      skyStart: '#87CEEB', skyEnd: '#B0E0FF',
      sunOpacity: 1, hazeOpacity: 0,
      treeCount: 6, riverColor: '#4FC3F7',
      smokeActive: false, pollutionLevel: 'clear',
      ariaLabel: `Clear sky scene. Your footprint this month is low at ${Math.round(totalKgThisMonth)} kg.`,
    };
  }
  if (totalKgThisMonth < 150) {
    return {
      skyStart: '#B0C4DE', skyEnd: '#9DB7D8',
      sunOpacity: 0.65, hazeOpacity: 0.25,
      treeCount: 4, riverColor: '#78909C',
      smokeActive: false, pollutionLevel: 'hazy',
      ariaLabel: `Hazy sky scene. Your footprint this month is moderate at ${Math.round(totalKgThisMonth)} kg.`,
    };
  }
  if (totalKgThisMonth < 300) {
    return {
      skyStart: '#808080', skyEnd: '#696969',
      sunOpacity: 0.3, hazeOpacity: 0.55,
      treeCount: 2, riverColor: '#546E7A',
      smokeActive: true, pollutionLevel: 'polluted',
      ariaLabel: `Polluted sky scene. Your footprint this month is high at ${Math.round(totalKgThisMonth)} kg.`,
    };
  }
  return {
    skyStart: '#4A4A4A', skyEnd: '#3D3D3D',
    sunOpacity: 0.08, hazeOpacity: 0.85,
    treeCount: 1, riverColor: '#37474F',
    smokeActive: true, pollutionLevel: 'critical',
    ariaLabel: `Critical pollution scene. Your footprint this month is very high at ${Math.round(totalKgThisMonth)} kg.`,
  };
}

export function getMonthlyTotal(entries: Array<{ kgCO2: number; timestamp: number }>): number {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  return entries
    .filter(e => e.timestamp >= monthStart)
    .reduce((sum, e) => sum + e.kgCO2, 0);
}

export function getMonthlySummary(entries: Array<{ kgCO2: number; isWin: boolean; timestamp: number }>) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const thisMonth = entries.filter(e => e.timestamp >= monthStart);
  return {
    totalKg: Math.max(0, thisMonth.reduce((sum, e) => sum + e.kgCO2, 0)),
    decisionCount: thisMonth.length,
    winCount: thisMonth.filter(e => e.isWin).length,
  };
}
