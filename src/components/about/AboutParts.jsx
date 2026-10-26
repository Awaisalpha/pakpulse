import { CATEGORIES, INDICATORS } from '../../data/indicators.js'
import { SOURCE_LINK, getFact } from '../../data/about.js'
import { useNewestYear } from '../../hooks/useLatestByCountry.js'
import ExternalLink from '../ExternalLink.jsx'
import Icon from '../icons/Icon.jsx'

// Building blocks for the "About the data" section: the light tile, and the source text
// that sits on the photo tile.

// Each tile's own hue, as full class names (Tailwind only finds class names written out in full).
//   tint  – the soft background of the picture area
//   solid – the deep version of the same hue, behind the title and sentence
const TILE_COLOURS = {
  enrolment: { tint: 'bg-about-enrolment-tint', solid: 'bg-about-enrolment-solid' }, // violet
  lag: { tint: 'bg-about-year-tint', solid: 'bg-about-year-solid' }, // teal
  gaps: { tint: 'bg-about-gaps-tint', solid: 'bg-about-gaps-solid' }, // indigo
}

// One tile in two parts:
//   top    – the picture on a soft tint. It grows (flex-1) to fill the height the grid row
//            gives the tile, so the tile never ends in an empty strip.
//   bottom – the deep colour of the same hue: a translucent white badge, a white title and
//            a light grey sentence. The edge where the tint meets the deep colour is the divider.
//   factId    – which fact from data/about.js (also gives the icon and the colours)
//   className – its size in the grid, e.g. 'md:col-span-2'
export function Tile({ factId, className = '', children }) {
  const fact = getFact(factId)
  const colours = TILE_COLOURS[factId]

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-transparent shadow-card ${className}`}>
      <div className={`flex flex-1 flex-col p-6 sm:p-7 ${colours.tint}`}>{children}</div>

      <div className={`flex items-start gap-4 p-6 sm:p-7 ${colours.solid}`}>
        {/* Decorative: the title says what the tile is about */}
        <span aria-hidden="true" className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-on-fill/15 text-on-fill">
          <Icon name={fact.icon} className="size-7" />
        </span>
        {/* min-w-0 lets long words wrap instead of pushing the tile wider */}
        <div className="min-w-0">
          <h3 className="text-card-title font-semibold text-balance text-on-fill">{fact.title}</h3>
          {/* Plain text in one colour: no links, no coloured words */}
          <p className="mt-1.5 text-sm text-pretty text-on-fill-muted">{fact.text}</p>
        </div>
      </div>
    </div>
  )
}

// The key stats: number of indicators and topics (from the config) and the newest
// data year (live). Small monospace labels over the values, hairlines between.
// While the year loads it shows a grey block. If it can't load, its cell is left out
// and the other two share the row, so nothing looks broken.
function AboutStats({ className = '' }) {
  const newest = useNewestYear()

  const stats = [
    { label: 'Indicators', value: INDICATORS.length },
    { label: 'Topics', value: CATEGORIES.length },
  ]
  if (newest.status !== 'error') stats.push({ label: 'Newest data', value: newest.year })

  return (
    // The column count follows the number of stats (2 or 3)
    <dl className={`grid ${stats.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} ${className}`}>
      {stats.map((stat, index) => (
        <div key={stat.label} className={`flex flex-col gap-1 pe-2 ${index > 0 ? 'border-s border-cta-axis ps-4 sm:ps-5' : ''}`}>
          <dt className="font-label text-label text-on-cta-muted uppercase">{stat.label}</dt>
          <dd className="text-figure font-semibold text-on-cta sm:text-figure-lg">
            {stat.value === null ? (
              // Still loading: a block about the size of a year
              <>
                <span aria-hidden="true" className="mt-1 block h-7 w-16 rounded bg-cta-skeleton" />
                <span className="sr-only">Loading</span>
              </>
            ) : (
              stat.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}

// The source text: who publishes the data, the licence, how it loads, that some figures
// are modelled estimates, the key stats and a link to World Bank Open Data.
// It sits on charcoal (phones) or on the photo tile's dark scrim (md up); the text uses
// the CTA card's light tokens. Its parent sets the light-blue focus ring.
export function SourceText() {
  const source = getFact('source')
  const live = getFact('live')
  const estimates = getFact('estimates')

  return (
    <>
      <p className="font-label text-label text-on-cta-muted uppercase">Source</p>
      <h3 className="mt-3 text-heading font-semibold text-balance text-on-cta">{source.title}</h3>
      <p className="mt-3 inline-flex self-start rounded-full border border-cta-axis px-2.5 py-0.5 text-xs font-medium text-on-cta-muted">
        Licence: CC BY 4.0
      </p>
      <p className="mt-4 max-w-measure text-pretty text-on-cta-muted">
        {source.text} {live.text} {estimates.text}
      </p>

      <AboutStats className="mt-6 border-t border-cta-axis pt-5" />

      <div className="pt-6">
        <ExternalLink
          href={SOURCE_LINK.href}
          className="inline-flex min-h-11 items-center rounded-full bg-surface px-5 font-medium text-text hover:bg-pill"
        >
          {SOURCE_LINK.label}
        </ExternalLink>
      </div>
    </>
  )
}
