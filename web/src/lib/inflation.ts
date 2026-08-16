export function realValue(nominal: number, cpiThen: number, cpiNow: number): number {
  if (cpiThen <= 0) {
    throw new Error('CPI at the earlier date must be positive');
  }
  return nominal * (cpiNow / cpiThen);
}

export function purchasingPower(amount: number, cpiThen: number, cpiNow: number): number {
  if (cpiNow <= 0) {
    throw new Error('CPI at the later date must be positive');
  }
  return amount * (cpiThen / cpiNow);
}

export function cumulativeChange(start: number, end: number): number {
  if (start === 0) return end === 0 ? 0 : Number.POSITIVE_INFINITY;
  return (end - start) / start;
}

export function cagr(start: number, end: number, years: number): number {
  if (years <= 0) {
    throw new Error('CAGR requires a positive number of years');
  }
  if (start <= 0 || end <= 0) {
    throw new Error('CAGR requires positive start and end values');
  }
  return (end / start) ** (1 / years) - 1;
}

export function annualRates(values: { year: number; value: number }[]): { year: number; rate: number }[] {
  const rates: { year: number; rate: number }[] = [];
  for (let i = 1; i < values.length; i += 1) {
    const previous = values[i - 1];
    const current = values[i];
    if (previous.value <= 0) continue;
    rates.push({
      year: current.year,
      rate: (current.value - previous.value) / previous.value,
    });
  }
  return rates;
}
