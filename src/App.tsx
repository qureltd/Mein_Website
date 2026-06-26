import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import MobileCtaBanner from './components/MobileCtaBanner'

import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import JoinPage from './pages/JoinPage'
import MakeYourMovePage from './pages/MakeYourMovePage'
import StoriesPage from './pages/StoriesPage'
import StoryDetailPage from './pages/StoryDetailPage'
import FutureMePage from './pages/FutureMePage'
import ShopPage from './pages/ShopPage'
import WhyThisMattersPage from './pages/WhyThisMattersPage'
import ParentsPage from './pages/ParentsPage'
import SchoolsPage from './pages/SchoolsPage'
import CommunityRulesPage from './pages/CommunityRulesPage'
import ContactPage from './pages/ContactPage'
import PrivacyPage, { TermsPage } from './pages/LegalPages'
import AdminDashboard from './pages/AdminDashboard'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
      <MobileCtaBanner />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Admin — standalone layout */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Site routes with shared nav/footer */}
        <Route path="/" element={<SiteLayout><HomePage /></SiteLayout>} />
        <Route path="/about" element={<SiteLayout><AboutPage /></SiteLayout>} />
        <Route path="/join" element={<SiteLayout><JoinPage /></SiteLayout>} />
        <Route path="/make-your-move" element={<SiteLayout><MakeYourMovePage /></SiteLayout>} />
        <Route path="/stories" element={<SiteLayout><StoriesPage /></SiteLayout>} />
        <Route path="/stories/:id" element={<SiteLayout><StoryDetailPage /></SiteLayout>} />
        <Route path="/future-me" element={<SiteLayout><FutureMePage /></SiteLayout>} />
        <Route path="/shop" element={<SiteLayout><ShopPage /></SiteLayout>} />
        <Route path="/why-this-matters" element={<SiteLayout><WhyThisMattersPage /></SiteLayout>} />
        <Route path="/parents" element={<SiteLayout><ParentsPage /></SiteLayout>} />
        <Route path="/schools" element={<SiteLayout><SchoolsPage /></SiteLayout>} />
        <Route path="/community-rules" element={<SiteLayout><CommunityRulesPage /></SiteLayout>} />
        <Route path="/contact" element={<SiteLayout><ContactPage /></SiteLayout>} />
        <Route path="/privacy" element={<SiteLayout><PrivacyPage /></SiteLayout>} />
        <Route path="/terms" element={<SiteLayout><TermsPage /></SiteLayout>} />
      </Routes>
    </BrowserRouter>
  )
}
