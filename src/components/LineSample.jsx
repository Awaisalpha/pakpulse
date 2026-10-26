// One data point drawn in a country's shape (see `dot` in data/countries.js),
// centred on (cx, cy). Used inside the chart and inside LineSample below.
export function CountryDot({ country, cx, cy }) {
  const color = `var(${country.colorVar})`

  if (country.dot === 'square') {
    return <rect x={cx - 3.5} y={cy - 3.5} width="7" height="7" fill={color} />
  }
  if (country.dot === 'ring') {
    return <circle cx={cx} cy={cy} r="3" fill="var(--color-surface)" stroke={color} strokeWidth="2" />
  }
  return <circle cx={cx} cy={cy} r="4" fill={color} />
}

// A short piece of a country's chart line (solid, dashed or dotted), used like a
// legend key next to the country's name. It is decorative: the name beside it
// carries the meaning, so screen readers skip it.
// With `asDot`, it shows the country's point shape instead, for charts that draw
// that country as separate points.
function LineSample({ country, asDot = false }) {
  return (
    <svg aria-hidden="true" width="24" height="10" viewBox="0 0 24 10" className="shrink-0">
      {asDot ? (
        <CountryDot country={country} cx={12} cy={5} />
      ) : (
        <line
          x1="2"
          y1="5"
          x2="22"
          y2="5"
          stroke={`var(${country.colorVar})`}
          strokeWidth={country.line.width}
          strokeDasharray={country.line.dash}
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

export default LineSample
