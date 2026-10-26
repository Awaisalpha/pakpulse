import { Link } from 'react-router'

// Shown for any URL we do not know, and for unknown categories.
function NotFoundPage() {
  return (
    <>
      <h1>Page not found</h1>
      <p>There is no page at this address.</p>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </>
  )
}

export default NotFoundPage
