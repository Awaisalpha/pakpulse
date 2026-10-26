import { Outlet } from 'react-router'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

// The frame shared by every page: navbar on top, footer at the bottom.
// <Outlet /> is the slot where React Router puts the page that matches the URL.
// A page can also be passed in directly as `children`, e.g. <Layout><NotFoundPage /></Layout>
// (the explorer does this for an unknown category, because it sits outside this layout).
function Layout({ children }) {
  return (
    <>
      {/* First focusable element: lets keyboard users jump past the navbar.
          Hidden until it receives focus. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-[60] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-full focus:bg-surface focus:px-5 focus:font-medium focus:text-text focus:shadow-md"
      >
        Skip to content
      </a>
      <Navbar />
      {/* tabIndex={-1} lets the skip link move focus here; main itself is not a control, so no ring */}
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {/* ?? means: use children if given, otherwise the matched route */}
        {children ?? <Outlet />}
      </main>
      <Footer />
    </>
  )
}

export default Layout
