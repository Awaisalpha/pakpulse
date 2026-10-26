// Colours for the Features mini dashboards, which sit on a dark charcoal panel.
// CSS values (not Tailwind classes), because Recharts and inline SVG need them as plain values.

// Lines, labels and surfaces on the dark panel
export const DARK_CHART = {
  grid: 'var(--color-cta-grid)', // faint gridlines and tracks
  axisLine: 'var(--color-cta-axis)', // the chart's baseline
  tick: 'var(--color-on-cta-muted)', // axis labels: 8.6:1 on the panel
  panel: 'var(--color-cta-panel)', // the inner panel, e.g. the inside of a hollow dot
}

// Each country's colour, lightened for the dark panel (same hues as the normal country colours)
export const DARK_COUNTRY_COLORS = {
  PAK: 'var(--color-pak-on-dark)',
  IND: 'var(--color-ind-on-dark)',
  BGD: 'var(--color-bgd-on-dark)',
}
