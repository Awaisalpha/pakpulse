import { Link } from 'react-router'
import { FEATURES, FEATURES_HEADING, FEATURES_INTRO } from '../../data/features.js'
import FeatureIcon from './FeatureIcon.jsx'
import LiveDataVisual from './LiveDataVisual.jsx'
import CompareVisual from './CompareVisual.jsx'
import GapsVisual from './GapsVisual.jsx'
import AccessibilityVisual from './AccessibilityVisual.jsx'

// The landing page's "Features" section: four zig-zag rows, one per feature.
// Each row has text on one side and a mini dashboard on a dark panel on the other;
// the sides swap every row. The section background stays light, so the dark panels stand out.

// Which mini dashboard goes with which feature (by its id in data/features.js)
const VISUALS = {
  live: LiveDataVisual,
  compare: CompareVisual,
  gaps: GapsVisual,
  everyone: AccessibilityVisual,
}

// The same arrow as the other landing sections (decorative)
function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10" />
      <path d="m9 4 4 4-4 4" />
    </svg>
  )
}

// The text side: big faint number, icon badge, title, sentence and link
function FeatureText({ feature, index }) {
  // 0 → "01"
  const number = String(index + 1).padStart(2, '0')

  return (
    <div>
      {/* The number is decoration: the list (<ol>) already gives the order to screen readers */}
      <p aria-hidden="true" className="mb-2 text-[4.5rem] leading-none font-bold tracking-tight text-numeral-faint sm:text-[5.5rem]">
        {number}
      </p>
      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-cta text-accent-on-dark">
        <FeatureIcon id={feature.id} />
      </span>

      <h3 className="mt-5 text-heading font-bold text-balance text-text">{feature.title}</h3>
      <p className="mt-3 max-w-measure text-pretty text-text-muted">{feature.text}</p>

      {feature.link && (
        <Link
          to={feature.link.to}
          className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent underline decoration-1 underline-offset-4 transition-colors hover:text-accent-hover"
        >
          {feature.link.label}
          <ArrowIcon />
        </Link>
      )}
    </div>
  )
}

function FeatureRow({ feature, index }) {
  const Visual = VISUALS[feature.id]
  // Rows 2 and 4 put the visual on the left from md up
  const visualFirst = index % 2 === 1

  return (
    // Phones: one column, text first, then the visual (same order in every row).
    // From md up: two equal columns. The text is always first in the HTML, so reading
    // order stays the same; on even rows the visual is only *placed* in the left column.
    // That is safe because the visual is one picture with nothing to focus inside it.
    <li className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
      <div className={visualFirst ? 'md:col-start-2 md:row-start-1' : ''}>
        <FeatureText feature={feature} index={index} />
      </div>

      <div className={`min-w-0 ${visualFirst ? 'md:col-start-1 md:row-start-1' : ''}`}>
        <Visual />
      </div>
    </li>
  )
}

function FeaturesSection() {
  return (
    <section aria-labelledby="features-title" className="px-gutter sm:px-gutter-wide">
      {/* Centred intro, same style as the sections above */}
      <div className="mx-auto max-w-hero-text text-center">
        <h2 id="features-title" className="text-heading font-semibold text-balance text-text">
          {FEATURES_HEADING}
        </h2>
        <p className="mt-2 text-pretty text-text-muted">{FEATURES_INTRO}</p>
      </div>

      {/* Same max width as the topic list and CTA card, so the outer edges line up.
          An ordered list: the features are numbered 01–04. */}
      <ol className="mx-auto mt-12 flex max-w-preview flex-col gap-16 md:gap-24">
        {FEATURES.map((feature, index) => (
          <FeatureRow key={feature.id} feature={feature} index={index} />
        ))}
      </ol>
    </section>
  )
}

export default FeaturesSection
