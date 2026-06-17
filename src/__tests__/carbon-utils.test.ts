import { describe, it, expect } from 'vitest';
import {
  toRelatableUnit,
  deriveSceneState,
  getMonthlyTotal,
  getMonthlySummary,
} from '../lib/carbon-utils';

describe('carbon-utils', () => {
  describe('toRelatableUnit', () => {
    it('should return "net-zero impact" for 0 or negative values', () => {
      expect(toRelatableUnit(0)).toBe('net-zero impact');
      expect(toRelatableUnit(-1)).toBe('net-zero impact');
    });

    it('should return coal grid minutes for < 1 kg CO2', () => {
      expect(toRelatableUnit(0.5)).toBe('30 minutes of Indian coal grid power');
    });

    it('should return km in petrol car for < 5 kg CO2', () => {
      expect(toRelatableUnit(3)).toBe('16 km in a petrol car'); // Math.round(3 / 0.192) = 16
    });

    it('should return tree absorption days for < 50 kg CO2', () => {
      expect(toRelatableUnit(20)).toBe('12 days for a tree to absorb'); // Math.ceil(20 / 1.75) = 12
    });

    it('should return Delhi grid electricity kWh for < 200 kg CO2', () => {
      expect(toRelatableUnit(100)).toBe('122 kWh of Delhi grid electricity'); // Math.round(100 / 0.82) = 122
    });

    it('should return flight equivalent for >= 200 kg CO2', () => {
      expect(toRelatableUnit(500)).toBe('2.0 Delhi–Mumbai flights equivalent'); // (500 / 255).toFixed(1) = 2.0
    });
  });

  describe('deriveSceneState', () => {
    it('should derive correct clear state', () => {
      const state = deriveSceneState(0);
      expect(state.pollutionLevel).toBe('clear');
      expect(state.treeCount).toBe(6);
      expect(state.smokeActive).toBe(false);
      expect(state.ariaLabel).toContain('0 kg');
    });

    it('should derive correct clear boundary state', () => {
      const state = deriveSceneState(49);
      expect(state.pollutionLevel).toBe('clear');
    });

    it('should derive correct hazy state', () => {
      const state = deriveSceneState(50);
      expect(state.pollutionLevel).toBe('hazy');
      expect(state.treeCount).toBe(4);
      expect(state.smokeActive).toBe(false);
      expect(state.ariaLabel).toContain('50 kg');
    });

    it('should derive correct hazy boundary state', () => {
      const state = deriveSceneState(149);
      expect(state.pollutionLevel).toBe('hazy');
    });

    it('should derive correct polluted state', () => {
      const state = deriveSceneState(150);
      expect(state.pollutionLevel).toBe('polluted');
      expect(state.treeCount).toBe(2);
      expect(state.smokeActive).toBe(true);
      expect(state.ariaLabel).toContain('150 kg');
    });

    it('should derive correct polluted boundary state', () => {
      const state = deriveSceneState(299);
      expect(state.pollutionLevel).toBe('polluted');
    });

    it('should derive correct critical state', () => {
      const state = deriveSceneState(300);
      expect(state.pollutionLevel).toBe('critical');
      expect(state.treeCount).toBe(1);
      expect(state.smokeActive).toBe(true);
      expect(state.ariaLabel).toContain('300 kg');
    });
  });

  describe('getMonthlyTotal', () => {
    it('should return 0 for an empty array', () => {
      expect(getMonthlyTotal([])).toBe(0);
    });

    it('should sum entries from the current month and exclude past months', () => {
      const now = new Date();
      const thisMonthTimestamp = now.getTime();
      const lastMonthTimestamp = new Date(now.getFullYear(), now.getMonth() - 1, 15).getTime();

      const entries = [
        { kgCO2: 10, timestamp: thisMonthTimestamp },
        { kgCO2: 25, timestamp: thisMonthTimestamp },
        { kgCO2: 100, timestamp: lastMonthTimestamp }, // excluded
      ];

      expect(getMonthlyTotal(entries)).toBe(35);
    });

    it('should reduce the total for win entries (negative kgCO2)', () => {
      const thisMonthTimestamp = Date.now();
      const entries = [
        { kgCO2: 10, timestamp: thisMonthTimestamp },
        { kgCO2: -2.5, timestamp: thisMonthTimestamp }, // win
      ];
      expect(getMonthlyTotal(entries)).toBe(7.5);
    });
  });

  describe('getMonthlySummary', () => {
    it('should return correct summary stats', () => {
      const now = new Date();
      const thisMonthTimestamp = now.getTime();
      const lastMonthTimestamp = new Date(now.getFullYear(), now.getMonth() - 1, 15).getTime();

      const entries = [
        { kgCO2: 10, isWin: false, timestamp: thisMonthTimestamp },
        { kgCO2: -2.5, isWin: true, timestamp: thisMonthTimestamp },
        { kgCO2: 100, isWin: false, timestamp: lastMonthTimestamp }, // excluded
      ];

      const summary = getMonthlySummary(entries);
      expect(summary.decisionCount).toBe(2);
      expect(summary.winCount).toBe(1);
      expect(summary.totalKg).toBe(7.5);
    });

    it('should guarantee totalKg never goes below 0', () => {
      const thisMonthTimestamp = Date.now();
      const entries = [
        { kgCO2: -10, isWin: true, timestamp: thisMonthTimestamp },
      ];
      const summary = getMonthlySummary(entries);
      expect(summary.totalKg).toBe(0);
    });
  });
});
