import { Link } from 'react-router'
import { CATEGORIES, getIndicatorsInCategory } from '../data/indicators.js'
import { formatIndicatorCount } from '../lib/formatIndicatorCount.js'
import Icon from './icons/Icon.jsx'
import TopicBadge from './topics/TopicBadge.jsx'
import TopicIntro from './topics/TopicIntro.jsx'

// The landing page's "Explore by topic" section: one charcoal panel, like the footer's CTA card.
// Left: the intro in light text. Right: one white list with a compact row per topic.
// Phones and tablets: the intro sits above the list. From lg up: side by side.

function TopicRow({ category }) {
  // The count comes from the config, so it stays true when indicators are added
  const count = getIndicatorsInCategory(category.name).length

  return (
    // The whole row is one link; its accessible name starts with the topic name.
    // "group" lets the name and arrow turn blue while the row is hovered.
    // Phones: the count sits under the description. From sm up: on the right, before the arrow.
    <Link
      to={`/explore/${category.slug}`}
      className="group flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-row-hover"
    >
      <TopicBadge slug={category.slug} icon={category.icon} />

      <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4">
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="font-semibold text-text transition-colors group-hover:text-accent">{category.name}</span>
          <span className="text-sm text-pretty text-text-muted">{category.description}</span>
        </span>
        <span className="font-label text-label whitespace-nowrap text-text-muted uppercase">{formatIndicatorCount(count)}</span>
      </span>

      <Icon name="arrowRight" className="text-text-muted transition-colors group-hover:text-accent" />
    </Link>
  )
}

function CategoryList() {
  return (
    <section aria-labelledby="topics-title" className="px-gutter sm:px-gutter-wide">
      {/* Same max width as the chart card above, so the edges line up */}
      <div className="mx-auto grid max-w-preview items-center gap-10 rounded-3xl bg-cta p-6 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
        {/* The light blue focus ring on charcoal: the normal blue ring is too dark here.
            Only on the left side; the white list keeps the normal blue ring. */}
        <div className="[&_:focus-visible]:outline-focus-on-dark">
          <TopicIntro titleId="topics-title" />
        </div>

        {/* Outer radius 20px = row radius 12px + 8px padding, so the corners run parallel */}
        <ul className="flex flex-col divide-y divide-border rounded-[20px] bg-surface p-2">
          {CATEGORIES.map((category) => (
            <li key={category.slug} className="py-1 first:pt-0 last:pb-0">
              <TopicRow category={category} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default CategoryList
