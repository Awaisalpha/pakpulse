import { useId } from 'react'
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { COUNTRIES } from '../data/countries.js'
import { formatAxisValue, formatValue } from '../lib/formatValue.js'
import { getLatestValue } from '../lib/transformData.js'
import CountryFlag from './flags/CountryFlag.jsx'
import LineSample, { CountryDot } from './LineSample.jsx'

// A line chart of one indicator for up to three countries, years on the x-axis.
// It only draws: loading and error states are handled by the parent.
//
// Props:
//   rows        – chart rows from toChartRows(): [{ year, PAK, IND, BGD }, ...], oldest first
//   countries   – optional: the countries to draw (lines, tooltip, summary); default all three
//   indicator   – one entry from data/indicators.js (gives the name, unit and format)
//   xTicks      – optional: the exact years to label, e.g. [2000, 2005, ..., 2025]
//   yTicks      – optional: the exact values to label, e.g. [0, 1000, 2000, 3000]
//                 (the y-axis then runs from the first to the last of them)
//   Without them, Recharts picks the labels itself.
//   sparseCodes – optional: countries with too many missing years for a line, e.g. ['PAK', 'BGD']
//                 (from getSparseCodes() in lib/dataCoverage.js). They are drawn as points only.

// The box that appears on hover, tap or arrow keys: the year, then every country's value,
// each with its flag and its line style (so it matches the chart without relying on colour).
// Recharts passes `active` (is the tooltip showing?) and `payload` (the hovered points).
function ChartTooltip({ active, payload, indicator, countries, sparseCodes }) {
  if (!active || !payload || payload.length === 0) return null

  // Every point carries the whole row, so we read every shown country from it,
  // including a country with no value that year ("No data").
  const row = payload[0].payload

  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm shadow-card">
      <p className="mb-1.5 font-semibold text-text">{row.year}</p>
      <ul className="flex flex-col gap-1.5">
        {countries.map((country) => (
          <li key={country.code} className="flex items-center gap-2">
            <CountryFlag code={country.code} />
            <LineSample country={country} asDot={sparseCodes.includes(country.code)} />
            <span className="text-text-muted">{country.name}</span>
            {/* whitespace-nowrap: a value like "56.0 per 1,000" stays on one line */}
            <span className={`ms-auto ps-4 whitespace-nowrap text-text ${country.isPrimary ? 'font-semibold' : ''}`}>
              {formatValue(row[country.code], indicator.format)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// One sentence for screen readers that sums up the chart, e.g.
// "GDP per capita (current US$), 2000 to 2025. Latest values: Pakistan $1.6k (2025), ..."
function describeChart(rows, indicator, countries, sparseCodes) {
  const firstYear = rows[0].year
  const lastYear = rows[rows.length - 1].year

  const latestValues = countries.map((country) => {
    const { value, year } = getLatestValue(rows, country.code)
    return value === null ? `${country.name} no data` : `${country.name} ${formatValue(value, indicator.format)} (${year})`
  })

  const sparseNames = countries.filter((country) => sparseCodes.includes(country.code)).map((country) => country.name)
  const sparseNote = sparseNames.length > 0 ? ` ${sparseNames.join(', ')}: shown as separate points, many years have no data.` : ''

  return `Line chart of ${indicator.name} (${indicator.unit}), ${firstYear} to ${lastYear}. Latest values: ${latestValues.join(', ')}.${sparseNote}`
}

// Recharts calls this for every point of a line, to draw (or skip) its dot.
//   Sparse series: every point gets a dot (there is no line).
//   Line series: only a lonely point gets a dot, i.e. a year with data between two years
//   without. A line needs two neighbours to show, so without the dot it would be invisible.
function makeDotRenderer(country, rows, isSparse) {
  return function renderDot({ cx, cy, index, value }) {
    const key = `${country.code}-${index}`
    if (value === null || value === undefined || cx === undefined) return <g key={key} />

    const previous = rows[index - 1]?.[country.code] ?? null
    const next = rows[index + 1]?.[country.code] ?? null
    const isLonely = previous === null && next === null

    if (!isSparse && !isLonely) return <g key={key} />
    return <CountryDot key={key} country={country} cx={cx} cy={cy} />
  }
}

// Where Pakistan's fill starts, and where its gradient is clear.
//   Axis starts at 0 or above (most indicators): the fill reaches the bottom of the chart and
//   fades from the line downwards → { baseValue: bottom tick, zeroOffset: 1 }.
//   Axis goes below 0 (e.g. GDP growth): the fill reaches the ZERO line instead, so a year
//   below zero is filled between the line and zero. The gradient is strongest at the line and
//   clear at zero, on both sides. zeroOffset is where zero sits inside the fill's box,
//   from 0 (top) to 1 (bottom): the box runs from the highest point to the lowest,
//   counting the zero line itself.
function getFillShape(rows, yTicks) {
  const hasNegativeAxis = yTicks && yTicks[0] < 0
  if (!hasNegativeAxis) {
    return { baseValue: yTicks ? yTicks[0] : 'dataMin', zeroOffset: 1 }
  }

  const pakistan = COUNTRIES.find((country) => country.isPrimary)
  const values = rows.map((row) => row[pakistan.code]).filter((value) => value !== null)
  const top = Math.max(0, ...values)
  const bottom = Math.min(0, ...values)
  const zeroOffset = top === bottom ? 1 : top / (top - bottom)
  return { baseValue: 0, zeroOffset }
}

function IndicatorChart({ rows, indicator, xTicks, yTicks, sparseCodes = [], countries = COUNTRIES }) {
  const tickStyle = { fill: 'var(--color-text-muted)', fontSize: 12 }
  // A unique id for the gradient below (SVG finds it by id, so two charts on one page must
  // not share one). useId can contain characters like ":" that break url(#...), so we drop them.
  const gradientId = `area-fill-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const fill = getFillShape(rows, yTicks)

  return (
    // Height tokens from index.css: taller on wider screens
    <div className="h-chart sm:h-chart-md lg:h-chart-lg">
      <ResponsiveContainer width="100%" height="100%">
        {/* ComposedChart can mix an Area (Pakistan) with Lines (India, Bangladesh) */}
        <ComposedChart
          data={rows}
          // Extra room on the right, so the last year's label (e.g. "2025") isn't cut off
          margin={{ top: 8, right: 24, bottom: 0, left: 0 }}
          // The chart can be focused with Tab; the arrow keys then move the tooltip
          // from year to year (Recharts' built-in "accessibility layer").
          // aria-label is what a screen reader announces when the chart gets focus.
          aria-label={`${describeChart(rows, indicator, countries, sparseCodes)} Use the left and right arrow keys to read each year.`}
        >
          {/* Pakistan's soft fill: Pakistan's green at 22% at the top, fading to fully transparent
              at zero (or at the bottom). Below zero it fades back in, so it is strongest at the line. */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-pak)" stopOpacity={0.22} />
              <stop offset={fill.zeroOffset} stopColor="var(--color-pak)" stopOpacity={0} />
              {fill.zeroOffset < 1 && <stop offset="100%" stopColor="var(--color-pak)" stopOpacity={0.22} />}
            </linearGradient>
          </defs>

          {/* Faint horizontal lines only: they help read values without competing with the data */}
          <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.7} />
          <XAxis
            dataKey="year"
            tick={tickStyle}
            tickLine={false}
            axisLine={{ stroke: 'var(--color-border)' }}
            ticks={xTicks}
            // With fixed ticks: show every one of them.
            // Without: always show the first and last year, skip labels in between when they'd overlap.
            interval={xTicks ? 0 : 'preserveStartEnd'}
            minTickGap={24}
          />
          <YAxis
            ticks={yTicks}
            domain={yTicks ? [yTicks[0], yTicks[yTicks.length - 1]] : undefined}
            // Short labels like "20%" or "$3,000 B"; the full format is in the tooltip
            tickFormatter={(value) => formatAxisValue(value, indicator.format)}
            tick={tickStyle}
            tickLine={false}
            axisLine={false}
            width={64}
          />
          <Tooltip
            content={(props) => <ChartTooltip {...props} indicator={indicator} countries={countries} sparseCodes={sparseCodes} />}
            // A dashed vertical guide at the hovered year
            cursor={{ stroke: 'var(--color-text-muted)', strokeWidth: 1, strokeDasharray: '4 4' }}
            // The tooltip jumps to its place instead of sliding
            isAnimationActive={false}
          />
          {/* SVG paints in order, later on top: the other countries first, Pakistan last */}
          {[...countries.filter((country) => !country.isPrimary), ...countries.filter((country) => country.isPrimary)].map((country) => {
            const isSparse = sparseCodes.includes(country.code)
            // Settings shared by the Area and the Line versions
            const series = {
              // A smooth curve through every point. "monotone" never bends above or
              // below the real values between two years, so it doesn't invent peaks.
              type: 'monotone',
              dataKey: country.code,
              name: country.name,
              // A sparse series has no line at all, only its points
              stroke: isSparse ? 'none' : `var(${country.colorVar})`,
              strokeWidth: country.line.width,
              strokeDasharray: country.line.dash,
              strokeLinecap: 'round',
              dot: makeDotRenderer(country, rows, isSparse),
              // The dot on each line at the hovered year
              activeDot: { r: 5, fill: `var(${country.colorVar})`, stroke: 'var(--color-surface)', strokeWidth: 2 },
              // Gaps stay gaps: a missing year is never joined over
              connectNulls: false,
              // Drawn at once, no animation
              isAnimationActive: false,
            }

            // Pakistan (as a line, not points): the line plus the gradient fill under it.
            // baseValue: where the fill stops, the bottom of the chart or the zero line (see getFillShape).
            if (country.isPrimary && !isSparse) {
              return (
                <Area
                  key={country.code}
                  {...series}
                  fill={`url(#${gradientId})`}
                  baseValue={fill.baseValue}
                />
              )
            }

            return <Line key={country.code} {...series} />
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default IndicatorChart
