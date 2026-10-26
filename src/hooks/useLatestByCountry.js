import { useEffect, useState } from 'react'
import { COUNTRIES } from '../data/countries.js'
import { fetchIndicator } from '../lib/worldBankApi.js'
import { getLatestValue, toChartRows } from '../lib/transformData.js'
import { useIndicatorRows } from './useIndicatorRows.js'

// Loads one indicator and returns each country's latest value with its own year:
//   { status: 'loading' | 'ready' | 'error',
//     latest: [{ country, value, year }, ...],   // value and year are null if a country has no data
//     newestYear }                               // the most recent of those years, or null
// Built only from the existing data layer (fetchIndicator via useIndicatorRows, getLatestValue).
export function useLatestByCountry(code) {
  const { status, rows } = useIndicatorRows(code)

  const latest = COUNTRIES.map((country) => ({ country, ...getLatestValue(rows, country.code) }))
  const years = latest.map((item) => item.year).filter((year) => year !== null)
  const newestYear = years.length > 0 ? Math.max(...years) : null

  return { status, latest, newestYear }
}

// The indicators the newest year is taken from: the ones the landing page loads anyway
// (the hero's four, plus the two the "About the data" section shows). The cache in
// worldBankApi.js already holds them, so asking again costs no extra request.
const NEWEST_YEAR_CODES = ['SP.POP.TOTL', 'NY.GDP.PCAP.CD', 'IT.NET.USER.ZS', 'SP.DYN.LE00.IN', 'SE.XPD.TOTL.GD.ZS', 'SE.PRM.ENRR']

// The newest year with data among those indicators, for any of the three countries:
//   { status: 'loading' | 'ready' | 'error', year }   (year is null unless 'ready')
// It used to read Population only. When that one request failed, the year was missing
// even though the other indicators had loaded. Now one failure is skipped, and only
// "every request failed" counts as an error.
export function useNewestYear() {
  const [result, setResult] = useState({ status: 'loading', year: null })

  useEffect(() => {
    let ignore = false

    async function load() {
      // allSettled waits for every request and never throws: each result is
      // { status: 'fulfilled', value } or { status: 'rejected', reason }
      const results = await Promise.allSettled(NEWEST_YEAR_CODES.map((code) => fetchIndicator(code)))

      const years = []
      for (const item of results) {
        if (item.status !== 'fulfilled') continue
        const rows = toChartRows(item.value)
        for (const country of COUNTRIES) {
          const { year } = getLatestValue(rows, country.code)
          if (year !== null) years.push(year)
        }
      }

      if (ignore) return
      if (years.length === 0) setResult({ status: 'error', year: null })
      else setResult({ status: 'ready', year: Math.max(...years) })
    }

    load()
    return () => {
      ignore = true
    }
  }, [])

  return result
}
