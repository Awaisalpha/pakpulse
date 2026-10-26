import { useId } from 'react'
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useIndicatorRows } from '../../hooks/useIndicatorRows.js'
import { formatValue } from '../../lib/formatValue.js'
import { getLatestValue } from '../../lib/transformData.js'
import { DARK_CHART, DARK_COUNTRY_COLORS } from './darkChartColors.js'
import { CardLabel, Chip, DarkSkeleton, VisualPanel } from './VisualParts.jsx'

// Mini dashboard for "Live World Bank data": Pakistan's access to electricity for every year
// from 2000 to the latest, as an area on a 0–100% axis. The first and the latest point carry
// their value and year, and a dashed line at the first value makes the rise since then easy to see.
//   loading → placeholder blocks
//   failed or no data → only the title and the "Live from World Bank API" badge (the static part)

const CODE = 'EG.ELC.ACCS.ZS'
const FORMAT = 'percent'
const LINE_COLOR = DARK_COUNTRY_COLORS.PAK

// "● Live from World Bank API" (a still dot, no pulsing)
function LiveBadge() {
  return (
    <Chip>
      <span className="size-1.5 shrink-0 rounded-full bg-current" />
      Live from World Bank API
    </Chip>
  )
}

// Draws a dot with its value and year, but only on the first and the latest point.
// Recharts calls this for every point; the others get an empty group.
function EndpointDot({ cx, cy, index, payload, firstYear, latestYear }) {
  const isFirst = payload.year === firstYear
  const isLatest = payload.year === latestYear
  if (cx === undefined || payload.PAK === null || (!isFirst && !isLatest)) {
    return <g key={index} />
  }

  // The first label sits to the right of its dot, the latest label to the left
  const anchor = isFirst ? 'start' : 'end'
  const dx = isFirst ? 8 : -8
  return (
    <g key={index}>
      <circle cx={cx} cy={cy} r="5" fill={DARK_CHART.panel} stroke={LINE_COLOR} strokeWidth="2.5" />
      <text x={cx + dx} y={cy - 20} textAnchor={anchor} fontSize="13" fontWeight="600" fill="var(--color-on-cta)">
        {formatValue(payload.PAK, FORMAT)}
      </text>
      <text x={cx + dx} y={cy - 6} textAnchor={anchor} fontSize="11" fill={DARK_CHART.tick}>
        {payload.year}
      </text>
    </g>
  )
}

function LiveDataVisual() {
  const { status, rows } = useIndicatorRows(CODE)
  // A unique id for the area's fill gradient. React's ids contain characters like ":"
  // that break url(#...), so we keep only letters and digits.
  const fillId = `electricity-fill-${useId().replace(/[^a-zA-Z0-9]/g, '')}`

  const title = <CardLabel>Access to electricity · Pakistan</CardLabel>

  if (status === 'loading') {
    return (
      <VisualPanel label="Access to electricity in Pakistan, loading from the World Bank API.">
        <div className="flex items-center justify-between gap-3">
          {title}
          <DarkSkeleton className="h-5 w-24 rounded-full" />
        </div>
        <DarkSkeleton className="mt-5 h-44 w-full" />
      </VisualPanel>
    )
  }

  const latest = getLatestValue(rows, 'PAK')
  const first = rows.find((row) => row.PAK !== null)

  if (latest.value === null || !first) {
    return (
      <VisualPanel label="Access to electricity in Pakistan. Live from World Bank API.">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {title}
          <LiveBadge />
        </div>
      </VisualPanel>
    )
  }

  // Every year from the first to the latest Pakistan value. A null year stays a gap.
  const chartRows = rows.filter((row) => row.year >= first.year && row.year <= latest.year)
  // Change in percentage points (95.7 − 72.8 = 22.9), not percent change
  const change = latest.value - first.PAK
  const verb = change >= 0 ? 'rose' : 'fell'

  const label =
    `Access to electricity in Pakistan ${verb} from ${formatValue(first.PAK, FORMAT)} of the population in ${first.year} ` +
    `to ${formatValue(latest.value, FORMAT)} in ${latest.year}, a change of ${Math.abs(change).toFixed(1)} percentage points. ` +
    `Area chart on an axis from 0 to 100%. Live from World Bank API.`

  const tickStyle = { fill: DARK_CHART.tick, fontSize: 12 }

  return (
    <VisualPanel label={label}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {title}
        <LiveBadge />
      </div>

      <div className="mt-4 h-44 sm:h-52">
        <ResponsiveContainer width="100%" height="100%">
          {/* accessibilityLayer off: this chart is part of a picture (role="img"), so it must
              not be a Tab stop. Recharts makes every chart focusable unless we say so. */}
          <AreaChart data={chartRows} margin={{ top: 28, right: 16, bottom: 0, left: 0 }} accessibilityLayer={false}>
            <defs>
              {/* The area's fill: the line colour at the top, fading out towards the bottom (static) */}
              <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={LINE_COLOR} stopOpacity={0.35} />
                <stop offset="100%" stopColor={LINE_COLOR} stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={DARK_CHART.grid} />
            <XAxis
              dataKey="year"
              ticks={[first.year, latest.year]}
              interval={0}
              tick={tickStyle}
              tickLine={false}
              axisLine={{ stroke: DARK_CHART.axisLine }}
              padding={{ left: 4, right: 4 }}
            />
            {/* The axis starts at 0, so the size of the area is honest */}
            <YAxis
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={tickStyle}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            {/* The first year's level, so the rise since then stands out */}
            <ReferenceLine y={first.PAK} stroke={DARK_CHART.tick} strokeDasharray="4 4" strokeOpacity={0.6} />
            <Area
              dataKey="PAK"
              type="monotone"
              stroke={LINE_COLOR}
              strokeWidth={2.5}
              fill={`url(#${fillId})`}
              connectNulls={false}
              dot={(props) => <EndpointDot {...props} key={props.index} firstYear={first.year} latestYear={latest.year} />}
              activeDot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </VisualPanel>
  )
}

export default LiveDataVisual
