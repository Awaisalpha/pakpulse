// Groups missing years into runs and writes them short:
// [2000, 2001, 2002, 2016] → "2000–2002, 2016"
export function describeMissingYears(years) {
  const runs = []
  for (const year of years) {
    const lastRun = runs[runs.length - 1]
    if (lastRun && year === lastRun.to + 1) {
      lastRun.to = year
    } else {
      runs.push({ from: year, to: year })
    }
  }
  return runs.map((run) => (run.from === run.to ? `${run.from}` : `${run.from}–${run.to}`)).join(', ')
}
