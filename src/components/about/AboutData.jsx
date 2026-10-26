import AboutIntro from './AboutIntro.jsx'
import { SourceText, Tile } from './AboutParts.jsx'
import { EnrolmentBars, MissingYears, YearTrack } from './LiveParts.jsx'

// The landing page's "About the data" section: the heading, then a mountain meadow photo
// as one tall image tile BESIDE the three coloured tiles.
//   phones: 1 column. The photo is a fixed-height banner at the top of the image tile,
//           and the source text sits below it on solid charcoal (no photo behind the text).
//   md:     the image tile spans both columns; the three tiles share a 2-column grid below
//   lg:     image tile on the left (spanning three rows), the three tiles stacked on the right
//
// The photo has no veil (full brightness). From md up, the source text sits at the tile's foot
// on a local dark scrim (86% charcoal), solid behind the text and fading out above it, so the
// top of the tile is pure photo. Contrast measured over the photo's brightest pixel:
// on-cta 11.1:1 or more, on-cta-muted 6.9:1 or more (AA needs 4.5:1).
function AboutData() {
  return (
    // id="about-data" is the target of the "About the data" links in the hero, navbar and footer.
    // The sticky navbar's room comes from `scroll-padding-top` on <html> (index.css).
    <section id="about-data" aria-labelledby="about-title" className="px-gutter sm:px-gutter-wide">
      <AboutIntro />

      <div className="mx-auto mt-12 grid max-w-preview gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* The image tile. overflow-hidden clips the photo to the rounded corners.
            The focus ring is the light blue one: the normal blue ring is too dark on charcoal. */}
        <div className="relative flex flex-col overflow-hidden rounded-2xl bg-cta [&_:focus-visible]:outline-focus-on-dark md:col-span-2 md:min-h-[50rem] lg:col-span-1 lg:row-span-3 lg:min-h-0">
          {/* The photo. Decorative: an empty div with a CSS background (.about-photo in index.css),
              hidden from screen readers. Phones: a banner in the flow. md+: fills the whole tile. */}
          <div aria-hidden="true" className="about-photo h-photo-banner-sm md:absolute md:inset-0 md:h-auto" />

          {/* The source text. Phones: on solid charcoal. md+: on the scrim, which is solid behind
              the text and fades out over the 7rem of padding above it (pt-28).
              mt-auto pushes it to the tile's foot, so all spare height becomes photo, not empty space. */}
          <div className="relative mt-auto flex flex-col p-6 sm:p-8 md:bg-[linear-gradient(to_top,var(--color-photo-scrim)_calc(100%-7rem),transparent)] md:pt-28">
            <SourceText />
          </div>
        </div>

        <Tile factId="enrolment">
          <EnrolmentBars />
        </Tile>

        <Tile factId="lag">
          <YearTrack />
        </Tile>

        {/* md: spans both columns, so the last row has no empty half; lg: back to one */}
        <Tile factId="gaps" className="md:col-span-2 lg:col-span-1">
          <MissingYears />
        </Tile>
      </div>
    </section>
  )
}

export default AboutData
