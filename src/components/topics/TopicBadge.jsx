import Icon from '../icons/Icon.jsx'

// A topic's icon in a small rounded square with the topic's own soft tint (tokens in index.css).
// Decorative (aria-hidden): the topic name next to it carries the meaning.

// Written out in full, so Tailwind finds every class name when it scans this file
const BADGE_COLORS = {
  economy: 'bg-topic-economy-tint text-topic-economy-ink',
  population: 'bg-topic-population-tint text-topic-population-ink',
  health: 'bg-topic-health-tint text-topic-health-ink',
  education: 'bg-topic-education-tint text-topic-education-ink',
  technology: 'bg-topic-technology-tint text-topic-technology-ink',
  'energy-environment': 'bg-topic-energy-tint text-topic-energy-ink',
  gender: 'bg-topic-gender-tint text-topic-gender-ink',
}

// Props:
//   slug – the category's slug, e.g. 'health' (picks the colours)
//   icon – the category's icon name, e.g. 'heart'
function TopicBadge({ slug, icon }) {
  return (
    <span aria-hidden="true" className={`inline-flex size-9 shrink-0 items-center justify-center rounded-lg ${BADGE_COLORS[slug]}`}>
      <Icon name={icon} className="size-5" />
    </span>
  )
}

export default TopicBadge
