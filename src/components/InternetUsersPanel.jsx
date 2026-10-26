import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useIndicatorRows } from '../hooks/useIndicatorRows.js'
import { getYearTicks } from '../lib/chartTicks.js'
import { formatValue } from '../lib/formatValue.js'
import { getLatestValue } from '../lib/transformData.js'

// A small "dashboard widget" for the dark CTA card: Pakistan's internet users
// (% of population) as a headline number, a change indicator and an area chart.
//
//   loading → grey placeholder blocks
//   failed or no data → nothing at all (the card's left side still makes sense alone)

const CODE = 'IT.NET.USER.ZS'
const FORMAT = 'percent'
// The change indicator compares the latest value with the value this many years earlier
const CHANGE_SPAN_YEARS = 10

// The chart's height: smaller on phones
const CHART_HEIGHT = 'h-44 md:h-56'

// --- Small helpers (plain functions, no React) ---

// The value for a year, or the closest earlier year that has one. Returns a row or undefined.
function findValueAtOrBefore(rows, year) {
  const candidates = rows.filter((row) => row.year <= year && row.PAK !== null)
  return candidates[candidates.length - 1]
}

// Finds each run of missing years between two real values, e.g. 2020 → 2024.
// Returns [{ from: 2020, to: 2024, missing: [2021, 2022, 2023] }, ...]
function findGaps(rows) {
  const gaps = []
  let lastWithValue = null
  let missing = []

  for (const row of rows) {
    if (row.PAK === null) {
      missing.push(row.year)
    } else {
      if (lastWithValue !== null && missing.length > 0) {
        gaps.push({ from: lastWithValue, to: row.year, missing })
      }
      lastWithValue = row.year
      missing = []
    }
  }
  return gaps
}

// A year whose neighbours (the year before and after) both have no value.
// The area can't draw a line from a single point, so these years get a visible dot instead.
function isLoneYear(rows, index) {
  const before = rows[index - 1]
  const after = rows[index + 1]
  return rows[index].PAK !== null && (!before || before.PAK === null) && (!after || after.PAK === null)
}

// The missing years of ONE gap (always consecutive): [2021, 2022, 2023] → "2021–2023"
function describeYears(years) {
  return years.length > 1 ? `${years[0]}–${years[years.length - 1]}` : `${years[0]}`
}

// --- Pieces of the panel ---

// Up or down arrow for the change indicator (decorative: the text says the direction)
function ArrowIcon({ isUp }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {isUp ? <path d="M8 13V3M4 7l4-4 4 4" /> : <path d="M8 3v10M4 9l4 4 4-4" />}
    </svg>
  )
}

// The box shown on hover or with the arrow keys: the year and its value ("No data" in a gap).
// Recharts gives us `label` (the hovered year). We look the row up ourselves, because in a
// gap year Recharts sends no points at all, and we still want to say "No data".
function ChartTooltip({ active, label, rows }) {
  const row = rows.find((item) => item.year === label)
  if (!active || !row) return null
  return (
    <div className="rounded-lg border border-cta-axis bg-cta px-3 py-2 text-sm shadow-md">
      <p className="text-on-cta-muted">{row.year}</p>
      <p className="font-semibold text-on-cta">{formatValue(row.PAK, FORMAT)}</p>
    </div>
  )
}

// Grey blocks in the shape of the real content, shown while loading
function PanelSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="h-4 w-40 rounded bg-cta-skeleton" />
      <div className="mt-3 h-9 w-32 rounded bg-cta-skeleton" />
      <div className="mt-2 h-4 w-36 rounded bg-cta-skeleton" />
      <div className={`mt-5 ${CHART_HEIGHT} rounded-xl bg-cta-skeleton`} />
    </div>
  )
}

