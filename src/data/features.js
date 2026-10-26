// The copy for the landing page's "Features" section.
// Only things the site really does. `id` picks the mini dashboard shown next to each feature.
// `link` is optional: { to, label }, where `to` is a page inside the site.

export const FEATURES_HEADING = 'What the explorer shows'

export const FEATURES_INTRO =
  'Every chart uses the same World Bank data, the same three countries and the same rules for missing years.'

export const FEATURES = [
  {
    id: 'live',
    title: 'Live World Bank data',
    text: 'Every figure is fetched from the World Bank API when you open PakPulse. The year next to each value shows how recent it is.',
    link: { to: '/explore/economy', label: 'Explore economy indicators' },
  },
  {
    id: 'compare',
    title: 'Compare with neighbours',
    text: 'Each indicator shows Pakistan alongside India and Bangladesh, with Pakistan highlighted.',
    link: { to: '/explore/health', label: 'Explore health indicators' },
  },
  {
    id: 'gaps',
    title: 'Honest about gaps',
    text: 'When a country reports no figure for a year, that year stays empty instead of being drawn as zero. Every value is labelled with its year.',
    link: { to: '/explore/education', label: 'Explore education indicators' },
  },
  {
    id: 'everyone',
    title: 'Works for everyone',
    text: 'Layouts adapt from phone to desktop, every control works with a keyboard, and text meets WCAG AA contrast.',
  },
]
