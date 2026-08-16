import { yearBounds } from '../context/LocaleContext';

interface Props {
  country: string;
  year: number;
  onChange: (year: number) => void;
}

export function YearScrubber({ country, year, onChange }: Props) {
  const { min, max } = yearBounds(country);

  return (
    <div className="year-scrubber">
      <label htmlFor="year-range">Compare from {year}</label>
      <input
        id="year-range"
        type="range"
        min={min}
        max={max - 1}
        value={Math.min(year, max - 1)}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
