// Small line icons (16 × 16, 1.5px lines), drawn by hand as inline SVG.
// Each entry in ICONS is the inside of one icon; <Icon name="heart" /> draws it.
// All icons use `currentColor`, so they take the text colour of their parent:
// set the colour with a class like text-text-muted or text-accent.
//
// Tip for small dots: a path like "M5 5h.01" with round line caps draws a round dot.

const ICONS = {
  // ---------- Categories ----------
  barChart: (
    <>
      <path d="M2 13.5h12" />
      <path d="M4 11V7M8 11V3M12 11V5" />
    </>
  ),
  people: (
    <>
      <circle cx="6" cy="5.5" r="2" />
      <path d="M2.5 13c0-2 1.6-3.5 3.5-3.5S9.5 11 9.5 13" />
      <circle cx="11" cy="6" r="1.6" />
      <path d="M10.5 9.6c1.8 0 3 1.4 3 3.4" />
    </>
  ),
  heart: <path d="M8 13.5S2.5 10.3 2.5 6.3A2.8 2.8 0 0 1 8 5a2.8 2.8 0 0 1 5.5 1.3c0 4-5.5 7.2-5.5 7.2Z" />,
  book: (
    <>
      <path d="M3.5 3h7.5a1.5 1.5 0 0 1 1.5 1.5V13H5a1.5 1.5 0 0 1-1.5-1.5Z" />
      <path d="M3.5 11.5A1.5 1.5 0 0 1 5 10h7.5" />
    </>
  ),
  wifi: (
    <>
      <path d="M2 6.5a9 9 0 0 1 12 0" />
      <path d="M4.2 9a5.8 5.8 0 0 1 7.6 0" />
      <path d="M6.4 11.4a2.6 2.6 0 0 1 3.2 0" />
      <path d="M8 13.5h.01" />
    </>
  ),
  bolt: <path d="M9 1.5 3.5 9H8l-1 5.5L12.5 7H8Z" />,
  person: (
    <>
      <circle cx="8" cy="4.5" r="2" />
      <path d="M4 14c0-2.5 1.8-4.5 4-4.5s4 2 4 4.5" />
    </>
  ),

  // ---------- Indicators ----------
  lineChart: (
    <>
      <path d="M2 13.5h12" />
      <path d="M3 10.5 6 7.5l2.5 2L13 4.5" />
    </>
  ),
  coins: (
    <>
      <circle cx="6" cy="6" r="3.5" />
      <path d="M9.3 7.2a3.5 3.5 0 1 1-2.6 5.6" />
    </>
  ),
  trendUp: (
    <>
      <path d="M2 12 6.5 7.5 9 10l5-5" />
      <path d="M10 5h4v4" />
    </>
  ),
  priceTag: (
    <>
      <path d="M2.5 2.5h5l6 6-5 5-6-6Z" />
      <path d="M5.5 5.5h.01" />
    </>
  ),
  search: (
    <>
      <circle cx="7" cy="7" r="4" />
      <path d="m10 10 3.5 3.5" />
    </>
  ),
  transfer: (
    <>
      <path d="M2.5 5.5h10M10 3l2.5 2.5L10 8" />
      <path d="M13.5 10.5h-10M6 8l-2.5 2.5L6 13" />
    </>
  ),
  personPlus: (
    <>
      <circle cx="6" cy="4.5" r="2" />
      <path d="M2 14c0-2.5 1.8-4.5 4-4.5s4 2 4 4.5" />
      <path d="M12.5 5v4M10.5 7h4" />
    </>
  ),
  buildings: (
    <>
      <path d="M2.5 14V5.5l4-2V14" />
      <path d="M6.5 14V7.5h7V14" />
      <path d="M1.5 14h13" />
      <path d="M4.5 7h.01M4.5 10h.01M9 10h.01M11 10h.01" />
    </>
  ),
  family: (
    <>
      <circle cx="5.5" cy="4" r="1.8" />
      <path d="M2 13.5c0-2.4 1.6-4.2 3.5-4.2S9 11.1 9 13.5" />
      <circle cx="11.5" cy="8" r="1.3" />
      <path d="M9.6 13.5c0-1.5.9-2.6 1.9-2.6s1.9 1.1 1.9 2.6" />
    </>
  ),
  heartbeat: <path d="M1.5 8.5h3l1.5-3 2.5 6 1.5-3h4.5" />,
  baby: (
    <>
      <circle cx="8" cy="5.5" r="3" />
      <path d="M7 5.5h.01M9 5.5h.01" />
      <path d="M4.5 14c.5-2 1.8-3 3.5-3s3 1 3.5 3" />
    </>
  ),
  child: (
    <>
      <circle cx="8" cy="3.5" r="1.6" />
      <path d="M8 6v4.5M5.5 8h5M8 10.5l-2 3M8 10.5l2 3" />
    </>
  ),
  medKit: (
    <>
      <rect x="2.5" y="4.5" width="11" height="9" rx="1.5" />
      <path d="M6 4.5V3h4v1.5" />
      <path d="M8 7v4M6 9h4" />
    </>
  ),
  bookOpen: (
    <>
      <path d="M8 4.5C6.5 3.3 4.5 3 2 3v9.5c2.5 0 4.5.3 6 1.5 1.5-1.2 3.5-1.5 6-1.5V3c-2.5 0-4.5.3-6 1.5Z" />
      <path d="M8 4.5V14" />
    </>
  ),
  pencil: (
    <>
      <path d="m10.5 2.5 3 3-8 8h-3v-3Z" />
      <path d="m9 4 3 3" />
    </>
  ),
  gradCap: (
    <>
      <path d="M1.5 6 8 3l6.5 3L8 9Z" />
      <path d="M4.5 7.5v3c1 1 2.2 1.5 3.5 1.5s2.5-.5 3.5-1.5v-3" />
      <path d="M14.5 6v3.5" />
    </>
  ),
  banknote: (
    <>
      <rect x="1.5" y="4" width="13" height="8" rx="1.5" />
      <circle cx="8" cy="8" r="1.8" />
      <path d="M4 8h.01M12 8h.01" />
    </>
  ),
  globe: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M2 8h12" />
      <path d="M8 2c1.8 1.7 2.6 3.7 2.6 6S9.8 12.3 8 14c-1.8-1.7-2.6-3.7-2.6-6S6.2 3.7 8 2Z" />
    </>
  ),
  phone: (
    <>
      <rect x="4.5" y="1.5" width="7" height="13" rx="1.5" />
      <path d="M7 12h2" />
    </>
  ),
  plug: (
    <>
      <path d="M6 1.5v3M10 1.5v3" />
      <path d="M4 4.5h8V7a4 4 0 0 1-8 0Z" />
      <path d="M8 11v3.5" />
    </>
  ),
  tree: (
    <>
      <path d="M8 1.5 3.5 8h2L3 12h10l-2.5-4h2Z" />
      <path d="M8 12v2.5" />
    </>
  ),
  briefcase: (
    <>
      <rect x="2" y="5" width="12" height="8.5" rx="1.5" />
      <path d="M5.5 5V3.5h5V5" />
      <path d="M2 9h12" />
    </>
  ),

  // ---------- Explore by topic ----------
  // A tick mark: one true fact in the checklist
  check: <path d="m3 8.5 3 3 7-7" />,
  // An arrow pointing right: "go to"
  arrowRight: (
    <>
      <path d="M3 8h10" />
      <path d="m9 4 4 4-4 4" />
    </>
  ),

  // ---------- About the data ----------
  // A calendar page: "every value shows its year"
  calendar: (
    <>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" />
      <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" />
    </>
  ),
  // Four years on a baseline, one with no dot above its tick: "missing years stay empty"
  gapDots: (
    <>
      <path d="M1.5 13.5h13" />
      <path d="M3 12v1.5M6.5 12v1.5M10 12v1.5M13.5 12v1.5" />
      <circle cx="3" cy="8.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="6.5" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="4.5" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  // A bar that runs past an upright line: "enrolment can pass 100%"
  overflow: (
    <>
      <rect x="1.5" y="6" width="12" height="4" rx="1" />
      <path d="M10.5 3v10" />
    </>
  ),
}

// Props:
//   name      – one of the keys of ICONS above, e.g. 'heart'
//   className – classes for colour, e.g. 'text-text-muted'
// Decorative (aria-hidden): the text next to the icon carries the meaning.
function Icon({ name, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      {ICONS[name]}
    </svg>
  )
}

export default Icon
