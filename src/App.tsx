import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SiteFooter, SiteHeader } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ClassesPage } from './pages/ClassesPage'
import { AboutPage } from './pages/AboutPage'
import { GalleryPage } from './pages/GalleryPage'
import { ContactPage } from './pages/ContactPage'
import { PayNowPage } from './pages/PayNowPage'
import { AdmissionPage } from './pages/AdmissionPage'
import { TrialClassPage } from './pages/TrialClassPage'
import { TermsPage } from './pages/TermsPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminAdmissionsPage } from './pages/admin/AdminAdmissionsPage'
import { AdminGuard } from './components/AdminGuard'
import { NotFoundPage } from './pages/NotFoundPage'
import './App.css'

const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage })))

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-white">
        <Routes>
          <Route path="/" element={<><SiteHeader /><HomePage /><SiteFooter /></>} />
          <Route path="/classes" element={<><SiteHeader /><ClassesPage /><SiteFooter /></>} />
          <Route path="/about" element={<><SiteHeader /><AboutPage /><SiteFooter /></>} />
          <Route path="/gallery" element={<><SiteHeader /><GalleryPage /><SiteFooter /></>} />
          <Route path="/contact" element={<><SiteHeader /><ContactPage /><SiteFooter /></>} />
          <Route path="/pay-now" element={<><SiteHeader /><PayNowPage /><SiteFooter /></>} />
          <Route path="/admission" element={<><SiteHeader /><AdmissionPage /><SiteFooter /></>} />
          <Route path="/trial-class" element={<><SiteHeader /><TrialClassPage /><SiteFooter /></>} />
          <Route path="/privacy-policy" element={<><SiteHeader /><PrivacyPolicyPage /><SiteFooter /></>} />
          <Route path="/terms" element={<><SiteHeader /><TermsPage /><SiteFooter /></>} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<Suspense fallback={<main className="min-h-screen bg-slate-950 p-8 text-center text-slate-300">Loading owner dashboard…</main>}><AdminGuard><AdminDashboardPage /></AdminGuard></Suspense>} />
          <Route path="/admin/payment-settings" element={<Suspense fallback={<main className="min-h-screen bg-slate-950 p-8 text-center text-slate-300">Loading payment setup…</main>}><AdminGuard><AdminDashboardPage initialView="settings" /></AdminGuard></Suspense>} />
          <Route path="/admin/admissions" element={<AdminGuard><AdminAdmissionsPage /></AdminGuard>} />
          <Route path="/admin/students" element={<Suspense fallback={<main className="min-h-screen bg-slate-950 p-8 text-center text-slate-300">Loading owner dashboard…</main>}><AdminGuard><AdminDashboardPage initialView="students" /></AdminGuard></Suspense>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
