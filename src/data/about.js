// The copy for the landing page's "About the data" section.
// One place for every fact the section states, so the wording stays consistent.
//
// Each fact:
//   id       – used by the section to pick which fact goes where
//   title    – a short heading for the fact
//   text     – one or two plain sentences
//   icon     – optional, name of its small icon (see components/icons/Icon.jsx)

export const ABOUT_EYEBROW = 'About the data'
export const ABOUT_HEADING = 'Where the numbers come from'
export const ABOUT_INTRO = 'What PakPulse shows, where it comes from, and what to keep in mind when you read it.'

// The source link. Its text names the destination, so it makes sense on its own.
export const SOURCE_LINK = { href: 'https://data.worldbank.org', label: 'Visit World Bank Open Data' }

export const FACTS = [
  {
    id: 'source',
    title: 'World Bank, World Development Indicators',
    text: 'All figures come from the World Bank’s World Development Indicators, published under the CC BY 4.0 licence.',
  },
  {
    id: 'live',
    title: 'Loaded live on every visit',
    text: 'PakPulse loads the figures from the World Bank API each time you visit. The data isn’t stored in the app.',
  },
  {
    id: 'estimates',
    title: 'Some figures are estimates',
    text: 'Some figures are modelled estimates, such as unemployment from the International Labour Organization (ILO).',
  },
  {
    id: 'lag',
    title: 'Every value shows its year',
    icon: 'calendar',
    text: 'Figures usually trail the current year by one to two years, and the newest year can differ from country to country. That’s why every value shows its year.',
  },
  {
    id: 'gaps',
    title: 'Missing years stay empty',
    icon: 'gapDots',
    text: 'Not every country reports every figure every year. A year with no figure is shown as a gap, never as zero.',
  },
  {
    id: 'enrolment',
    title: 'Enrolment can pass 100%',
    icon: 'overflow',
    text: 'Gross school enrolment can go above 100% because it counts enrolled students of every age, including those older or younger than the official school age.',
  },
]

// Look up one fact by its id, e.g. getFact('gaps').text
export function getFact(id) {
  return FACTS.find((fact) => fact.id === id)
}
