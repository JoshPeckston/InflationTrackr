import { useMemo, useState } from 'react';
import { formatMoney } from '../lib/money';
import type { SeriesPoint } from '../lib/series';

interface Props {
  series: SeriesPoint[];
  currency: string;
  accent?: string;
  height?: number;
}

export function PriceChart({ series, currency, accent = 'var(--copper)', height = 280 }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const width = 720;
  const padding = { top: 16, right: 16, bottom: 28, left: 16 };

  const geometry = useMemo(() => {
    if (series.length === 0) return null;
    const values = series.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || max * 0.08 || 1;
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const x = (index: number) =>
      padding.left + (series.length === 1 ? innerWidth / 2 : (index / (series.length - 1)) * innerWidth);
    const y = (value: number) =>
      padding.top + innerHeight - ((value - min) / span) * innerHeight;
    const line = series
      .map((point, index) => `${index === 0 ? 'M' : 'L'}${x(index).toFixed(2)} ${y(point.value).toFixed(2)}`)
      .join(' ');
    const area = `${line} L${x(series.length - 1).toFixed(2)} ${height - padding.bottom} L${x(0).toFixed(2)} ${height - padding.bottom} Z`;
    return { min, max, x, y, line, area };
  }, [height, series]);

  if (!geometry || series.length === 0) {
    return <p className="empty">No series for this selection yet.</p>;
  }

  const active = hover == null ? series[series.length - 1] : series[hover];

  return (
    <div className="chart-wrap" style={{ position: 'relative' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Historic price chart"
        onMouseLeave={() => setHover(null)}
      >
        <path d={geometry.area} fill={accent} opacity="0.16" />
        <path d={geometry.line} fill="none" stroke={accent} strokeWidth="2.4" strokeLinejoin="round" />
        {series
          .filter((point) => point.year % 10 === 0 || point === series[0] || point === series[series.length - 1])
          .map((point) => {
            const index = series.indexOf(point);
            return (
              <text
                key={point.year}
                x={geometry.x(index)}
                y={height - 8}
                textAnchor="middle"
                fill="currentColor"
                opacity="0.55"
                fontSize="11"
                fontFamily="IBM Plex Mono, monospace"
              >
                {point.year}
              </text>
            );
          })}
        {series.map((point, index) => (
          <rect
            key={point.year}
            x={geometry.x(index) - 8}
            y={0}
            width="16"
            height={height}
            fill="transparent"
            onMouseEnter={() => setHover(index)}
          />
        ))}
        <circle
          cx={geometry.x(series.indexOf(active))}
          cy={geometry.y(active.value)}
          r="5"
          fill={accent}
        />
      </svg>
      <div className="tooltip" style={{ left: 16, top: 8 }}>
        {active.year} · {formatMoney(active.value, currency)}
      </div>
    </div>
  );
}

export function Sparkline({ series, accent = 'var(--copper)' }: { series: SeriesPoint[]; accent?: string }) {
  if (series.length < 2) return null;
  const width = 160;
  const height = 42;
  const values = series.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const d = series
    .map((point, index) => {
      const x = (index / (series.length - 1)) * width;
      const y = height - ((point.value - min) / span) * (height - 4) - 2;
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={d} fill="none" stroke={accent} strokeWidth="2" />
    </svg>
  );
}
