// Picks "indicator" or "indicators" using the English plural rules built into the browser
const pluralRules = new Intl.PluralRules('en')

// 1 → "1 indicator", 6 → "6 indicators"
export function formatIndicatorCount(count) {
  const word = pluralRules.select(count) === 'one' ? 'indicator' : 'indicators'
  return `${count} ${word}`
}
