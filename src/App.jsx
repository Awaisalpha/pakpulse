import { Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import ExplorePage from './pages/ExplorePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

// The list of pages: which URL shows which component.
// Routes inside <Layout> get the navbar and footer.
// The explorer is outside it: it brings its own dashboard frame (sidebar + top bar).
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        {/* "*" matches any URL not listed above */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      {/* /explore on its own opens the first category */}
      <Route path="/explore" element={<Navigate to="/explore/economy" replace />} />
      <Route path="/explore/:category" element={<ExplorePage />} />
    </Routes>
  )
}

export default App
