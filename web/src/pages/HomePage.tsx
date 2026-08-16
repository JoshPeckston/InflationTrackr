import { useMemo, useState } from 'react';
import { COUNTRY_BY_CODE } from '../data/countries';
import { CATEGORIES, GOODS } from '../data/goods';
import type { Category } from '../data/types';
import { GoodCard } from '../components/GoodCard';
import { Sparkline } from '../components/PriceChart';
import { YearScrubber } from '../components/YearScrubber';
import { useLocale } from '../context/LocaleContext';
import { cpiAt, cpiSeries, LATEST_YEAR } from '../lib/catalog';
import { cagr, cumulativeChange } from '../lib/inflation';
import { formatPercent } from '../lib/money';

export function HomePage() {
  const { country, currency, year, setYear } = useLocale();
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [query, setQuery] = useState('');
  const selected = COUNTRY_BY_CODE[country];
  const thenCpi = cpiAt(country, year);
  const nowCpi = cpiAt(country, LATEST_YEAR);
  const change = thenCpi && nowCpi ? cumulativeChange(thenCpi, nowCpi) : null;
  const annual = thenCpi && nowCpi ? cagr(thenCpi, nowCpi, LATEST_YEAR - year) : null;
  const series = cpiSeries(country);

  const goods = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return GOODS.filter((good) => {
      const matchesCategory = category === 'all' || good.category === category;
      const matchesQuery =
        needle.length === 0 ||
        good.name.toLowerCase().includes(needle) ||
        good.shortName.toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div>
      <section className="hero">
        <div>
          <p className="eyebrow">{selected.flag} {selected.name} · {selected.region}</p>
          <h1>What things used to cost.</h1>
          <p className="lede">
            {selected.blurb} Drag the year, switch country or currency, and watch the same basket
            rewrite itself.
          </p>
        </div>
        <div className="hero-stats">
          <article className="stat">
            <span className="kicker">Prices since {year}</span>
            <b className={change && change >= 0 ? 'up' : 'down'}>
              {change == null ? '—' : formatPercent(change, 0)}
            </b>
            <span className="muted">Headline consumer prices, {year} to {LATEST_YEAR}</span>
          </article>
          <article className="stat">
            <span className="kicker">Average yearly rise</span>
            <b>{annual == null ? '—' : formatPercent(annual)}</b>
            <Sparkline series={series} />
          </article>
        </div>
      </section>

      <div className="toolbar">
        <div className="pills" role="tablist" aria-label="Categories">
          <button
            type="button"
            className="pill"
            aria-pressed={category === 'all'}
            onClick={() => setCategory('all')}
          >
            All goods
          </button>
          {CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              className="pill"
              aria-pressed={category === item.id}
              onClick={() => setCategory(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          type="search"
          placeholder="Search milk, rent, petrol…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <YearScrubber country={country} year={year} onChange={setYear} />
      </div>

      {goods.length === 0 ? (
        <p className="empty">Nothing in the archive matches that search.</p>
      ) : (
        <div className="grid">
          {goods.map((good) => (
            <GoodCard
              key={good.id}
              good={good}
              country={country}
              currency={currency}
              year={year}
            />
          ))}
        </div>
      )}
    </div>
  );
}
