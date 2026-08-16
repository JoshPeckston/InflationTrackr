export type Category =
  | 'food'
  | 'energy'
  | 'housing'
  | 'transport'
  | 'services'
  | 'household';

export type Observation = 'observed' | 'interpolated' | 'estimated';

export interface Country {
  code: string;
  name: string;
  adjective: string;
  flag: string;
  currency: string;
  region: string;
  blurb: string;
  firstYear: number;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  /** US dollars per one unit of this currency, mid-2024/25 snapshot. */
  usdPerUnit: number;
}

export interface Good {
  id: string;
  name: string;
  shortName: string;
  category: Category;
  unit: string;
  unitLabel: string;
  blurb: string;
}

export interface AnchorMap {
  [year: number]: number;
}

export interface PriceAnchors {
  [countryCode: string]: AnchorMap;
}
