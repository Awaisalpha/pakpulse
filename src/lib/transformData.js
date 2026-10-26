import { COUNTRIES } from '../data/countries.js'

const COUNTRY_CODES = COUNTRIES.map((country) => country.code)

// Turns the raw World Bank rows into one object per year, oldest first:
//   [{ year: 2000, PAK: 1.2, IND: 2.3, BGD: null }, ...]
// Missing values stay null (never 0), so the chart can show them as gaps.
export function toChartRows(rawRows) {
  const ourRows = rawRows.filter((row) => COUNTRY_CODES.includes(row.countryiso3code))

  // Group by year: { "2020": { year: 2020, PAK: ..., IND: ..., BGD: ... }, ... }
  const rowsByYear = {}

  for (const row of ourRows) {
    if (!rowsByYear[row.date]) {
      // First time we see this year: every country starts as null
      const newRow = { year: Number(row.date) }
      for (const code of COUNTRY_CODES) {
        newRow[code] = null
      }
      rowsByYear[row.date] = newRow
    }

    rowsByYear[row.date][row.countryiso3code] = row.value
  }

  return Object.values(rowsByYear).sort((a, b) => a.year - b.year)
}

// Removes the years at the end where no country has a value yet
// (the latest data lags 1–2 years), so a chart doesn't end in empty space.
// Gaps in the middle are kept: they are real missing data.
export function trimTrailingEmptyYears(chartRows) {
  let lastIndexWithData = -1
  chartRows.forEach((row, index) => {
    if (COUNTRY_CODES.some((code) => row[code] !== null)) {
      lastIndexWithData = index
    }
  })
  return chartRows.slice(0, lastIndexWithData + 1)
}

// Finds the most recent year that has a value for one country.
// Returns { value, year }, or { value: null, year: null } if there is no data at all.
export function getLatestValue(chartRows, countryCode) {
  const rowsWithValue = chartRows.filter((row) => row[countryCode] !== null)

  if (rowsWithValue.length === 0) {
    return { value: null, year: null }
  }

  // chartRows are sorted oldest → newest, so the last one is the latest
  const latestRow = rowsWithValue[rowsWithValue.length - 1]
  return { value: latestRow[countryCode], year: latestRow.year }
}
