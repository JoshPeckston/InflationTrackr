import { Link } from 'react-router-dom';
import type { Good } from '../data/types';
import { displayedPrice, LATEST_YEAR, priceSeries } from '../lib/catalog';
import { cumulativeChange } from '../lib/inflation';
import { formatMoney, formatPercent } from '../lib/money';
import { Sparkline } from './PriceChart';

interface Props {
  good: Good;
  country: string;
  currency: string;
  year: number;
}

export function GoodCard({ good, country, currency, year }: Props) {
  const thenPrice = displayedPrice(good.id, country, year, currency);
  const nowPrice = displayedPrice(good.id, country, LATEST_YEAR, currency);
  const change = thenPrice && nowPrice ? cumulativeChange(thenPrice, nowPrice) : null;
  const series = priceSeries(good.id, country).map((point) => ({
    ...point,
    value: displayedPrice(good.id, country, point.year, currency) ?? point.value,
  }));

  return (
    <Link className="card" to={`/good/${good.id}`}>
      <div className="card-top">
        <span className="kicker">{good.category}</span>
        {change != null && (
          <span className={change >= 0 ? 'up' : 'down'}>{formatPercent(change)}</span>
        )}
      </div>
      <h3>{good.shortName}</h3>
      <p>{good.unitLabel}</p>
      <Sparkline series={series} />
      <div className="price-pair">
        <div>
          <span className="kicker">{year}</span>
          <strong>{thenPrice == null ? '—' : formatMoney(thenPrice, currency)}</strong>
        </div>
        <div>
          <span className="kicker">{LATEST_YEAR}</span>
          <strong>{nowPrice == null ? '—' : formatMoney(nowPrice, currency)}</strong>
        </div>
      </div>
      <span className="card-follow">Open the line →</span>
    </Link>
  );
}
