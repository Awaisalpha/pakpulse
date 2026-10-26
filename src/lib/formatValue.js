// Number formatters, created once and reused (creating them is the slow part).
// The "exactly" ones always show the same number of decimals (53 → "53.0"), so values
// of one indicator line up in a table column: "53.0", "48.2", never "53" next to "48.2".
// oneDecimal drops a trailing ".0" and is only used for round axis labels.
const oneDecimal = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })
const exactlyOneDecimal = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})
const exactlyTwoDecimals = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
// Always 3 significant digits: 1588.6 → "1.59", 1600 → "1.60", 850 → "850"
const threeSignificantDigits = new Intl.NumberFormat('en-US', {
  minimumSignificantDigits: 3,
  maximumSignificantDigits: 3,
})
// style: 'percent' expects 0.372 for 37.2%, so we divide by 100 before using it
const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

// Splits a big number into a shorter number and a suffix:
//   241499431 → { number: 241.499431, suffix: 'M' }
//   86.4      → { number: 86.4, suffix: '' }
function shortenNumber(value) {
  const size = Math.abs(value)
  if (size >= 1e12) return { number: value / 1e12, suffix: 'T' }
  if (size >= 1e9) return { number: value / 1e9, suffix: 'B' }
  if (size >= 1e6) return { number: value / 1e6, suffix: 'M' }
  if (size >= 1e3) return { number: value / 1e3, suffix: 'k' }
  return { number: value, suffix: '' }
}

// Turns a raw value into display text, based on the indicator's `format`.
export function formatValue(value, format) {
  if (value === null || value === undefined) {
    return 'No data'
  }

  switch (format) {
    case 'number': {
      // 241499431 → "241.5 M", 240000000 → "240.0 M", 86.4 → "86.4", 90 → "90.0"
      const { number, suffix } = shortenNumber(value)
      return suffix ? `${exactlyOneDecimal.format(number)} ${suffix}` : exactlyOneDecimal.format(number)
    }
    case 'percent':
      // 37.21 → "37.2%"
      return percent.format(value / 100)
    case 'usd': {
      // 1588.6 → "$1.59k", 1600 → "$1.60k", 850 → "$850"
      const sign = value < 0 ? '-' : ''
      const { number, suffix } = shortenNumber(Math.abs(value))
      return `${sign}$${threeSignificantDigits.format(number)}${suffix}`
    }
    case 'usdBillions': {
      // 374600000000 → "$374.6 B"
      // 1,000 billion or more is shown in trillions: 3960000000000 → "$3.96 T"
      const sign = value < 0 ? '-' : ''
      const billions = Math.abs(value) / 1e9
      if (billions >= 1000) return `${sign}$${exactlyTwoDecimals.format(billions / 1000)} T`
      return `${sign}$${exactlyOneDecimal.format(billions)} B`
    }
    case 'per1000':
      // 52.06 → "52.1 per 1,000", 53 → "53.0 per 1,000"
      return `${exactlyOneDecimal.format(value)} per 1,000`
    case 'years':
      // 68.37 → "68.4 years"
      return `${exactlyOneDecimal.format(value)} years`
    case 'ratio':
      // 3.468 → "3.47", 3.5 → "3.50"
      return exactlyTwoDecimals.format(value)
    default:
      // Unknown format: show a plain number rather than crash
      return oneDecimal.format(value)
  }
}

// Shorter text for a chart's axis labels, which are round numbers.
// Unit words go (the chart's heading already names the unit) and so does the forced ".0":
//   60 years → "60" (not "60.0 years"), 20% → "20%" (not "20.0%"), $3,000 B → "$3 T"
export function formatAxisValue(value, format) {
  switch (format) {
    case 'number': {
      // 50 → "50", 200000000 → "200 M"
      const { number, suffix } = shortenNumber(value)
      return suffix ? `${oneDecimal.format(number)} ${suffix}` : oneDecimal.format(number)
    }
    case 'usd': {
      // 1000 → "$1k", 1500 → "$1.5k", 500 → "$500"
      const sign = value < 0 ? '-' : ''
      const { number, suffix } = shortenNumber(Math.abs(value))
      return `${sign}$${oneDecimal.format(number)}${suffix}`
    }
    case 'percent':
      return `${oneDecimal.format(value)}%`
    case 'usdBillions': {
      // 500000000000 → "$500 B", 2000000000000 → "$2 T"
      const sign = value < 0 ? '-' : ''
      const billions = Math.abs(value) / 1e9
      if (billions >= 1000) return `${sign}$${oneDecimal.format(billions / 1000)} T`
      return `${sign}$${oneDecimal.format(billions)} B`
    }
    case 'per1000':
    case 'years':
    case 'ratio':
      return oneDecimal.format(value)
    default:
      return formatValue(value, format)
  }
}
