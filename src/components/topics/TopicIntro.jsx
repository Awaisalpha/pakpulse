import { Link } from 'react-router'
import { CATEGORIES, INDICATORS } from '../../data/indicators.js'
import { COUNTRIES } from '../../data/countries.js'
import { formatIndicatorCount } from '../../lib/formatIndicatorCount.js'
import CountryFlag from '../flags/CountryFlag.jsx'
import Icon from '../icons/Icon.jsx'

// The left side of the "Explore by topic" panel, in light text on charcoal:
// headline, one sentence, the three countries, a checklist and the "Open explorer" button.
// Contrast on charcoal: headline 16:1, muted text 10.1:1, chips 16:1 (see index.css).

// The three facts in the checklist. The first is counted from the config, so it stays true.
const FACTS = [
  `${formatIndicatorCount(INDICATORS.length)} across ${CATEGORIES.length} topics`,
  'Live data from the World Bank API',
  'Every value shows its year',
]

// Props: titleId – id for the <h2>, so the <section> can point at it with aria-labelledby
function TopicIntro({ titleId }) {
  return (
    <div>
      {/* Two lines: the second is quieter. The <span> is block, so it always starts a new line. */}
      <h2 id={titleId} className="text-title font-bold text-balance text-on-cta">
        Explore Pakistan’s data, <span className="block text-on-cta-muted">topic by topic</span>
      </h2>
      <p className="mt-4 max-w-md text-lead text-pretty text-on-cta-muted">
        Pick a topic to compare Pakistan with India and Bangladesh on World Bank indicators since 2000.
      </p>

      {/* "Compares" + the three countries on light chips. A list, so screen readers hear "3 items". */}
      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span id={`${titleId}-compares`} className="font-label text-label text-on-cta-muted uppercase">
          Compares
        </span>
        <ul aria-labelledby={`${titleId}-compares`} className="flex flex-wrap gap-2">
          {COUNTRIES.map((country) => (
            <li key={country.code} className="inline-flex items-center gap-2 rounded-full bg-on-cta px-3 py-1 text-sm text-text">
              <CountryFlag code={country.code} />
              {country.name}
            </li>
          ))}
        </ul>
      </div>

      <ul className="mt-6 flex flex-col gap-2">
        {FACTS.map((fact) => (
          <li key={fact} className="flex items-center gap-2 text-on-cta-muted">
            <Icon name="check" className="text-accent-on-dark" />
            {fact}
          </li>
        ))}
      </ul>

      {/* A light button: the site's blue button would have too little contrast against charcoal */}
      <Link
        to="/explore/economy"
        className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-lg bg-on-cta px-5 font-medium text-text transition-colors hover:bg-button-light-hover"
      >
        Open explorer
        <Icon name="arrowRight" />
      </Link>
    </div>
  )
}

export default TopicIntro
