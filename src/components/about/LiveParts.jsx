import { Fragment } from 'react'
import { Link } from 'react-router'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { COUNTRIES } from '../../data/countries.js'
import { CATEGORIES, INDICATORS } from '../../data/indicators.js'
import { useIndicatorRows } from '../../hooks/useIndicatorRows.js'
import { useLatestByCountry } from '../../hooks/useLatestByCountry.js'
import { formatValue } from '../../lib/formatValue.js'
import { getLatestValue } from '../../lib/transformData.js'
import { describeMissingYears } from '../../lib/describeMissingYears.js'
import { getYearTicks } from '../../lib/chartTicks.js'
import CountryFlag from '../flags/CountryFlag.jsx'
import { Skeleton } from '../features/VisualParts.jsx'

// Small live pictures for the "About the data" tiles.
// Each one is a single role="img" whose aria-label holds its real numbers and years.
// Every picture follows the same three states:
//   loading → grey blocks of about the final size
//   failed or no data → a quiet link to the same indicator in the explorer, so the tile
//                       around it still looks complete and nothing pretends to be a number
//   ready → the picture
// Each picture grows (flex-1) to fill the height its tile gets from the grid row.

function findIndicator(code) {
  return INDICATORS.find((indicator) => indicator.code === code)
}

// One picture: screen readers read `label` and skip the drawing inside
function Picture({ label, children }) {
  return (
    <div role="img" aria-label={label} className="flex flex-1 flex-col">
      <div aria-hidden="true" className="flex flex-1 flex-col">
        {children}
      </div>
    </div>
  )
}

// "See government spending on education in the explorer": shown in place of a picture
// when its data didn't load
function ExplorerLink({ indicator }) {
  const category = CATEGORIES.find((item) => item.name === indicator.category)
  return (
    <Link
      to={`/explore/${category.slug}?indicator=${indicator.code}`}
      className="inline-flex min-h-11 items-center self-start text-sm font-medium text-accent underline underline-offset-4 hover:text-accent-hover"
    >
      See {indicator.name.toLowerCase()} in the explorer
    </Link>
  )
}

