import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryGrid } from '../components/log/CategoryGrid';

describe('CategoryGrid', () => {
  it('renders all 4 category buttons', () => {
    render(<CategoryGrid selectedCategory={null} onSelectCategory={() => {}} onSimulateClick={() => {}} />);
    expect(screen.getByText('Travel')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Energy')).toBeInTheDocument();
    expect(screen.getByText('Shopping')).toBeInTheDocument();
  });

  it('calls onSelectCategory with the correct id when a category is clicked', () => {
    const onSelectCategory = vi.fn();
    render(<CategoryGrid selectedCategory={null} onSelectCategory={onSelectCategory} onSimulateClick={() => {}} />);
    fireEvent.click(screen.getByText('Travel'));
    expect(onSelectCategory).toHaveBeenCalledWith('travel');
    fireEvent.click(screen.getByText('Food'));
    expect(onSelectCategory).toHaveBeenCalledWith('food');
  });

  it('calls onSelectCategory with "win" when Climate Win button is clicked', () => {
    const onSelectCategory = vi.fn();
    render(<CategoryGrid selectedCategory={null} onSelectCategory={onSelectCategory} onSimulateClick={() => {}} />);
    fireEvent.click(screen.getByText(/Log a Climate Win/i));
    expect(onSelectCategory).toHaveBeenCalledWith('win');
  });

  it('calls onSimulateClick when simulate link is clicked', () => {
    const onSimulateClick = vi.fn();
    render(<CategoryGrid selectedCategory={null} onSelectCategory={() => {}} onSimulateClick={onSimulateClick} />);
    fireEvent.click(screen.getByText(/Simulate instead/i));
    expect(onSimulateClick).toHaveBeenCalledOnce();
  });

  it('applies selected styles to the active category', () => {
    render(<CategoryGrid selectedCategory="energy" onSelectCategory={() => {}} onSimulateClick={() => {}} />);
    const energyBtn = screen.getByText('Energy').closest('button');
    expect(energyBtn).toHaveClass('border-emerald-500');
  });

  it('applies selected styles to climate win button when "win" is selected', () => {
    render(<CategoryGrid selectedCategory="win" onSelectCategory={() => {}} onSimulateClick={() => {}} />);
    const winBtn = screen.getByText(/Log a Climate Win/i).closest('button');
    expect(winBtn).toHaveClass('border-emerald-400');
  });
});
