// The three countries we compare.
// `code` is the ISO3 code the World Bank API uses (it matches `countryiso3code` in each row).
// `colorVar` points at the CSS colour token defined in index.css.
// `barColorVar` is the colour of the country's bar in the About section's bars: Pakistan's solid green,
// soft tints of their own colours for the others (so Pakistan's bar stands out).
// Pakistan is the primary country: always shown and visually emphasised.
// `line` is how the country's line is drawn in charts. The dash pattern tells
// the lines apart without relying on colour (solid, dashed, dotted).
//   width – line thickness in pixels
//   dash  – SVG stroke-dasharray: "6 4" means 6px dash, 4px gap; undefined means solid
// `dot` is the point shape used when a series is drawn as separate points (sparse data
// like literacy). Like the dash, the shape tells countries apart without colour.
//   'circle' (filled) | 'ring' (hollow circle) | 'square' (filled)
export const COUNTRIES = [
  { code: 'PAK', name: 'Pakistan', isPrimary: true, colorVar: '--color-pak', barColorVar: '--color-pak', line: { width: 3.5, dash: undefined }, dot: 'circle' },
  { code: 'IND', name: 'India', isPrimary: false, colorVar: '--color-ind', barColorVar: '--color-ind-soft', line: { width: 2, dash: '6 4' }, dot: 'ring' },
  { code: 'BGD', name: 'Bangladesh', isPrimary: false, colorVar: '--color-bgd', barColorVar: '--color-bgd-soft', line: { width: 2, dash: '1 4' }, dot: 'square' },
]
