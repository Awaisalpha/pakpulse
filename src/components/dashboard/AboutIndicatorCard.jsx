import { CATEGORIES } from '../../data/indicators.js'
import { getCoveredYears, getCoverage, summarizeCoverage } from '../../lib/dataCoverage.js'
import EstimateBadge from '../EstimateBadge.jsx'
import ExternalLink from '../ExternalLink.jsx'
import TopicBadge from '../topics/TopicBadge.jsx'
import CoverageRow from './CoverageRow.jsx'
import { YearTicks } from './YearGrid.jsx'

// "About this indicator", top to bottom:
//   header    – the indicator's icon in its category's tinted badge, the card title,
//               the indicator name (plus an "Estimate" badge for modelled data)
//   body      – the description, the unit and code as two chips, a link to the World Bank page
//   coverage  – after one hairline: a one-line summary, then a compact grid: year labels
//               every 5 years along the top, and per country a row of year squares
//               with the share of years that have data and the latest year
// The card is a flex column and the coverage part takes any spare height (flex-1),
// so when the card next to it is taller there is no empty gap at the bottom.
//
// Props:
//   status, rows, indicator – from the explorer (rows: all years)
//   className – the frame each layout gives the card

// The coverage grid's columns on a wide card: country name | year squares | share and year.
// The year labels' row uses the same columns, so the labels sit over the squares.
// Written out in full, so Tailwind finds the class name when it scans this file.
const COVERAGE_COLUMNS = '@md:grid-cols-[7rem_minmax(0,1fr)_5rem]'

// A chip for one detail, e.g. "Unit · annual %". A <div> around <dt> + <dd> is allowed in a <dl>.
function DetailChip({ label, children, valueClassName = '' }) {
  return (
    <div className="inline-flex max-w-full items-baseline gap-1.5 rounded-full bg-pill px-3 py-1 text-sm">
      <dt className="text-text-muted">
        {label}
        <span aria-hidden="true"> ·</span>
      </dt>
      <dd className={`min-w-0 break-words text-text ${valueClassName}`}>{children}</dd>
    </div>
  )
}

// The "Data coverage" part: loading blocks, an error note, or the summary and one row per country
function CoverageSection({ status, rows }) {
  let summary
  let body

  if (status === 'loading') {
    summary = <span aria-hidden="true" className="block h-4 w-3/5 rounded bg-skeleton" />
    // Three grey strips where the three rows will be
    body = (
      <ul aria-hidden="true" className="flex flex-1 flex-col justify-around gap-4">
        {[1, 2, 3].map((item) => (
          <li key={item} className="flex flex-col gap-1.5">
            <span className="h-4 w-2/5 rounded bg-skeleton" />
            <span className="h-3 rounded-xs bg-skeleton" />
          </li>
        ))}
      </ul>
    )
  } else if (status === 'error') {
    summary = 'Coverage shows once the data loads.'
  } else {
    const years = getCoveredYears(rows)
    const coverage = getCoverage(rows)

    if (years.length === 0) {
      summary = 'No data since 2000 for any of the three countries.'
    } else {
      // Each part on one line ("Pakistan: 11 years missing"); lines break only between parts
      summary = summarizeCoverage(coverage).map((part, index) => (
        <span key={part}>
          {index > 0 && ' · '}
          <span className="whitespace-nowrap">{part}</span>
        </span>
      ))
      body = (
        <>
          {/* Year labels every 5 years along the top, over the squares' column */}
          <div className={`grid gap-x-3 ${COVERAGE_COLUMNS}`}>
            <YearTicks years={years} className="text-text-muted @md:col-start-2" />
          </div>
          <ul className="mt-2 flex flex-1 flex-col justify-around gap-4">
            {coverage.map((item) => (
              <CoverageRow key={item.country.code} item={item} years={years} columnsClassName={COVERAGE_COLUMNS} />
            ))}
          </ul>
        </>
      )
    }
  }

  return (
    // @container: the rows switch between narrow and wide by the card's own width, not the screen's
    <section aria-labelledby="coverage-title" className="@container flex flex-1 flex-col">
      {/* h3: this part sits inside the card, which has the h2 */}
      <h3 id="coverage-title" className="text-sm font-semibold text-text">
        Data coverage
      </h3>
      <p className="mt-1 mb-4 text-sm text-pretty text-text-muted">{summary}</p>
      {body}
    </section>
  )
}

function AboutIndicatorCard({ status, rows, indicator, className = '' }) {
  // The indicator only stores its category's name; the badge colours need the slug
  const category = CATEGORIES.find((item) => item.name === indicator.category)

  return (
    <section aria-labelledby="about-indicator-title" className={`flex flex-col ${className}`}>
      <div className="flex items-start gap-3">
        <TopicBadge slug={category.slug} icon={indicator.icon} />
        <div className="min-w-0">
          <h2 id="about-indicator-title" className="text-card-title font-bold text-text">
            About this indicator
          </h2>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-text">
            {indicator.name}
            {indicator.isEstimate && <EstimateBadge />}
          </p>
        </div>
      </div>

      <p className="mt-4 max-w-measure text-base leading-relaxed text-pretty text-text">{indicator.description}</p>
      {indicator.isEstimate && (
        <p className="mt-2 text-sm text-pretty text-text-muted">Modelled estimates, not direct measurements.</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        {/* A description list: pairs of "term" and "value", shown as chips */}
        <dl className="flex flex-wrap gap-2">
          <DetailChip label="Unit">{indicator.unit}</DetailChip>
          <DetailChip label="Code" valueClassName="font-label">
            {indicator.code}
          </DetailChip>
        </dl>
        <ExternalLink
          href={`https://data.worldbank.org/indicator/${indicator.code}`}
          className="inline-flex min-h-10 items-center text-sm font-medium text-text underline underline-offset-4 transition-colors hover:text-accent"
        >
          View on World Bank
        </ExternalLink>
      </div>

      {/* The one hairline in the card */}
      <div className="mt-4 flex flex-1 flex-col border-t border-border pt-4">
        <CoverageSection status={status} rows={rows} />
      </div>
    </section>
  )
}

export default AboutIndicatorCard
