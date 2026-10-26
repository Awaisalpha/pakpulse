// All indicators the app can show. The UI is built from this list,
// so adding a new indicator means adding one object here — no new components.
//
// Each entry:
//   code        – World Bank indicator code (used in the API URL)
//   name        – label shown in the UI
//   category    – must match the `name` of one of CATEGORIES below
//   unit        – short unit text shown next to the name
//   format      – how values are displayed; one of:
//                 "number" | "percent" | "usd" | "usdBillions" | "per1000" | "years" | "ratio"
//   description – one or two neutral sentences shown under the chart
//   isEstimate  – optional, true when the values are modelled estimates (e.g. by the ILO)
//                 rather than direct measurements; the explorer then shows an "Estimate" badge
//   icon        – name of the small icon shown before the name in the sidebar
//                 (one of the names in components/icons/Icon.jsx)

// Category tabs, in the order they appear.
//   slug        – the short name used in the URL, e.g. /explore/energy-environment
//   name        – the label shown in the UI
//   description – one short, factual line about what the category covers
//   icon        – name of the small icon shown before the name (see components/icons/Icon.jsx)
export const CATEGORIES = [
  { slug: 'economy', name: 'Economy', icon: 'barChart', description: 'Output, prices, jobs and money sent home' },
  { slug: 'population', name: 'Population', icon: 'people', description: 'Size, growth, cities and births per woman' },
  { slug: 'health', name: 'Health', icon: 'heart', description: 'Life expectancy, child deaths and health spending' },
  { slug: 'education', name: 'Education', icon: 'book', description: 'Literacy, school enrolment and spending' },
  { slug: 'technology', name: 'Technology', icon: 'wifi', description: 'Internet use and mobile subscriptions' },
  { slug: 'energy-environment', name: 'Energy & Environment', icon: 'bolt', description: 'Electricity access and forest cover' },
  { slug: 'gender', name: 'Gender', icon: 'person', description: 'Women’s participation in the labour force' },
]