// "Every value shows its year": each country's latest year with data, on a year track
// that runs to this year. The filled part ends at the country's latest year; the dashed
// rest is the wait for newer figures. Pakistan's name is bold (not colour alone).
export function YearTrack({ code = 'SE.XPD.TOTL.GD.ZS' }) {
  const indicator = findIndicator(code)
  const { status, latest, newestYear } = useLatestByCountry(code)

  if (status === 'loading') {
    return (
      <Picture label={`${indicator.name}, latest year by country, loading.`}>
        <div className="flex flex-1 flex-col justify-between gap-5">
          {COUNTRIES.map((country) => (
            <div key={country.code}>
              <Skeleton className="h-5 w-full" />
              <Skeleton className="mt-2 h-2 w-full" />
            </div>
          ))}
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Picture>
    )
  }

  if (newestYear === null) return <ExplorerLink indicator={indicator} />

  // The track runs from 5 years before the oldest latest year to this year
  const thisYear = new Date().getFullYear()
  const withData = latest.filter((item) => item.year !== null)
  const oldest = withData.reduce((a, b) => (b.year < a.year ? b : a))
  const trackStart = oldest.year - 5
  const span = thisYear - trackStart
  const share = (year) => ((year - trackStart) / span) * 100

  // e.g. "Pakistan 2023, India 2022, Bangladesh 2024"
  const parts = latest.map(({ country, year }) => `${country.name} ${year ?? 'no data'}`)
  const label = `${indicator.name} (${indicator.unit}), latest year with data: ${parts.join(', ')}. This year is ${thisYear}.`

  return (
    <Picture label={label}>
      <p className="text-xs font-medium text-text-muted">Education spending · latest year</p>
      {/* justify-between spreads the rows over the whole height, so no strip is left empty */}
      <ul className="mt-4 flex flex-1 flex-col justify-between gap-5">
        {latest.map(({ country, year }) => (
          <li key={country.code}>
            <div className="flex items-center gap-2">
              <CountryFlag code={country.code} />
              <span className={`text-sm text-text ${country.isPrimary ? 'font-bold' : 'font-medium'}`}>{country.name}</span>
              <span className={`ms-auto text-xl font-bold ${year === null ? 'text-text-muted' : 'text-text'}`}>{year ?? 'No data'}</span>
            </div>
            {year !== null && (
              <div className="relative mt-2 h-2">
                {/* The whole track up to this year, dashed */}
                <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-border" />
                {/* Filled up to the country's latest year */}
                <div
                  className="absolute inset-y-0 start-0 rounded-full"
                  style={{ width: `${share(year)}%`, backgroundColor: `var(${country.colorVar})` }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
      {/* The track's two ends */}
      <div className="mt-2 flex justify-between text-xs text-text-muted">
        <span>{trackStart}</span>
        <span>{thisYear} · this year</span>
      </div>
    </Picture>
  )
}

// "Enrolment can pass 100%": each country's latest gross primary enrolment as a bar,
// with one dashed line marking 100% through all bars. The "100%" label has its own row
// at the top of the line, so it never sits under a bar or touches a value.
// A grid: [country, value and year] [bar]. The line is drawn over the bar column only.
export function EnrolmentBars() {
  const indicator = findIndicator('SE.PRM.ENRR')
  const { status, latest } = useLatestByCountry(indicator.code)

  if (status === 'loading') {
    return (
      <Picture label={`${indicator.name}, loading.`}>
        <div className="flex flex-1 flex-col justify-between gap-5 pt-6">
          {COUNTRIES.map((country) => (
            <Skeleton key={country.code} className="h-8 w-full" />
          ))}
        </div>
      </Picture>
    )
  }

  const items = latest.filter((item) => item.value !== null)
  if (items.length === 0) return <ExplorerLink indicator={indicator} />

  // The scale reaches past the highest value (and always past 100%), rounded up to a multiple of 10
  const highest = Math.max(100, ...items.map((item) => item.value))
  const scaleMax = Math.ceil((highest * 1.08) / 10) * 10
  const linePosition = (100 / scaleMax) * 100

  const parts = items.map(({ country, year, value }) => `${country.name} ${year}: ${formatValue(value, indicator.format)}`)
  const label = `${indicator.name} (gross), latest year: ${parts.join(', ')}. A line marks 100%.`

  return (
    <Picture label={label}>
      <div
        className="grid flex-1 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-4"
        // Row 1 holds the "100%" label; the country rows share the rest of the height equally
        style={{ gridTemplateRows: `auto repeat(${items.length}, minmax(0, 1fr))` }}
      >
        <p className="col-start-1 row-start-1 text-xs font-medium text-text-muted">Primary school, gross</p>

        {/* The dashed 100% line over the bar column, from the label row to the last bar */}
        <div className="pointer-events-none relative col-start-2 row-start-1 self-stretch" style={{ gridRowEnd: -1 }}>
          <span
            className="absolute top-0 -translate-x-1/2 text-xs font-bold whitespace-nowrap text-text"
            style={{ insetInlineStart: `${linePosition}%` }}
          >
            100%
          </span>
          <div
            className="absolute top-5 bottom-0 border-s-2 border-dashed border-text"
            style={{ insetInlineStart: `${linePosition}%` }}
          />
        </div>

        {items.map(({ country, year, value }, index) => (
          // Fragment: the cells place themselves in the grid, so no wrapper element
          <Fragment key={country.code}>
            <div className="col-start-1 flex items-center gap-2" style={{ gridRow: index + 2 }}>
              <CountryFlag code={country.code} />
              {/* Name on top; value and year below, so the bar column gets most of the width */}
              <span className="flex flex-col leading-tight">
                <span className={`text-sm text-text ${country.isPrimary ? 'font-bold' : 'font-medium'}`}>{country.name}</span>
                <span className="text-xs whitespace-nowrap text-text-muted">
                  <span className="text-sm font-bold text-text">{formatValue(value, indicator.format)}</span> · {year}
                </span>
              </span>
            </div>
            {/* The empty track is white, so it shows on the tile's tinted picture area */}
            <div className="col-start-2 h-3 rounded-full bg-surface" style={{ gridRow: index + 2 }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${(value / scaleMax) * 100}%`, backgroundColor: `var(${country.barColorVar})` }}
              />
            </div>
          </Fragment>
        ))}
      </div>
    </Picture>
  )
}

// "Missing years stay empty": Pakistan's education spending as dots only; a year
// without data has no dot. The chart fills the tile's free height.
export function MissingYears({ code = 'SE.XPD.TOTL.GD.ZS' }) {
  const indicator = findIndicator(code)
  const { status, rows } = useIndicatorRows(code)
  const latest = getLatestValue(rows, 'PAK')

  if (status === 'loading') {
    return (
      <Picture label={`${indicator.name} in Pakistan, loading.`}>
        <Skeleton className="min-h-40 w-full flex-1" />
        <Skeleton className="mt-5 h-12 w-full" />
      </Picture>
    )
  }

  if (latest.value === null) return <ExplorerLink indicator={indicator} />

  // ONE list of years drives the axis, the dots and the summary, so they never disagree.
  // It runs from the first row (2000) to Pakistan's latest reported year.
  const chartRows = rows.filter((row) => row.year <= latest.year)
  const firstYear = chartRows[0].year
  const lastYear = latest.year
  const reportedCount = chartRows.filter((row) => row.PAK !== null).length
  const missingYears = chartRows.filter((row) => row.PAK === null).map((row) => row.year)
  const missingText = describeMissingYears(missingYears)
  const latestText = formatValue(latest.value, indicator.format)

  // Room above and below the dots: 10% of the range
  const values = chartRows.map((row) => row.PAK).filter((value) => value !== null)
  const lowest = Math.min(...values)
  const highest = Math.max(...values)
  const padding = (highest - lowest) * 0.1 || 1

  const label =
    `${indicator.name} in Pakistan (${indicator.unit}), ${firstYear} to ${lastYear}: reported in ${reportedCount} of ${chartRows.length} years, ` +
    `latest ${latestText} in ${lastYear}.` +
    (missingYears.length > 0 ? ` No data for ${missingText}.` : '')

  return (
    <Picture label={label}>
      <div className="flex items-center gap-2">
        <CountryFlag code="PAK" />
        <p className="text-xs font-medium text-text-muted">Pakistan · education spending, % of GDP</p>
      </div>

      {/* relative + absolute chart: the chart takes the box's height instead of setting it */}
      <div className="relative mt-3 min-h-40 flex-1">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            {/* accessibilityLayer off: the chart is part of a picture (role="img"), not a Tab stop */}
            <LineChart data={chartRows} margin={{ top: 8, right: 16, bottom: 0, left: 16 }} accessibilityLayer={false}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              {/* A number axis: a missing year is an empty slot. Labels every 5 years plus the last year. */}
              <XAxis
                dataKey="year"
                type="number"
                domain={[firstYear, lastYear]}
                ticks={getYearTicks(firstYear, lastYear)}
                interval={0}
                tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: 'var(--color-border)' }}
              />
              {/* Hidden axis: only sets the vertical range so the dots aren't squashed to one edge */}
              <YAxis hide domain={[lowest - padding, highest + padding]} />
              <Line
                dataKey="PAK"
                // No line between the dots: the years in between are not known
                stroke="none"
                connectNulls={false}
                dot={{ r: 4, fill: 'var(--color-pak)', stroke: 'var(--color-pak)' }}
                activeDot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Three figures from the same rows: value first, small caption under it, no lines */}
      <div className="mt-5 grid grid-cols-3 gap-4">
        <p className="flex flex-col">
          <span className="text-lg font-bold text-text">
            {reportedCount} of {chartRows.length}
          </span>
          <span className="text-xs text-text-muted">years reported</span>
        </p>
        <p className="flex flex-col">
          <span className="text-lg font-bold text-text">{missingYears.length > 0 ? missingText : 'None'}</span>
          <span className="text-xs text-text-muted">no data</span>
        </p>
        <p className="flex flex-col">
          <span className="text-lg font-bold text-text">{latestText}</span>
          <span className="text-xs text-text-muted">latest · {lastYear}</span>
        </p>
      </div>
    </Picture>
  )
}
