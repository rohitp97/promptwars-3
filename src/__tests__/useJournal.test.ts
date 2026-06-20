import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useJournal } from '../hooks/useJournal';
import type { JournalEntry } from '../types';

describe('useJournal', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty entries when localStorage is empty', () => {
    const { result } = renderHook(() => useJournal('Delhi'));
    expect(result.current.entries).toEqual([]);
  });

  it('adds an entry and updates state immediately', () => {
    const { result } = renderHook(() => useJournal('Delhi'));
    act(() => {
      result.current.addEntry('flight_domestic');
    });
    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].activityLabel).toBe('Domestic flight');
  });

  it('addEntry returns the new entry with id and null story', () => {
    const { result } = renderHook(() => useJournal('Delhi'));
    let entry: JournalEntry;
    act(() => {
      entry = result.current.addEntry('flight_domestic');
    });
    expect(entry!.id).toBeDefined();
    expect(entry!.story).toBeNull();
    expect(entry!.kgCO2).toBeGreaterThan(0);
  });

  it('addEntry sets pre-generated story when provided', () => {
    const { result } = renderHook(() => useJournal('Delhi'));
    let entry: JournalEntry;
    act(() => {
      entry = result.current.addEntry('flight_domestic', 'Pre-generated story text.');
    });
    expect(entry!.story).toBe('Pre-generated story text.');
  });

  it('updateEntry patches only the specified fields', () => {
    const { result } = renderHook(() => useJournal('Delhi'));
    act(() => { result.current.addEntry('flight_domestic'); });
    const id = result.current.entries[0].id;
    act(() => {
      result.current.updateEntry(id, { story: 'Updated story.' });
    });
    expect(result.current.entries[0].story).toBe('Updated story.');
    expect(result.current.entries[0].activityLabel).toBe('Domestic flight');
  });

  it('clearJournal empties the entries array', () => {
    const { result } = renderHook(() => useJournal('Delhi'));
    act(() => { result.current.addEntry('flight_domestic'); });
    expect(result.current.entries).toHaveLength(1);
    act(() => { result.current.clearJournal(); });
    expect(result.current.entries).toHaveLength(0);
  });

  it('summary reflects current month totals', () => {
    const { result } = renderHook(() => useJournal('Delhi'));
    act(() => {
      result.current.addEntry('flight_domestic');
      result.current.addEntry('cycle_walk'); // isWin: true
    });
    expect(result.current.summary.decisionCount).toBe(2);
    expect(result.current.summary.winCount).toBe(1);
  });

  it('uses separate localStorage keys per city', () => {
    const { result: delhi } = renderHook(() => useJournal('Delhi'));
    const { result: mumbai } = renderHook(() => useJournal('Mumbai'));
    act(() => { delhi.current.addEntry('flight_domestic'); });
    expect(delhi.current.entries).toHaveLength(1);
    expect(mumbai.current.entries).toHaveLength(0);
  });

  it('reloads entries from storage when city changes', () => {
    localStorage.setItem(
      'trace_journal_entries_mumbai',
      JSON.stringify([{
        id: 'pre-existing',
        activityId: 'flight_domestic',
        activityLabel: 'Domestic flight',
        category: 'travel',
        icon: '✈️',
        kgCO2: 255,
        relatableUnit: '',
        story: null,
        isWin: false,
        timestamp: Date.now(),
      }])
    );
    const { result, rerender } = renderHook(({ city }) => useJournal(city), {
      initialProps: { city: 'Delhi' },
    });
    expect(result.current.entries).toHaveLength(0);
    rerender({ city: 'Mumbai' });
    expect(result.current.entries).toHaveLength(1);
  });
});