export const INDICATORS = [
  // ---------- Economy ----------
  // GDP per capita comes first: the first indicator of a category is its default
  {
    code: 'NY.GDP.PCAP.CD',
    icon: 'coins',
    name: 'GDP per capita',
    category: 'Economy',
    unit: 'current US$',
    format: 'usd',
    description: 'GDP divided by the mid-year population, in current US dollars.',
  },
  {
    code: 'NY.GDP.MKTP.CD',
    icon: 'lineChart',
    name: 'GDP',
    category: 'Economy',
    unit: 'current US$',
    format: 'usdBillions',
    description:
      'Gross domestic product: the total value of goods and services produced in the country in a year, in current US dollars.',
  },
  {
    code: 'NY.GDP.MKTP.KD.ZG',
    icon: 'trendUp',
    name: 'GDP growth',
    category: 'Economy',
    unit: 'annual %',
    format: 'percent',
    description:
      'Yearly percentage change in GDP, measured in constant prices so that inflation does not count as growth.',
  },
  {
    code: 'FP.CPI.TOTL.ZG',
    icon: 'priceTag',
    name: 'Inflation, consumer prices',
    category: 'Economy',
    unit: 'annual %',
    format: 'percent',
    description:
      'Yearly percentage change in the cost of a typical basket of goods and services bought by households.',
  },
  {
    code: 'SL.UEM.TOTL.ZS',
    icon: 'search',
    name: 'Unemployment',
    category: 'Economy',
    unit: '% of labour force',
    format: 'percent',
    description:
      'Share of the labour force without work but available for and seeking work. Modelled estimate by the International Labour Organization (ILO).',
    isEstimate: true,
  },
  {
    code: 'BX.TRF.PWKR.CD.DT',
    icon: 'transfer',
    name: 'Personal remittances received',
    category: 'Economy',
    unit: 'current US$',
    format: 'usdBillions',
    description:
      'Money sent home by people working abroad, plus compensation of employees, in current US dollars.',
  },

  // ---------- Population ----------
  {
    code: 'SP.POP.TOTL',
    icon: 'people',
    name: 'Population',
    category: 'Population',
    unit: 'people',
    format: 'number',
    description: 'Total number of residents, counted at mid-year, regardless of legal status or citizenship.',
  },
  {
    code: 'SP.POP.GROW',
    icon: 'personPlus',
    name: 'Population growth',
    category: 'Population',
    unit: 'annual %',
    format: 'percent',
    description: 'Yearly percentage change in the total population.',
  },
  {
    code: 'SP.URB.TOTL.IN.ZS',
    icon: 'buildings',
    name: 'Urban population',
    category: 'Population',
    unit: '% of total',
    format: 'percent',
    description:
      'Share of people living in urban areas, as defined by each country’s national statistical office.',
  },
  {
    code: 'SP.DYN.TFRT.IN',
    icon: 'family',
    name: 'Fertility rate',
    category: 'Population',
    unit: 'births per woman',
    format: 'ratio',
    description:
      'Average number of children a woman would have over her lifetime at the birth rates of that year.',
  },

  // ---------- Health ----------
  {
    code: 'SP.DYN.LE00.IN',
    icon: 'heartbeat',
    name: 'Life expectancy at birth',
    category: 'Health',
    unit: 'years',
    format: 'years',
    description:
      'Number of years a newborn would live if the death rates of that year stayed the same throughout their life.',
  },
  {
    code: 'SP.DYN.IMRT.IN',
    icon: 'baby',
    name: 'Infant mortality',
    category: 'Health',
    unit: 'per 1,000 live births',
    format: 'per1000',
    description: 'Number of babies who die before their first birthday, per 1,000 live births.',
  },
  {
    code: 'SH.DYN.MORT',
    icon: 'child',
    name: 'Under-5 mortality',
    category: 'Health',
    unit: 'per 1,000 live births',
    format: 'per1000',
    description: 'Number of children who die before their fifth birthday, per 1,000 live births.',
  },
  {
    code: 'SH.XPD.CHEX.GD.ZS',
    icon: 'medKit',
    name: 'Current health expenditure',
    category: 'Health',
    unit: '% of GDP',
    format: 'percent',
    description:
      'Total public and private spending on health goods and services in a year, as a share of GDP.',
  },

  // ---------- Education ----------
  {
    code: 'SE.ADT.LITR.ZS',
    icon: 'bookOpen',
    name: 'Adult literacy rate',
    category: 'Education',
    unit: '% ages 15+',
    format: 'percent',
    description:
      'Share of people aged 15 and over who can read and write a short simple statement about their everyday life. Reported only in survey or census years, so many years have no value.',
  },
  {
    code: 'SE.PRM.ENRR',
    icon: 'pencil',
    name: 'Primary school enrolment',
    category: 'Education',
    unit: '% gross',
    format: 'percent',
    description:
      'Children enrolled in primary school, of any age, as a share of the official primary-school-age population. Gross rates can be above 100% when older or younger children are enrolled.',
  },
  {
    code: 'SE.SEC.ENRR',
    icon: 'gradCap',
    name: 'Secondary school enrolment',
    category: 'Education',
    unit: '% gross',
    format: 'percent',
    description:
      'Students enrolled in secondary school, of any age, as a share of the official secondary-school-age population. Gross rates can be above 100% when older or younger students are enrolled.',
  },
  {
    code: 'SE.XPD.TOTL.GD.ZS',
    icon: 'banknote',
    name: 'Government spending on education',
    category: 'Education',
    unit: '% of GDP',
    format: 'percent',
    description: 'Total government spending on education (local, regional and central), as a share of GDP.',
  },

  // ---------- Technology ----------
  {
    code: 'IT.NET.USER.ZS',
    icon: 'globe',
    name: 'Internet users',
    category: 'Technology',
    unit: '% of population',
    format: 'percent',
    description: 'Share of people who used the internet from any location in the last three months.',
  },
  {
    code: 'IT.CEL.SETS.P2',
    icon: 'phone',
    name: 'Mobile subscriptions',
    category: 'Technology',
    unit: 'per 100 people',
    format: 'number',
    description:
      'Mobile phone subscriptions per 100 people. Can be above 100 because one person may have more than one subscription.',
  },

  // ---------- Energy & Environment ----------
  {
    code: 'EG.ELC.ACCS.ZS',
    icon: 'plug',
    name: 'Access to electricity',
    category: 'Energy & Environment',
    unit: '% of population',
    format: 'percent',
    description: 'Share of people with access to electricity.',
  },
  {
    code: 'AG.LND.FRST.ZS',
    icon: 'tree',
    name: 'Forest area',
    category: 'Energy & Environment',
    unit: '% of land area',
    format: 'percent',
    description:
      'Land covered by trees taller than 5 metres over at least 0.5 hectares, as a share of total land area.',
  },

  // ---------- Gender ----------
  {
    code: 'SL.TLF.CACT.FE.ZS',
    icon: 'briefcase',
    name: 'Female labour force participation',
    category: 'Gender',
    unit: '% of females 15+',
    format: 'percent',
    description:
      'Share of women aged 15 and over who are working or looking for work. Modelled estimate by the International Labour Organization (ILO).',
    isEstimate: true,
  },
]

// All indicators that belong to one category, e.g. getIndicatorsInCategory('Health').
// Use `.length` on the result to count them.
export function getIndicatorsInCategory(categoryName) {
  return INDICATORS.filter((indicator) => indicator.category === categoryName)
}

// The category object for a category name, e.g. getCategoryByName('Health') → { slug: 'health', ... }
export function getCategoryByName(categoryName) {
  return CATEGORIES.find((category) => category.name === categoryName)
}