function InternetUsersPanel() {
  // useIndicatorRows uses fetchIndicator and toChartRows (and their cache) for us
  const { status, rows } = useIndicatorRows(CODE)

  // The panel surface stays the same in every state, so nothing jumps when data arrives
  const panelClass = 'rounded-2xl bg-cta-panel p-4 sm:p-5'

  if (status === 'loading') {
    return (
      <div className={panelClass}>
        <PanelSkeleton />
      </div>
    )
  }

  const latest = getLatestValue(rows, 'PAK')
  const first = rows.find((row) => row.PAK !== null)

  // Failed request or no data: show nothing, quietly
  if (status === 'error' || latest.value === null || !first) {
    return null
  }

  // Only the years from the first to the latest Pakistan value, so the line
  // starts at the left edge and ends at the right edge with no empty space
  const pakistanRows = rows.filter((row) => row.year >= first.year && row.year <= latest.year)
  const gaps = findGaps(pakistanRows)

  // Change in percentage points (57.3 − 10.0 = +47.3 pts), not percent change
  const reference = findValueAtOrBefore(pakistanRows, latest.year - CHANGE_SPAN_YEARS)
  const change = reference ? latest.value - reference.PAK : null
  const isUp = change !== null && change >= 0
  const changeText = change !== null ? `${isUp ? '+' : '−'}${Math.abs(change).toFixed(1)}` : ''

  // e.g. "2021–2023", or "2008, 2021–2023" if there is more than one gap
  const missingText = gaps.map((gap) => describeYears(gap.missing)).join(', ')
  const gapNote = gaps.length > 0 ? ` No data for ${missingText}.` : ''

  // One sentence for screen readers, built only from the data
  const verb = latest.value >= first.PAK ? 'rose' : 'fell'
  const summary = `Internet users in Pakistan ${verb} from ${formatValue(first.PAK, FORMAT)} of the population in ${first.year} to ${formatValue(latest.value, FORMAT)} in ${latest.year}.${gapNote} Use the left and right arrow keys to read each year.`

  const tickStyle = { fill: 'var(--color-on-cta-muted)', fontSize: 12 }

  return (
    <div className={panelClass}>
      {/* Header: label, the latest value with its year, and the change */}
      <p className="text-sm text-on-cta-muted">Internet users in Pakistan</p>
      <p className="mt-1 flex items-baseline gap-2">
        <span className="text-figure-lg font-semibold text-on-cta">{formatValue(latest.value, FORMAT)}</span>
        <span className="text-sm text-on-cta-muted">{latest.year}</span>
      </p>
      {change !== null && (
        <p className="mt-1 flex items-center gap-1 text-sm text-pak-on-dark">
          <ArrowIcon isUp={isUp} />
          {/* Short form on screen, the full words for screen readers */}
          <span aria-hidden="true">
            {changeText} pts since {reference.year}
          </span>
          <span className="sr-only">
            {isUp ? 'Up' : 'Down'} {Math.abs(change).toFixed(1)} percentage points since {reference.year}
          </span>
        </p>
      )}

      <figure className="mt-4">
        <div className={CHART_HEIGHT}>
          <ResponsiveContainer width="100%" height="100%">
            {/* accessibilityLayer: Tab focuses the chart, then the arrow keys move year by year. */}
            <AreaChart
              data={pakistanRows}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
              accessibilityLayer
              aria-label={summary}
            >
              <defs>
                {/* The area's fill: Pakistan green at the top, fading to transparent at the bottom */}
                <linearGradient id="internet-users-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-pak-on-dark)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-pak-on-dark)" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke="var(--color-cta-grid)" />
              <XAxis
                dataKey="year"
                ticks={getYearTicks(first.year, latest.year)}
                tick={tickStyle}
                tickLine={false}
                axisLine={{ stroke: 'var(--color-cta-axis)' }}
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                tick={tickStyle}
                tickLine={false}
                axisLine={false}
                width={40}
                tickCount={4}
              />
              <Tooltip
                content={(props) => <ChartTooltip {...props} rows={pakistanRows} />}
                // Dashed vertical guide at the hovered year
                cursor={{ stroke: 'var(--color-on-cta-muted)', strokeWidth: 1, strokeDasharray: '4 4' }}
                // Appears and moves instantly
                isAnimationActive={false}
                // Keep empty (null) values, so the tooltip still shows "No data" in gap years
                // instead of disappearing
                filterNull={false}
              />
              <Area
                dataKey="PAK"
                // "monotone" curves smoothly but never overshoots the real values
                type="monotone"
                stroke="var(--color-pak-on-dark)"
                strokeWidth={2}
                fill="url(#internet-users-fill)"
                // Gaps stay gaps: missing years are never filled in
                connectNulls={false}
                // A year standing alone after a gap (e.g. 2024 after 2021–2023) gets a dot,
                // because a line needs two neighbouring years to be drawn.
                // Recharts calls this function once per year; every other year draws nothing.
                dot={({ index, cx, cy }) =>
                  isLoneYear(pakistanRows, index) ? (
                    <circle key={index} cx={cx} cy={cy} r={4} fill="var(--color-pak-on-dark)" />
                  ) : (
                    <g key={index} />
                  )
                }
                activeDot={{ r: 4, fill: 'var(--color-pak-on-dark)', stroke: 'var(--color-cta-panel)', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <figcaption className="mt-3 text-xs text-on-cta-muted">
          Data: World Bank · % of population · {first.year}–{latest.year}
          {gaps.length > 0 && ` · No data for ${missingText}`}
        </figcaption>
      </figure>
    </div>
  )
}

export default InternetUsersPanel
