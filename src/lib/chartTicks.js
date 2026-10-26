import { COUNTRIES } from '../data/countries.js'

// Helpers that pick where a chart's axis labels go (plain functions, no React).

// X-axis labels: every year divisible by `step` (5 unless given), plus the latest year.
// A label too close to the latest one is dropped so they don't overlap
// (under 3 years for a step of 5, under one step otherwise).
//   getYearTicks(2000, 2025)    → [2000, 2005, 2010, 2015, 2020, 2025]
//   getYearTicks(2001, 2024)    → [2005, 2010, 2015, 2020, 2024]
//   getYearTicks(2016, 2025, 2) → [2016, 2018, 2020, 2022, 2025]
export function getYearTicks(firstYear, lastYear, step = 5) {
  const minGapToLast = step === 5 ? 3 : step
  const ticks = []
  for (let year = firstYear; year <= lastYear; year++) {
    if (year % step === 0 && lastYear - year >= minGapToLast) ticks.push(year)
  }
  ticks.push(lastYear)
  return ticks
}

// The label step for a range of years: every year for a short range,
// every 2 years up to about a decade, every 5 years beyond that
function getYearStep(firstYear, lastYear) {
  const span = lastYear - firstYear
  if (span <= 6) return 1
  if (span <= 12) return 2
  return 5
}

// Y-axis labels: round numbers covering every value, about 4 steps.
// The step is always 1, 2, 2.5 or 5 times a power of ten, so labels read easily.
//   getRoundTicks(2716)                    → [0, 1000, 2000, 3000]
//   getRoundTicks(57.3)                    → [0, 20, 40, 60]
//   getRoundTicks(9.6, { minValue: -1.3 }) → [-5, 0, 5, 10]   (negative values get room too)
//   getRoundTicks(74, { minValue: 62 })    → [60, 65, 70, 75]  (see below)
// The axis starts at 0 unless every value sits high above it (the smallest value is more
// than half the largest, like life expectancy at 62–74 years). Starting at 0 there would
// squash all lines into a thin band at the top.
export function getRoundTicks(maxValue, { minValue = 0, targetSteps = 4 } = {}) {
  const startsHigh = minValue > 0 && minValue > maxValue / 2
  const lowest = minValue < 0 || startsHigh ? minValue : 0
  if (!(maxValue > lowest)) return [lowest]

  const roughStep = (maxValue - lowest) / targetSteps
  // The power of ten just below the rough step, e.g. 679 → 100
  const magnitude = 10 ** Math.floor(Math.log10(roughStep))
  // The smallest "nice" step that is at least the rough step
  const step = [1, 2, 2.5, 5, 10].map((multiple) => multiple * magnitude).find((nice) => nice >= roughStep)

  // Start at the round number at or just below the lowest value (0 stays 0),
  // then add one step at a time until one tick reaches or passes the largest value.
  // toPrecision trims tiny rounding errors, e.g. 3 × 0.2 = 0.6000000000000001 → 0.6
  const first = Math.floor(lowest / step) * step
  const ticks = [first]
  while (ticks[ticks.length - 1] < maxValue) {
    ticks.push(Number((first + ticks.length * step).toPrecision(12)))
  }
  return ticks
}

// Both axes for a chart of chart rows (oldest first, at least one row, at least one value):
//   { xTicks: [2000, 2005, ...], yTicks: [0, 20, 40, 60] }
// countries: optional, the countries drawn (default all three). The y-axis only has to fit
// their values, so hiding a country with much larger values makes the others easier to read.
export function getAxisTicks(chartRows, countries = COUNTRIES) {
  const allValues = chartRows.flatMap((row) => countries.map((country) => row[country.code]))
  const values = allValues.filter((value) => value !== null)

  const firstYear = chartRows[0].year
  const lastYear = chartRows[chartRows.length - 1].year
  const xTicks = getYearTicks(firstYear, lastYear, getYearStep(firstYear, lastYear))
  const yTicks = getRoundTicks(Math.max(...values), { minValue: Math.min(...values) })
  return { xTicks, yTicks }
}
