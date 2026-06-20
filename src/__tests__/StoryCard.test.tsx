import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StoryCard } from '../components/journal/StoryCard';
import type { JournalEntry } from '../types';

const baseEntry: JournalEntry = {
  id: 'test-id-1',
  activityId: 'domestic_flight',
  activityLabel: 'Domestic flight',
  category: 'travel',
  icon: '✈️',
  kgCO2: 255,
  relatableUnit: '1.0 Delhi–Mumbai flights equivalent',
  story: null,
  isWin: false,
  timestamp: Date.now(),
};

describe('StoryCard', () => {
  it('shows skeleton loader with aria-busy when story is null', () => {
    render(<StoryCard entry={baseEntry} />);
    const skeleton = screen.getByRole('alert');
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
    expect(skeleton).toHaveAttribute('aria-label', 'Generating your climate story');
  });

  it('does not show skeleton when story is available', () => {
    const entry = { ...baseEntry, story: 'Your flight added 146 days to a tree.' };
    render(<StoryCard entry={entry} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders the story text when story is available', () => {
    const entry = { ...baseEntry, story: 'Your flight added 146 days to a tree.' };
    render(<StoryCard entry={entry} />);
    expect(screen.getByText('Your flight added 146 days to a tree.')).toBeInTheDocument();
  });

  it('shows relatable unit for non-win entries', () => {
    render(<StoryCard entry={baseEntry} />);
    expect(screen.getByText(/1.0 Delhi–Mumbai flights equivalent/)).toBeInTheDocument();
  });

  it('shows "Climate Win" badge for win entries', () => {
    const winEntry: JournalEntry = { ...baseEntry, isWin: true, kgCO2: 0, relatableUnit: '' };
    render(<StoryCard entry={winEntry} />);
    expect(screen.getByText(/Climate Win/i)).toBeInTheDocument();
  });

  it('does not show relatable unit row for win entries', () => {
    const winEntry: JournalEntry = { ...baseEntry, isWin: true, kgCO2: 0, relatableUnit: '' };
    render(<StoryCard entry={winEntry} />);
    expect(screen.queryByText(/Delhi–Mumbai/)).not.toBeInTheDocument();
  });

  it('renders the activity label', () => {
    render(<StoryCard entry={baseEntry} />);
    expect(screen.getByText('Domestic flight')).toBeInTheDocument();
  });
});
