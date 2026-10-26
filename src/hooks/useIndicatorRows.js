import { useEffect, useState } from 'react'
import { fetchIndicator } from '../lib/worldBankApi.js'
import { getLatestValue, toChartRows } from '../lib/transformData.js'

// A custom hook: loads one indicator and returns
//   { status: 'loading' | 'ready' | 'error', rows, error, retry }
// where rows are chart rows: [{ year: 2000, PAK: ..., IND: ..., BGD: ... }, ...],
// error is the error message (only when status is 'error'),
// and retry() loads again (for a "Try again" button).
// Thanks to the cache in worldBankApi.js, two components asking for the
// same code share one request.
export function useIndicatorRows(code) {
  // Counts the "Try again" clicks. Changing it re-runs the effect below.
  const [attempt, setAttempt] = useState(0)
  // The result also remembers which code and attempt it belongs to (see below)
  const [result, setResult] = useState({ code: null, attempt: 0, status: 'loading', rows: [], error: null })

  useEffect(() => {
    // If the component goes away (or the code changes) before the data arrives, don't update its state
    let ignore = false

    async function load() {
      try {
        const rawRows = await fetchIndicator(code)
        if (!ignore) setResult({ code, attempt, status: 'ready', rows: toChartRows(rawRows), error: null })
      } catch (error) {
        if (!ignore) setResult({ code, attempt, status: 'error', rows: [], error: error.message })
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [code, attempt])

  function retry() {
    setAttempt((count) => count + 1)
  }

  // The stored result is from an older request (another indicator, or before "Try again"
  // was clicked): the new one is still on its way, so we are loading. Without this check,
  // the old indicator's numbers would show for a moment under the new indicator's name.
  if (result.code !== code || result.attempt !== attempt) {
    return { status: 'loading', rows: [], error: null, retry }
  }

  return { status: result.status, rows: result.rows, error: result.error, retry }
}

// Turns a status and chart rows into what one figure needs:
//   { state: 'loading' | 'ready' | 'missing', value, year }
// "missing" covers both a failed request and an indicator with no data.
export function getFigure(status, rows, countryCode) {
  if (status === 'loading') {
    return { state: 'loading', value: null, year: null }
  }

  const { value, year } = getLatestValue(rows, countryCode)
  if (value === null) {
    return { state: 'missing', value: null, year: null }
  }

  return { state: 'ready', value, year }
}
