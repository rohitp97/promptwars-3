import { useState, useCallback, useMemo, useEffect } from 'react';
import type { JournalEntry } from '../types';
import { getActivityById } from '../lib/activities';
import { toRelatableUnit, getMonthlySummary } from '../lib/carbon-utils';
import * as storage from '../lib/storage';

export function useJournal(city: string) {
  const [entries, setEntries] = useState<JournalEntry[]>(() => storage.getJournal(city));

  // Reload entries when city changes
  useEffect(() => {
    setEntries(storage.getJournal(city));
  }, [city]);

  const addEntry = useCallback((activityId: string, preGeneratedStory: string | null = null) => {
    const activity = getActivityById(activityId);
    if (!activity) {
      throw new Error(`Activity with id ${activityId} not found`);
    }

    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      activityId: activity.id,
      activityLabel: activity.label,
      category: activity.category,
      icon: activity.icon,
      kgCO2: activity.kgCO2,
      relatableUnit: toRelatableUnit(activity.kgCO2),
      story: preGeneratedStory,
      isWin: !!activity.isWin,
      timestamp: Date.now(),
    };

    storage.addEntry(newEntry, city);
    setEntries(prev => [...prev, newEntry]);
    return newEntry;
  }, [city]);

  const updateEntry = useCallback((id: string, updatedFields: Partial<JournalEntry>) => {
    storage.updateEntry(id, updatedFields, city);
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updatedFields } : e));
  }, [city]);

  const clearJournal = useCallback(() => {
    storage.clearJournal(city);
    setEntries([]);
  }, [city]);

  const summary = useMemo(() => getMonthlySummary(entries), [entries]);

  return {
    entries,
    addEntry,
    updateEntry,
    clearJournal,
    summary,
  };
}
