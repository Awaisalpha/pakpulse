import { COUNTRIES } from '../../data/countries.js'
import { getAxisTicks } from '../../lib/chartTicks.js'
import { hasVisibleData } from '../../lib/filterChartRows.js'
import IndicatorChart from '../IndicatorChart.jsx'

// What goes in the chart's place, in every state. All of them have the same height,
// so the page doesn't jump when the data arrives:
//   loading      → a still grey block (no animation)
//   error        → what went wrong + a "Try again" button
//   empty        → a short "no data" message
//   empty range  → the chosen years (or countries) have no data: a hint to widen the range
//   ready        → the chart
// Screen readers hear about loading and errors from <LoadStatus>, not from here.
//
// Props come from the explorer: status, chartRows, indicator, sparseCodes, error, retry,
// plus optional range ({ from, to, isAllYears }) and countries (the visible ones; default all three)

const BOX = 'flex h-chart flex-col items-center justify-center gap-3 rounded-lg p-4 text-center sm:h-chart-md lg:h-chart-lg'

function ChartArea({ status, chartRows, indicator, sparseCodes, error, retry, range = null, countries = COUNTRIES }) {
  if (status === 'loading') {
    return <div aria-hidden="true" className={`${BOX} bg-skeleton`} />
  }

  if (status === 'error') {
    return (
      <div className={`${BOX} bg-page`}>
        <p className="font-medium text-text">Couldn’t load {indicator.name}.</p>
        <p className="max-w-measure text-sm text-pretty text-text-muted">{error}</p>
        <button
          type="button"
          onClick={retry}
          className="inline-flex min-h-10 items-center rounded-full bg-accent px-5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
        >
          Try again
        </button>
      </div>
    )
  }

  if (chartRows.length === 0) {
    return (
      <div className={`${BOX} bg-page`}>
        <p className="font-medium text-text">No data for this indicator</p>
        <p className="max-w-measure text-sm text-pretty text-text-muted">
          The World Bank has not published values of {indicator.name} for Pakistan, India or Bangladesh since 2000.
        </p>
      </div>
    )
  }

  // The indicator has data, but not for the chosen years and countries
  if (!hasVisibleData(chartRows, countries)) {
    // All years chosen: it is the hidden countries that have the data
    const isAllYears = !range || range.isAllYears
    let years = ''
    if (!isAllYears) years = range.from === range.to ? `${range.from}` : `${range.from}–${range.to}`
    return (
      <div className={`${BOX} bg-page`}>
        <p className="font-medium text-text">{isAllYears ? 'No data for the countries shown' : `No data for ${years}`}</p>
        <p className="max-w-measure text-sm text-pretty text-text-muted">
          {isAllYears ? 'Turn on another country to see its values.' : 'Try a wider range.'}
        </p>
      </div>
    )
  }

  // Round axis labels for the shown years and countries: a year every 5 years plus the latest, and round values
  const { xTicks, yTicks } = getAxisTicks(chartRows, countries)
  return (
    <IndicatorChart
      rows={chartRows}
      countries={countries}
      indicator={indicator}
      xTicks={xTicks}
      yTicks={yTicks}
      sparseCodes={sparseCodes}
    />
  )
}

export default ChartArea
