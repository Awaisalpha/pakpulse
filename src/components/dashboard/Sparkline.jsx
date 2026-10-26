import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts'

// A tiny line of one country's values, without axes or labels.
// Hidden from screen readers: the card next to it already states the latest value
// and the change in words. Gaps stay gaps, like in the main chart. No animation.
//
// Props:
//   rows        – chart rows, oldest first (e.g. the last 15 years)
//   countryCode – e.g. 'PAK'
//   color       – line colour, e.g. 'var(--color-on-accent)'
//   isSparse    – true when many years are missing: then small dots instead of a line
function Sparkline({ rows, countryCode, color, isSparse = false }) {
  return (
    <div aria-hidden="true" className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 4, right: 4, bottom: 4, left: 4 }} accessibilityLayer={false}>
          {/* Hidden axis: fits the line between its own lowest and highest value */}
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Line
            type="monotone"
            dataKey={countryCode}
            stroke={isSparse ? 'none' : color}
            strokeWidth={2}
            dot={isSparse ? { r: 2, fill: color, stroke: 'none' } : false}
            connectNulls={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Sparkline
