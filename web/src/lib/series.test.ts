import { describe, expect, it } from 'vitest';
import { COUNTRIES } from '../data/countries';
import { GOODS } from '../data/goods';
import { PRICE_ANCHORS } from '../data/prices';
import { cpiAt, priceAt } from './catalog';
import { expandAnnual, interpolateExponential, valueAtYear } from './series';

describe('interpolateExponential', () => {
  it('returns the midpoint of a geometric path', () => {
    expect(interpolateExponential(100, 400, 2000, 2002, 2001)).toBeCloseTo(200);
  });

  it('falls back to a straight line when a value is not positive', () => {
    expect(interpolateExponential(0, 10, 2000, 2010, 2005)).toBeCloseTo(5);
  });
});

describe('valueAtYear', () => {
  it('returns an exact anchor and interpolates the gaps', () => {
    const anchors = { 2000: 10, 2010: 20 };
    expect(valueAtYear(anchors, 2000)).toBe(10);
    expect(valueAtYear(anchors, 2005)).toBeCloseTo(Math.sqrt(200));
    expect(valueAtYear(anchors, 1999)).toBeNull();
  });
});

describe('expandAnnual', () => {
  it('marks observed years and fills the rest', () => {
    const series = expandAnnual({ 2000: 10, 2002: 40 }, 2000, 2002);
    expect(series.map((point) => point.observation)).toEqual([
      'observed',
      'interpolated',
      'observed',
    ]);
    expect(series[1].value).toBeCloseTo(20);
  });
});

describe('archive coverage', () => {
  it('has a CPI reading for every country in 2024', () => {
    for (const country of COUNTRIES) {
      expect(cpiAt(country.code, 2024)).toBeGreaterThan(0);
    }
  });

  it('has a 2024 price for every good in every listed country', () => {
    for (const good of GOODS) {
      const countries = Object.keys(PRICE_ANCHORS[good.id] ?? {});
      expect(countries.length).toBeGreaterThan(0);
      for (const country of countries) {
        expect(priceAt(good.id, country, 2024)).toBeGreaterThan(0);
      }
    }
  });
});
