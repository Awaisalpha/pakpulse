import { COUNTRIES } from '../../data/countries.js'
import { getFigure } from '../../hooks/useIndicatorRows.js'
import { getChange } from '../../lib/indicatorChange.js'
import { trimTrailingEmptyYears } from '../../lib/transformData.js'
import { FigureNote, FigureValue } from '../Figure.jsx'
import CountryFlag from '../flags/CountryFlag.jsx'
import ChangeBadge from './ChangeBadge.jsx'
import Sparkline from './Sparkline.jsx'

// One card per country, the three sharing the row equally. Each card has two columns:
//   left  – flag and name, the latest value (large), its year
//   right – a small sparkline of the last 15 years, with the change badge under it
// When a card is narrow, the right column drops below the value. This is decided by the
// card's OWN width (a "container query": @container on the card, @min-[17rem]: on the
// parts), not the screen width, because the cards get narrow at several screen sizes.
// Pakistan's card is filled with Pakistan's green, with white text and a white sparkline.
//
// Props: status, rows, indicator – from the explorer

const SPARKLINE_YEARS = 15

// A series counts as sparse (drawn as dots) when more than 30% of its years are missing,
// the same rule as the main chart uses
function isSparseSeries(rows, countryCode) {
  const missing = rows.filter((row) => row[countryCode] === null).length
  return rows.length > 0 && missing / rows.length > 0.3
}

function KpiCards({ status, rows, indicator }) {
  // The last 15 years that have any data, for the sparklines
  const recentRows = trimTrailingEmptyYears(rows).slice(-SPARKLINE_YEARS)

  return (
    // A list, so screen readers announce "list, 3 items".
    // Phones: one card per row. From sm: three equal columns.
    <ul className="grid gap-3 sm:grid-cols-3">
      {COUNTRIES.map((country) => {
        const figure = getFigure(status, rows, country.code)
        const change = status === 'ready' ? getChange(rows, country.code, indicator.format) : null

        // Pakistan: white text on green (7.7:1), secondary text in light green (6.0:1),
        // white sparkline (7.7:1). Others: dark text on white, sparkline in the country colour.
        const colors = country.isPrimary
          ? { card: 'border-pak bg-pak', main: 'text-on-pak', muted: 'text-on-pak-muted', line: 'var(--color-on-pak)' }
          : { card: 'border-border bg-surface', main: 'text-text', muted: 'text-text-muted', line: `var(${country.colorVar})` }

        return (
          <li key={country.code} className={`@container min-w-0 rounded-xl border px-4 py-3 ${colors.card}`}>
            <div className="flex flex-col gap-3 @min-[17rem]:flex-row @min-[17rem]:items-end @min-[17rem]:justify-between">
              {/* Left column */}
              <div className="flex min-w-0 flex-col gap-1">
                <p className={`flex items-center gap-2 text-sm font-medium ${colors.main}`}>
                  <CountryFlag code={country.code} />
                  {country.name}
                </p>
                {/* whitespace-nowrap: a value like "56.0 per 1,000" never breaks onto two lines */}
                <p className={`text-figure whitespace-nowrap ${colors.main} ${country.isPrimary ? 'font-bold' : 'font-semibold'}`}>
                  <FigureValue figure={figure} format={indicator.format} />
                </p>
                <p className={`text-sm ${colors.muted}`}>
                  <FigureNote figure={figure} />
                </p>
              </div>

              {/* Right column: only once the data is there */}
              {status === 'ready' && figure.state === 'ready' && (
                // At least 8rem wide, wider if the badge text needs it
                <div className="flex shrink-0 flex-col items-start gap-2 @min-[17rem]:min-w-32 @min-[17rem]:items-end">
                  <Sparkline
                    rows={recentRows}
                    countryCode={country.code}
                    color={colors.line}
                    isSparse={isSparseSeries(recentRows, country.code)}
                  />
                  <ChangeBadge change={change} onPakCard={country.isPrimary} />
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default KpiCards
