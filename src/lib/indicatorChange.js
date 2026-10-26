import { formatValue } from './formatValue.js'
import { getLatestValue } from './transformData.js'

// How much a country's value changed over about 10 years (plain functions, no React).

// How far back we compare
const YEARS_BACK = 10

const wholeNumber = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const oneDecimal = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

// The value to compare with: the year 10 years before the latest, or, if that year has
// no value, the nearest earlier year that has one. Returns the chart row, or undefined.
function findEarlierRow(chartRows, countryCode, latestYear) {
  const targetYear = latestYear - YEARS_BACK
  const candidates = chartRows.filter((row) => row.year <= targetYear && row[countryCode] !== null)
  // Rows are oldest first, so the last candidate is the one closest to the target year
  return candidates[candidates.length - 1]
}

// The change of one country's latest value since about 10 years earlier.
//   getChange(rows, 'PAK', 'percent') → { direction: 'up', text: '+12.4 pts', amount: 12.4, sinceYear: 2014 }
//   getChange(rows, 'PAK', 'usd')     → { direction: 'up', text: '+38%', amount: 38, sinceYear: 2015 }
// `amount` is the shown number (negative for a fall), for drawing the change as a bar.
// Percentages change in percentage points ("pts"); everything else in percent.
// If the earlier value is 0 or negative, a percent change means nothing, so the
// absolute change is shown instead, e.g. "+$1.2 B".
// Returns null when the country has no latest value or no earlier value to compare with.
export function getChange(chartRows, countryCode, format) {
  const latest = getLatestValue(chartRows, countryCode)
  if (latest.value === null) return null

  const earlierRow = findEarlierRow(chartRows, countryCode, latest.year)
  if (!earlierRow) return null

  const earlier = earlierRow[countryCode]
  const difference = latest.value - earlier

  // `shown` is the number as it will be displayed (rounded), so a change that rounds
  // to zero counts as "flat" and gets no + or − sign.
  let shown
  let amount
  if (format === 'percent') {
    shown = Math.round(difference * 10) / 10
    amount = `${oneDecimal.format(Math.abs(shown))} pts`
  } else if (earlier <= 0) {
    shown = difference
    amount = formatValue(Math.abs(difference), format)
  } else {
    shown = Math.round((difference / earlier) * 100)
    amount = `${wholeNumber.format(Math.abs(shown))}%`
  }

  let direction = 'flat'
  let sign = ''
  if (shown > 0) {
    direction = 'up'
    sign = '+'
  } else if (shown < 0) {
    direction = 'down'
    sign = '−' // a real minus sign, not a hyphen
  }

  return { direction, text: `${sign}${amount}`, amount: shown, sinceYear: earlierRow.year }
}
