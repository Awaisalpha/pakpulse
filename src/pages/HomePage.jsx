import Hero from '../components/Hero.jsx'
import LandingDashboard from '../components/LandingDashboard.jsx'
import CategoryList from '../components/CategoryList.jsx'
import FeaturesSection from '../components/features/FeaturesSection.jsx'
import AboutData from '../components/about/AboutData.jsx'

// The landing page ("/").
// The gap classes put the same space between every section.
function HomePage() {
  return (
    <div className="flex flex-col gap-section pb-section sm:gap-section-wide sm:pb-section-wide">
      <Hero />
      <LandingDashboard />

      <CategoryList />

      <FeaturesSection />

      {/* Target of the "About the data" links in the hero, navbar and footer (id="about-data") */}
      <AboutData />
    </div>
  )
}

export default HomePage
