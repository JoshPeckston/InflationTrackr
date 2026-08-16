import type { AnchorMap, Observation } from '../data/types';

export interface SeriesPoint {
  year: number;
  value: number;
  observation: Observation;
}

function sortedYears(anchors: AnchorMap): number[] {
  return Object.keys(anchors)
    .map(Number)
    .sort((a, b) => a - b);
}

export function firstAnchorYear(anchors: AnchorMap): number {
  const years = sortedYears(anchors);
  if (years.length === 0) {
    throw new Error('Anchor map is empty');
  }
  return years[0];
}

export function lastAnchorYear(anchors: AnchorMap): number {
  const years = sortedYears(anchors);
  if (years.length === 0) {
    throw new Error('Anchor map is empty');
  }
  return years[years.length - 1];
}

export function interpolateExponential(
  startValue: number,
  endValue: number,
  startYear: number,
  endYear: number,
  year: number,
): number {
  if (endYear === startYear) return startValue;
  if (startValue <= 0 || endValue <= 0) {
    const t = (year - startYear) / (endYear - startYear);
    return startValue + (endValue - startValue) * t;
  }
  const t = (year - startYear) / (endYear - startYear);
  return startValue * (endValue / startValue) ** t;
}

export function valueAtYear(anchors: AnchorMap, year: number): number | null {
  if (anchors[year] != null) return anchors[year];
  const years = sortedYears(anchors);
  if (years.length === 0) return null;
  if (year < years[0] || year > years[years.length - 1]) return null;

  let previous = years[0];
  let next = years[years.length - 1];
  for (const candidate of years) {
    if (candidate <= year) previous = candidate;
    if (candidate >= year) {
      next = candidate;
      break;
    }
  }
  return interpolateExponential(anchors[previous], anchors[next], previous, next, year);
}

export function observationAtYear(anchors: AnchorMap, year: number): Observation | null {
  if (anchors[year] != null) return 'observed';
  if (valueAtYear(anchors, year) == null) return null;
  return 'interpolated';
}

export function expandAnnual(anchors: AnchorMap, start: number, end: number): SeriesPoint[] {
  const points: SeriesPoint[] = [];
  for (let year = start; year <= end; year += 1) {
    const value = valueAtYear(anchors, year);
    const observation = observationAtYear(anchors, year);
    if (value == null || observation == null) continue;
    points.push({ year, value, observation });
  }
  return points;
}
