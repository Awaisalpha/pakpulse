import { useId } from 'react'

// The year range control: four buttons (All, Last 10 years, Last 5 years, Custom), the
// pressed one marked with aria-pressed and a white chip, not colour alone. Custom shows
// two native <select> lists, From and To, with only the years that have data.
// From only offers years up to To, and To only years from From on, so From is never after To.
// While the data loads there are no years yet, so the buttons are disabled.
//
// Props:
//   dataYears     – the years with data, oldest first
//   range         – { from, to }, or null while there are no years
//   activePreset  – 'all' | 'last10' | 'last5' | 'custom' | null
//   onPreset      – function(preset), for All / Last 10 years / Last 5 years
//   onCustom      – function(), shows the From/To lists
//   onRangeChange – function(from, to), when a year is picked in a list
//   allButtonRef  – a ref for the "All" button (Reset moves the focus there)

const PRESETS = [
  { id: 'all', label: 'All' },
  { id: 'last10', label: 'Last 10 years' },
  { id: 'last5', label: 'Last 5 years' },
  { id: 'custom', label: 'Custom' },
]

const SELECT_LABEL = 'flex items-center gap-2 text-sm text-text-muted'
// 16px text on phones (text-base), so iOS doesn't zoom in; 14px from sm up
const SELECT = 'min-h-10 rounded-full border border-border-input bg-surface px-3 text-base text-text sm:text-sm'

function YearRange({ dataYears, range, activePreset, onPreset, onCustom, onRangeChange, allButtonRef }) {
  // Unique ids, so each <label> is tied to its <select>
  const fromId = useId()
  const toId = useId()

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {/* The radius is half the group's height, so it is a pill on one line
          and still looks tidy if the buttons wrap on a narrow screen */}
      <div role="group" aria-label="Years" className="flex flex-wrap rounded-[1.375rem] border border-border bg-pill p-0.5">
        {PRESETS.map((preset) => {
          const isCurrent = preset.id === activePreset
          return (
            <button
              key={preset.id}
              ref={preset.id === 'all' ? allButtonRef : undefined}
              type="button"
              aria-pressed={isCurrent}
              disabled={range === null}
              onClick={() => (preset.id === 'custom' ? onCustom() : onPreset(preset.id))}
              className={`inline-flex min-h-10 items-center rounded-full px-3 text-sm whitespace-nowrap transition-colors disabled:text-text-muted ${
                isCurrent ? 'bg-surface font-semibold text-text shadow-sm' : 'text-text-muted enabled:hover:text-text'
              }`}
            >
              {preset.label}
            </button>
          )
        })}
      </div>

      {activePreset === 'custom' && range !== null && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <label htmlFor={fromId} className={SELECT_LABEL}>
            From
            <select
              id={fromId}
              value={range.from}
              // The <select> gives its value as text, so Number() turns it back into a year
              onChange={(event) => onRangeChange(Number(event.target.value), range.to)}
              className={SELECT}
            >
              {dataYears
                .filter((year) => year <= range.to)
                .map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </select>
          </label>
          <label htmlFor={toId} className={SELECT_LABEL}>
            To
            <select
              id={toId}
              value={range.to}
              onChange={(event) => onRangeChange(range.from, Number(event.target.value))}
              className={SELECT}
            >
              {dataYears
                .filter((year) => year >= range.from)
                .map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </select>
          </label>
        </div>
      )}
    </div>
  )
}

export default YearRange
