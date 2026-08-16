import type { Currency } from './types';

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US dollar', symbol: '$', usdPerUnit: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', usdPerUnit: 1.09 },
  { code: 'GBP', name: 'British pound', symbol: '£', usdPerUnit: 1.27 },
  { code: 'CAD', name: 'Canadian dollar', symbol: 'C$', usdPerUnit: 0.73 },
  { code: 'AUD', name: 'Australian dollar', symbol: 'A$', usdPerUnit: 0.65 },
  { code: 'JPY', name: 'Japanese yen', symbol: '¥', usdPerUnit: 0.0067 },
  { code: 'INR', name: 'Indian rupee', symbol: '₹', usdPerUnit: 0.012 },
  { code: 'BRL', name: 'Brazilian real', symbol: 'R$', usdPerUnit: 0.18 },
  { code: 'MXN', name: 'Mexican peso', symbol: 'MX$', usdPerUnit: 0.055 },
  { code: 'SEK', name: 'Swedish krona', symbol: 'kr', usdPerUnit: 0.095 },
  { code: 'KRW', name: 'South Korean won', symbol: '₩', usdPerUnit: 0.00073 },
  { code: 'CHF', name: 'Swiss franc', symbol: 'CHF', usdPerUnit: 1.12 },
  { code: 'NZD', name: 'New Zealand dollar', symbol: 'NZ$', usdPerUnit: 0.6 },
  { code: 'PLN', name: 'Polish złoty', symbol: 'zł', usdPerUnit: 0.25 },
  { code: 'ZAR', name: 'South African rand', symbol: 'R', usdPerUnit: 0.055 },
];

export const CURRENCY_BY_CODE = Object.fromEntries(
  CURRENCIES.map((currency) => [currency.code, currency]),
) as Record<string, Currency>;

export const DEFAULT_CURRENCY = 'USD';
