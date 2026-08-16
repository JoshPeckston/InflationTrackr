import { describe, expect, it } from 'vitest';
import { annualRates, cagr, cumulativeChange, purchasingPower, realValue } from './inflation';

describe('realValue', () => {
  it('revalues a past price into later-year money', () => {
    expect(realValue(1, 50, 100)).toBe(2);
  });

  it('rejects a non-positive earlier CPI', () => {
    expect(() => realValue(1, 0, 100)).toThrow(/positive/);
  });
});

describe('purchasingPower', () => {
  it('says what a later amount could buy in an earlier year', () => {
    expect(purchasingPower(100, 50, 100)).toBe(50);
  });
});

describe('cumulativeChange', () => {
  it('returns the fractional change between two prices', () => {
    expect(cumulativeChange(2, 5)).toBeCloseTo(1.5);
  });

  it('treats a rise from zero as infinite', () => {
    expect(cumulativeChange(0, 4)).toBe(Number.POSITIVE_INFINITY);
  });
});

describe('cagr', () => {
  it('compounds a doubling over ten years', () => {
    expect(cagr(100, 200, 10)).toBeCloseTo(0.0718, 3);
  });

  it('rejects a zero-year span', () => {
    expect(() => cagr(100, 110, 0)).toThrow(/positive number of years/);
  });
});

describe('annualRates', () => {
  it('computes year-over-year changes', () => {
    const rates = annualRates([
      { year: 2022, value: 100 },
      { year: 2023, value: 110 },
      { year: 2024, value: 121 },
    ]);
    expect(rates).toEqual([
      { year: 2023, rate: 0.1 },
      { year: 2024, rate: 0.1 },
    ]);
  });
});
