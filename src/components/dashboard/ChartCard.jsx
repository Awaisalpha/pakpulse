import { COUNTRIES } from '../../data/countries.js'
import { getFigure } from '../../hooks/useIndicatorRows.js'
import { getChange } from '../../lib/indicatorChange.js'
import ChartArea from '../explorer/ChartArea.jsx'
import { FigureNote, FigureValue } from '../Figure.jsx'
import CountryFlag from '../flags/CountryFlag.jsx'
import LineSample from '../LineSample.jsx'
import ChangeBadge from './ChangeBadge.jsx'

// The main chart card: a heading, Pakistan's latest value shown large with its year and
// change badge, a legend (flag, line style, name), and the chart (or its loading/error/empty state).
//
// Props:
//   explorer  – everything ExplorePage loaded (status, rows, chartRows, indicator, ...)
//   className – the frame each layout gives the card
//   headingLevel – optional: 2 (default) for <h2>, 3 for <h3> when the card sits
//                  inside a section that already has its own <h2> (the landing page)

// A key that names each shown country next to its flag and line (or point) style
function ChartLegend({ countries, sparseCodes }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-text">
      {countries.map((country) => (
        <li key={country.code} className="flex items-center gap-2">
          <CountryFlag code={country.code} />
          <LineSample country={country} asDot={sparseCodes.includes(country.code)} />
          <span className={country.isPrimary ? 'font-semibold' : ''}>{country.name}</span>
        </li>
      ))}
    </ul>
  )
}

function ChartCard({ explorer, className = '', headingLevel = 2 }) {
  // range and countries come from the explorer's controls; without them (the landing page)
  // the chart shows every year and all three countries
  const { status, rows, chartRows, indicator, sparseCodes, error, retry, range = null, countries = COUNTRIES } = explorer
  // A component name in a variable: <Heading> renders <h2> or <h3>.
  // It must start with a capital letter, or React would look for an HTML tag called "heading".
  const Heading = `h${headingLevel}`
  // Pakistan's big figure and change badge use all years (`rows`), like the KPI cards
  const pakistan = COUNTRIES.find((country) => country.isPrimary)
  const figure = getFigure(status, rows, pakistan.code)
  const change = status === 'ready' ? getChange(rows, pakistan.code, indicator.format) : null
  // The years the chart covers, e.g. "2010–2025": the chosen range, or else the years in
  // the rows (only once the data is there)
  let years = ''
  if (range) {
    years = range.from === range.to ? `${range.from}` : `${range.from}–${range.to}`
  } else if (chartRows.length > 0) {
    years = `${chartRows[0].year}–${chartRows[chartRows.length - 1].year}`
  }

  return (
    <section aria-labelledby="chart-title" className={`min-w-0 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {/* The title in dark semibold; the years after it stay muted, like a subtitle */}
          <Heading id="chart-title" className="text-card-title font-semibold text-text">
            {indicator.name} over time
            {years && <span className="font-normal text-text-muted"> · {years}</span>}
          </Heading>
          <p className="mt-1 text-figure-lg font-bold whitespace-nowrap text-text">
            <FigureValue figure={figure} format={indicator.format} />
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-sm text-text-muted">
              <FigureNote figure={figure} country={pakistan.name} />
            </p>
            <ChangeBadge change={change} />
          </div>
        </div>
        <ChartLegend countries={countries} sparseCodes={sparseCodes} />
      </div>

      <div className="mt-6">
        <ChartArea
          status={status}
          chartRows={chartRows}
          range={range}
          countries={countries}
          indicator={indicator}
          sparseCodes={sparseCodes}
          error={error}
          retry={retry}
        />
      </div>
    </section>
  )
}

export default ChartCard
