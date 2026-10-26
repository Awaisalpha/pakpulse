// A row with one equal column per year, used by "Data coverage" for both the coverage
// squares and the year labels above them, so each label sits exactly over its own year.
//
// Props:
//   years     – every year shown, from getCoveredYears(), e.g. [2000, ..., 2025]
//   className – spacing, colours, etc.
//   ...rest   – passed on to the <div> (e.g. role and aria-label)
export function YearGrid({ years, className = '', children, ...rest }) {
  return (
    <div {...rest} className={`grid gap-0.5 ${className}`} style={{ gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))` }}>
      {children}
    </div>
  )
}

// Year labels every 5 years (2000, 2005, ...), on the same columns as the squares.
// Decorative (aria-hidden): each country's coverage image already says its years in words.
// The first label lines up with the start of the squares and the last year with their end,
// so no label sticks out past the card; the others are centred on their year.
export function YearTicks({ years, className = '' }) {
  return (
    <YearGrid years={years} aria-hidden="true" className={`text-xs ${className}`}>
      {years.map((year, index) => {
        if (year % 5 !== 0) return <span key={year} />

        let position = 'left-1/2 -translate-x-1/2'
        if (index === 0) position = 'left-0'
        else if (index === years.length - 1) position = 'right-0'

        return (
          <span key={year} className="relative h-4">
            <span className={`absolute top-0 whitespace-nowrap ${position}`}>{year}</span>
          </span>
        )
      })}
    </YearGrid>
  )
}
