import { useRef } from 'react'
import EstimateBadge from '../EstimateBadge.jsx'
import CountryToggles from '../explorer/CountryToggles.jsx'
import YearRange from '../explorer/YearRange.jsx'

// The top of the explorer page: the category as the main heading, and below it
// the selected indicator with its unit (plus an "Estimate" badge for modelled data).
// On the right (or below the title, when there isn't room): the country toggles,
// the year range and a "Reset" button that only shows once something was changed.
// Screen readers hear each change ("Showing 2010–2025, India hidden") from a polite live region.
//
// Props:
//   category, indicator
//   view – everything useExplorerView() returns
function PageHeader({ category, indicator, view }) {
  const allButtonRef = useRef(null)

  function handleReset() {
    view.reset()
    // The Reset button disappears after the click; put the focus on "All"
    // so keyboard users don't lose their place
    allButtonRef.current?.focus()
  }

  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-heading font-semibold text-balance text-text sm:text-title">{category.name}</h1>
        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-text-muted">
          <span className="font-medium text-text">{indicator.name}</span>
          <span aria-hidden="true">·</span>
          <span>{indicator.unit}</span>
          {indicator.isEstimate && <EstimateBadge />}
        </p>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-3">
        <CountryToggles hiddenCodes={view.hiddenCodes} onToggle={view.toggleCountry} />
        <YearRange
          dataYears={view.dataYears}
          range={view.range}
          activePreset={view.activePreset}
          onPreset={view.choosePreset}
          onCustom={view.openCustom}
          onRangeChange={view.setRange}
          allButtonRef={allButtonRef}
        />
        {view.isChanged && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-10 items-center px-1 text-sm font-medium text-text underline underline-offset-4 hover:text-accent"
          >
            Reset
            <span className="sr-only"> to all years and countries</span>
          </button>
        )}
      </div>

      {/* Always on the page, only its text changes: that is what makes screen readers announce it */}
      <p role="status" className="sr-only">
        {view.announcement}
      </p>
    </header>
  )
}

export default PageHeader
