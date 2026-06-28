import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import MobileCtaBanner from './components/MobileCtaBanner'
import AdminRouteGuard from './components/AdminRouteGuard'
import AdminLayout from './components/AdminLayout'

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
import AdminLoginPage from './pages/AdminLoginPage'
import ConsentPlaceholderPage from './pages/ConsentPlaceholderPage'

import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminSubmissionsPage from './pages/admin/AdminSubmissionsPage'
import AdminSubmissionDetailPage from './pages/admin/AdminSubmissionDetailPage'
import AdminContactPage from './pages/admin/AdminContactPage'
import AdminMembersPage from './pages/admin/AdminMembersPage'
import AdminConsentPage from './pages/admin/AdminConsentPage'
import AdminWallPage from './pages/admin/AdminWallPage'
import { AdminShopPage, AdminShopProductsPage, AdminShopDropsPage } from './pages/admin/AdminShopPages'
import AdminEmailEventsPage from './pages/admin/AdminEmailEventsPage'
import AdminSettingsPage from './pages/admin/AdminSettingsPage'

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

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminRouteGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminRouteGuard>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ── Admin — protected, standalone layout ── */}
        <Route path="/admin" element={<AdminShell><AdminDashboardPage /></AdminShell>} />
        <Route path="/admin/submissions" element={<AdminShell><AdminSubmissionsPage /></AdminShell>} />
        <Route path="/admin/submissions/:id" element={<AdminShell><AdminSubmissionDetailPage /></AdminShell>} />
        <Route path="/admin/contact" element={<AdminShell><AdminContactPage /></AdminShell>} />
        <Route path="/admin/members" element={<AdminShell><AdminMembersPage /></AdminShell>} />
        <Route path="/admin/consent" element={<AdminShell><AdminConsentPage /></AdminShell>} />
        <Route path="/admin/wall" element={<AdminShell><AdminWallPage /></AdminShell>} />
        <Route path="/admin/shop" element={<AdminShell><AdminShopPage /></AdminShell>} />
        <Route path="/admin/shop/products" element={<AdminShell><AdminShopProductsPage /></AdminShell>} />
        <Route path="/admin/shop/drops" element={<AdminShell><AdminShopDropsPage /></AdminShell>} />
        <Route path="/admin/email-events" element={<AdminShell><AdminEmailEventsPage /></AdminShell>} />
        <Route path="/admin/settings" element={<AdminShell><AdminSettingsPage /></AdminShell>} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* ── Consent — public token route, placeholder for now ── */}
        <Route
          path="/consent/:token"
          element={
            <SiteLayout>
              <ConsentPlaceholderPage />
            </SiteLayout>
          }
        />

        {/* ── Homepage aliases ── */}
        <Route path="/" element={<SiteLayout><HomePage /></SiteLayout>} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/start-here" element={<Navigate to="/" replace />} />

        {/* ── About ── */}
        <Route path="/about" element={<SiteLayout><AboutPage /></SiteLayout>} />
        <Route path="/what-is-mein" element={<Navigate to="/about" replace />} />

        {/* ── Why This Matters ── */}
        <Route path="/why-this-matters" element={<SiteLayout><WhyThisMattersPage /></SiteLayout>} />

        {/* ── Make Your Move ── */}
        <Route path="/make-your-move" element={<SiteLayout><MakeYourMovePage /></SiteLayout>} />

        {/* ── Future Me ── */}
        <Route path="/future-me" element={<SiteLayout><FutureMePage /></SiteLayout>} />

        {/* ── The Wall — /wall is canonical; /stories redirects there ── */}
        <Route path="/wall" element={<SiteLayout><StoriesPage /></SiteLayout>} />
        <Route path="/stories" element={<Navigate to="/wall" replace />} />
        {/* Story detail keeps /stories/:id so existing links and internal nav work */}
        <Route path="/stories/:id" element={<SiteLayout><StoryDetailPage /></SiteLayout>} />

        {/* ── Join ── */}
        <Route path="/join" element={<SiteLayout><JoinPage /></SiteLayout>} />

        {/* ── Shop ── */}
        <Route path="/shop" element={<SiteLayout><ShopPage /></SiteLayout>} />

        {/* ── Parents ── */}
        <Route path="/parents" element={<SiteLayout><ParentsPage /></SiteLayout>} />

        {/* ── Schools ── */}
        <Route path="/schools" element={<SiteLayout><SchoolsPage /></SiteLayout>} />

        {/* ── Community Rules ── */}
        <Route path="/community-rules" element={<SiteLayout><CommunityRulesPage /></SiteLayout>} />

        {/* ── Contact ── */}
        <Route path="/contact" element={<SiteLayout><ContactPage /></SiteLayout>} />

        {/* ── Legal ── */}
        <Route path="/privacy" element={<SiteLayout><PrivacyPage /></SiteLayout>} />
        <Route path="/terms" element={<SiteLayout><TermsPage /></SiteLayout>} />
      </Routes>
    </BrowserRouter>
  )
}
