import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, YAxis } from 'recharts'
import { COUNTRIES } from '../../data/countries.js'
import { getFigure } from '../../hooks/useIndicatorRows.js'
import { formatValue } from '../../lib/formatValue.js'
import { getChange } from '../../lib/indicatorChange.js'
import CountryFlag from '../flags/CountryFlag.jsx'

// "Latest values": a small bar chart with one bar per country and a two-button toggle:
//   Latest          – each country's latest value (the year can differ per country)
//   10-year change  – each country's change from getChange(), bars going up or down
//                     from a zero line, labelled like the change badges ("+36% since 2015")
// Every bar is in its country's solid colour, the same as its line in the main chart
// (each 5:1 or more on the white card). Pakistan stands out with a soft green column
// behind its bar and a bold label and name.
// Screen readers get one sentence (aria-label) with all the numbers of the current view.
//
// Props:
//   status, rows, indicator – from the explorer (rows: only the years of the chosen range,
//                             so "latest" means the latest value within that range)
//   countries – optional: the countries that get a bar (default all three)
//   className – the frame the page gives the card

const VIEWS = [
  { id: 'latest', label: 'Latest' },
  { id: 'change', label: '10-year change' },
]

// The label row under the bars has one column per bar. Tailwind only finds class
// names written out in full, so they are listed here instead of built from a number.
const LABEL_COLUMNS = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' }

// Everything the chart needs about one country, for both views
function getBarEntries(status, rows, format, countries) {
  return countries.map((country) => {
    const figure = getFigure(status, rows, country.code)
    const change = status === 'ready' ? getChange(rows, country.code, format) : null
    return { country, figure, change }
  })
}

// The bar height and the label lines of one entry, for the chosen view.
// A missing value stays null: no bar and no label.
function getBarView(entry, view, format) {
  if (view === 'latest') {
    if (entry.figure.state !== 'ready') return { value: null, lines: [], tooltip: 'No data' }
    const text = formatValue(entry.figure.value, format)
    return { value: entry.figure.value, lines: [text], tooltip: `${text} (${entry.figure.year})` }
  }

  if (!entry.change) return { value: null, lines: [], tooltip: 'No earlier year to compare with' }
  const since = `since ${entry.change.sinceYear}`
  return { value: entry.change.amount, lines: [entry.change.text, since], tooltip: `${entry.change.text} ${since}` }
}

// One sentence for screen readers, e.g.
// "Latest values: Pakistan 58.9% (2021), India 78.2% (2024), Bangladesh 79.0% (2022)"
function describeView(entries, view, format) {
  const parts = entries.map((entry) => `${entry.country.name} ${getBarView(entry, view, format).tooltip}`)
  const title = view === 'latest' ? 'Latest values' : 'Change over about 10 years'
  return `${title}: ${parts.join(', ')}`
}

// Draws the text above a bar (or below it, for a bar going down from zero).
// Recharts calls it once per bar with the bar's position. SVG text never wraps,
// so each line stays on one line; the change view has two lines ("+36%", "since 2015").
// The value is semibold (bold for Pakistan), 13px, with tabular numbers so digits line up.
function makeLabelRenderer(data) {
  return function renderLabel({ x, y, width, height, index }) {
    const entry = data[index]
    if (!entry || entry.value === null) return null

    const centerX = x + width / 2
    const barTop = Math.min(y, y + height)
    const barBottom = Math.max(y, y + height)
    const lineHeight = 15
    // 8px gap between the text and the bar: above a bar going up, below a bar going down
    const firstLineY = entry.value < 0 ? barBottom + 8 + 13 : barTop - 8 - (entry.lines.length - 1) * lineHeight
    const valueWeight = entry.isPrimary ? 700 : 600

    return (
      <text key={entry.code} x={centerX} y={firstLineY} textAnchor="middle" fontSize={13} style={{ fontVariantNumeric: 'tabular-nums' }}>
        {entry.lines.map((line, lineIndex) => (
          <tspan
            key={line}
            x={centerX}
            dy={lineIndex === 0 ? 0 : lineHeight}
            fill={lineIndex === 0 ? 'var(--color-text)' : 'var(--color-text-muted)'}
            fontSize={lineIndex === 0 ? 13 : 12}
            fontWeight={lineIndex === 0 ? valueWeight : 400}
          >
            {line}
          </tspan>
        ))}
      </text>
    )
  }
}

// The box that appears when hovering a bar
function BarTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null
  const entry = payload[0].payload

  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2 text-sm shadow-card">
      <p className="flex items-center gap-2 font-semibold text-text">
        <CountryFlag code={entry.code} />
        {entry.name}
      </p>
      <p className="mt-0.5 whitespace-nowrap text-text-muted">{entry.tooltip}</p>
    </div>
  )
}

