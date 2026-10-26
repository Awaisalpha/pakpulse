import { COUNTRIES } from '../data/countries.js'
import { describeMissingYears } from './describeMissingYears.js'
import { getLatestValue } from './transformData.js'

// How complete an indicator's data is (plain functions, no React).
// Coverage is judged from 2000 to the newest year ANY country has data for,
// the same rule as docs/data-audit.md: a year the World Bank hasn't published
// for anyone yet doesn't count as missing.

const START_YEAR = 2000

// A country's series counts as "sparse" when more than this share of years is missing.
// Sparse series are drawn as dots, because a line would suggest values we don't have.
const SPARSE_SHARE = 0.3

// Every year from 2000 to the newest year with any data, e.g. [2000, 2001, ..., 2024].
// Empty if no country has any data.
export function getCoveredYears(chartRows) {
  const rowsWithData = chartRows.filter((row) => COUNTRIES.some((country) => row[country.code] !== null))
  if (rowsWithData.length === 0) return []

  const lastYear = rowsWithData[rowsWithData.length - 1].year
  const years = []
  for (let year = START_YEAR; year <= lastYear; year++) {
    years.push(year)
  }
  return years
}

// The years in `years` with no value for one country
function getMissingYears(chartRows, countryCode, years) {
  const yearsWithValue = new Set(chartRows.filter((row) => row[countryCode] !== null).map((row) => row.year))
  return years.filter((year) => !yearsWithValue.has(year))
}

// One entry per country:
//   [{ country, latestYear: 2021, missingYears: [2000, 2001, 2003, ...] }, ...]
// latestYear is null when the country has no data at all.
export function getCoverage(chartRows) {
  const years = getCoveredYears(chartRows)

  return COUNTRIES.map((country) => ({
    country,
    latestYear: getLatestValue(chartRows, country.code).year,
    missingYears: getMissingYears(chartRows, country.code, years),
  }))
}

// "1 year" or "3 years"
function countYears(count) {
  return count === 1 ? '1 year' : `${count} years`
}

// A short summary of all three countries, from getCoverage(), as a list of parts
// (the page shows them joined with " · ", and keeps each part on one line), e.g.
//   ["Complete for all three countries"]
//   ["Pakistan: 3 years missing", "India: complete", "Bangladesh: no data"]
export function summarizeCoverage(coverage) {
  const isComplete = (item) => item.latestYear !== null && item.missingYears.length === 0
  if (coverage.every(isComplete)) return ['Complete for all three countries']

  return coverage.map((item) => {
    if (item.latestYear === null) return `${item.country.name}: no data`
    if (item.missingYears.length === 0) return `${item.country.name}: complete`
    return `${item.country.name}: ${countYears(item.missingYears.length)} missing`
  })
}

// One country's coverage in words, for screen readers, e.g.
//   "Pakistan: data for 21 of 24 years, missing 2001–2003"
// `years` is the list from getCoveredYears().
export function describeCountryCoverage(item, years) {
  const name = item.country.name
  const withData = years.length - item.missingYears.length
  if (withData === 0) return `${name}: no data for any year from ${years[0]} to ${years[years.length - 1]}`
  if (item.missingYears.length === 0) return `${name}: data for all ${years.length} years, ${years[0]} to ${years[years.length - 1]}`
  return `${name}: data for ${withData} of ${years.length} years, missing ${describeMissingYears(item.missingYears)}`
}

// The codes of the countries whose series is sparse, e.g. ['PAK', 'IND', 'BGD'] for literacy
export function getSparseCodes(chartRows) {
  const years = getCoveredYears(chartRows)
  if (years.length === 0) return []

  return COUNTRIES.filter(
    (country) => getMissingYears(chartRows, country.code, years).length / years.length > SPARSE_SHARE,
  ).map((country) => country.code)
}
