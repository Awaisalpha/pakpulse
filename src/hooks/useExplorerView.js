import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { COUNTRIES } from '../data/countries.js'
import { buildExplorerSearch, readHiddenCodes, readYearRange } from '../lib/explorerView.js'
import { getDataYears, getPresetRange, getVisibleCountries } from '../lib/filterChartRows.js'

// A custom hook: the explorer's country toggles and year range, kept in the URL
// (see lib/explorerView.js for the format). Every change adds a history entry,
// so Back and Forward step through the choices.
//
// Takes the selected indicator and its chart rows (the years come from the data).
// Returns:
//   dataYears        – the years with data, for the From/To lists
//   hiddenCodes      – e.g. ['IND']
//   visibleCountries – the COUNTRIES entries to draw
//   range            – { from, to, isAllYears }, or null while there are no years
//   activePreset     – 'all' | 'last10' | 'last5' | 'custom' | null (no years yet)
//   isChanged        – true when a country is hidden or the range isn't all years
//   announcement     – a short sentence for screen readers about the last change
//   toggleCountry(code), choosePreset(preset), openCustom(), setRange(from, to), reset()

const PRESETS = ['all', 'last10', 'last5']

// "India", "India and Bangladesh"
function joinNames(names) {
  return names.length === 2 ? `${names[0]} and ${names[1]}` : names.join(', ')
}

// The sentence read out after a change, e.g. "Showing 2010–2025, India hidden"
function describeView(hiddenCodes, range) {
  const years = range === null ? 'all years' : range.from === range.to ? `${range.from}` : `${range.from}–${range.to}`
  const hiddenNames = COUNTRIES.filter((country) => hiddenCodes.includes(country.code)).map((country) => country.name)
  const countries = hiddenNames.length === 0 ? 'all countries' : `${joinNames(hiddenNames)} hidden`
  return `Showing ${years}, ${countries}`
}

export function useExplorerView(indicator, chartRows) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [announcement, setAnnouncement] = useState('')
  // The indicator for which "Custom" was clicked. Storing the code (not just true/false)
  // closes Custom by itself when another indicator is selected.
  const [customFor, setCustomFor] = useState(null)

  const dataYears = getDataYears(chartRows)
  const hiddenCodes = readHiddenCodes(searchParams)
  const visibleCountries = getVisibleCountries(hiddenCodes)
  const range = readYearRange(searchParams, dataYears)
  const isChanged = hiddenCodes.length > 0 || (range !== null && !range.isAllYears)

  // Which range button is pressed. A range that matches no preset (from a shared link,
  // or picked with the selects) counts as Custom.
  let activePreset = null
  if (range !== null) {
    const matchingPreset = PRESETS.find((preset) => {
      const presetRange = getPresetRange(dataYears, preset)
      return presetRange.from === range.from && presetRange.to === range.to
    })
    activePreset = customFor === indicator.code || !matchingPreset ? 'custom' : matchingPreset
  }

  // Writes new choices into the URL and prepares the announcement.
  // nextRange: { from, to }, or null for all years.
  function update(nextHiddenCodes, nextRange) {
    const all = getPresetRange(dataYears, 'all')
    const isAllYears = nextRange === null || (nextRange.from === all.from && nextRange.to === all.to)
    const urlRange = isAllYears ? null : nextRange

    // Only the "?..." part changes; the page path stays the same
    navigate({ search: buildExplorerSearch({ indicatorCode: indicator.code, hiddenCodes: nextHiddenCodes, range: urlRange }) })
    setAnnouncement(describeView(nextHiddenCodes, urlRange))
  }

  function toggleCountry(code) {
    const isHidden = hiddenCodes.includes(code)
    // Rebuilt from COUNTRIES, so the codes keep the same order in the URL
    const nextHiddenCodes = COUNTRIES.map((country) => country.code).filter((item) =>
      item === code ? !isHidden : hiddenCodes.includes(item),
    )
    update(nextHiddenCodes, range)
  }

  function choosePreset(preset) {
    setCustomFor(null)
    update(hiddenCodes, getPresetRange(dataYears, preset))
  }

  // Shows the From/To selects; the range itself only changes when a year is picked
  function openCustom() {
    setCustomFor(indicator.code)
  }

  function setRange(from, to) {
    update(hiddenCodes, { from, to })
  }

  function reset() {
    setCustomFor(null)
    update([], null)
  }

  return {
    dataYears,
    hiddenCodes,
    visibleCountries,
    range,
    activePreset,
    isChanged,
    announcement,
    toggleCountry,
    choosePreset,
    openCustom,
    setRange,
    reset,
  }
}
