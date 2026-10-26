import { useId, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { CATEGORIES, getIndicatorsInCategory } from '../../data/indicators.js'
import { buildExplorerSearch, readHiddenCodes } from '../../lib/explorerView.js'
import { formatIndicatorCount } from '../../lib/formatIndicatorCount.js'
import ExternalLink from '../ExternalLink.jsx'
import Icon from '../icons/Icon.jsx'
import Logo from '../Logo.jsx'

// The explorer's navigation: logo, the 7 categories, links back to the landing page,
// and the data source card. Used in the desktop sidebar and in the phone menu panel.
//
// Every category is a button that opens or closes its list of indicators (instantly,
// no animation). Several can be open at once. The current category starts open.
// Only the indicator links inside navigate.
//
// Props:
//   category   – the current category (from data/indicators.js)
//   indicator  – the selected indicator
//   showLogo   – false in the phone panel, where the top bar already shows the logo
//   onNavigate – optional function, called when a link is clicked
//                (the phone panel uses it to close itself and return focus to "Menu")

const ROW = 'flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-start text-sm text-text transition-colors hover:bg-text/5'

// Small arrow: points down while the list is open, right while it is closed (no animation)
function ChevronIcon({ isOpen }) {
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
      strokeLinejoin="round"
      // rtl:-scale-x-100 mirrors the "closed" arrow for right-to-left languages
      className={`shrink-0 text-text-muted ${isOpen ? '' : 'rtl:-scale-x-100'}`}
    >
      {isOpen ? <path d="m4 6 4 4 4-4" /> : <path d="m6 4 4 4-4 4" />}
    </svg>
  )
}

function SidebarNav({ category, indicator, showLogo = true, onNavigate }) {
  // Categories the user opened or closed by hand: { economy: true, health: false, ... }.
  // A category that isn't in here is open only if it is the current one.
  const [openState, setOpenState] = useState({})

  // The indicator this sidebar last showed. When a new indicator is selected (from the
  // sidebar, the search, or Back/Forward), its category is opened again, even if it was
  // closed by hand earlier, so the selected indicator is always visible.
  // (Updating state while rendering is allowed when it is guarded by a check like this:
  // React re-renders straight away, before anything is shown.)
  const [shownCode, setShownCode] = useState(indicator.code)
  if (shownCode !== indicator.code) {
    setShownCode(indicator.code)
    setOpenState({ ...openState, [category.slug]: true })
  }
  // A unique prefix for this copy's element ids. The sidebar and the phone panel can both
  // be on the page, and two elements must never share an id.
  const idPrefix = useId()
  // Hidden countries stay hidden when another indicator is chosen (the year range resets)
  const [searchParams] = useSearchParams()
  const hiddenCodes = readHiddenCodes(searchParams)

  function isOpen(slug) {
    return openState[slug] ?? slug === category.slug
  }

  function toggle(slug) {
    // Copy the old object and change one key (state objects are never changed in place)
    setOpenState({ ...openState, [slug]: !isOpen(slug) })
  }

  return (
    <div className="flex min-h-full flex-col gap-6 bg-surface p-4">
      {showLogo && <Logo className="self-start text-text" />}

      <nav aria-label="Indicators">
        <p className="px-3 font-label text-label text-text-muted uppercase">Categories</p>
        <ul className="mt-2 flex flex-col gap-1">
          {CATEGORIES.map((item) => {
            const indicators = getIndicatorsInCategory(item.name)
            const open = isOpen(item.slug)
            const listId = `${idPrefix}-${item.slug}`
            const isCurrent = item.slug === category.slug

            return (
              <li key={item.slug}>
                {/* A button, not a link: it only shows or hides the list below.
                    aria-expanded tells screen readers whether the list is open. */}
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={listId}
                  onClick={() => toggle(item.slug)}
                  className={`${ROW} ${isCurrent ? 'font-semibold' : 'font-medium'}`}
                >
                  {/* Accent colour for the current category, muted for the others */}
                  <Icon name={item.icon} className={isCurrent ? 'text-accent' : 'text-text-muted'} />
                  <span className="min-w-0 flex-1">{item.name}</span>
                  {/* Screen readers hear "6 indicators" instead of a bare "6" */}
                  <span aria-hidden="true" className="rounded-full bg-pill px-2 text-xs leading-5 font-medium text-text-muted">
                    {indicators.length}
                  </span>
                  <span className="sr-only">, {formatIndicatorCount(indicators.length)}</span>
                  <ChevronIcon isOpen={open} />
                </button>

                {open && (
                  <ul id={listId} className="mt-1 mb-2 flex flex-col gap-1 ps-3">
                    {indicators.map((child) => {
                      const isSelected = child.code === indicator.code
                      return (
                        <li key={child.code}>
                          <Link
                            to={`/explore/${item.slug}${buildExplorerSearch({ indicatorCode: child.code, hiddenCodes })}`}
                            aria-current={isSelected ? 'page' : undefined}
                            onClick={onNavigate}
                            // Selected: grey fill, bold text and an accent bar at its start
                            // (three cues, so it never relies on colour alone)
                            className={`flex min-h-10 items-center gap-2 rounded-e-lg border-s-2 px-3 py-1.5 text-sm transition-colors ${
                              isSelected
                                ? 'border-accent bg-canvas font-semibold text-text'
                                : 'border-transparent text-text-muted hover:bg-text/5 hover:text-text'
                            }`}
                          >
                            <Icon name={child.icon} className={isSelected ? 'text-accent' : 'text-text-muted'} />
                            {child.name}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      <nav aria-label="Site" className="border-t border-border pt-4">
        <ul className="flex flex-col gap-1">
          <li>
            {/* A plain <a>: it loads the landing page and jumps to the section */}
            <a href="/#about-data" onClick={onNavigate} className={ROW}>
              About the data
            </a>
          </li>
          <li>
            <Link to="/" onClick={onNavigate} className={ROW}>
              Back to home
            </Link>
          </li>
        </ul>
      </nav>

      {/* mt-auto pushes the card to the bottom when the sidebar is taller than its content */}
      <div className="mt-auto rounded-xl bg-canvas px-3 pt-3 pb-1 text-sm text-text-muted">
        <p>Data: World Bank WDI · CC BY 4.0</p>
        {/* Its own line, 40px tall, so it is easy to tap */}
        <ExternalLink
          href="https://data.worldbank.org"
          className="inline-flex min-h-10 items-center text-text underline underline-offset-2 hover:text-accent"
        >
          data.worldbank.org
        </ExternalLink>
      </div>
    </div>
  )
}

export default SidebarNav
