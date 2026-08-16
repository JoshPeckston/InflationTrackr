import { Link, Navigate, useParams } from 'react-router-dom';
import { COUNTRIES, COUNTRY_BY_CODE } from '../data/countries';
import { GOOD_BY_ID } from '../data/goods';
import { PriceChart } from '../components/PriceChart';
import { YearScrubber } from '../components/YearScrubber';
import { useLocale } from '../context/LocaleContext';
import {
  cpiAt,
  displayedPrice,
  LATEST_YEAR,
  priceObservation,
  priceSeries,
} from '../lib/catalog';
import { cagr, cumulativeChange, realValue } from '../lib/inflation';
import { convertAmount, formatMoney, formatMultiple, formatPercent } from '../lib/money';

export function GoodPage() {
  const { id } = useParams();
  const { country, currency, year, setYear, setCountry } = useLocale();
  const good = id ? GOOD_BY_ID[id] : undefined;

  if (!good) {
    return <Navigate to="/" replace />;
  }

  const localCurrency = COUNTRY_BY_CODE[country].currency;
  const thenLocal = displayedPrice(good.id, country, year, localCurrency);
  const thenShown = displayedPrice(good.id, country, year, currency);
  const nowShown = displayedPrice(good.id, country, LATEST_YEAR, currency);
  const thenCpi = cpiAt(country, year);
  const nowCpi = cpiAt(country, LATEST_YEAR);
  const todayMoney =
    thenLocal != null && thenCpi && nowCpi
      ? convertAmount(realValue(thenLocal, thenCpi, nowCpi), localCurrency, currency)
      : null;
  const change = thenShown && nowShown ? cumulativeChange(thenShown, nowShown) : null;
  const annual = thenShown && nowShown ? cagr(thenShown, nowShown, LATEST_YEAR - year) : null;
  const vsCpi =
    todayMoney != null && nowShown != null ? cumulativeChange(todayMoney, nowShown) : null;
  const series = priceSeries(good.id, country).map((point) => ({
    ...point,
    value: displayedPrice(good.id, country, point.year, currency) ?? point.value,
  }));
  const observation = priceObservation(good.id, country, year);

  return (
    <div>
      <p className="eyebrow">
        <Link to="/">Archive</Link> / {good.category}
      </p>
      <section className="hero">
        <div>
          <h1>{good.name}</h1>
          <p className="lede">{good.blurb}</p>
          <p className="story">
            In {COUNTRY_BY_CODE[country].name} in <em>{year}</em>, {good.shortName.toLowerCase()} cost{' '}
            <em>{thenShown == null ? 'an unknown amount' : formatMoney(thenShown, currency)}</em>
            {currency !== localCurrency ? ` (converted from ${localCurrency})` : ''}. Today it is{' '}
            <em>{nowShown == null ? 'unlisted' : formatMoney(nowShown, currency)}</em>
            {change != null ? `, ${formatMultiple(1 + change)} the old ticket price` : ''}.
          </p>
        </div>
        <div className="hero-stats">
          <article className="stat">
            <span className="kicker">{good.unitLabel}</span>
            <b>{nowShown == null ? '—' : formatMoney(nowShown, currency)}</b>
            <span className="muted">{LATEST_YEAR} shelf price</span>
          </article>
          <article className="stat">
            <span className="kicker">{year} in {LATEST_YEAR} money</span>
            <b>{todayMoney == null ? '—' : formatMoney(todayMoney, currency)}</b>
            <span className="muted">
              {observation === 'observed' ? 'Observed list price' : 'Interpolated from nearby years'}
            </span>
          </article>
        </div>
      </section>

      <div className="toolbar">
        <YearScrubber country={country} year={year} onChange={setYear} />
        <p className="note">
          {vsCpi == null
            ? 'Not enough overlap to compare with headline inflation.'
            : vsCpi > 0
              ? `This item rose ${formatPercent(vsCpi)} faster than the official consumer basket.`
              : `This item rose ${formatPercent(Math.abs(vsCpi))} more slowly than the official consumer basket.`}
          {annual != null ? ` Compound rate: ${formatPercent(annual)} a year.` : ''}
        </p>
      </div>

      <div className="split section">
        <article className="panel">
          <h2>The line</h2>
          <PriceChart series={series} currency={currency} />
        </article>
        <article className="panel stack">
          <h2>Across borders</h2>
          <p className="muted">Same item, {LATEST_YEAR} prices, shown in {currency}.</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Now</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {COUNTRIES.map((item) => {
                  const price = displayedPrice(good.id, item.code, LATEST_YEAR, currency);
                  return (
                    <tr key={item.code}>
                      <td>
                        {item.flag} {item.name}
                      </td>
                      <td className="mono">{price == null ? '—' : formatMoney(price, currency)}</td>
                      <td>
                        <button type="button" className="pill" onClick={() => setCountry(item.code)}>
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </div>
  );
}
