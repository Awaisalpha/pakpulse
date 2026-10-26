// "Estimate": a small label for indicators whose values are modelled (e.g. by the ILO)
// rather than measured. The word itself carries the meaning, the outline only frames it.
function EstimateBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-page px-2 py-0.5 font-label text-label whitespace-nowrap text-text-muted uppercase">
      Estimate
    </span>
  )
}

export default EstimateBadge
