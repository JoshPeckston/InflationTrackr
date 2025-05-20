# InflationTrackr React Native App Design

This document outlines the design for a React Native application that
tracks prices of products over time and helps visualize inflation.

## Features

- **Historical Price Tracking**: Users can enter product names, purchase
  dates, price, currency, and location.
- **Categories**: Products can be organized into custom categories for
  easier filtering.
- **Currency Conversion**: When prices are entered in different
  currencies, the app automatically converts them to a base currency for
  comparison (requires an exchange-rate service or offline data).
- **Sharing**: Interesting price changes or histories can be shared to
  social media or messaging apps using the native share sheet.
- **Alerts**: Users can receive notifications when prices change
  significantly or drop below a desired threshold.
- **Search & Filters**: Quickly filter by category, date range, price
  range, location or inflation rate.
- **Map View**: Display price entries on a map to visualize geographic
  differences.

## Navigation

The main interface uses a bottom tab navigator with four tabs:

1. **Home** – Dashboard and quick stats.
2. **Stats** – Add/view entries and see charts.
3. **Map** – Map of price entries by location.
4. **Explore** – Discover trends and comparisons.

## Data Model (simplified)

```ts
interface PriceEntry {
  id: string;
  productName: string;
  category: string;
  price: number;
  currency: string;
  normalizedPrice: number; // converted to a base currency
  date: string; // ISO date
  location: string; // e.g. city or GPS coordinates
}
```

## Implementation Notes

- Use **React Navigation** for bottom tabs.
- Store data locally with a database such as **SQLite** or **Async
  Storage**, and sync with a cloud service if needed.
- For currency conversion, consider a third-party API or regularly
  updated offline rates.
- Charts can be implemented with libraries like
  `react-native-chart-kit`.
- Map view can be built with `react-native-maps`.

## Getting Started

1. Install dependencies with `npm install` or `yarn`.
2. Run the Metro bundler with `npx react-native start`.
3. Build the app on a device or emulator with `npx react-native run-ios`
   or `npx react-native run-android`.

This repo currently contains only example code to illustrate the app
structure.
