// India's flag, drawn small (16 × 12): saffron, white and green stripes with the navy
// wheel (Ashoka Chakra) in the middle, simplified to a ring and a dot at this size.
// The hex colours are the flag's own colours, not design tokens.
function IndiaFlag() {
  return (
    <svg viewBox="0 0 16 12" width="16" height="12" className="block">
      <rect width="16" height="4" fill="#ff9933" />
      <rect y="4" width="16" height="4" fill="#ffffff" />
      <rect y="8" width="16" height="4" fill="#138808" />
      <circle cx="8" cy="6" r="1.5" fill="none" stroke="#000080" strokeWidth="0.5" />
      <circle cx="8" cy="6" r="0.4" fill="#000080" />
    </svg>
  )
}

export default IndiaFlag
