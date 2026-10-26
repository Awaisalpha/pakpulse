import { INDICATORS, getCategoryByName } from '../data/indicators.js'

// Finds indicators whose name contains the search text, ignoring upper/lower case.
//   searchIndicators('mort') → [{ indicator: Infant mortality…, category: Health… }, { …Under-5 mortality… }]
// Each result also carries its category, so the UI can show it and build the link.
// Empty search text → no results.
export function searchIndicators(query) {
  const text = query.trim().toLowerCase()
  if (text === '') return []

  return INDICATORS.filter((indicator) => indicator.name.toLowerCase().includes(text)).map((indicator) => ({
    indicator,
    category: getCategoryByName(indicator.category),
  }))
}
