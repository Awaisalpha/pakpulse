// One small line icon per feature (16 × 16 grid, 1.5px lines, drawn at 20px), drawn by hand.
// Decorative: the feature's title carries the meaning, so screen readers skip it (aria-hidden).
// Uses `currentColor`, so the parent's text colour sets the icon colour.
//
// Props: id – the feature's id in data/features.js ('live' | 'compare' | 'gaps' | 'everyone')

const ICONS = {
  // A signal sending out waves: "live data"
  live: (
    <>
      <path d="M8 8h.01" strokeWidth="2.5" />
      <path d="M5.5 5.5a3.5 3.5 0 0 0 0 5M10.5 5.5a3.5 3.5 0 0 1 0 5" />
      <path d="M3.2 3.2a6.8 6.8 0 0 0 0 9.6M12.8 3.2a6.8 6.8 0 0 1 0 9.6" />
    </>
  ),
  // Three rows, each with a dot at a different place: "compare"
  compare: (
    <>
      <path d="M2 4h12M2 8h12M2 12h12" strokeOpacity="0.45" />
      <circle cx="6" cy="4" r="1.6" fill="currentColor" />
      <circle cx="11" cy="8" r="1.6" fill="currentColor" />
      <circle cx="8.5" cy="12" r="1.6" fill="currentColor" />
    </>
  ),
  // Dots on a baseline with a dashed empty stretch: "gaps stay gaps"
  gaps: (
    <>
      <path d="M1.5 13.5h13" />
      <circle cx="3" cy="9" r="1.3" fill="currentColor" />
      <circle cx="5.5" cy="7.5" r="1.3" fill="currentColor" />
      <path d="M7.5 6.5h3" strokeDasharray="1 1.5" />
      <circle cx="13" cy="4.5" r="1.3" fill="currentColor" />
    </>
  ),
  // A keyboard: "works for everyone"
  everyone: (
    <>
      <rect x="1.5" y="4" width="13" height="8" rx="1.5" />
      <path d="M4.5 6.8h.01M7 6.8h.01M9 6.8h.01M11.5 6.8h.01" strokeWidth="2" />
      <path d="M5.5 9.5h5" />
    </>
  ),
}

function FeatureIcon({ id }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      {ICONS[id]}
    </svg>
  )
}

export default FeatureIcon
