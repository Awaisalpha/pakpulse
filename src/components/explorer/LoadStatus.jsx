// An invisible message for screen readers about loading and errors.
// The element is always on the page (only its text changes): screen readers only
// announce changes inside a live region that already existed before the change.
// aria-live="polite" waits until the reader has finished its current sentence.
//
// Props: status, indicator, error (from the explorer)
function LoadStatus({ status, indicator, error }) {
  let message = ''
  if (status === 'loading') message = `Loading ${indicator.name}…`
  if (status === 'error') message = `Couldn’t load ${indicator.name}. ${error}`

  return (
    <p role="status" aria-live="polite" className="sr-only">
      {message}
    </p>
  )
}

export default LoadStatus
