import { useId } from 'react'
import { COUNTRIES } from '../../data/countries.js'
import CountryFlag from '../flags/CountryFlag.jsx'

// Three toggle buttons that show or hide a country in the charts and the table.
// Each button says whether it is on with aria-pressed (screen readers say "pressed"),
// and shows it without relying on colour: on = dark fill + check mark, off = white outline.
// Pakistan is always shown: its button stays focusable but does nothing (aria-disabled),
// shows a lock, and screen readers hear "Pakistan is always shown."
//
// Props:
//   hiddenCodes – the hidden country codes, e.g. ['IND']
//   onToggle    – function(code), called when India or Bangladesh is clicked

const BUTTON = 'inline-flex min-h-10 items-center gap-2 rounded-full border px-3 text-sm whitespace-nowrap transition-colors'
const ON = 'border-text bg-text font-semibold text-on-cta'
const OFF = 'border-border-input bg-surface font-medium text-text hover:bg-pill'

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  )
}

function CountryToggles({ hiddenCodes, onToggle }) {
  // The id of the hidden note that describes Pakistan's button
  const noteId = useId()

  return (
    <div role="group" aria-label="Countries" className="flex flex-wrap gap-2">
      {COUNTRIES.map((country) => {
        if (country.isPrimary) {
          return (
            <button
              key={country.code}
              type="button"
              aria-pressed="true"
              aria-disabled="true"
              aria-describedby={noteId}
              className={`${BUTTON} ${ON} cursor-default`}
            >
              <CountryFlag code={country.code} />
              {country.name}
              <LockIcon />
            </button>
          )
        }

        const isOn = !hiddenCodes.includes(country.code)
        return (
          <button
            key={country.code}
            type="button"
            aria-pressed={isOn}
            onClick={() => onToggle(country.code)}
            className={`${BUTTON} ${isOn ? ON : OFF}`}
          >
            <CountryFlag code={country.code} />
            {country.name}
            {isOn && <CheckIcon />}
          </button>
        )
      })}

      {/* Not shown on screen; read out as the description of Pakistan's button */}
      <span id={noteId} hidden>
        Pakistan is always shown.
      </span>
    </div>
  )
}

export default CountryToggles
