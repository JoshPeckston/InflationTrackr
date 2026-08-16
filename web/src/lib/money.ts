import { CURRENCY_BY_CODE } from '../data/currencies';

export function convertAmount(amount: number, fromCode: string, toCode: string): number {
  if (fromCode === toCode) return amount;
  const from = CURRENCY_BY_CODE[fromCode];
  const to = CURRENCY_BY_CODE[toCode];
  if (!from || !to) {
    throw new Error(`Unknown currency pair ${fromCode}/${toCode}`);
  }
  return (amount * from.usdPerUnit) / to.usdPerUnit;
}

export function formatMoney(
  amount: number,
  currencyCode: string,
  options: { compact?: boolean; maximumFractionDigits?: number } = {},
): string {
  const currency = CURRENCY_BY_CODE[currencyCode];
  if (!currency) return amount.toFixed(2);

  const abs = Math.abs(amount);
  let maximumFractionDigits = options.maximumFractionDigits;
  if (maximumFractionDigits == null) {
    if (abs >= 1000) maximumFractionDigits = 0;
    else if (abs >= 100) maximumFractionDigits = 0;
    else if (abs >= 20) maximumFractionDigits = 1;
    else if (currency.usdPerUnit < 0.01) maximumFractionDigits = 0;
    else maximumFractionDigits = 2;
  }

  if (options.compact && abs >= 10000) {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  }

  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits,
      minimumFractionDigits: maximumFractionDigits > 0 && abs < 20 ? Math.min(2, maximumFractionDigits) : 0,
    }).format(amount);
  } catch {
    const digits = maximumFractionDigits;
    return `${currency.symbol}${amount.toFixed(digits)}`;
  }
}

export function formatPercent(value: number, digits = 1): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${(value * 100).toFixed(digits)}%`;
}

export function formatMultiple(value: number): string {
  if (!Number.isFinite(value)) return '—';
  if (value >= 100) return `${value.toFixed(0)}×`;
  if (value >= 10) return `${value.toFixed(1)}×`;
  return `${value.toFixed(2)}×`;
}
