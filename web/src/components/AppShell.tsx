import { NavLink, Outlet } from 'react-router-dom';
import { COUNTRIES } from '../data/countries';
import { CURRENCIES } from '../data/currencies';
import { useLocale } from '../context/LocaleContext';

const LINKS = [
  { to: '/', label: 'Archive' },
  { to: '/compare', label: 'Compare' },
  { to: '/calculator', label: 'Calculator' },
  { to: '/methodology', label: 'Sources' },
];

export function AppShell() {
  const { country, currency, setCountry, setCurrency, theme, toggleTheme } = useLocale();

  return (
    <div className="shell">
      <header className="masthead">
        <div className="masthead-inner">
          <NavLink to="/" className="brand">
            <span className="brand-kicker">A living ledger</span>
            <span className="brand-name">InflationTrackr</span>
          </NavLink>
          <nav className="nav" aria-label="Primary">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="locale-bar">
            <label className="field">
              <span>Country</span>
              <select value={country} onChange={(event) => setCountry(event.target.value)}>
                {COUNTRIES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.flag} {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Display currency</span>
              <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
                {CURRENCIES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.code} · {item.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to paper theme' : 'Switch to night theme'}
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
          </div>
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <span>Everyday prices, kept like a public ledger.</span>
          <span>FX snapshot for display only · CPI for real-value math</span>
        </div>
      </footer>
    </div>
  );
}
