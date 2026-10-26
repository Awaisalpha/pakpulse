import { CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useIndicatorRows } from '../../hooks/useIndicatorRows.js'
import { describeMissingYears } from '../../lib/describeMissingYears.js'
import { formatValue } from '../../lib/formatValue.js'
import { getLatestValue } from '../../lib/transformData.js'
import { DARK_CHART, DARK_COUNTRY_COLORS } from './darkChartColors.js'
import { CardLabel, Chip, DarkSkeleton, VisualPanel } from './VisualParts.jsx'

// Mini dashboard for "Honest about gaps": Pakistan's adult literacy as one dot per reported
// year (no line between them), a shaded band over each run of years with no data,
// a key, and the list of missing years.
//   loading → placeholder blocks
//   failed or no data → only the key (the static part)

const CODE = 'SE.ADT.LITR.ZS'
const FORMAT = 'percent'
const DOT_COLOR = DARK_COUNTRY_COLORS.PAK

// "● Reported year   ▭ No data"
function Key() {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-on-cta">
      <span className="inline-flex items-center gap-2">
        <span className="size-2.5 shrink-0 rounded-full bg-pak-on-dark" />
        Reported year
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-3 w-4 shrink-0 rounded-sm border border-cta-axis bg-cta-grid" />
        No data
      </span>
    </p>
  )
}

// Groups missing years into runs: [2000, 2001, 2002, 2015] → [{ from: 2000, to: 2002 }, { from: 2015, to: 2015 }]
function toRuns(years) {
  const runs = []
  for (const year of years) {
    const lastRun = runs[runs.length - 1]
    if (lastRun && year === lastRun.to + 1) lastRun.to = year
    else runs.push({ from: year, to: year })
  }
  return runs
}

function GapsVisual() {
  const { status, rows } = useIndicatorRows(CODE)
  const title = <CardLabel>Adult literacy · Pakistan</CardLabel>

  if (status === 'loading') {
    return (
      <VisualPanel label="Adult literacy rate in Pakistan, loading.">
        {title}
        <DarkSkeleton className="mt-5 h-40 w-full" />
        <div className="mt-4">
          <Key />
        </div>
      </VisualPanel>
    )
  }

  const latest = getLatestValue(rows, 'PAK')

  if (latest.value === null) {
    return (
      <VisualPanel label="Key: a dot is a reported year, a shaded band is a stretch of years with no data.">
        <Key />
      </VisualPanel>
    )
  }

  // Every year from the first row (2000) to Pakistan's latest reported year
  const chartRows = rows.filter((row) => row.year <= latest.year)
  const firstYear = chartRows[0].year
  const reported = chartRows.filter((row) => row.PAK !== null)
  const missingYears = chartRows.filter((row) => row.PAK === null).map((row) => row.year)
  const missingText = describeMissingYears(missingYears)

  // Vertical range: round tens around the values, e.g. 49.9 and 59.1 → 40% to 70%
  const values = reported.map((row) => row.PAK)
  const low = Math.floor((Math.min(...values) - 5) / 10) * 10
  const high = Math.ceil((Math.max(...values) + 5) / 10) * 10

  const label =
    `Adult literacy rate in Pakistan, ${firstYear} to ${latest.year}: reported in ${reported.length} of ${chartRows.length} years, ` +
    `from ${formatValue(reported[0].PAK, FORMAT)} in ${reported[0].year} to ${formatValue(latest.value, FORMAT)} in ${latest.year}.` +
    (missingYears.length > 0 ? ` No data for ${missingText}.` : '')

  const tickStyle = { fill: DARK_CHART.tick, fontSize: 12 }

  return (
    <VisualPanel label={label}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {title}
        <Chip>
          Latest {formatValue(latest.value, FORMAT)} · {latest.year}
        </Chip>
      </div>

      <div className="mt-4 h-40 sm:h-44">
        <ResponsiveContainer width="100%" height="100%">
          {/* accessibilityLayer off: this chart is part of a picture (role="img"), so it must
              not be a Tab stop. Recharts makes every chart focusable unless we say so. */}
          <LineChart data={chartRows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} accessibilityLayer={false}>
            {/* A shaded band over each run of missing years (half a year wider on each side, to cover the year) */}
            {toRuns(missingYears).map((run) => (
              <ReferenceArea
                key={run.from}
                x1={run.from - 0.5}
                x2={run.to + 0.5}
                fill={DARK_CHART.grid}
                fillOpacity={1}
                ifOverflow="visible"
              />
            ))}
            <CartesianGrid vertical={false} stroke={DARK_CHART.grid} />
            {/* A number axis (not one slot per year), so the bands can start and end between years */}
            <XAxis
              dataKey="year"
              type="number"
              domain={[firstYear - 0.5, latest.year + 0.5]}
              ticks={[firstYear, latest.year]}
              tick={tickStyle}
              tickLine={false}
              axisLine={{ stroke: DARK_CHART.axisLine }}
            />
            <YAxis
              domain={[low, high]}
              ticks={[low, (low + high) / 2, high]}
              tickFormatter={(value) => `${value}%`}
              tick={tickStyle}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Line
              dataKey="PAK"
              // No line between the dots: the years in between are not known
              stroke="none"
              connectNulls={false}
              dot={{ r: 4, fill: DOT_COLOR, stroke: DARK_CHART.panel, strokeWidth: 1.5 }}
              activeDot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Key />
        {missingYears.length > 0 && (
          <p className="text-sm text-on-cta-muted">
            <span className="font-semibold text-on-cta">No data:</span> {missingText}
          </p>
        )}
      </div>
    </VisualPanel>
  )
}

export default GapsVisual
