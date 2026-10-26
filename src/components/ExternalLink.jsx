// A link to another website. It opens in a new tab, so we say so to screen readers
// (the hidden text) and show a small arrow to everyone else.
// rel="noopener noreferrer" stops the new tab from controlling this one.
function ExternalLink({ href, className, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ms-1 inline-block shrink-0"
      >
        <path d="M5 11 11 5" />
        <path d="M6 5h5v5" />
      </svg>
    </a>
  )
}

export default ExternalLink
