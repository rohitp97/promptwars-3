import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LogSheet } from '../components/log/LogSheet';

describe('LogSheet', () => {
  it('renders nothing when isOpen is false', () => {
    render(<LogSheet isOpen={false} onClose={() => {}} onLog={() => {}} onSimulateClick={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders a dialog element when isOpen is true', () => {
    render(<LogSheet isOpen={true} onClose={() => {}} onLog={() => {}} onSimulateClick={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('dialog has aria-modal="true"', () => {
    render(<LogSheet isOpen={true} onClose={() => {}} onLog={() => {}} onSimulateClick={() => {}} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('shows CategoryGrid (step 1) on open', () => {
    render(<LogSheet isOpen={true} onClose={() => {}} onLog={() => {}} onSimulateClick={() => {}} />);
    expect(screen.getByText('What did you do?')).toBeInTheDocument();
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<LogSheet isOpen={true} onClose={onClose} onLog={() => {}} onSimulateClick={() => {}} />);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(<LogSheet isOpen={true} onClose={onClose} onLog={() => {}} onSimulateClick={() => {}} />);
    fireEvent.click(container.firstChild as HTMLElement);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does NOT call onClose when the panel itself is clicked', () => {
    const onClose = vi.fn();
    render(<LogSheet isOpen={true} onClose={onClose} onLog={() => {}} onSimulateClick={() => {}} />);
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('advances to ActivityList (step 2) when a category is selected', () => {
    render(<LogSheet isOpen={true} onClose={() => {}} onLog={() => {}} onSimulateClick={() => {}} />);
    fireEvent.click(screen.getByText('Travel'));
    expect(screen.getByText('Travel Actions')).toBeInTheDocument();
  });

  it('calls onSimulateClick and onClose when the simulate link is clicked', () => {
    const onClose = vi.fn();
    const onSimulateClick = vi.fn();
    render(<LogSheet isOpen={true} onClose={onClose} onLog={() => {}} onSimulateClick={onSimulateClick} />);
    fireEvent.click(screen.getByText(/Simulate instead/i));
    expect(onSimulateClick).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('goes back to CategoryGrid when Back is clicked on step 2', () => {
    render(<LogSheet isOpen={true} onClose={() => {}} onLog={() => {}} onSimulateClick={() => {}} />);
    fireEvent.click(screen.getByText('Food'));
    expect(screen.getByText('Food Actions')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Back to categories/i }));
    expect(screen.getByText('What did you do?')).toBeInTheDocument();
  });

  it('completes the full 3-step flow and calls onLog with the selected activity id', () => {
    const onLog = vi.fn();
    const onClose = vi.fn();
    render(<LogSheet isOpen={true} onClose={onClose} onLog={onLog} onSimulateClick={() => {}} />);

    // Step 1 → click Travel
    fireEvent.click(screen.getByText('Travel'));
    expect(screen.getByText('Travel Actions')).toBeInTheDocument();

    // Step 2 → select an activity from the listbox
    fireEvent.click(screen.getByText('Domestic flight'));
    expect(screen.getByRole('option', { name: /Domestic flight/i })).toHaveAttribute('aria-selected', 'true');

    // Advance to step 3
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText('Confirm Decision')).toBeInTheDocument();

    // Step 3 → confirm
    fireEvent.click(screen.getByRole('button', { name: 'Log It' }));
    expect(onLog).toHaveBeenCalledWith('flight_domestic');
    expect(onClose).toHaveBeenCalledOnce();
  });
});
