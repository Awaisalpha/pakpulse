import { Link } from 'react-router'

// The PakPulse logo: a small mark (a pulse line in a rounded square) plus the name.
// It links home. `className` sets the text colour, so the same logo works on
// light and dark bars; the mark keeps the accent blue in both.
function Logo({ className = '' }) {
  return (
    <Link
      to="/"
      className={`inline-flex min-h-10 items-center gap-2 rounded-full text-lg font-semibold tracking-tight ${className}`}
    >
      {/* Decorative: the link's name comes from the text "PakPulse" */}
      <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" className="shrink-0">
        <rect width="24" height="24" rx="7" className="fill-accent" />
        <path
          d="M5 13h3l2-5 3.5 9 2-4H19"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      PakPulse
    </Link>
  )
}

export default Logo
