import { useMemo, useState } from 'react';
import { GOODS } from '../data/goods';
import { COUNTRY_BY_CODE } from '../data/countries';
import { YearScrubber } from '../components/YearScrubber';
import { useLocale, yearBounds } from '../context/LocaleContext';
import { cpiAt, displayedPrice, LATEST_YEAR } from '../lib/catalog';
import { purchasingPower, realValue } from '../lib/inflation';
import { convertAmount, formatMoney } from '../lib/money';

export function CalculatorPage() {
  const { country, currency, year, setYear } = useLocale();
  const { max } = yearBounds(country);
  const [amount, setAmount] = useState('100');
  const parsed = Number(amount);
  const localCurrency = COUNTRY_BY_CODE[country].currency;
  const thenCpi = cpiAt(country, year);
  const nowCpi = cpiAt(country, LATEST_YEAR);

  const result = useMemo(() => {
    if (!Number.isFinite(parsed) || parsed <= 0 || !thenCpi || !nowCpi) return null;
    const localAmount = convertAmount(parsed, currency, localCurrency);
    const todayLocal = realValue(localAmount, thenCpi, nowCpi);
    const pastLocal = purchasingPower(localAmount, thenCpi, nowCpi);
    return {
      today: convertAmount(todayLocal, localCurrency, currency),
      past: convertAmount(pastLocal, localCurrency, currency),
    };
  }, [currency, localCurrency, nowCpi, parsed, thenCpi]);

  const basket = GOODS.map((good) => {
    const price = displayedPrice(good.id, country, LATEST_YEAR, currency);
    const count = result && price ? result.today / price : null;
    return { good, price, count };
  }).filter((row) => row.count != null && row.count > 0.15);

  return (
    <div>
      <p className="eyebrow">Purchasing power</p>
      <h1>What was that worth?</h1>
      <p className="lede">
        Take a wage, a pocketful of cash, or a remembered price. The calculator uses {COUNTRY_BY_CODE[country].adjective}{' '}
        consumer prices to walk it forward — or backward — and then spends it on the archive.
      </p>

      <div className="calc-grid section">
        <aside className="panel stack">
          <label className="field">
            <span>Amount in {currency}</span>
            <input
              type="number"
              min="0"
              step="1"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </label>
          <YearScrubber country={country} year={year} onChange={setYear} />
          <p className="note">
            Headline CPI from {year} to {max}. Currency conversion uses a recent mid-market snapshot,
            not historic exchange rates.
          </p>
        </aside>

        <div className="stack">
          <div className="metric-row">
            <article className="stat">
              <span className="kicker">{year} money today</span>
              <b>{result ? formatMoney(result.today, currency) : '—'}</b>
              <span className="muted">Same purchasing power in {LATEST_YEAR}</span>
            </article>
            <article className="stat">
              <span className="kicker">{LATEST_YEAR} money then</span>
              <b>{result ? formatMoney(result.past, currency) : '—'}</b>
              <span className="muted">What today’s sum felt like in {year}</span>
            </article>
            <article className="stat">
              <span className="kicker">Country basket</span>
              <b>{COUNTRY_BY_CODE[country].flag}</b>
              <span className="muted">{COUNTRY_BY_CODE[country].name}</span>
            </article>
          </div>

          <article className="panel">
            <h2>What it buys now</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>You could buy</th>
                  </tr>
                </thead>
                <tbody>
                  {basket.map(({ good, price, count }) => (
                    <tr key={good.id}>
                      <td>{good.name}</td>
                      <td className="mono">{price == null ? '—' : formatMoney(price, currency)}</td>
                      <td className="mono">
                        {count == null ? '—' : `${count.toFixed(count >= 10 ? 0 : 1)} ${good.unitLabel.replace('per ', '')}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
