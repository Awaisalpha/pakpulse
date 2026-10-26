import { Link } from 'react-router'
import { CATEGORIES } from '../data/indicators.js'
import { GITHUB_URL } from '../data/site.js'
import Logo from './Logo.jsx'
import CtaCard from './CtaCard.jsx'
import ExternalLink from './ExternalLink.jsx'

// Site-wide footer. It also carries the attribution the data licence (CC BY 4.0) asks for.
// Top: a dark call-to-action card that overlaps the footer's top edge.
// Desktop: brand | Explore | Project, then a bottom row of small print.
// Phones: everything stacks in that same order.

// Links in the columns: 40px tall so they are easy to tap; hover adds the accent colour and an underline
const FOOTER_LINK =
  'inline-flex min-h-10 items-center text-sm text-text underline-offset-4 transition-colors hover:text-accent hover:underline'

// Column titles: the site's small uppercase label style, but bold and in the main text colour,
// so they stand out clearly from the links under them.
// Bold (700), not semibold: at 12px the monospace label font has thin strokes, and 600 looks
// barely darker than regular. 700 is the heaviest weight that font has. The slightly tighter
// letter spacing (0.04em instead of 0.05em) keeps the heavier letters from looking spread out.
const COLUMN_TITLE = 'font-label text-label font-bold tracking-[0.04em] text-text uppercase'

function Footer() {
  return (
    <footer>
      {/* The CTA card sits on a strip whose top half is the page colour and bottom half the
          footer colour. So the footer's background starts exactly at the card's middle,
          whatever height the card has: the card overlaps the footer's top edge by half. */}
      <div className="bg-[linear-gradient(to_bottom,var(--color-page)_50%,var(--color-footer)_50%)] px-gutter sm:px-gutter-wide">
        <CtaCard />
      </div>

      {/* The footer zone: its own background colour separates it from the page */}
      <div className="bg-footer px-gutter sm:px-gutter-wide">
        {/* Same max width as the navbar and chart card */}
        <div className="mx-auto max-w-preview pt-16 pb-8">
          {/* Top area: brand on the left, the two link columns on the right */}
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <Logo className="text-text" />
              <p className="mt-3 max-w-xs text-sm text-pretty text-text-muted">
                PakPulse charts World Bank data on Pakistan’s development since 2000, alongside India and Bangladesh.
              </p>
            </div>

            <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-2">
              <div>
                <h2 className={COLUMN_TITLE}>Explore</h2>
                <ul className="mt-3">
                  {CATEGORIES.map((category) => (
                    <li key={category.slug}>
                      <Link to={`/explore/${category.slug}`} className={FOOTER_LINK}>
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className={COLUMN_TITLE}>Project</h2>
                <ul className="mt-3">
                  <li>
                    {/* A plain <a>: on "/" it jumps to the section, elsewhere it loads the landing page */}
                    <a href="/#about-data" className={FOOTER_LINK}>
                      About the data
                    </a>
                  </li>
                  <li>
                    <Link to="/explore/economy" className={FOOTER_LINK}>
                      Open explorer
                    </Link>
                  </li>
                  <li>
                    <ExternalLink href={GITHUB_URL} className={FOOTER_LINK}>
                      GitHub
                    </ExternalLink>
                  </li>
                </ul>
              </div>
            </nav>
          </div>

          {/* Bottom row: small print in the muted text colour (contrast measured on the footer background) */}
          <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-sm text-text-muted md:flex-row md:items-start md:justify-between md:gap-8">
            <div className="flex flex-col gap-1">
              <p>
                Data:{' '}
                <ExternalLink
                  href="https://data.worldbank.org"
                  className="text-text underline underline-offset-4 transition-colors hover:text-accent"
                >
                  World Bank, World Development Indicators (CC BY 4.0)
                </ExternalLink>
              </p>
              <p>PakPulse is an independent project and is not affiliated with the World Bank.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
