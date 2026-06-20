import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScene } from '../hooks/useScene';
import type { JournalEntry } from '../types';

const makeEntry = (kgCO2: number): JournalEntry => ({
  id: 'test',
  activityId: 'domestic_flight',
  activityLabel: 'Domestic flight',
  category: 'travel',
  icon: '✈️',
  kgCO2,
  relatableUnit: '',
  story: null,
  isWin: false,
  timestamp: Date.now(),
});

describe('useScene', () => {
  it('returns "clear" when entries is empty', () => {
    const { result } = renderHook(() => useScene([]));
    expect(result.current.pollutionLevel).toBe('clear');
  });

  it('returns "clear" for monthly total below 50 kg', () => {
    const { result } = renderHook(() => useScene([makeEntry(30)]));
    expect(result.current.pollutionLevel).toBe('clear');
  });

  it('returns "hazy" for monthly total between 50 and 149 kg', () => {
    const { result } = renderHook(() => useScene([makeEntry(80)]));
    expect(result.current.pollutionLevel).toBe('hazy');
  });

  it('returns "polluted" for monthly total between 150 and 299 kg', () => {
    const { result } = renderHook(() => useScene([makeEntry(200)]));
    expect(result.current.pollutionLevel).toBe('polluted');
  });

  it('returns "critical" for monthly total at or above 300 kg', () => {
    const { result } = renderHook(() => useScene([makeEntry(255), makeEntry(100)]));
    expect(result.current.pollutionLevel).toBe('critical');
  });

  it('accumulates kg from multiple entries to determine level', () => {
    // 2 × 20 = 40 kg → clear (below 50)
    const entries = [makeEntry(20), makeEntry(20)];
    const { result } = renderHook(() => useScene(entries));
    expect(result.current.pollutionLevel).toBe('clear');

    // 3 × 20 = 60 kg → hazy (50–149)
    const entriesPast50 = [makeEntry(20), makeEntry(20), makeEntry(20)];
    const { result: result2 } = renderHook(() => useScene(entriesPast50));
    expect(result2.current.pollutionLevel).toBe('hazy');
  });

  it('returns a non-empty aria label for screen readers', () => {
    const { result } = renderHook(() => useScene([]));
    expect(typeof result.current.ariaLabel).toBe('string');
    expect(result.current.ariaLabel.length).toBeGreaterThan(0);
  });

  it('disables smoke when pollution is "clear"', () => {
    const { result } = renderHook(() => useScene([]));
    expect(result.current.smokeActive).toBe(false);
  });

  it('enables smoke when pollution is "critical"', () => {
    const { result } = renderHook(() => useScene([makeEntry(350)]));
    expect(result.current.smokeActive).toBe(true);
  });
});
