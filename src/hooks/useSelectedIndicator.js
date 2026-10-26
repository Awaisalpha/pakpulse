import { useNavigate, useSearchParams } from 'react-router'
import { getIndicatorsInCategory } from '../data/indicators.js'
import { buildExplorerSearch, readHiddenCodes } from '../lib/explorerView.js'

// A custom hook: which indicator of a category is selected, read from the URL.
//   /explore/education?indicator=SE.ADT.LITR.ZS → the adult literacy indicator
// If ?indicator= is missing, or names a code that is not in this category,
// the category's first indicator is used.
//
// Returns { indicators, indicator, selectIndicator }:
//   indicators      – all indicators of the category, in config order
//   indicator       – the selected one
//   selectIndicator – function(code): puts a new ?indicator= in the URL
//                     (a new history entry, so the Back button returns to the previous one).
//                     Hidden countries stay hidden; the year range goes back to all years.
export function useSelectedIndicator(category) {
  // Like useState, but the value lives in the URL's "?..." part
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const indicators = getIndicatorsInCategory(category.name)
  const requestedCode = searchParams.get('indicator')
  const indicator = indicators.find((item) => item.code === requestedCode) ?? indicators[0]

  function selectIndicator(code) {
    navigate({ search: buildExplorerSearch({ indicatorCode: code, hiddenCodes: readHiddenCodes(searchParams) }) })
  }

  return { indicators, indicator, selectIndicator }
}
