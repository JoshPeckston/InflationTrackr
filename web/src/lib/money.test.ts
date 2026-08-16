import { describe, expect, it } from 'vitest';
import { convertAmount, formatMultiple, formatPercent } from './money';

describe('convertAmount', () => {
  it('leaves an amount unchanged in the same currency', () => {
    expect(convertAmount(12.5, 'USD', 'USD')).toBe(12.5);
  });

  it('converts through the dollar snapshot', () => {
    expect(convertAmount(1, 'GBP', 'USD')).toBeCloseTo(1.27);
    expect(convertAmount(1.27, 'USD', 'GBP')).toBeCloseTo(1);
  });

  it('rejects an unknown currency', () => {
    expect(() => convertAmount(1, 'USD', 'XXX')).toThrow(/Unknown currency/);
  });
});

describe('format helpers', () => {
  it('signs percentage changes', () => {
    expect(formatPercent(0.123)).toBe('+12.3%');
    expect(formatPercent(-0.05)).toBe('-5.0%');
  });

  it('formats multiples with sensible precision', () => {
    expect(formatMultiple(2.456)).toBe('2.46×');
    expect(formatMultiple(12.34)).toBe('12.3×');
    expect(formatMultiple(150)).toBe('150×');
  });
});
