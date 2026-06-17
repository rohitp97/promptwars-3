import type { JournalEntry } from '../types';

const JOURNAL_STORAGE_KEY = 'trace_journal_entries';

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing key "${key}" to localStorage:`, error);
  }
}

export function getJournal(city: string): JournalEntry[] {
  const key = `${JOURNAL_STORAGE_KEY}_${city.toLowerCase()}`;
  return safeGet<JournalEntry[]>(key, []);
}

export function addEntry(entry: JournalEntry, city: string): void {
  const key = `${JOURNAL_STORAGE_KEY}_${city.toLowerCase()}`;
  const entries = getJournal(city);
  entries.push(entry);
  safeSet(key, entries);
}

export function updateEntry(id: string, updatedFields: Partial<JournalEntry>, city: string): void {
  const key = `${JOURNAL_STORAGE_KEY}_${city.toLowerCase()}`;
  const entries = getJournal(city);
  const index = entries.findIndex(e => e.id === id);
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updatedFields };
    safeSet(key, entries);
  }
}

export function clearJournal(city: string): void {
  const key = `${JOURNAL_STORAGE_KEY}_${city.toLowerCase()}`;
  safeSet(key, []);
}
