import { COUNTRIES } from '../data/countries.js'
import { getPresetRange } from './filterChartRows.js'

// Reads and writes the explorer's view choices in the URL (plain functions, no React):
//   ?indicator=NY.GDP.PCAP.CD&from=2010&to=2025&hide=IND
//   indicator – the selected indicator (read by useSelectedIndicator)
//   from, to  – the year range; both left out means "all years"
//   hide      – hidden countries, separated by commas; left out means "all countries"
// A link anyone can change by hand can contain anything, so every value is checked.
// A value that makes no sense is ignored, as if it weren't there.

// The hidden country codes, e.g. ['IND'].
// Only India and Bangladesh can be hidden: 'PAK', unknown codes and duplicates are dropped.
export function readHiddenCodes(searchParams) {
  const requested = (searchParams.get('hide') ?? '').split(',')
  return COUNTRIES.filter((country) => !country.isPrimary && requested.includes(country.code)).map(
    (country) => country.code,
  )
}

// One year from the URL, or null if it is missing or isn't one of the data years
function readYear(text, dataYears) {
  if (text === null) return null
  const year = Number(text)
  return dataYears.includes(year) ? year : null
}

// The year range from the URL: { from, to, isAllYears }.
//   A missing or unknown `from` → the first data year; the same for `to` → the last one.
//   `from` after `to` → all years.
// Returns null when there are no data years (still loading, or no data at all).
export function readYearRange(searchParams, dataYears) {
  const all = getPresetRange(dataYears, 'all')
  if (!all) return null

  let from = readYear(searchParams.get('from'), dataYears) ?? all.from
  let to = readYear(searchParams.get('to'), dataYears) ?? all.to
  if (from > to) {
    from = all.from
    to = all.to
  }

  return { from, to, isAllYears: from === all.from && to === all.to }
}

// The "?..." part of an explorer URL.
//   buildExplorerSearch({ indicatorCode: 'NY.GDP.PCAP.CD', hiddenCodes: ['IND'], range: { from: 2010, to: 2025 } })
//   → "?indicator=NY.GDP.PCAP.CD&from=2010&to=2025&hide=IND"
// range: null (or left out) means all years, so no from/to is written.
// Built by hand instead of with URLSearchParams, which would write the comma as "%2C".
// That's safe here: codes and years only contain letters, digits and dots.
export function buildExplorerSearch({ indicatorCode, hiddenCodes = [], range = null }) {
  const parts = [`indicator=${indicatorCode}`]
  if (range) {
    parts.push(`from=${range.from}`, `to=${range.to}`)
  }
  if (hiddenCodes.length > 0) {
    parts.push(`hide=${hiddenCodes.join(',')}`)
  }
  return `?${parts.join('&')}`
}
