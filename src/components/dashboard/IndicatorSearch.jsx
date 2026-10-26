import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { buildExplorerSearch, readHiddenCodes } from '../../lib/explorerView.js'
import { formatIndicatorCount } from '../../lib/formatIndicatorCount.js'
import { searchIndicators } from '../../lib/searchIndicators.js'

// A search box that finds indicators by name, in every category.
// The results are plain links (to /explore/category?indicator=CODE) in a box under the input.
//   Escape            → clears the search
//   choosing a result → clears the search
//   clicking or tabbing outside → hides the results (the text stays)
// Screen readers hear the number of results through a polite live region.

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-text-muted"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="m10.5 10.5 3 3" />
    </svg>
  )
}

function IndicatorSearch() {
  const [query, setQuery] = useState('')
  // Whether the results box is shown (only matters while there is search text)
  const [isOpen, setIsOpen] = useState(false)
  const areaRef = useRef(null)
  const inputRef = useRef(null)
  // Hidden countries stay hidden when a result is opened (the year range resets)
  const [searchParams] = useSearchParams()
  const hiddenCodes = readHiddenCodes(searchParams)

  const results = searchIndicators(query)
  const hasQuery = query.trim() !== ''
  const showResults = hasQuery && isOpen

  // The sentence screen readers hear, e.g. "3 indicators found"
  let statusMessage = ''
  if (hasQuery) {
    statusMessage = results.length === 0 ? 'No matching indicators' : `${formatIndicatorCount(results.length)} found`
  }

  function clear() {
    setQuery('')
    setIsOpen(false)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      clear()
      // If focus was on a result link, it would be lost when the list goes away
      inputRef.current?.focus()
    }
  }

  // While the results are shown: hide them on a click or focus outside the search area
  useEffect(() => {
    if (!showResults) return

    function handleOutside(event) {
      if (!areaRef.current?.contains(event.target)) setIsOpen(false)
    }

    document.addEventListener('pointerdown', handleOutside)
    document.addEventListener('focusin', handleOutside)
    return () => {
      document.removeEventListener('pointerdown', handleOutside)
      document.removeEventListener('focusin', handleOutside)
    }
  }, [showResults])

  return (
    <div ref={areaRef} className="relative" onKeyDown={handleKeyDown}>
      <label htmlFor="indicator-search" className="sr-only">
        Search indicators
      </label>
      <SearchIcon />
      <input
        ref={inputRef}
        id="indicator-search"
        type="search"
        autoComplete="off"
        placeholder="Search indicators"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        // 16px text on phones (text-base), so iOS doesn't zoom in; 14px from sm up
        className="min-h-10 w-full rounded-full border border-border-input bg-surface ps-9 pe-4 text-base text-text placeholder:text-text-muted sm:text-sm"
      />

      {/* Always on the page, only its text changes: that is what makes screen readers announce it */}
      <p role="status" className="sr-only">
        {statusMessage}
      </p>

      {showResults && (
        <div className="absolute inset-x-0 top-full z-40 mt-2 max-h-80 overflow-y-auto overscroll-contain rounded-2xl border border-border bg-surface p-2 shadow-card">
          {results.length === 0 ? (
            <p className="px-3 py-2 text-sm text-text-muted">No matching indicators</p>
          ) : (
            <ul aria-label="Search results">
              {results.map(({ indicator, category }) => (
                <li key={indicator.code}>
                  <Link
                    to={`/explore/${category.slug}${buildExplorerSearch({ indicatorCode: indicator.code, hiddenCodes })}`}
                    onClick={clear}
                    className="flex min-h-11 flex-col justify-center rounded-xl px-3 py-1.5 transition-colors hover:bg-text/5"
                  >
                    <span className="text-sm text-text">{indicator.name}</span>
                    <span className="text-xs text-text-muted">{category.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default IndicatorSearch
