import { Link } from 'react-router'
import { CATEGORIES, INDICATORS } from '../data/indicators.js'
import InternetUsersPanel from './InternetUsersPanel.jsx'

// The dark card at the top of the footer: an invitation to open the explorer (left)
// and a small live dashboard widget about internet users in Pakistan (right).

// Both numbers come from the config, so the sentence stays true when indicators change
const SUMMARY = `Compare ${INDICATORS.length} indicators across ${CATEGORIES.length} topics with India and Bangladesh, using live World Bank data.`

function CtaCard() {
  return (
    <section
      aria-labelledby="cta-title"
      // Wider screens: the widget column is a bit wider than the text column.
      // The focus ring is light blue here: the site's normal blue ring is too dark on charcoal.
      className="mx-auto grid max-w-preview items-center gap-8 rounded-3xl bg-cta p-6 sm:p-10 md:grid-cols-2 md:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] [&_:focus-visible]:outline-focus-on-dark"
    >
      <div>
        <h2 id="cta-title" className="text-heading font-semibold text-balance text-on-cta sm:text-title">
          See how Pakistan has changed since 2000
        </h2>
        <p className="mt-3 max-w-md text-pretty text-on-cta-muted">{SUMMARY}</p>
        {/* The green button with its own green focus ring, which works on charcoal too (4.6:1).
            The ! makes the ring win over the card's light-blue ring rule above. */}
        <Link
          to="/explore/economy"
          className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-primary px-5 font-medium text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-primary-focus!"
        >
          Open explorer
        </Link>
      </div>

      <InternetUsersPanel />
    </section>
  )
}

export default CtaCard
