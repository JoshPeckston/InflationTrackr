import { COUNTRY_BY_CODE } from '../data/countries';
import { ARCHIVE_END_YEAR, CPI_ANCHORS } from '../data/cpi';
import { PRICE_ANCHORS } from '../data/prices';
import type { Observation } from '../data/types';
import { convertAmount } from './money';
import {
  expandAnnual,
  firstAnchorYear,
  lastAnchorYear,
  observationAtYear,
  valueAtYear,
  type SeriesPoint,
} from './series';

export const LATEST_YEAR = ARCHIVE_END_YEAR;

export function countryStartYear(countryCode: string): number {
  const country = COUNTRY_BY_CODE[countryCode];
  const cpi = CPI_ANCHORS[countryCode];
  if (!country || !cpi) return 1960;
  return Math.max(country.firstYear, firstAnchorYear(cpi));
}

export function cpiSeries(countryCode: string): SeriesPoint[] {
  const anchors = CPI_ANCHORS[countryCode];
  if (!anchors) return [];
  return expandAnnual(anchors, countryStartYear(countryCode), LATEST_YEAR);
}

export function cpiAt(countryCode: string, year: number): number | null {
  const anchors = CPI_ANCHORS[countryCode];
  if (!anchors) return null;
  return valueAtYear(anchors, year);
}

export function priceAt(goodId: string, countryCode: string, year: number): number | null {
  const anchors = PRICE_ANCHORS[goodId]?.[countryCode];
  if (!anchors) return null;
  return valueAtYear(anchors, year);
}

export function priceObservation(
  goodId: string,
  countryCode: string,
  year: number,
): Observation | null {
  const anchors = PRICE_ANCHORS[goodId]?.[countryCode];
  if (!anchors) return null;
  return observationAtYear(anchors, year);
}

export function priceSeries(goodId: string, countryCode: string): SeriesPoint[] {
  const anchors = PRICE_ANCHORS[goodId]?.[countryCode];
  if (!anchors) return [];
  const start = Math.max(countryStartYear(countryCode), firstAnchorYear(anchors));
  const end = Math.min(LATEST_YEAR, lastAnchorYear(anchors));
  return expandAnnual(anchors, start, end);
}

export function displayedPrice(
  goodId: string,
  countryCode: string,
  year: number,
  displayCurrency: string,
): number | null {
  const local = priceAt(goodId, countryCode, year);
  if (local == null) return null;
  const localCurrency = COUNTRY_BY_CODE[countryCode]?.currency;
  if (!localCurrency) return local;
  return convertAmount(local, localCurrency, displayCurrency);
}

export function availableYearsForGood(goodId: string, countryCode: string): number[] {
  return priceSeries(goodId, countryCode).map((point) => point.year);
}

export function clampYear(countryCode: string, year: number): number {
  const start = countryStartYear(countryCode);
  return Math.min(LATEST_YEAR, Math.max(start, year));
}

export function countriesWithGood(goodId: string): string[] {
  const byCountry = PRICE_ANCHORS[goodId];
  return byCountry ? Object.keys(byCountry) : [];
}
