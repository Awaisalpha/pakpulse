import { Link } from 'react-router'
import { INDICATORS } from '../data/indicators.js'
import { COUNTRIES } from '../data/countries.js'
import { getFigure, useIndicatorRows } from '../hooks/useIndicatorRows.js'
import { FigureNote, FigureValue } from './Figure.jsx'

// The landing page hero: a centred headline on a faint dot grid,
// two buttons, and a strip of four live Pakistan figures.

// The counts come from the config, so they stay true when indicators or countries change
const EYEBROW = `Live World Bank data · ${INDICATORS.length} indicators · ${COUNTRIES.length} countries`

// The four figures in the strip. `label` is shorter than the config name, to fit.
const STATS = [
  { code: 'SP.POP.TOTL', label: 'Population' },
  { code: 'NY.GDP.PCAP.CD', label: 'GDP per capita' },
  { code: 'IT.NET.USER.ZS', label: 'Internet users' },
  { code: 'SP.DYN.LE00.IN', label: 'Life expectancy' },
]

// One cell of the strip. Each cell loads its own indicator.
function StatCell({ code, label }) {
  const indicator = INDICATORS.find((item) => item.code === code)
  const { status, rows } = useIndicatorRows(code)
  const figure = getFigure(status, rows, 'PAK')

  return (
    <div className="flex flex-col gap-1 bg-page px-4 py-5 sm:px-6">
      <dt className="font-label text-label text-text-muted uppercase">{label}</dt>
      <dd className="text-figure font-semibold text-text sm:text-figure-lg">
        <FigureValue figure={figure} format={indicator.format} />
      </dd>
      <dd className="text-sm text-text-muted">
        <FigureNote figure={figure} country="Pakistan" />
      </dd>
    </div>
  )
}

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Decorative background (see .hero-dot-grid in index.css), hidden from screen readers */}
      <div aria-hidden="true" className="hero-dot-grid absolute inset-0 -z-10" />

      {/* Side padding here; each block below sets its own max width and centres itself (mx-auto) */}
      <div className="px-gutter pt-section sm:px-gutter-wide sm:pt-section-wide">
        <div className="mx-auto flex max-w-hero-text flex-col items-center gap-6 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm text-text-muted">
            {/* A still dot (no pulsing) that marks the data as live */}
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent" />
            {EYEBROW}
          </p>

          <h1 id="hero-title" className="text-title font-semibold text-balance text-text sm:text-display">
            Pakistan’s development, in data since 2000
          </h1>

          <p className="max-w-measure text-lead text-pretty text-text-muted">
            PakPulse charts World Bank figures on Pakistan’s economy, health, education and more, alongside India and
            Bangladesh.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/explore/economy"
              className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 font-medium text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-primary-focus"
            >
              Explore the data
            </Link>
            {/* A plain <a>: it jumps to a section on this page */}
            <a
              href="#about-data"
              className="inline-flex min-h-11 items-center rounded-lg border border-border bg-surface px-5 font-medium text-text transition-colors hover:border-text-muted hover:bg-page"
            >
              About the data
            </a>
          </div>
        </div>

        {/* gap-px over a border-coloured background draws hairlines between the cells,
            for both the 2×2 grid on phones and the single row on wider screens */}
        <dl className="mx-auto mt-14 grid max-w-stats grid-cols-2 gap-px border-y border-border bg-border sm:grid-cols-4">
          {STATS.map((stat) => (
            <StatCell key={stat.code} code={stat.code} label={stat.label} />
          ))}
        </dl>
      </div>
    </section>
  )
}

export default Hero
