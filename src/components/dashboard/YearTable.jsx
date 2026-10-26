import { useState } from 'react'
import { COUNTRIES } from '../../data/countries.js'
import { hasVisibleData } from '../../lib/filterChartRows.js'
import { formatValue } from '../../lib/formatValue.js'

// "Values by year": a real table with one row per year, newest first, and a column per
// country. It shows the latest 6 years; "Show all years" reveals the rest inside the same
// card, in a scroll box with a header row that stays in view.
// A missing value shows "—", and screen readers hear "No data" instead.
//
// On wide screens this card sits next to the chart card and is exactly as tall:
// `xl:contain-size` tells the browser to ignore this card's content when sizing the row,
// so the chart card alone decides the height and this card stretches to match.
//
// Props:
//   status, chartRows, indicator – from the explorer
//   countries – optional: the countries that get a column (default all three)
//   className – the frame the page gives the card
//   headingLevel – optional: 2 (default) for <h2>, 3 for <h3> (see ChartCard)

const SHORT_LIST_YEARS = 6

function YearTable({ status, chartRows, indicator, countries = COUNTRIES, className = '', headingLevel = 2 }) {
  const [showAll, setShowAll] = useState(false)
  const Heading = `h${headingLevel}`

  // Newest first. [...chartRows] makes a copy, because reverse() changes the array it is called on.
  const newestFirst = [...chartRows].reverse()
  const visibleRows = showAll ? newestFirst : newestFirst.slice(0, SHORT_LIST_YEARS)
  const cell = 'px-2 py-2'

  let body
  if (status === 'loading') {
    body = (
      <ul aria-hidden="true" className="mt-4 flex flex-col gap-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <li key={item} className="h-5 rounded bg-skeleton" />
        ))}
      </ul>
    )
  } else if (status === 'error') {
    body = <p className="mt-4 text-sm text-text-muted">Shows once the data loads.</p>
  } else if (chartRows.length === 0) {
    body = <p className="mt-4 text-sm text-text-muted">No years to show.</p>
  } else if (!hasVisibleData(chartRows, countries)) {
    // The chosen years have no values for the countries shown (the chart says the same)
    body = <p className="mt-4 text-sm text-text-muted">No values for these years.</p>
  } else {
    body = (
      <>
        {/* The visible title line; the table's own <caption> (hidden) says the same for screen readers */}
        <p aria-hidden="true" className="mt-1 text-sm text-text-muted">
          {indicator.name} ({indicator.unit}), newest year first
        </p>

        {/* The scroll box. flex-1 + min-h-0: it takes the card's free height and scrolls inside
            it (on wide screens). Below xl the card has no fixed height, so max-h caps it.
            Focusable (tabIndex 0) and labelled, so keyboard users can scroll it with the arrow keys. */}
        <div
          role="region"
          aria-label={`${indicator.name} by year`}
          tabIndex={0}
          className="mt-3 min-h-0 flex-1 overflow-auto overscroll-contain rounded-lg max-xl:max-h-96"
        >
          <table id="year-table" className="w-full min-w-[20rem] border-collapse text-sm">
            <caption className="sr-only">
              {indicator.name} ({indicator.unit}), newest year first
            </caption>
            <thead>
              <tr>
                {/* sticky top-0: the header row stays in view while the years scroll under it.
                    The line under it is a shadow, because a sticky cell's border scrolls away. */}
                <th
                  scope="col"
                  className={`${cell} sticky top-0 bg-surface text-start font-medium text-text-muted shadow-[inset_0_-1px_0_var(--color-border)]`}
                >
                  Year
                </th>
                {countries.map((country) => (
                  <th
                    key={country.code}
                    scope="col"
                    className={`${cell} sticky top-0 bg-surface text-end text-text shadow-[inset_0_-1px_0_var(--color-border)] ${country.isPrimary ? 'font-semibold' : 'font-medium'}`}
                  >
                    {country.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.year} className="border-b border-border last:border-b-0">
                  <th scope="row" className={`${cell} text-start font-medium text-text`}>
                    {row.year}
                  </th>
                  {countries.map((country) => (
                    <td
                      key={country.code}
                      className={`${cell} text-end whitespace-nowrap text-text ${country.isPrimary ? 'font-semibold' : ''}`}
                    >
                      {row[country.code] === null ? (
                        <>
                          <span aria-hidden="true" className="text-text-muted">
                            —
                          </span>
                          <span className="sr-only">No data</span>
                        </>
                      ) : (
                        formatValue(row[country.code], indicator.format)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Only needed when there are more years than the short list shows */}
        {newestFirst.length > SHORT_LIST_YEARS && (
          <button
            type="button"
            aria-expanded={showAll}
            aria-controls="year-table"
            onClick={() => setShowAll(!showAll)}
            className="mt-3 inline-flex min-h-10 shrink-0 items-center self-start rounded-full border border-border px-4 text-sm font-medium text-text transition-colors hover:bg-text/5"
          >
            {showAll ? 'Show fewer years' : `Show all years (${newestFirst.length})`}
          </button>
        )}
      </>
    )
  }

  return (
    <section aria-labelledby="year-table-title" className={`flex min-w-0 flex-col xl:contain-size ${className}`}>
      <Heading id="year-table-title" className="text-card-title font-semibold text-text">
        Values by year
      </Heading>
      {body}
    </section>
  )
}

export default YearTable
