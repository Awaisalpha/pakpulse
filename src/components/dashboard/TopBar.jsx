import ExternalLink from '../ExternalLink.jsx'
import Logo from '../Logo.jsx'
import IndicatorSearch from './IndicatorSearch.jsx'

// The bar at the top of the explorer: on phones a "Menu" button and the logo,
// then the indicator search and a link to the indicator's World Bank page.
//
// Props:
//   indicator     – the selected indicator (for the World Bank link)
//   isMenuOpen    – is the phone menu panel open?
//   onMenuToggle  – function, called when "Menu" is clicked
//   menuButtonRef – a ref for the Menu button, so focus can return to it

// Three lines while closed, a cross while open
function MenuIcon({ isOpen }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      {isOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  )
}

function TopBar({ indicator, isMenuOpen, onMenuToggle, menuButtonRef }) {
  return (
    <header className="border-b border-border bg-surface px-gutter py-3 sm:px-gutter-wide">
      <div className="flex flex-wrap items-center gap-3">
        {/* Phones and tablets only: the sidebar is hidden there */}
        <div className="flex basis-full items-center gap-3 lg:hidden">
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="dashboard-menu"
            onClick={onMenuToggle}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-text transition-colors hover:bg-text/5"
          >
            <MenuIcon isOpen={isMenuOpen} />
            Menu
          </button>
          <Logo className="text-text" />
        </div>

        {/* min-w-0 + basis: the search takes the free space but may shrink on small screens */}
        <div className="min-w-0 flex-1 basis-56 lg:max-w-md">
          <IndicatorSearch />
        </div>

        <ExternalLink
          href={`https://data.worldbank.org/indicator/${indicator.code}`}
          // Pushed to the end of the row when it fits next to the search; on phones it
          // wraps to its own line and stays at the start (-ms-3 lines its text up with the search box)
          className="-ms-3 inline-flex sm:ms-auto min-h-10 items-center rounded-full px-3 text-sm font-medium text-text underline underline-offset-4 transition-colors hover:text-accent"
        >
          View on World Bank
        </ExternalLink>
      </div>
    </header>
  )
}

export default TopBar
