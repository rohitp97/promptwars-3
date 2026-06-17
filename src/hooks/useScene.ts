import { useMemo } from 'react';
import type { JournalEntry, SceneState } from '../types';
import { deriveSceneState, getMonthlyTotal } from '../lib/carbon-utils';

export function useScene(entries: JournalEntry[]): SceneState {
  return useMemo(() => {
    const totalKg = getMonthlyTotal(entries);
    return deriveSceneState(totalKg);
  }, [entries]);
}
