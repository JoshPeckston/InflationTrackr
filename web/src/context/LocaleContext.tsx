import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { COUNTRY_BY_CODE, DEFAULT_COUNTRY } from '../data/countries';
import { DEFAULT_CURRENCY } from '../data/currencies';
import { clampYear, countryStartYear, LATEST_YEAR } from '../lib/catalog';

type Theme = 'light' | 'dark';

interface LocaleState {
  country: string;
  currency: string;
  year: number;
  theme: Theme;
  setCountry: (code: string) => void;
  setCurrency: (code: string) => void;
  setYear: (year: number) => void;
  toggleTheme: () => void;
}

const LocaleContext = createContext<LocaleState | null>(null);

function readTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem('inflationtrackr-theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState(DEFAULT_COUNTRY);
  const [currency, setCurrency] = useState(
    COUNTRY_BY_CODE[DEFAULT_COUNTRY]?.currency ?? DEFAULT_CURRENCY,
  );
  const [currencyPinned, setCurrencyPinned] = useState(false);
  const [year, setYearState] = useState(1990);
  const [theme, setTheme] = useState<Theme>(() => readTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo<LocaleState>(() => {
    const setCountry = (code: string) => {
      setCountryState(code);
      setYearState((current) => clampYear(code, current));
      if (!currencyPinned) {
        setCurrency(COUNTRY_BY_CODE[code]?.currency ?? DEFAULT_CURRENCY);
      }
    };

    const setCurrencySafe = (code: string) => {
      setCurrencyPinned(true);
      setCurrency(code);
    };

    const setYear = (next: number) => {
      setYearState(clampYear(country, next));
    };

    const toggleTheme = () => {
      setTheme((current) => {
        const next = current === 'dark' ? 'light' : 'dark';
        window.localStorage.setItem('inflationtrackr-theme', next);
        return next;
      });
    };

    return {
      country,
      currency,
      year: clampYear(country, year),
      theme,
      setCountry,
      setCurrency: setCurrencySafe,
      setYear,
      toggleTheme,
    };
  }, [country, currency, currencyPinned, theme, year]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleState {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return value;
}

export function yearBounds(country: string): { min: number; max: number } {
  return { min: countryStartYear(country), max: LATEST_YEAR };
}
