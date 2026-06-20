import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JournalFeed } from '../components/journal/JournalFeed';
import type { JournalEntry } from '../types';

const emptySummary = { totalKg: 0, decisionCount: 0, winCount: 0 };

const makeEntry = (overrides: Partial<JournalEntry> = {}): JournalEntry => ({
  id: 'entry-1',
  activityId: 'domestic_flight',
  activityLabel: 'Domestic flight',
  category: 'travel',
  icon: '✈️',
  kgCO2: 255,
  relatableUnit: '1.0 Delhi–Mumbai flights equivalent',
  story: 'A consequence story.',
  isWin: false,
  timestamp: Date.now(),
  ...overrides,
});

describe('JournalFeed', () => {
  it('renders empty state when entries array is empty', () => {
    render(<JournalFeed entries={[]} summary={emptySummary} pollutionLevel="clear" onOpenLogSheet={() => {}} />);
    expect(screen.getByText(/Your climate story starts here/i)).toBeInTheDocument();
  });

  it('shows "Log your first decision" CTA in empty state', () => {
    render(<JournalFeed entries={[]} summary={emptySummary} pollutionLevel="clear" onOpenLogSheet={() => {}} />);
    expect(screen.getByRole('button', { name: /Log your first decision/i })).toBeInTheDocument();
  });

  it('calls onOpenLogSheet when empty-state CTA is clicked', () => {
    const onOpenLogSheet = vi.fn();
    render(<JournalFeed entries={[]} summary={emptySummary} pollutionLevel="clear" onOpenLogSheet={onOpenLogSheet} />);
    fireEvent.click(screen.getByRole('button', { name: /Log your first decision/i }));
    expect(onOpenLogSheet).toHaveBeenCalledOnce();
  });

  it('renders entry cards when entries is non-empty', () => {
    const entries = [makeEntry()];
    render(<JournalFeed entries={entries} summary={emptySummary} pollutionLevel="clear" onOpenLogSheet={() => {}} />);
    expect(screen.getByText('Domestic flight')).toBeInTheDocument();
    expect(screen.queryByText(/Your climate story starts here/i)).not.toBeInTheDocument();
  });

  it('renders multiple entries', () => {
    const entries = [
      makeEntry({ id: '1', activityLabel: 'Domestic flight' }),
      makeEntry({ id: '2', activityLabel: 'AC for 8 hours' }),
    ];
    render(<JournalFeed entries={entries} summary={emptySummary} pollutionLevel="clear" onOpenLogSheet={() => {}} />);
    expect(screen.getByText('Domestic flight')).toBeInTheDocument();
    expect(screen.getByText('AC for 8 hours')).toBeInTheDocument();
  });

  it('displays correct summary counts', () => {
    const summary = { totalKg: 255, decisionCount: 5, winCount: 2 };
    render(<JournalFeed entries={[makeEntry()]} summary={summary} pollutionLevel="clear" onOpenLogSheet={() => {}} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows the correct pollution pill label for each level', () => {
    const levels = [
      { level: 'clear' as const, label: 'Clear Sky' },
      { level: 'hazy' as const, label: 'Hazy' },
      { level: 'polluted' as const, label: 'Polluted' },
      { level: 'critical' as const, label: 'Critical' },
    ];
    for (const { level, label } of levels) {
      const { unmount } = render(
        <JournalFeed entries={[]} summary={emptySummary} pollutionLevel={level} onOpenLogSheet={() => {}} />
      );
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    }
  });
});