// The "Latest" / "10-year change" switch: two buttons, the chosen one marked with
// aria-pressed (screen readers say "pressed") and a white chip, not colour alone.
function ViewToggle({ view, onChange }) {
  return (
    <div role="group" aria-label="Chart view" className="flex rounded-full bg-pill p-0.5">
      {VIEWS.map((option) => {
        const isCurrent = option.id === view
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isCurrent}
            onClick={() => onChange(option.id)}
            className={`inline-flex min-h-10 items-center rounded-full px-3 text-sm whitespace-nowrap transition-colors ${
              isCurrent ? 'bg-surface font-semibold text-text shadow-sm' : 'text-text-muted hover:text-text'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function LatestValuesChart({ status, rows, indicator, countries = COUNTRIES, className = '' }) {
  const [view, setView] = useState('latest')

  const entries = getBarEntries(status, rows, indicator.format, countries)
  // One object per bar for Recharts
  const data = entries.map((entry) => ({
    code: entry.country.code,
    name: entry.country.name,
    isPrimary: entry.country.isPrimary,
    ...getBarView(entry, view, indicator.format),
  }))
  const hasValues = data.some((item) => item.value !== null)
  const isChange = view === 'change'

  let body
  if (status === 'loading') {
    body = (
      <div aria-hidden="true" className="mt-4 flex min-h-48 flex-1 items-end justify-around gap-6 px-4">
        {[70, 45, 85].map((height) => (
          <span key={height} className="w-10 rounded-t-md bg-skeleton" style={{ height: `${height}%` }} />
        ))}
      </div>
    )
  } else if (status === 'error') {
    body = <p className="mt-4 text-sm text-text-muted">Shows once the data loads.</p>
  } else if (!hasValues) {
    body = (
      <p className="mt-4 text-sm text-text-muted">
        {isChange ? 'No earlier years to compare with.' : 'No values to compare.'}
      </p>
    )
  } else {
    body = (
      // role="img" + aria-label: screen readers read the sentence instead of the bars and labels
      <div role="img" aria-label={describeView(entries, view, indicator.format)} className="relative mt-4 flex flex-1 flex-col">
        {/* Pakistan's soft green column, behind its bar and its name. A grid with the same
            columns as the label row below, so the tint sits exactly under Pakistan's slot. */}
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 grid ${LABEL_COLUMNS[countries.length]} gap-1`}>
          {countries.map((country) => (
            <span key={country.code} className={country.isPrimary ? 'rounded-lg bg-pak-tint' : ''} />
          ))}
        </div>

        {/* flex-1: the chart fills the card's free height, so this card can match the one beside it.
            The absolute box gives Recharts a fixed size to measure. */}
        <div className="relative min-h-48 flex-1">
          <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
              {/* No margin at the sides, so the three bars line up with the three labels below.
                  Room above (and below, for falls) for the labels. accessibilityLayer off: the aria-label covers it. */}
              <BarChart
                data={data}
                margin={{ top: isChange ? 40 : 26, right: 0, bottom: isChange ? 40 : 0, left: 0 }}
                accessibilityLayer={false}
              >
                <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.7} />
                {/* Hidden axis that always includes 0, so bars start at a zero line */}
                <YAxis hide domain={[(dataMin) => Math.min(0, dataMin), (dataMax) => Math.max(0, dataMax)]} />
                {isChange && <ReferenceLine y={0} stroke="var(--color-text-muted)" />}
                <Tooltip content={BarTooltip} cursor={{ fill: 'var(--color-canvas)' }} isAnimationActive={false} />
                <Bar
                  dataKey="value"
                  maxBarSize={44}
                  // Rounded tops; a change bar can point down, so it gets all four corners rounded
                  radius={isChange ? 4 : [6, 6, 0, 0]}
                  isAnimationActive={false}
                >
                  {countries.map((country) => (
                    <Cell key={country.code} fill={`var(${country.colorVar})`} />
                  ))}
                  <LabelList dataKey="value" content={makeLabelRenderer(data)} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* One equal column per bar, the same widths as the bars' slots above.
            `relative` keeps the labels in front of Pakistan's tinted column. */}
        <ul className={`relative mt-2 grid ${LABEL_COLUMNS[countries.length]} gap-1 border-t border-border pt-2 pb-2 text-center text-xs`}>
          {entries.map(({ country, figure, change }) => {
            // Latest view: the value's year. Change view: the two years compared.
            let years = figure.state === 'ready' ? `${figure.year}` : 'No data'
            if (isChange && change) years = `${change.sinceYear}–${figure.year}`

            return (
              <li key={country.code} className="flex min-w-0 flex-col items-center gap-1">
                <span className={`flex flex-wrap items-center justify-center gap-1.5 text-text ${country.isPrimary ? 'font-bold' : ''}`}>
                  <CountryFlag code={country.code} />
                  {country.name}
                </span>
                <span className="text-text-muted">{years}</span>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <section aria-labelledby="latest-values-title" className={`flex flex-col ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="latest-values-title" className="text-card-title font-semibold text-text">
          Latest values
        </h2>
        <ViewToggle view={view} onChange={setView} />
      </div>
      {body}
    </section>
  )
}

export default LatestValuesChart
