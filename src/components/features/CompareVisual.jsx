import { COUNTRIES } from '../../data/countries.js'
import { useIndicatorRows } from '../../hooks/useIndicatorRows.js'
import { formatValue } from '../../lib/formatValue.js'
import { getLatestValue } from '../../lib/transformData.js'
import CountryFlag from '../flags/CountryFlag.jsx'
import { DARK_CHART, DARK_COUNTRY_COLORS } from './darkChartColors.js'
import { CardLabel, DarkSkeleton, VisualPanel } from './VisualParts.jsx'

// Mini dashboard for "Compare with neighbours": a dot plot of the latest life expectancy
// per country (each with its own year). All dots share one axis that starts just below the
// lowest value, so a gap of a few years is clearly visible. A dot plot (not bars) is honest
// on an axis that doesn't start at 0. Each country keeps its dot shape (circle, ring, square),
// so it works without colour.
//   loading → placeholder rows
//   failed or no data → only the title (the static part)

const CODE = 'SP.DYN.LE00.IN'
const FORMAT = 'years'
// Axis ticks every 2 years
const TICK_STEP = 2

// The axis range: the even numbers just around the lowest and highest values
// (with half a year of room, so no dot sits on the very edge). 67.8 and 74.9 → 66 to 76.
function getAxisRange(values) {
  const low = Math.floor((Math.min(...values) - 0.5) / TICK_STEP) * TICK_STEP
  const high = Math.ceil((Math.max(...values) + 0.5) / TICK_STEP) * TICK_STEP
  const ticks = []
  for (let tick = low; tick <= high; tick += TICK_STEP) ticks.push(tick)
  return { low, high, ticks }
}

// Where a value sits on the axis, from 0 (left end) to 100 (right end), in percent
function toPercent(value, low, high) {
  return ((value - low) / (high - low)) * 100
}

// One dot in the country's shape (see `dot` in data/countries.js). Pakistan's is bigger.
function ShapeDot({ country }) {
  const color = DARK_COUNTRY_COLORS[country.code]
  const size = country.isPrimary ? 18 : 14
  const center = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      {country.dot === 'square' && <rect x="2" y="2" width={size - 4} height={size - 4} fill={color} />}
      {country.dot === 'ring' && (
        <circle cx={center} cy={center} r={center - 2} fill={DARK_CHART.panel} stroke={color} strokeWidth="2.5" />
      )}
      {country.dot === 'circle' && (
        <circle cx={center} cy={center} r={center - 1} fill={color} stroke={DARK_CHART.panel} strokeWidth="2" />
      )}
    </svg>
  )
}

// One country: flag, name, value and year on top; its dot on the shared axis below
function CountryRow({ country, latest, range }) {
  const weight = country.isPrimary ? 'font-semibold' : ''
  return (
    <div>
      <p className="flex items-baseline gap-2 text-sm">
        <span className="self-center">
          <CountryFlag code={country.code} />
        </span>
        <span className={`text-on-cta ${weight}`}>{country.name}</span>
        <span className={`ms-auto text-on-cta ${weight}`}>{formatValue(latest.value, FORMAT)}</span>
        <span className="text-xs text-on-cta-muted">{latest.year}</span>
      </p>

      {/* The track: a faint line with short tick marks; the dot sits at its value */}
      <div className="relative mt-1 h-6">
        <div className="absolute inset-x-0 top-1/2 h-px" style={{ backgroundColor: DARK_CHART.grid }} />
        {range.ticks.map((tick) => (
          <div
            key={tick}
            className="absolute top-1.5 bottom-1.5 w-px"
            style={{ insetInlineStart: `${toPercent(tick, range.low, range.high)}%`, backgroundColor: DARK_CHART.grid }}
          />
        ))}
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ insetInlineStart: `${toPercent(latest.value, range.low, range.high)}%` }}
        >
          <ShapeDot country={country} />
        </div>
      </div>
    </div>
  )
}

function CompareVisual() {
  const { status, rows } = useIndicatorRows(CODE)
  const title = <CardLabel>Life expectancy at birth</CardLabel>

  if (status === 'loading') {
    return (
      <VisualPanel label="Life expectancy in Pakistan, India and Bangladesh, loading.">
        {title}
        <div className="mt-5 flex flex-col gap-5">
          {COUNTRIES.map((country) => (
            <DarkSkeleton key={country.code} className="h-11 w-full" />
          ))}
        </div>
      </VisualPanel>
    )
  }

  // Only countries with a value get a row
  const items = COUNTRIES.map((country) => ({ country, latest: getLatestValue(rows, country.code) })).filter(
    (item) => item.latest.value !== null,
  )

  if (items.length === 0) {
    return <VisualPanel label="Life expectancy at birth: data unavailable.">{title}</VisualPanel>
  }

  const range = getAxisRange(items.map((item) => item.latest.value))

  // e.g. "Pakistan 67.8 years (2024), India 72.2 years (2024), ..."
  const parts = items.map(({ country, latest }) => `${country.name} ${formatValue(latest.value, FORMAT)} (${latest.year})`)
  const label = `Life expectancy at birth, latest values: ${parts.join(', ')}. Dot plot on an axis from ${range.low} to ${range.high} years.`

  return (
    <VisualPanel label={label}>
      {title}
      <div className="mt-4 flex flex-col gap-3">
        {items.map(({ country, latest }) => (
          <CountryRow key={country.code} country={country} latest={latest} range={range} />
        ))}
      </div>

      {/* The shared axis: tick labels under the tracks */}
      <div className="relative mt-1 h-5 border-t border-cta-axis">
        {range.ticks.map((tick) => (
          <span
            key={tick}
            className="absolute top-1 -translate-x-1/2 text-xs text-on-cta-muted"
            style={{ insetInlineStart: `${toPercent(tick, range.low, range.high)}%` }}
          >
            {tick}
          </span>
        ))}
      </div>
      <p className="mt-2 text-xs text-on-cta-muted">Years · axis starts at {range.low}</p>
    </VisualPanel>
  )
}

export default CompareVisual
