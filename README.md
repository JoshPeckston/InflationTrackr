# InflationTrackr

A historic archive of everyday prices — milk, rent, petrol, haircuts — across
countries and currencies. The living product is a web app. The original React
Native stub remains under `mobile/` as an early sketch.

## Look and feel

The archive is designed like a public ledger, not a fintech dashboard: warm
paper, ink, a copper rule for rising prices, and large serif headlines. Country
and display currency stay in the masthead. A year scrubber rewrites every card
at once.

- **Archive** — the national basket, filterable by category
- **Item pages** — then vs now, real-value translation, cross-country table
- **Compare** — two goods, or the same good in a second country
- **Calculator** — purchasing power, then spent on the shelf
- **Sources** — what is observed, interpolated, or converted

## Web app

From the repo root (or `cd web` first):

```bash
cd web
npm install
npm test
npm run dev
```

Then open **http://127.0.0.1:5173** — use the IPv4 address, not `localhost`.
Safari on macOS often resolves `localhost` to IPv6 (`::1`) and shows
“Safari Can’t Connect to the Server” if the page is opened that way, or if
the app is only running on a remote machine.

Production build:

```bash
npm run build
npm run preview
```

Preview is at **http://127.0.0.1:4173**.

After GitHub Pages is enabled on this repository (Settings → Pages → GitHub
Actions), the archive is also served at
`https://joshpeckston.github.io/InflationTrackr/`.

## Data

Prices are local-currency list prices at selected years, compiled from public
statistical sources and historical retail series. Gaps are filled along each
country’s CPI path. Display-currency conversion uses a recent mid-market
snapshot, not historic FX. See `web/src/pages/MethodologyPage.tsx` and
`docs/design.md`.

## Directory

- `web/` — Vite + React + TypeScript archive
- `docs/design.md` — product and data notes
- `mobile/` — original React Native prototype
