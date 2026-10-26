import { formatValue } from '../lib/formatValue.js'

// Two small pieces for showing one live number. `figure` comes from getFigure()
// in hooks/useIndicatorRows.js: { state: 'loading' | 'ready' | 'missing', value, year }.

// The number itself:
//   loading → a still grey bar (no animation), plus hidden text for screen readers
//   ready   → the formatted value, e.g. "255.2 M"
//   missing → "—" (FigureNote next to it says "Data unavailable")
export function FigureValue({ figure, format, className = '' }) {
  if (figure.state === 'loading') {
    return (
      <span className={className}>
        {/* 0.75em tall and 4 characters wide, so the layout doesn't jump when the number arrives */}
        <span aria-hidden="true" className="inline-block h-[0.75em] w-[4ch] rounded bg-skeleton" />
        <span className="sr-only">Loading…</span>
      </span>
    )
  }

  if (figure.state === 'missing') {
    // Screen readers skip the dash; they read the note instead
    return (
      <span aria-hidden="true" className={className}>
        —
      </span>
    )
  }

  return <span className={className}>{formatValue(figure.value, format)}</span>
}

// The line under the number: "Pakistan · 2025", "2025", or "Data unavailable".
// Pass `country` to show the country name before the year.
export function FigureNote({ figure, country, className = '' }) {
  if (figure.state === 'loading') {
    return (
      <span className={className}>
        <span aria-hidden="true" className="inline-block h-[0.75em] w-[9ch] rounded bg-skeleton" />
      </span>
    )
  }

  if (figure.state === 'missing') {
    return <span className={className}>Data unavailable</span>
  }

  return <span className={className}>{country ? `${country} · ${figure.year}` : figure.year}</span>
}
