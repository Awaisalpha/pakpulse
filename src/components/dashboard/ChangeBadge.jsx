// A small grey label with the change over about 10 years, e.g. "↑ +12.4 pts since 2014".
// It is neutral on purpose: no green or red, because a rise is not always good
// (inflation, child mortality) and we show data, not opinions.
//
// Props:
//   change   – from getChange() in lib/indicatorChange.js, or null (then nothing is shown)
//   onPakCard – true when the badge sits on Pakistan's green card (white text on a lighter green)

// Arrow pointing up, down, or a flat line. Decorative: the text says the same.
function ChangeArrow({ direction }) {
  let path = 'M3 8h10' // flat
  if (direction === 'up') path = 'M8 13V3M4 7l4-4 4 4'
  if (direction === 'down') path = 'M8 3v10M4 9l4 4 4-4'

  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d={path} />
    </svg>
  )
}

function ChangeBadge({ change, onPakCard = false }) {
  if (!change) return null

  // On Pakistan's card: white text on white-15% (5.4:1). Elsewhere: muted text on the pill grey (6.3:1).
  const colors = onPakCard ? 'bg-white/15 text-on-pak' : 'bg-pill text-text-muted'

  return (
    <p className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${colors}`}>
      <ChangeArrow direction={change.direction} />
      {change.text} since {change.sinceYear}
    </p>
  )
}

export default ChangeBadge
