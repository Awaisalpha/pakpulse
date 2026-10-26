import { Link } from 'react-router'
import { INDICATORS } from '../data/indicators.js'
import { useIndicatorRows } from '../hooks/useIndicatorRows.js'
import { getSparseCodes } from '../lib/dataCoverage.js'
import { trimTrailingEmptyYears } from '../lib/transformData.js'
import ChartCard from './dashboard/ChartCard.jsx'
import KpiCards from './dashboard/KpiCards.jsx'
import YearTable from './dashboard/YearTable.jsx'
import LoadStatus from './explorer/LoadStatus.jsx'

// The landing page's dashboard preview: the same parts as the explorer, for one indicator.
//   centred heading → three country cards → chart card and "Values by year" table side by side
//   (wide screens; below that the table goes under the chart) → "Open in explorer" link.
// Loading, error ("Try again") and empty states come from the reused cards themselves,
// so a failed request only affects this section, not the rest of the page.

const FEATURED_CODE = 'NY.GDP.PCAP.CD'
const EXPLORER_URL = `/explore/economy?indicator=${FEATURED_CODE}`

// The same card frame as in the explorer
const CARD = 'rounded-xl border border-border bg-surface p-4'

function LandingDashboard() {
  const indicator = INDICATORS.find((item) => item.code === FEATURED_CODE)
  const { status, rows, error, retry } = useIndicatorRows(FEATURED_CODE)

  // Prepared the same way as in ExplorePage, because ChartCard expects the same object
  const chartRows = trimTrailingEmptyYears(rows)
  const sparseCodes = getSparseCodes(rows)
  const explorer = { indicator, status, rows, chartRows, sparseCodes, error, retry }

  return (
    // Side padding on the section; the intro and the dashboard each centre themselves (mx-auto)
    // on the same line as the hero
    <section aria-labelledby="landing-dashboard-title" className="px-gutter sm:px-gutter-wide">
      <div className="mx-auto max-w-hero-text text-center">
        <h2 id="landing-dashboard-title" className="text-heading font-semibold text-balance text-text">
          {indicator.name} in Pakistan, India and Bangladesh
        </h2>
        <p className="mt-2 text-pretty text-text-muted">
          The latest value for each country, the trend since 2000 and the figure for every year, in current US dollars.
        </p>
      </div>

      {/* Screen readers hear "Loading…" and errors from here */}
      <LoadStatus status={status} indicator={indicator} error={error} />

      <div className="mx-auto mt-8 flex max-w-preview flex-col gap-4">
        <KpiCards status={status} rows={rows} indicator={indicator} />

        {/* The same grid as the explorer: chart three fifths, table two fifths, equal heights */}
        <div className="grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* h3: this section already has the <h2> */}
          <ChartCard explorer={explorer} className={CARD} headingLevel={3} />
          <YearTable status={status} chartRows={chartRows} indicator={indicator} className={CARD} headingLevel={3} />
        </div>
      </div>

      {/* Centred under the dashboard; opens the explorer on this same indicator */}
      <div className="mt-4 flex justify-center">
        <Link
          to={EXPLORER_URL}
          className="inline-flex min-h-11 items-center gap-1 font-medium text-accent underline underline-offset-4 hover:text-accent-hover"
        >
          Open in explorer
          <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10" />
            <path d="m9 4 4 4-4 4" />
          </svg>
        </Link>
      </div>
    </section>
  )
}

export default LandingDashboard
