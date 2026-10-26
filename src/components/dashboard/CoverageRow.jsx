import { describeCountryCoverage } from '../../lib/dataCoverage.js'
import CountryFlag from '../flags/CountryFlag.jsx'
import { YearGrid } from './YearGrid.jsx'

// One country's row in the "Data coverage" grid:
//   name     – flag and country name
//   squares  – one small square per year: filled in the country's colour when the year
//              has a value, a light outlined square when it has none
//   share    – the share of years with a value ("56%"), with the latest year under it
// Wide card (the container query @md, 28rem): name | squares | share, in three columns
// (columnsClassName, shared with the year labels' row so they line up).
// Narrow card (phones): name and share on one line, the squares under them at full width.
// Screen readers get the squares as one image with a sentence (aria-label) instead of 26 squares.
//
// Props:
//   item             – one entry from getCoverage(): { country, latestYear, missingYears }
//   years            – every year shown, from getCoveredYears(), e.g. [2000, ..., 2025]
//   columnsClassName – the three columns on a wide card, from AboutIndicatorCard

// The share of years with a value, as a whole percentage, e.g. 14 of 25 years → 56
function getCompleteness(item, years) {
  const withData = years.length - item.missingYears.length
  return Math.round((withData / years.length) * 100)
}

function CoverageRow({ item, years, columnsClassName }) {
  const { country } = item
  const missing = new Set(item.missingYears)

  return (
    <li className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 ${columnsClassName}`}>
      <span className={`flex min-w-0 items-center gap-2 text-sm text-text ${country.isPrimary ? 'font-semibold' : 'font-medium'}`}>
        <CountryFlag code={country.code} />
        {country.name}
      </span>

      {/* Narrow: a second line across both columns. Wide: the middle column. */}
      <YearGrid
        years={years}
        role="img"
        aria-label={describeCountryCoverage(item, years)}
        className="col-span-2 row-start-2 @md:col-span-1 @md:col-start-2 @md:row-start-1"
      >
        {years.map((year) =>
          missing.has(year) ? (
            // No value: a light outlined square
            <span key={year} className="aspect-square rounded-[2px] border border-border-input/40" />
          ) : (
            // A value: filled in the country's colour (5:1 or more on the white card)
            <span key={year} className="aspect-square rounded-[2px]" style={{ backgroundColor: `var(${country.colorVar})` }} />
          ),
        )}
      </YearGrid>

      <span className="col-start-2 row-start-1 flex flex-col items-end text-end leading-tight @md:col-start-3">
        <span className={`text-sm text-text ${country.isPrimary ? 'font-bold' : 'font-semibold'}`}>
          {getCompleteness(item, years)}%<span className="sr-only"> of years with data</span>
        </span>
        <span className="text-xs whitespace-nowrap text-text-muted">
          {item.latestYear === null ? 'No data' : `latest ${item.latestYear}`}
        </span>
      </span>
    </li>
  )
}

export default CoverageRow
