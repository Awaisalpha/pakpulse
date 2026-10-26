import { useEffect } from 'react'
import { useParams } from 'react-router'
import AboutIndicatorCard from '../components/dashboard/AboutIndicatorCard.jsx'
import ChartCard from '../components/dashboard/ChartCard.jsx'
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx'
import KpiCards from '../components/dashboard/KpiCards.jsx'
import LatestValuesChart from '../components/dashboard/LatestValuesChart.jsx'
import PageHeader from '../components/dashboard/PageHeader.jsx'
import YearTable from '../components/dashboard/YearTable.jsx'
import LoadStatus from '../components/explorer/LoadStatus.jsx'
import Layout from '../components/Layout.jsx'
import { CATEGORIES } from '../data/indicators.js'
import { useExplorerView } from '../hooks/useExplorerView.js'
import { useIndicatorRows } from '../hooks/useIndicatorRows.js'
import { useSelectedIndicator } from '../hooks/useSelectedIndicator.js'
import { getSparseCodes } from '../lib/dataCoverage.js'
import { filterChartRows } from '../lib/filterChartRows.js'
import { trimTrailingEmptyYears } from '../lib/transformData.js'
import NotFoundPage from './NotFoundPage.jsx'

// The explorer ("/explore/:category?indicator=CODE&from=YEAR&to=YEAR&hide=CODES"), shown as a dashboard:
// heading → compact country cards → chart with the year table beside it (wide screens)
// → "Latest values" and "About this indicator" side by side.

// The frame every card gets: white, a hairline border, rounded corners
const CARD = 'rounded-xl border border-border bg-surface p-4'

// Loads the selected indicator and lays out the dashboard.
// It is its own component because hooks can't run after the "unknown category"
// early return in ExplorePage below (hooks must run on every render, in the same order).
function Explorer({ category }) {
  const { indicators, indicator, selectIndicator } = useSelectedIndicator(category)
  const { status, rows, error, retry } = useIndicatorRows(indicator.code)

  // The chart ends at the newest year with any data (not at empty trailing years)
  const chartRows = trimTrailingEmptyYears(rows)
  // Countries with too many missing years for a line: drawn as points.
  // Judged on all years, so a series doesn't switch between line and points when the range changes.
  const sparseCodes = getSparseCodes(rows)

  // The country toggles and year range, read from the URL
  const view = useExplorerView(indicator, chartRows)
  // Only the years in the chosen range (all years while the data loads)
  const rangeRows = view.range ? filterChartRows(chartRows, view.range) : chartRows
  const countries = view.visibleCountries

  // The browser tab's title, e.g. "Adult literacy rate · Education · PakPulse".
  // The cleanup puts back the plain title when you leave the explorer.
  useEffect(() => {
    document.title = `${indicator.name} · ${category.name} · PakPulse`
    return () => {
      document.title = 'PakPulse'
    }
  }, [indicator.name, category.name])

  // Everything the chart card needs, in one object.
  //   rows      – all years: Pakistan's big figure and its change badge don't follow the range
  //   chartRows – only the chosen years; countries – only the visible countries
  const explorer = {
    category,
    indicators,
    indicator,
    selectIndicator,
    status,
    rows,
    chartRows: rangeRows,
    range: view.range,
    countries,
    sparseCodes,
    error,
    retry,
  }

  return (
    <DashboardLayout category={category} indicator={indicator}>
      <LoadStatus status={status} indicator={indicator} error={error} />

      <div className="flex flex-col gap-4">
        <PageHeader category={category} indicator={indicator} view={view} />
        {/* The KPI cards always show all three countries and all years */}
        <KpiCards status={status} rows={rows} indicator={indicator} />

        {/* Wide screens: chart three fifths, table two fifths, both the same height
            (grid items stretch to the row; the table card is sized by the chart, see YearTable) */}
        <div className="grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <ChartCard explorer={explorer} className={CARD} />
          <YearTable status={status} chartRows={rangeRows} countries={countries} indicator={indicator} className={CARD} />
        </div>

        {/* Grid items stretch to the row's height, so both cards are equally tall */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Each country's latest value within the chosen range */}
          <LatestValuesChart status={status} rows={rangeRows} countries={countries} indicator={indicator} className={CARD} />
          <AboutIndicatorCard status={status} rows={rows} indicator={indicator} className={CARD} />
        </div>
      </div>
    </DashboardLayout>
  )
}

function ExplorePage() {
  // For the URL /explore/health, useParams() returns { category: 'health' }
  const { category: slug } = useParams()
  const category = CATEGORIES.find((item) => item.slug === slug)

  // A slug that is not in our config, like /explore/banana: the normal
  // "Page not found" page, with the site's navbar and footer
  if (!category) {
    return (
      <Layout>
        <NotFoundPage />
      </Layout>
    )
  }

  return <Explorer category={category} />
}

export default ExplorePage
