import { Link, NavLink } from 'react-router-dom'
import { Menu, MessageCircle, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { academyConfig } from '../data/mockData'
import { getStudioPaymentSettings, whatsappNumber } from '../lib/ownerStore'

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-white" aria-label="Feel The Dance Studio home">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-fuchsia-500 shadow-lg shadow-rose-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight">{academyConfig.wordmark}</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          <NavLink to="/" className={({ isActive }) => `transition hover:text-white ${isActive ? 'text-white' : ''}`} end>Home</NavLink>
          <NavLink to="/classes" className={({ isActive }) => `transition hover:text-white ${isActive ? 'text-white' : ''}`}>Classes</NavLink>
          <NavLink to="/about" className={({ isActive }) => `transition hover:text-white ${isActive ? 'text-white' : ''}`}>About</NavLink>
          <NavLink to="/gallery" className={({ isActive }) => `transition hover:text-white ${isActive ? 'text-white' : ''}`}>Gallery</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `transition hover:text-white ${isActive ? 'text-white' : ''}`}>Contact</NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/pay-now" className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110">Pay Now</Link>
          <Link to="/admin/login" className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-rose-400 hover:text-rose-200">Owner Login</Link>
          <Link to="/trial-class" className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-rose-400 hover:text-rose-200">Book a Trial</Link>
          <Link to="/admission" className="rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:scale-[1.01]">Apply Now</Link>
        </div>

        <button type="button" className="rounded-lg border border-white/10 p-2 text-slate-100 md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-950 md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-sm text-slate-200">
            <NavLink to="/" onClick={() => setMobileOpen(false)} className={({ isActive }) => `transition ${isActive ? 'text-white' : ''}`} end>Home</NavLink>
            <NavLink to="/classes" onClick={() => setMobileOpen(false)} className={({ isActive }) => `transition ${isActive ? 'text-white' : ''}`}>Classes</NavLink>
            <NavLink to="/about" onClick={() => setMobileOpen(false)} className={({ isActive }) => `transition ${isActive ? 'text-white' : ''}`}>About</NavLink>
            <NavLink to="/gallery" onClick={() => setMobileOpen(false)} className={({ isActive }) => `transition ${isActive ? 'text-white' : ''}`}>Gallery</NavLink>
            <NavLink to="/contact" onClick={() => setMobileOpen(false)} className={({ isActive }) => `transition ${isActive ? 'text-white' : ''}`}>Contact</NavLink>
            <Link to="/pay-now" onClick={() => setMobileOpen(false)} className="mt-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-center font-semibold text-white">Pay Now</Link>
            <Link to="/admin/login" onClick={() => setMobileOpen(false)} className="mt-2 rounded-full border border-white/15 px-4 py-2 text-center font-medium text-rose-200">Owner Login</Link>
            <Link to="/admission" onClick={() => setMobileOpen(false)} className="mt-2 rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 px-4 py-2 text-center font-medium text-white">Apply for Admission</Link>
          </nav>
        </div>
      )}
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="mb-3 font-semibold text-white">{academyConfig.wordmark}</div>
          <p>Movement, rhythm, confidence, and joy — rooted in a welcoming dance community.</p>
        </div>
        <div>
          <h3 className="mb-3 text-base font-semibold text-white">Explore</h3>
          <ul className="space-y-2">
            <li><Link to="/classes">Classes</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/pay-now">Pay fees</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-base font-semibold text-white">Visit</h3>
          <ul className="space-y-2">
            <li>{academyConfig.address}</li>
            <li>{academyConfig.hours}</li>
            <li>{academyConfig.email}</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-base font-semibold text-white">Legal</h3>
          <ul className="space-y-2">
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
            <li><Link to="/admin/login">Admin Login</Link></li>
          </ul>
        </div>
      </div>
      <FloatingWhatsAppShortcut />
    </footer>
  )
}

function FloatingWhatsAppShortcut() {
  const digits = whatsappNumber(getStudioPaymentSettings().whatsappPhone)
  const message = encodeURIComponent('Namaste, mujhe Feel The Dance Studio ke baare mein jankari chahiye.')
  const className = 'fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-950/40 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'

  return digits.length >= 11
    ? <a href={`https://wa.me/${digits}?text=${message}`} target="_blank" rel="noreferrer" className={className} aria-label="Chat with studio on WhatsApp" title="Chat on WhatsApp"><MessageCircle className="h-7 w-7" /></a>
    : <button type="button" disabled className={`${className} cursor-not-allowed opacity-70`} aria-label="Admin WhatsApp number not configured" title="Owner: set the WhatsApp number in Admin → Payment setup"><MessageCircle className="h-7 w-7" /></button>
}
