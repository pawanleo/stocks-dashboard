import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LiveTickerBadge from '../components/LiveTickerBadge';
import { TickerData } from '../types';

const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

describe('LiveTickerBadge', () => {
  const positiveTicker: TickerData = {
    symbol: 'AAPL',
    price: 178.52,
    change: 3.45,
    changePercent: 1.97,
    volume: 3200,
    timestamp: Date.now(),
  };

  const negativeTicker: TickerData = {
    symbol: 'TSLA',
    price: 241.10,
    change: -8.20,
    changePercent: -3.29,
    volume: 5400,
    timestamp: Date.now(),
  };

  it('should render the ticker symbol', () => {
    renderWithRouter(<LiveTickerBadge ticker={positiveTicker} />);
    expect(screen.getByText('AAPL')).toBeInTheDocument();
  });

  it('should render the formatted price', () => {
    renderWithRouter(<LiveTickerBadge ticker={positiveTicker} />);
    expect(screen.getByText('$178.52')).toBeInTheDocument();
  });

  it('should display positive change with + prefix', () => {
    renderWithRouter(<LiveTickerBadge ticker={positiveTicker} />);
    expect(screen.getByText('+3.45')).toBeInTheDocument();
    expect(screen.getByText('(1.97%)')).toBeInTheDocument();
  });

  it('should display negative change without + prefix', () => {
    renderWithRouter(<LiveTickerBadge ticker={negativeTicker} />);
    expect(screen.getByText('-8.20')).toBeInTheDocument();
    expect(screen.getByText('(-3.29%)')).toBeInTheDocument();
  });

  it('should render the first character of the symbol as avatar', () => {
    renderWithRouter(<LiveTickerBadge ticker={positiveTicker} />);
    // The avatar shows the first character
    const avatars = screen.getAllByText('A');
    expect(avatars.length).toBeGreaterThanOrEqual(1);
  });

  it('should be clickable (has cursor-pointer)', () => {
    const { container } = renderWithRouter(<LiveTickerBadge ticker={positiveTicker} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('cursor-pointer');
  });
});
