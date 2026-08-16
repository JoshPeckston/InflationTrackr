# InflationTrackr design

The product is a **historic price archive**: a way to feel how the cost of
ordinary goods and services moved, country by country, and to reread those
prices in another currency.

## Why a web ledger, not the mobile stub

The repository began as a four-tab React Native shell. Historic inflation is
mostly an argument with a chart, a year, and a comparison. That wants a wide
page, a persistent country/currency bar, and room for a sentence. The web app
is the first complete expression of that idea.

## Interface

The masthead is the instrument panel:

1. **Country** chooses the economy (CPI, shelf prices, first available year).
2. **Display currency** is a lens. It does not change the underlying series.
3. **Year** is a scrubber. Every card answers “what did this cost then?”

Surfaces:

| Route | Job |
| --- | --- |
| `/` | National basket as museum cards, with sparklines |
| `/good/:id` | One item’s line, real-value translation, cross-country table |
| `/compare` | Two goods in one country, plus the left good abroad |
| `/calculator` | Walk an amount through CPI, then spend it on the shelf |
| `/methodology` | Observed vs interpolated, FX caveats |

Visual language: Fraunces for headlines, Outfit for UI, IBM Plex Mono for
money. Paper and ink by default; a night theme for late reading. Rising prices
lean rose/copper; real declines lean pine.

## Data model

```ts
Country { code, currency, firstYear, blurb }
Currency { code, symbol, usdPerUnit }
Good { id, category, unitLabel }
CPI anchors, 2015 = 100
Price anchors in local currency at selected years
```

Missing years are filled with exponential interpolation between anchors
(`web/src/lib/series.ts`). Real-value math uses that country’s CPI
(`web/src/lib/inflation.ts`). Display conversion goes through a USD snapshot
(`web/src/lib/money.ts`).

Brazil starts in 1995 and Mexico in 1993 so redenomination does not invent a
false century of bread prices. Pre-euro German and French prices are
euro-equivalents.

## What this is not

It is not a live supermarket feed, a historic FX tape, or a substitute for a
national statistical office. Housing is a typical inner-city one-bedroom, not
every dwelling in the country.
