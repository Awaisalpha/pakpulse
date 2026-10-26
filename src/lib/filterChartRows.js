import { COUNTRIES } from '../data/countries.js'

// Helpers for the explorer's country toggles and year range (plain functions, no React).
// They never change the rows they get: they return new arrays.

// How many years the "Last 10 years" and "Last 5 years" presets cover
const PRESET_LENGTHS = { last10: 10, last5: 5 }

// The years where at least one country has a value, oldest first, e.g. [2000, 2001, ..., 2024].
// The year range is built from these: a year nobody has data for can't be picked.
export function getDataYears(chartRows) {
  return chartRows
    .filter((row) => COUNTRIES.some((country) => row[country.code] !== null))
    .map((row) => row.year)
}

// The { from, to } years of a preset button: 'all', 'last10' or 'last5'.
//   getPresetRange([2000, ..., 2024], 'last10') → { from: 2015, to: 2024 }
// "Last 10 years" means the latest data year and the 9 years before it. If that first year
// has no data (sparse indicators like literacy), `from` moves to the first data year after it.
// Returns null when there are no years at all.
export function getPresetRange(dataYears, preset) {
  if (dataYears.length === 0) return null

  const firstYear = dataYears[0]
  const lastYear = dataYears[dataYears.length - 1]
  if (preset === 'all') return { from: firstYear, to: lastYear }

  const windowStart = lastYear - PRESET_LENGTHS[preset] + 1
  const from = dataYears.find((year) => year >= windowStart)
  return { from, to: lastYear }
}

// The countries to draw: every country except the hidden ones.
// Pakistan is the primary country and is never hidden, even if its code is in the list.
export function getVisibleCountries(hiddenCodes) {
  return COUNTRIES.filter((country) => country.isPrimary || !hiddenCodes.includes(country.code))
}

// Only the rows from `from` to `to` (both included). Missing values stay null,
// so gaps in the chart stay gaps.
export function filterChartRows(chartRows, { from, to }) {
  return chartRows.filter((row) => row.year >= from && row.year <= to)
}

// True if at least one of the given countries has a value in at least one row.
// False means the chosen range is empty for the countries on screen.
export function hasVisibleData(chartRows, countries) {
  return chartRows.some((row) => countries.some((country) => row[country.code] !== null))
}
