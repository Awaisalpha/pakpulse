import BangladeshFlag from './BangladeshFlag.jsx'
import IndiaFlag from './IndiaFlag.jsx'
import PakistanFlag from './PakistanFlag.jsx'

// The small flag shown before a country's name, picked by the country's ISO3 code.
// The frame gives every flag the same rounded corners and a hairline edge (so white parts
// don't melt into a white card). It is decorative: the country name next to it carries
// the meaning, so screen readers skip it (aria-hidden).
//
// Props: code – 'PAK' | 'IND' | 'BGD'

const FLAGS = {
  PAK: PakistanFlag,
  IND: IndiaFlag,
  BGD: BangladeshFlag,
}

function CountryFlag({ code }) {
  const Flag = FLAGS[code]
  if (!Flag) return null

  return (
    // overflow-hidden clips the flag to the rounded corners; the outline is drawn
    // 1px inside the edge in a see-through black, so it works on any background
    <span
      aria-hidden="true"
      className="inline-block shrink-0 overflow-hidden rounded-[3px] outline-1 -outline-offset-1 outline-black/15"
    >
      <Flag />
    </span>
  )
}

export default CountryFlag
