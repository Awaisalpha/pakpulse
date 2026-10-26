import { CardLabel, VisualPanel } from './VisualParts.jsx'

// Mini dashboard for "Works for everyone": a still illustration made with HTML and CSS.
// A phone-sized frame with a simplified PakPulse card, keyboard keys, a button
// with a focus ring, and an "AA contrast" badge. No data needed.

const LABEL =
  'Illustration: a phone-sized PakPulse card, the keyboard keys Tab, left arrow, right arrow and Esc, a button with a visible focus ring, and an AA contrast badge.'

const KEYS = ['Tab', '←', '→', 'Esc']

// A tick mark for the badge (decorative)
function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  )
}

// A rising line for the phone's card (decorative, not real data)
function SampleLine() {
  return (
    <svg viewBox="0 0 80 28" className="h-8 w-full" fill="none" stroke="var(--color-accent-on-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 24 L18 20 L32 21 L46 13 L60 11 L78 4" />
    </svg>
  )
}

// One step of the illustration: a small label and its content, split by a hairline
function Step({ label, children }) {
  return (
    <div className="flex flex-col gap-2 border-t border-cta-grid pt-3 first:border-t-0 first:pt-0">
      <CardLabel>{label}</CardLabel>
      {children}
    </div>
  )
}

function AccessibilityVisual() {
  return (
    <VisualPanel label={LABEL}>
      {/* Phone frame on the leading side, the three steps next to it */}
      <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6">
        <div className="rounded-[1.5rem] border border-cta-grid p-1.5">
          <div className="flex h-52 flex-col gap-2 rounded-[1.1rem] bg-cta-grid p-2.5">
            {/* The speaker slot at the top of the phone */}
            <div className="mx-auto h-1 w-8 rounded-full bg-cta-skeleton" />
            <div className="rounded-lg bg-cta-panel p-2">
              <p className="text-[0.625rem] font-semibold text-on-cta">PakPulse</p>
              <div className="mt-2 h-1.5 w-3/4 rounded-full bg-cta-skeleton" />
              <div className="mt-1 h-1.5 w-1/2 rounded-full bg-cta-skeleton" />
              <div className="mt-2">
                <SampleLine />
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-cta-skeleton" />
            <div className="h-1.5 w-2/3 rounded-full bg-cta-skeleton" />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <Step label="Keyboard">
            <div className="flex flex-wrap gap-1.5">
              {KEYS.map((key) => (
                <span
                  key={key}
                  className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-b-2 border-cta-axis bg-cta px-2 font-label text-xs text-on-cta"
                >
                  {key}
                </span>
              ))}
            </div>
          </Step>

          <Step label="Focus">
            {/* Looks like a button with the site's focus ring; it is a picture, not a control.
                Dark text on the light blue: 7.4:1 */}
            <span className="my-1 ms-0.5 inline-flex min-h-9 items-center self-start rounded-lg bg-accent-on-dark px-3 text-sm font-medium text-cta-panel outline-2 outline-offset-2 outline-accent-on-dark outline-solid">
              Open explorer
            </span>
          </Step>

          <Step label="Contrast">
            <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-cta-axis bg-cta px-2.5 py-0.5 text-xs font-medium text-on-cta">
              <span className="text-accent-on-dark">
                <CheckIcon />
              </span>
              AA contrast
            </span>
          </Step>
        </div>
      </div>
    </VisualPanel>
  )
}

export default AccessibilityVisual
