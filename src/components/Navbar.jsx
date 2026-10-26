import { Link, NavLink, useLocation } from 'react-router'
import { CATEGORIES } from '../data/indicators.js'
import { GITHUB_URL } from '../data/site.js'
import { useDisclosure } from '../hooks/useDisclosure.js'
import Logo from './Logo.jsx'

// Site navigation, sticky at the top while you scroll.
// Wide screens: logo left, the links in a soft pill in the centre, "Open explorer" right.
// Phones: logo left, a menu button right that opens a panel with every link.
//
// NavLink is like Link, but it adds aria-current="page" to the link of the
// page you are on, so screen readers announce it.

// The dropdown and phone menu: near-white with a blur, so the page behind barely shows through
const GLASS_PANEL = 'border border-border/70 bg-surface/95 backdrop-blur-md shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_rgb(0_0_0/0.05)]'

// Links and buttons inside the centre pill (40px tall). Hover darkens the pill fill a little.
const PILL_ITEM = 'inline-flex min-h-10 items-center gap-1 rounded-full px-4 text-sm font-medium text-text transition-colors hover:bg-text/5'
// The current item gets a white chip on the grey pill, plus an underline so it doesn't rely on
// colour alone. It replaces PILL_ITEM's hover, so the chip stays white under the mouse.
const PILL_CURRENT = 'inline-flex min-h-10 items-center gap-1 rounded-full px-4 text-sm font-medium text-text bg-surface underline decoration-2 underline-offset-[6px]'
// The underline marks the current page without relying on colour
const CURRENT = 'underline decoration-2 underline-offset-[6px]'
// Rows in the dropdown and the phone menu (44px tall, easy to tap)
const PANEL_ITEM = 'flex min-h-11 items-center rounded-2xl px-3 text-text transition-colors hover:bg-text/5'

// Small arrow after "Explore". It points up while the dropdown is open (no animation).
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
      className={isOpen ? 'rotate-180' : ''}
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  )
}

// Three lines while closed, a cross while open
function MenuIcon({ isOpen }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    >
      {isOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  )
}

function Navbar() {
  const location = useLocation()
  // Each call gives one open/close switch: one for the Explore dropdown, one for the phone menu
  const { isOpen: isExploreOpen, toggle: toggleExplore, areaRef: exploreAreaRef, buttonRef: exploreButtonRef } =
    useDisclosure()
  const { isOpen: isMenuOpen, toggle: toggleMenu, close: closeMenu, areaRef: menuAreaRef, buttonRef: menuButtonRef } =
    useDisclosure()
  const isExploreCurrent = location.pathname.startsWith('/explore')

  return (
    // bg-page: the header row has the page colour, so content scrolling underneath
    // doesn't show through behind the logo and button
    <header className="sticky top-0 z-50 bg-page px-gutter py-3 sm:px-gutter-wide">
      {/* Same max width as the chart card, so their edges line up */}
      <div ref={menuAreaRef} className="mx-auto max-w-preview">
        {/* Three columns: the two outer ones share the leftover space equally (1fr each),
            so the middle pill stays centred on the page whatever the logo and button widths are */}
        <nav aria-label="Main" className="grid min-h-14 grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
          <Logo className="justify-self-start text-text" />

          {/* Centre pill: hidden on phones, where the menu button shows these links instead */}
          <ul className="hidden items-center gap-1 rounded-full bg-pill p-1 md:flex">
            <li ref={exploreAreaRef} className="relative">
              {/* A real button that shows/hides the list (the "disclosure" pattern).
                  On /explore/... it is marked as the current item of the navigation. */}
              <button
                ref={exploreButtonRef}
                type="button"
                aria-expanded={isExploreOpen}
                aria-controls="explore-menu"
                aria-current={isExploreCurrent ? 'true' : undefined}
                onClick={toggleExplore}
                className={isExploreCurrent ? PILL_CURRENT : PILL_ITEM}
              >
                Explore
                <ChevronIcon isOpen={isExploreOpen} />
              </button>

              {isExploreOpen && (
                <ul
                  id="explore-menu"
                  className={`absolute start-0 top-[calc(100%+0.5rem)] w-60 rounded-3xl p-2 ${GLASS_PANEL}`}
                >
                  {CATEGORIES.map((category) => (
                    <li key={category.slug}>
                      <NavLink
                        to={`/explore/${category.slug}`}
                        className={({ isActive }) => `${PANEL_ITEM} text-sm ${isActive ? CURRENT : ''}`}
                      >
                        {category.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              {/* A plain <a>: on "/" it jumps to the section, elsewhere it loads the landing page */}
              <a href="/#about-data" className={PILL_ITEM}>
                About the data
              </a>
            </li>
            <li>
              <a href={GITHUB_URL} className={PILL_ITEM}>
                GitHub
              </a>
            </li>
          </ul>

          <Link
            to="/explore/economy"
            className="hidden min-h-10 items-center justify-self-end rounded-full bg-primary px-5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-primary-focus md:inline-flex"
          >
            Open explorer
          </Link>

          {/* Phones only */}
          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={toggleMenu}
            className="inline-flex size-11 items-center justify-center justify-self-end rounded-full text-text transition-colors hover:bg-text/5 md:hidden"
          >
            <MenuIcon isOpen={isMenuOpen} />
          </button>
        </nav>

        {isMenuOpen && (
          <div
            id="mobile-menu"
            className={`mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-3xl p-2 md:hidden ${GLASS_PANEL}`}
          >
            <p className="px-3 pt-2 pb-1 font-label text-label text-text-muted uppercase">Explore</p>
            <ul>
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <NavLink
                    to={`/explore/${category.slug}`}
                    className={({ isActive }) => `${PANEL_ITEM} ${isActive ? CURRENT : ''}`}
                  >
                    {category.name}
                  </NavLink>
                </li>
              ))}
            </ul>
            <ul className="mt-2 border-t border-border pt-2">
              <li>
                {/* On "/" the URL may not change, so close the menu by hand */}
                <a href="/#about-data" onClick={closeMenu} className={PANEL_ITEM}>
                  About the data
                </a>
              </li>
              <li>
                <a href={GITHUB_URL} className={PANEL_ITEM}>
                  GitHub
                </a>
              </li>
            </ul>
            <Link
              to="/explore/economy"
              className="mt-2 flex min-h-11 items-center justify-center rounded-2xl bg-primary px-5 font-medium text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-primary-focus"
            >
              Open explorer
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
