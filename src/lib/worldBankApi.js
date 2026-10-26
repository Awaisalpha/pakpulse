import { COUNTRIES } from '../data/countries.js'

const BASE_URL = 'https://api.worldbank.org/v2'
const START_YEAR = 2000

// In-memory cache: indicator code → Promise of its rows.
// It lives as long as the page is open, so each indicator is fetched only once.
const cache = new Map()

// Builds the request URL, for example:
// https://api.worldbank.org/v2/country/PAK;IND;BGD/indicator/SP.POP.TOTL?format=json&per_page=500&date=2000:2026
function buildIndicatorUrl(code) {
  const countryCodes = COUNTRIES.map((country) => country.code).join(';')
  const currentYear = new Date().getFullYear()
  return `${BASE_URL}/country/${countryCodes}/indicator/${code}?format=json&per_page=500&date=${START_YEAR}:${currentYear}`
}

// Does the real network request and checks every way it can go wrong.
// Returns the array of rows (can be empty if the indicator has no data).
async function requestIndicator(code) {
  let response
  try {
    response = await fetch(buildIndicatorUrl(code))
  } catch {
    // fetch itself only fails when the network is down or the request is blocked
    throw new Error("Couldn't reach the World Bank. Check your internet connection and try again.")
  }

  if (!response.ok) {
    throw new Error(`World Bank API returned status ${response.status}.`)
  }

  const data = await response.json()

  // A good answer looks like [metadata, rows]
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Unexpected response from the World Bank API.')
  }

  // An invalid code still returns status 200, but with [{ message: [...] }]
  if (data[0].message) {
    throw new Error(`Indicator code ${code} is not valid.`)
  }

  // A valid indicator with no data at all returns [metadata, null]
  if (data[1] === null || data[1] === undefined) {
    return []
  }

  if (!Array.isArray(data[1])) {
    throw new Error('Unexpected response from the World Bank API.')
  }

  return data[1]
}

// Public function used by the app. Returns a Promise of the raw rows.
// We cache the Promise (not the finished rows), so two calls at the same
// moment share one request instead of fetching twice.
export function fetchIndicator(code) {
  if (cache.has(code)) {
    return cache.get(code)
  }

  const request = requestIndicator(code).catch((error) => {
    // Forget failed requests, so "Try again" really fetches again
    cache.delete(code)
    throw error
  })

  cache.set(code, request)
  return request
}
