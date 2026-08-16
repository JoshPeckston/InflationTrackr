import { useState } from 'react';
import { COUNTRIES } from '../data/countries';
import { GOODS } from '../data/goods';
import { PriceChart } from '../components/PriceChart';
import { useLocale } from '../context/LocaleContext';
import { displayedPrice, LATEST_YEAR, priceSeries } from '../lib/catalog';
import { cumulativeChange } from '../lib/inflation';
import { formatMoney, formatPercent } from '../lib/money';

export function ComparePage() {
  const { country, currency, year } = useLocale();
  const [leftGood, setLeftGood] = useState('milk');
  const [rightGood, setRightGood] = useState('rent');
  const [rightCountry, setRightCountry] = useState(country === 'US' ? 'GB' : 'US');

  const leftNow = displayedPrice(leftGood, country, LATEST_YEAR, currency);
  const rightNow = displayedPrice(rightGood, country, LATEST_YEAR, currency);
  const leftThen = displayedPrice(leftGood, country, year, currency);
  const rightThen = displayedPrice(rightGood, country, year, currency);
  const crossNow = displayedPrice(leftGood, rightCountry, LATEST_YEAR, currency);
  const leftChange = leftThen && leftNow ? cumulativeChange(leftThen, leftNow) : null;
  const rightChange = rightThen && rightNow ? cumulativeChange(rightThen, rightNow) : null;

  const leftSeries = priceSeries(leftGood, country).map((point) => ({
    ...point,
    value: displayedPrice(leftGood, country, point.year, currency) ?? point.value,
  }));
  const rightSeries = priceSeries(rightGood, country).map((point) => ({
    ...point,
    value: displayedPrice(rightGood, country, point.year, currency) ?? point.value,
  }));
  const crossSeries = priceSeries(leftGood, rightCountry).map((point) => ({
    ...point,
    value: displayedPrice(leftGood, rightCountry, point.year, currency) ?? point.value,
  }));

  return (
    <div>
      <p className="eyebrow">Two lines, one argument</p>
      <h1>Compare the basket.</h1>
      <p className="lede">
        Put milk against rent, or America against Britain. The archive keeps the units honest and
        the currency switch in the header applies to both sides.
      </p>

      <div className="compare-grid section">
        <aside className="panel stack">
          <label className="field">
            <span>Left item</span>
            <select value={leftGood} onChange={(event) => setLeftGood(event.target.value)}>
              {GOODS.map((good) => (
                <option key={good.id} value={good.id}>
                  {good.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Right item</span>
            <select value={rightGood} onChange={(event) => setRightGood(event.target.value)}>
              {GOODS.map((good) => (
                <option key={good.id} value={good.id}>
                  {good.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Second country for {GOODS.find((good) => good.id === leftGood)?.shortName}</span>
            <select value={rightCountry} onChange={(event) => setRightCountry(event.target.value)}>
              {COUNTRIES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.flag} {item.name}
                </option>
              ))}
            </select>
          </label>
        </aside>

        <div className="stack">
          <div className="metric-row">
            <article className="stat">
              <span className="kicker">{GOODS.find((good) => good.id === leftGood)?.shortName}</span>
              <b>{leftNow == null ? '—' : formatMoney(leftNow, currency)}</b>
              <span className={leftChange && leftChange >= 0 ? 'up' : 'down'}>
                {leftChange == null ? '—' : formatPercent(leftChange)} since {year}
              </span>
            </article>
            <article className="stat">
              <span className="kicker">{GOODS.find((good) => good.id === rightGood)?.shortName}</span>
              <b>{rightNow == null ? '—' : formatMoney(rightNow, currency)}</b>
              <span className={rightChange && rightChange >= 0 ? 'up' : 'down'}>
                {rightChange == null ? '—' : formatPercent(rightChange)} since {year}
              </span>
            </article>
            <article className="stat">
              <span className="kicker">Same item abroad</span>
              <b>{crossNow == null ? '—' : formatMoney(crossNow, currency)}</b>
              <span className="muted">
                {COUNTRIES.find((item) => item.code === rightCountry)?.name} today
              </span>
            </article>
          </div>

          <article className="panel">
            <h2>{GOODS.find((good) => good.id === leftGood)?.name}</h2>
            <PriceChart series={leftSeries} currency={currency} />
          </article>
          <article className="panel">
            <h2>{GOODS.find((good) => good.id === rightGood)?.name}</h2>
            <PriceChart series={rightSeries} currency={currency} accent="var(--pine)" />
          </article>
          <article className="panel">
            <h2>
              {GOODS.find((good) => good.id === leftGood)?.shortName} in{' '}
              {COUNTRIES.find((item) => item.code === rightCountry)?.name}
            </h2>
            <PriceChart series={crossSeries} currency={currency} accent="var(--ink-soft)" />
          </article>
        </div>
      </div>
    </div>
  );
}
