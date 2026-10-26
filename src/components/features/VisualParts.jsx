// Small building blocks shared by the four Features mini dashboards.
// Every visual sits on a dark charcoal panel, like the call-to-action card above the footer.
// Everything here sits inside a visual that is one role="img", so none of it
// needs its own screen-reader text. The chart colours are in darkChartColors.js.

// The charcoal panel behind a mini dashboard, with a one-step-lighter panel inside it
export function VisualPanel({ label, children }) {
  return (
    // role="img" + aria-label: screen readers read the label as one picture
    // and skip everything inside, so the label must contain the real numbers.
    <div role="img" aria-label={label} className="rounded-3xl bg-cta p-3 sm:p-4">
      {/* aria-hidden on the content too, for screen readers that look inside role="img" anyway */}
      <div aria-hidden="true" className="rounded-2xl bg-cta-panel p-5 sm:p-7">
        {children}
      </div>
    </div>
  )
}

// A small rounded label on the dark panel, e.g. "Latest 58.9% · 2021"
export function Chip({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-cta-axis bg-cta px-2.5 py-0.5 text-xs font-medium text-on-cta-muted ${className}`}
    >
      {children}
    </span>
  )
}

// A grey placeholder block while data loads, on a light background (also used by the About section).
// Pass the size as Tailwind classes, e.g. "h-3 w-24".
export function Skeleton({ className }) {
  return <div className={`rounded bg-skeleton ${className}`} />
}

// The same placeholder block, for the dark panel
export function DarkSkeleton({ className }) {
  return <div className={`rounded bg-cta-skeleton ${className}`} />
}

// Uppercase card title in the small label font
export function CardLabel({ children }) {
  return <p className="font-label text-label text-on-cta-muted uppercase">{children}</p>
}
