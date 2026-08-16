export function MethodologyPage() {
  return (
    <div>
      <p className="eyebrow">How the ledger is kept</p>
      <h1>Sources, not spells.</h1>
      <p className="lede">
        InflationTrackr is an editorial archive, not a statistical agency. The numbers are compiled
        so a person can feel a country’s price history — and they are labelled when they are
        thinner than a national accounts release.
      </p>

      <div className="split section">
        <article className="panel stack">
          <h2>What you are looking at</h2>
          <p>
            Each country has a consumer-price index, rebased to 2015 = 100, built from published
            annual paths (World Bank, OECD, national statistical offices). Item prices are
            local-currency list prices at selected years: supermarket staples, regulated fares,
            typical city rents, and a few services that refuse to get cheaper.
          </p>
          <p>
            Years between those anchors are filled along the country’s CPI path, so a missing 1987
            milk price is an interpolation, not a newly discovered till receipt. Hover a chart: the
            tooltip is honest about the year, not about a weekly special.
          </p>
          <p>
            Brazil begins in 1995 and Mexico in 1993. Earlier series exist, but redenomination and
            hyperinflation make a single unbroken “price of bread” line more theatrical than true.
            German and French prices before the euro are shown as euro-equivalents at the official
            conversion rates.
          </p>
        </article>
        <article className="panel stack">
          <h2>Country and currency</h2>
          <p>
            Country chooses the economy — the CPI, the shelf prices, the story. Currency is a
            display lens. Switch from dollars to pounds and every number is translated at a recent
            mid-market snapshot. That is useful for comparing today’s milk in Tokyo and Toronto. It
            is not a historic exchange-rate series, and it will not tell you what a 1974 yen was
            “really” worth in 1974 dollars.
          </p>
          <p>
            Real-value math — “what is 1974 money today?” — always uses that country’s own CPI, then
            converts the result into the display currency. Housing cards are typical inner-city
            one-bedrooms, not a national average of every village.
          </p>
          <p className="note">
            Treat the archive as a way to see shape and argument: which goods outran the index,
            which countries inflated through a decade, what a wage used to buy. For legal,
            contractual, or academic work, go back to the primary series.
          </p>
        </article>
      </div>
    </div>
  );
}
