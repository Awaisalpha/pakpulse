// Pakistan's flag, drawn small (16 × 12): a white stripe at the pole side, then a dark green
// field with a white crescent and star. The hex colours are the flag's own colours, so they
// are written here and not as design tokens (they are never used anywhere else in the UI).
function PakistanFlag() {
  return (
    <svg viewBox="0 0 16 12" width="16" height="12" className="block">
      <rect width="16" height="12" fill="#01411c" />
      <rect width="4" height="12" fill="#ffffff" />
      {/* The crescent: a white circle with a green circle laid over it, a little up and to the right */}
      <circle cx="9.6" cy="6.3" r="3" fill="#ffffff" />
      <circle cx="10.5" cy="5.5" r="2.6" fill="#01411c" />
      <polygon
        points="12.60,3.38 12.48,4.12 13.13,4.49 12.39,4.61 12.23,5.34 11.90,4.67 11.15,4.75 11.69,4.22 11.38,3.54 12.05,3.88"
        fill="#ffffff"
      />
    </svg>
  )
}

export default PakistanFlag
