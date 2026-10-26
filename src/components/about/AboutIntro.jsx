import { ABOUT_EYEBROW, ABOUT_HEADING, ABOUT_INTRO } from '../../data/about.js'

// The centred top of the "About the data" section: a small chip, the h2 and one line of intro.
// The chip uses the same shape as the hero's chip, so the two read as one family.
function AboutIntro() {
  return (
    <div className="mx-auto flex max-w-hero-text flex-col items-center text-center">
      <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm text-text-muted">
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent" />
        {ABOUT_EYEBROW}
      </p>
      <h2 id="about-title" className="mt-4 text-heading font-semibold text-balance text-text">
        {ABOUT_HEADING}
      </h2>
      <p className="mt-2 max-w-measure text-pretty text-text-muted">{ABOUT_INTRO}</p>
    </div>
  )
}

export default AboutIntro
