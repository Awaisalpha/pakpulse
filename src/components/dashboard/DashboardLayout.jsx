import { useDisclosure } from '../../hooks/useDisclosure.js'
import SidebarNav from './SidebarNav.jsx'
import TopBar from './TopBar.jsx'

// The explorer's frame: a sidebar on the left (from the lg breakpoint up) and,
// next to it, the top bar and the page content.
// Below lg the sidebar is hidden; the "Menu" button in the top bar opens the
// same navigation as a panel under the bar (instantly, no animation).
//
// Props:
//   category, indicator – what is selected (the sidebar and top bar need them)
//   children            – the page content

function DashboardLayout({ category, indicator, children }) {
  // The phone menu's open/close switch. Its panelRef moves focus into the panel when
  // it opens; closeAndReturnFocus puts focus back on the Menu button.
  const { isOpen, toggle, closeAndReturnFocus, areaRef, buttonRef, panelRef } = useDisclosure()

  return (
    // Two columns from lg: a 16rem sidebar and the rest.
    // minmax(0, 1fr) lets the content column shrink instead of pushing the page sideways.
    <div className="min-h-dvh bg-canvas lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      {/* First focusable element: jumps past the sidebar and top bar */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-[60] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-full focus:bg-surface focus:px-5 focus:font-medium focus:text-text focus:shadow-md"
      >
        Skip to content
      </a>

      {/* Desktop sidebar: stays in place while the content scrolls, and scrolls on its own if it is taller than the screen */}
      <aside className="sticky top-0 hidden h-dvh overflow-y-auto overscroll-contain border-e border-border lg:block">
        <SidebarNav category={category} indicator={indicator} />
      </aside>

      <div className="min-w-0">
        {/* Wraps the Menu button and its panel, so clicks/focus inside both count as "inside" */}
        <div ref={areaRef}>
          <TopBar indicator={indicator} isMenuOpen={isOpen} onMenuToggle={toggle} menuButtonRef={buttonRef} />

          {isOpen && (
            <div id="dashboard-menu" ref={panelRef} className="border-b border-border lg:hidden">
              <SidebarNav
                category={category}
                indicator={indicator}
                showLogo={false}
                onNavigate={closeAndReturnFocus}
              />
            </div>
          )}
        </div>

        {/* tabIndex={-1} lets the skip link move focus here; main itself is not a control, so no ring */}
        <main id="main-content" tabIndex={-1} className="px-gutter py-6 focus:outline-none sm:px-gutter-wide sm:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
